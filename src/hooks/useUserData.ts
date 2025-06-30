import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  goals: string | null;
  preferences: any;
  created_at: string;
  updated_at: string;
}

export interface SpeechSession {
  id: string;
  user_id: string;
  topic_id: string | null;
  title: string | null;
  audio_url: string | null;
  transcript: string | null;
  duration_seconds: number | null;
  clarity_score: number | null;
  pace_score: number | null;
  volume_score: number | null;
  tone_score: number | null;
  engagement_score: number | null;
  overall_score: number | null;
  feedback: any;
  created_at: string;
}

export interface DebateSession {
  id: string;
  user_id: string;
  topic_id: string | null;
  position: string;
  duration_seconds: number | null;
  ai_opponent_response: string | null;
  user_score: number | null;
  ai_score: number | null;
  feedback: any;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  leader_id: string;
  created_at: string;
  updated_at: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'leader' | 'member';
  joined_at: string;
}

export const useUserData = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [speechSessions, setSpeechSessions] = useState<SpeechSession[]>([]);
  const [debateSessions, setDebateSessions] = useState<DebateSession[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      console.log('Fetching user data...');
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        console.log('No authenticated user found');
        return;
      }

      console.log('Auth user found:', authUser.id);
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      console.log('User profile fetched:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch speech sessions
  const fetchSpeechSessions = async () => {
    try {
      console.log('Fetching speech sessions...');
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        console.log('No auth user found for speech sessions');
        return;
      }

      const { data, error } = await supabase
        .from('speech_sessions')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching speech sessions:', error);
        throw error;
      }
      
      console.log('Speech sessions fetched:', data?.length || 0, 'sessions');
      setSpeechSessions(data || []);
    } catch (error) {
      console.error('Error fetching speech sessions:', error);
    }
  };

  // Fetch debate sessions
  const fetchDebateSessions = async () => {
    try {
      console.log('Fetching debate sessions...');
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        console.log('No auth user found for debate sessions');
        return;
      }

      const { data, error } = await supabase
        .from('debate_sessions')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching debate sessions:', error);
        throw error;
      }
      
      console.log('Debate sessions fetched:', data?.length || 0, 'sessions');
      setDebateSessions(data || []);
    } catch (error) {
      console.error('Error fetching debate sessions:', error);
    }
  };

  // Fetch user teams
  const fetchUserTeams = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          teams (*)
        `)
        .eq('user_id', authUser.id);

      if (error) throw error;
      
      // Transform the data to match our Team interface
      const userTeams = data?.map(item => ({
        ...item.teams,
        members: [item]
      })) || [];
      
      setTeams(userTeams);
    } catch (error) {
      console.error('Error fetching user teams:', error);
    }
  };

  // Create a new speech session
  const createSpeechSession = async (sessionData: Omit<SpeechSession, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('speech_sessions')
        .insert([{
          ...sessionData,
          user_id: authUser.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setSpeechSessions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating speech session:', error);
      throw error;
    }
  };

  // Create a new debate session
  const createDebateSession = async (sessionData: Omit<DebateSession, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('debate_sessions')
        .insert([{
          ...sessionData,
          user_id: authUser.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setDebateSessions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating debate session:', error);
      throw error;
    }
  };

  // Create a new team
  const createTeam = async (teamData: { name: string; description: string }) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('User not authenticated');

      // Create the team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert([{
          ...teamData,
          leader_id: authUser.id
        }])
        .select()
        .single();

      if (teamError) throw teamError;

      // Add the creator as a team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{
          team_id: team.id,
          user_id: authUser.id,
          role: 'leader'
        }]);

      if (memberError) throw memberError;

      // Add the new team to the local state
      const newTeam: Team = {
        ...team,
        members: [{
          id: 'temp',
          team_id: team.id,
          user_id: authUser.id,
          role: 'leader',
          joined_at: new Date().toISOString()
        }]
      };
      setTeams(prev => [newTeam, ...prev]);
      
      return team;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  };

  // Join a team by code (teamId)
  const joinTeamByCode = async (teamId: string) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('User not authenticated');

      // Check if already a member
      const { data: existing, error: existingError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .eq('user_id', authUser.id)
        .single();
      if (existing && !existingError) {
        throw new Error('You are already a member of this team');
      }

      // Add as member
      const { error } = await supabase
        .from('team_members')
        .insert([{
          team_id: teamId,
          user_id: authUser.id,
          role: 'member'
        }]);
      if (error) throw error;
      
      // Refresh teams data
      await fetchUserTeams();
      return true;
    } catch (error) {
      console.error('Error joining team:', error);
      throw error;
    }
  };

  // Get user statistics
  const getUserStats = () => {
    const totalSessions = speechSessions.length + debateSessions.length;
    const avgPracticeScore = speechSessions.length > 0 
      ? speechSessions.reduce((sum, session) => {
          const analysis = session.overall_score;
          return sum + (analysis || 0);
        }, 0) / speechSessions.length 
      : 0;
    const totalPracticeTime = speechSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);
    const debatesWon = debateSessions.filter(session => (session.user_score || 0) > (session.ai_score || 0)).length;

    return {
      totalSessions,
      avgPracticeScore: Math.round(avgPracticeScore * 10) / 10,
      totalPracticeTime: Math.round(totalPracticeTime / 60), // in minutes
      debatesWon,
      totalDebates: debateSessions.length
    };
  };

  // Get recent activity
  const getRecentActivity = () => {
    const allSessions = [
      ...speechSessions.map(session => ({
        ...session,
        type: 'speech' as const,
        title: session.title || 'Speech Session',
        score: session.overall_score || 0
      })),
      ...debateSessions.map(session => ({
        ...session,
        type: 'debate' as const,
        title: `Debate - ${session.position}`,
        score: session.user_score || 0
      }))
    ];

    return allSessions
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      console.log('Initializing user data...');
      setLoading(true);
      try {
        await Promise.all([
          fetchUserData(),
          fetchSpeechSessions(),
          fetchDebateSessions(),
          fetchUserTeams()
        ]);
        console.log('User data initialized successfully');
      } catch (error) {
        console.error('Error initializing user data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  return {
    user,
    speechSessions,
    debateSessions,
    teams,
    achievements: [], // Empty array for now since achievements table doesn't exist
    loading,
    createSpeechSession,
    createDebateSession,
    createTeam,
    joinTeamByCode,
    getUserStats,
    getRecentActivity,
    refreshData: () => {
      fetchUserData();
      fetchSpeechSessions();
      fetchDebateSessions();
      fetchUserTeams();
    }
  };
}; 