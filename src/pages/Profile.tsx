
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Edit3, 
  Trophy, 
  Target, 
  Calendar, 
  Mail,
  Bell,
  Shield,
  Save,
  Award,
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
  Settings
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const userStats = {
    totalSessions: 127,
    totalTime: "42.3h",
    avgScore: 8.2,
    debatesWon: 45,
    streakDays: 12,
    level: "Advanced"
  };

  const achievements = [
    { name: "First Steps", description: "Completed your first speech", earned: true, date: "March 1, 2024" },
    { name: "Debate Champion", description: "Won 10 consecutive debates", earned: true, date: "March 15, 2024" },
    { name: "Consistent Speaker", description: "Practiced 30 days in a row", earned: true, date: "April 2, 2024" },
    { name: "Perfect Score", description: "Achieved a perfect 10 score", earned: true, date: "April 10, 2024" },
    { name: "Team Player", description: "Joined 3 different teams", earned: true, date: "April 20, 2024" },
    { name: "Topic Master", description: "Practiced 50 different topics", earned: false, date: null },
    { name: "Marathon Speaker", description: "Practiced for 100 hours total", earned: false, date: null },
    { name: "Debate Master", description: "Won 100 debates", earned: false, date: null }
  ];

  const skillProgress = [
    { skill: "Clarity", current: 85, target: 90 },
    { skill: "Pace Control", current: 78, target: 85 },
    { skill: "Tone Variety", current: 92, target: 95 },
    { skill: "Engagement", current: 67, target: 80 },
    { skill: "Structure", current: 89, target: 95 },
    { skill: "Confidence", current: 74, target: 85 }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-gray-300">Manage your account, track your progress, and customize your experience.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-black/20 p-1 rounded-lg backdrop-blur-sm border border-blue-500/20">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "profile"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "progress"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "achievements"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "settings"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-400" />
                      Profile Information
                    </CardTitle>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                      className="border-blue-500/30 text-blue-400"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar and Basic Info */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-2xl">
                        JS
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Input
                            defaultValue="John Speaker"
                            className="bg-black/60 border-blue-500/30 text-white"
                          />
                          <Input
                            defaultValue="john.speaker@email.com"
                            className="bg-black/60 border-blue-500/30 text-white"
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-2xl font-bold text-white">John Speaker</h3>
                          <p className="text-gray-300">john.speaker@email.com</p>
                          <Badge className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {userStats.level} Speaker
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Bio</label>
                    {isEditing ? (
                      <Textarea
                        defaultValue="Passionate about public speaking and debate. Always looking to improve and help others develop their communication skills."
                        className="bg-black/60 border-blue-500/30 text-white placeholder-gray-400"
                      />
                    ) : (
                      <p className="text-gray-300">
                        Passionate about public speaking and debate. Always looking to improve and help others develop their communication skills.
                      </p>
                    )}
                  </div>

                  {/* Goals */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Speaking Goals</label>
                    {isEditing ? (
                      <Textarea
                        defaultValue="• Improve tone variety and engagement scores
• Win more competitive debates
• Join advanced speaking teams
• Practice 5 times per week consistently"
                        className="bg-black/60 border-blue-500/30 text-white placeholder-gray-400"
                      />
                    ) : (
                      <div className="text-gray-300">
                        <p>• Improve tone variety and engagement scores</p>
                        <p>• Win more competitive debates</p>
                        <p>• Join advanced speaking teams</p>
                        <p>• Practice 5 times per week consistently</p>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-gray-500/30 text-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{userStats.totalSessions}</div>
                      <div className="text-xs text-gray-400">Total Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{userStats.avgScore}</div>
                      <div className="text-xs text-gray-400">Avg Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{userStats.debatesWon}</div>
                      <div className="text-xs text-gray-400">Debates Won</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{userStats.streakDays}</div>
                      <div className="text-xs text-gray-400">Day Streak</div>
                    </div>
                  </div>
                  <div className="text-center pt-2 border-t border-gray-500/20">
                    <div className="text-lg font-bold text-white">{userStats.totalTime}</div>
                    <div className="text-xs text-gray-400">Total Practice Time</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    Next Milestone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-sm text-gray-300 mb-2">Topic Master Achievement</div>
                    <div className="text-2xl font-bold text-white mb-2">37/50</div>
                    <Progress value={74} className="mb-2" />
                    <div className="text-xs text-gray-400">13 more topics to unlock</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <div className="space-y-6">
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Skills Progress
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Track your improvement across different speaking skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {skillProgress.map((skill, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{skill.skill}</span>
                        <span className="text-sm text-gray-300">{skill.current}% / {skill.target}%</span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={skill.current} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Current: {skill.current}%</span>
                          <span>Target: {skill.target}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { activity: "Speech Practice", topic: "Climate Solutions", score: 8.7, time: "2 hours ago" },
                    { activity: "Debate Session", topic: "AI Ethics", score: 8.3, time: "1 day ago" },
                    { activity: "Team Practice", topic: "Leadership", score: 9.1, time: "2 days ago" },
                    { activity: "Speech Practice", topic: "Public Health", score: 7.9, time: "3 days ago" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div>
                        <div className="text-white font-medium">{item.activity}</div>
                        <div className="text-sm text-gray-300">{item.topic}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{item.score}/10</div>
                        <div className="text-xs text-gray-400">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div>
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Your Achievements
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Milestones and badges you've earned on your speaking journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`p-4 rounded-lg border transition-all duration-300 ${
                      achievement.earned 
                        ? "bg-green-500/10 border-green-500/30 hover:border-green-500/50" 
                        : "bg-gray-500/10 border-gray-500/30"
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          achievement.earned ? "bg-green-500" : "bg-gray-500"
                        }`}>
                          {achievement.earned ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Award className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${achievement.earned ? "text-green-400" : "text-gray-400"}`}>
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-gray-300 mt-1">{achievement.description}</p>
                          {achievement.earned && achievement.date && (
                            <p className="text-xs text-gray-500 mt-2">Earned on {achievement.date}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Notification Settings */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-400" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Practice Reminders</div>
                    <div className="text-sm text-gray-300">Get daily reminders to practice</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Team Activity</div>
                    <div className="text-sm text-gray-300">Notifications about team member activities</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Achievement Updates</div>
                    <div className="text-sm text-gray-300">Get notified when you earn new badges</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Weekly Progress Reports</div>
                    <div className="text-sm text-gray-300">Receive weekly summaries of your progress</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-400" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Email Address</label>
                  <Input
                    defaultValue="john.speaker@email.com"
                    className="bg-black/60 border-blue-500/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Change Password</label>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Current password"
                      className="bg-black/60 border-blue-500/30 text-white placeholder-gray-400"
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      className="bg-black/60 border-blue-500/30 text-white placeholder-gray-400"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-black/60 border-blue-500/30 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  Update Account
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Public Profile</div>
                    <div className="text-sm text-gray-300">Allow others to view your profile and stats</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Analytics Sharing</div>
                    <div className="text-sm text-gray-300">Share anonymous usage data to improve ForensIQ</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Team Visibility</div>
                    <div className="text-sm text-gray-300">Show your activity to team members</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
