import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { 
  Users, 
  Plus, 
  Settings, 
  UserPlus, 
  Trophy, 
  BarChart3,
  Calendar,
  Target,
  Crown
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface Team {
  id: string;
  name: string;
  description: string;
  leader_id: string;
  created_at: string;
  member_count: number;
  is_leader: boolean;
}

interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  role: 'leader' | 'member';
  joined_at: string;
  profile: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface TeamAnalytics {
  total_practice_time: number;
  sessions_count: number;
  average_score: number;
  active_members: number;
  weekly_activity: number[];
}

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamAnalytics, setTeamAnalytics] = useState<TeamAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create team form
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  useEffect(() => {
    fetchUserTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam.id);
      fetchTeamAnalytics(selectedTeam.id);
    }
  }, [selectedTeam]);

  const fetchUserTeams = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch teams where user is a member
      const { data: teamMemberships, error: membershipError } = await supabase
        .from('team_members')
        .select(`
          team_id,
          role,
          teams (
            id,
            name,
            description,
            leader_id,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (membershipError) throw membershipError;

      const userTeamsData = teamMemberships?.map(membership => ({
        ...membership.teams,
        member_count: 0, // Will be updated
        is_leader: membership.role === 'leader'
      })) || [];

      // Get member counts for each team
      for (const team of userTeamsData) {
        const { count } = await supabase
          .from('team_members')
          .select('*', { count: 'exact', head: true })
          .eq('team_id', team.id);
        
        team.member_count = count || 0;
      }

      setUserTeams(userTeamsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user teams:', err);
      setError('Failed to load teams');
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          team_id,
          role,
          joined_at,
          profiles (
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('team_id', teamId);

      if (error) throw error;

      const members = data?.map(member => ({
        id: member.id,
        user_id: member.user_id,
        team_id: member.team_id,
        role: member.role,
        joined_at: member.joined_at,
        profile: member.profiles
      })) || [];

      setTeamMembers(members);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const fetchTeamAnalytics = async (teamId: string) => {
    try {
      // Fetch team analytics from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('team_analytics')
        .select('*')
        .eq('team_id', teamId)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      // Calculate aggregated analytics
      const analytics: TeamAnalytics = {
        total_practice_time: data?.reduce((sum, day) => sum + (day.total_practice_time || 0), 0) || 0,
        sessions_count: data?.reduce((sum, day) => sum + (day.sessions_count || 0), 0) || 0,
        average_score: data?.length ? data.reduce((sum, day) => sum + (day.average_score || 0), 0) / data.length : 0,
        active_members: data?.[data.length - 1]?.active_members || 0,
        weekly_activity: Array(7).fill(0) // Simplified weekly activity
      };

      setTeamAnalytics(analytics);
    } catch (err) {
      console.error('Error fetching team analytics:', err);
    }
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      setError('Team name is required');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: newTeamName.trim(),
          description: newTeamDescription.trim(),
          leader_id: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add user as team leader
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'leader'
        });

      if (memberError) throw memberError;

      // Reset form and refresh teams
      setNewTeamName('');
      setNewTeamDescription('');
      setShowCreateDialog(false);
      fetchUserTeams();
    } catch (err) {
      console.error('Error creating team:', err);
      setError('Failed to create team');
    }
  };

  const inviteMember = async (teamId: string, email: string) => {
    try {
      // In a real app, you'd send an email invitation
      // For now, we'll just show a success message
      alert(`Invitation sent to ${email}`);
    } catch (err) {
      console.error('Error inviting member:', err);
      setError('Failed to send invitation');
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      // Refresh team members
      if (selectedTeam) {
        fetchTeamMembers(selectedTeam.id);
      }
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member');
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600">Manage your debate teams and collaborate with others</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a new debate team to collaborate with others
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Team Name</label>
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="Describe your team's goals"
                  rows={3}
                />
              </div>
              <Button onClick={createTeam} className="w-full">
                Create Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Teams</CardTitle>
              <CardDescription>
                {userTeams.length === 0 ? 'You haven\'t joined any teams yet' : 'Select a team to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userTeams.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No teams yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create or join a team to start collaborating.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userTeams.map((team) => (
                    <div
                      key={team.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTeam?.id === team.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTeam(team)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{team.name}</h3>
                          <p className="text-sm text-gray-500">{team.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {team.is_leader && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                          <Badge variant="outline">
                            {team.member_count} members
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Team Details */}
        <div className="lg:col-span-2">
          {selectedTeam ? (
            <div className="space-y-6">
              {/* Team Header */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {selectedTeam.name}
                        {selectedTeam.is_leader && (
                          <Crown className="ml-2 h-5 w-5 text-yellow-500" />
                        )}
                      </CardTitle>
                      <CardDescription>{selectedTeam.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite
                      </Button>
                      {selectedTeam.is_leader && (
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Team Analytics */}
              {teamAnalytics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      Team Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatDuration(teamAnalytics.total_practice_time)}
                        </div>
                        <p className="text-sm text-gray-500">Total Practice Time</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {teamAnalytics.sessions_count}
                        </div>
                        <p className="text-sm text-gray-500">Sessions</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {teamAnalytics.average_score.toFixed(1)}/10
                        </div>
                        <p className="text-sm text-gray-500">Avg Score</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {teamAnalytics.active_members}
                        </div>
                        <p className="text-sm text-gray-500">Active Members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Team Members */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {member.profile.full_name?.charAt(0) || member.profile.email.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {member.profile.full_name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-gray-500">{member.profile.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {member.role === 'leader' && (
                            <Badge variant="secondary">
                              <Crown className="mr-1 h-3 w-3" />
                              Leader
                            </Badge>
                          )}
                          {selectedTeam.is_leader && member.role !== 'leader' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeMember(member.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Select a team</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a team from the list to view details and manage members.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage; 