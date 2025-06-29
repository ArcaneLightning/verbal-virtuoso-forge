
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
  Crown, 
  Clock, 
  Target, 
  Trophy,
  Star,
  Calendar,
  MessageCircle,
  Award,
  TrendingUp,
  UserPlus,
  Settings
} from "lucide-react";

const Teams = () => {
  const [activeTab, setActiveTab] = useState("my-teams");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const myTeams = [
    {
      id: 1,
      name: "Debate Masters",
      description: "Advanced debate team focusing on policy and ethics",
      members: 8,
      role: "Leader",
      avgScore: 8.4,
      recentActivity: "2 hours ago",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      name: "Speech Warriors",
      description: "Public speaking improvement group",
      members: 12,
      role: "Member",
      avgScore: 7.9,
      recentActivity: "1 day ago",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const availableTeams = [
    {
      id: 3,
      name: "Rhetoric Rangers",
      description: "Beginner-friendly team for speech practice",
      members: 6,
      avgScore: 7.2,
      isOpen: true,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      name: "Argumentation Aces",
      description: "Competitive debate team for tournaments",
      members: 15,
      avgScore: 8.8,
      isOpen: false,
      color: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      name: "TED Talk Trainers",
      description: "Focus on presentation and storytelling skills",
      members: 10,
      avgScore: 8.1,
      isOpen: true,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const teamActivities = [
    {
      user: "Sarah M.",
      action: "completed a debate session",
      topic: "Climate Policy",
      score: 8.7,
      time: "2 hours ago"
    },
    {
      user: "Mike R.",
      action: "joined practice session",
      topic: "Public Speaking",
      score: null,
      time: "4 hours ago"
    },
    {
      user: "Emma K.",
      action: "achieved new high score",
      topic: "Persuasive Speaking",
      score: 9.2,
      time: "1 day ago"
    },
    {
      user: "David L.",
      action: "completed team challenge",
      topic: "Impromptu Speech",
      score: 8.0,
      time: "2 days ago"
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Team Collaboration</h1>
          <p className="text-gray-300">Join teams, collaborate with others, and improve together through group practice and challenges.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-black/20 p-1 rounded-lg backdrop-blur-sm border border-blue-500/20">
          <button
            onClick={() => setActiveTab("my-teams")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "my-teams"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            My Teams
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "discover"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Discover Teams
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "activity"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Team Activity
          </button>
        </div>

        {/* My Teams Tab */}
        {activeTab === "my-teams" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Your Teams</h2>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </div>

            {/* Create Team Form */}
            {showCreateForm && (
              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Create New Team</CardTitle>
                  <CardDescription className="text-gray-300">
                    Set up your team and start collaborating with other speakers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Team Name</label>
                    <Input
                      placeholder="Enter team name"
                      className="bg-black/60 border-blue-500/30 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe your team's focus and goals"
                      className="bg-black/60 border-blue-500/30 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                      Create Team
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="border-gray-500/30 text-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Teams Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {myTeams.map((team) => (
                <Card key={team.id} className="bg-black/40 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center">
                          <div className={`w-8 h-8 bg-gradient-to-r ${team.color} rounded-lg flex items-center justify-center mr-3`}>
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          {team.name}
                        </CardTitle>
                        <CardDescription className="text-gray-300 mt-2">
                          {team.description}
                        </CardDescription>
                      </div>
                      <Badge className={`${team.role === "Leader" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>
                        {team.role === "Leader" && <Crown className="w-3 h-3 mr-1" />}
                        {team.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{team.members}</div>
                        <div className="text-xs text-gray-400">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{team.avgScore}</div>
                        <div className="text-xs text-gray-400">Avg Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">
                          <TrendingUp className="w-4 h-4 mx-auto" />
                        </div>
                        <div className="text-xs text-gray-400">Growing</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {team.recentActivity}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {team.role === "Leader" && (
                        <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300">
                          <Settings className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Discover Teams Tab */}
        {activeTab === "discover" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Discover Teams</h2>
              <p className="text-gray-300">Find and join teams that match your interests and skill level.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTeams.map((team) => (
                <Card key={team.id} className="bg-black/40 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center">
                          <div className={`w-8 h-8 bg-gradient-to-r ${team.color} rounded-lg flex items-center justify-center mr-3`}>
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          {team.name}
                        </CardTitle>
                        <CardDescription className="text-gray-300 mt-2">
                          {team.description}
                        </CardDescription>
                      </div>
                      <Badge className={`${team.isOpen ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                        {team.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{team.members}</div>
                        <div className="text-xs text-gray-400">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{team.avgScore}</div>
                        <div className="text-xs text-gray-400">Avg Score</div>
                      </div>
                    </div>

                    <Button
                      className={`w-full ${team.isOpen 
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                        : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!team.isOpen}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {team.isOpen ? "Join Team" : "Application Required"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Team Activity Tab */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Team Activity Feed</h2>
              <p className="text-gray-300">Stay updated with your team members' progress and achievements.</p>
            </div>

            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="text-white">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </div>
                        <div className="text-sm text-gray-300">
                          Topic: {activity.topic}
                          {activity.score && (
                            <span className="ml-2 text-blue-400">Score: {activity.score}/10</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Leaderboard */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Team Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Emma K.", score: 9.2, team: "Debate Masters" },
                    { rank: 2, name: "Sarah M.", score: 8.7, team: "Debate Masters" },
                    { rank: 3, name: "Mike R.", score: 8.4, team: "Speech Warriors" },
                    { rank: 4, name: "David L.", score: 8.0, team: "Speech Warriors" },
                    { rank: 5, name: "Lisa T.", score: 7.8, team: "Debate Masters" }
                  ].map((member) => (
                    <div key={member.rank} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          member.rank === 1 ? 'bg-yellow-500 text-black' :
                          member.rank === 2 ? 'bg-gray-400 text-black' :
                          member.rank === 3 ? 'bg-orange-600 text-white' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {member.rank}
                        </div>
                        <div>
                          <div className="text-white font-medium">{member.name}</div>
                          <div className="text-xs text-gray-400">{member.team}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-white">{member.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
