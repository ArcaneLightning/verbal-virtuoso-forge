import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  Clock, 
  TrendingUp,
  Settings
} from "lucide-react";
import { useUserData } from "../hooks/useUserData";

const Teams = () => {
  const [activeTab, setActiveTab] = useState("my-teams");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { teams, createTeam, joinTeamByCode, loading, refreshData } = useUserData();
  const [error, setError] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleCreateTeam = async () => {
    setError(null);
    if (!teamName.trim() || !teamDescription.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setIsCreating(true);
    try {
      await createTeam({ name: teamName, description: teamDescription });
      setTeamName("");
      setTeamDescription("");
      setShowCreateForm(false);
    } catch (err: any) {
      setError(err.message || "Failed to create team");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinTeam = async () => {
    setJoinError(null);
    if (!joinCode.trim()) return;
    setIsJoining(true);
    try {
      await joinTeamByCode(joinCode.trim());
      setJoinCode("");
    } catch (err: any) {
      setJoinError(err.message || "Failed to join team");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Collaboration</h1>
          <p className="text-gray-600">Join teams, collaborate with others, and improve together through group practice and challenges.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setActiveTab("my-teams")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "my-teams"
                ? "bg-white text-blue-600 border border-gray-200 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            My Teams
          </button>
          {/* Future: Discover/Activity tabs can be implemented with real data */}
        </div>

        {/* My Teams Tab */}
        {activeTab === "my-teams" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Teams</h2>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </div>

            {/* Join Team by Code Form */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Join Team by Code</CardTitle>
                <CardDescription className="text-gray-600">
                  Enter a team code to join an existing team.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Enter team code (UUID)"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    disabled={isJoining || !joinCode.trim()}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    onClick={handleJoinTeam}
                  >
                    {isJoining ? "Joining..." : "Join"}
                  </Button>
                </div>
                {joinError && <div className="text-red-600 text-sm">{joinError}</div>}
              </CardContent>
            </Card>

            {/* Create Team Form */}
            {showCreateForm && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Create New Team</CardTitle>
                  <CardDescription className="text-gray-600">
                    Set up your team and start collaborating with other speakers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Team Name</label>
                    <Input
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe your team's focus and goals"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleCreateTeam}
                      disabled={isCreating}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      {isCreating ? "Creating..." : "Create Team"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setTeamName("");
                        setTeamDescription("");
                        setError(null);
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Teams List */}
            {loading ? (
              <div className="text-center text-gray-500 py-12">Loading your teams...</div>
            ) : teams.length === 0 ? (
              <div className="text-center text-gray-500 py-12">You are not a member of any teams yet.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {teams.map((team) => (
                  <Card key={team.id} className="bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-gray-900 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            {team.name}
                          </CardTitle>
                          <CardDescription className="text-gray-600 mt-2">
                            {team.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">-</div>
                          <div className="text-xs text-gray-600">Members</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">-</div>
                          <div className="text-xs text-gray-600">Avg Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">
                            <TrendingUp className="w-4 h-4 mx-auto" />
                          </div>
                          <div className="text-xs text-gray-600">Growing</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Created {new Date(team.created_at).toLocaleDateString()}
                        </span>
                        <span className="ml-2 text-xs text-gray-400 select-all">Code: {team.id}</span>
                      </div>
                      {/* Future: Team actions, members, etc. */}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
