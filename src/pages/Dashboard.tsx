
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Trophy, 
  Clock, 
  Star,
  Mic,
  Users,
  Calendar,
  Award,
  ArrowRight,
  PlayCircle,
  Timer,
  CheckCircle
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    { title: "Total Sessions", value: "24", change: "+12%", icon: Clock, color: "text-blue-400" },
    { title: "Average Score", value: "8.2", change: "+0.8", icon: Target, color: "text-green-400" },
    { title: "Speaking Time", value: "2.4h", change: "+45min", icon: Mic, color: "text-purple-400" },
    { title: "Debates Won", value: "15", change: "+3", icon: Trophy, color: "text-yellow-400" }
  ];

  const recentSessions = [
    { id: 1, type: "Speech Practice", topic: "Climate Change Solutions", score: 8.5, date: "2 hours ago", duration: "12min" },
    { id: 2, type: "Debate", topic: "Social Media Impact", score: 7.8, date: "1 day ago", duration: "15min" },
    { id: 3, type: "Speech Practice", topic: "Leadership Skills", score: 9.1, date: "2 days ago", duration: "10min" },
    { id: 4, type: "Team Practice", topic: "Economic Policies", score: 8.3, date: "3 days ago", duration: "18min" }
  ];

  const achievements = [
    { name: "First Speech", description: "Completed your first speech analysis", earned: true },
    { name: "Debate Champion", description: "Won 10 consecutive debates", earned: true },
    { name: "Consistency King", description: "Practiced 7 days in a row", earned: true },
    { name: "Perfect Score", description: "Achieved a perfect 10 score", earned: false },
    { name: "Team Player", description: "Joined your first team", earned: false },
    { name: "Topic Master", description: "Practiced 25 different topics", earned: false }
  ];

  const skillsData = [
    { skill: "Clarity", score: 85, color: "bg-blue-500" },
    { skill: "Pace", score: 78, color: "bg-green-500" },
    { skill: "Tone Variety", score: 92, color: "bg-purple-500" },
    { skill: "Engagement", score: 67, color: "bg-yellow-500" },
    { skill: "Structure", score: 89, color: "bg-pink-500" }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Speaker!</h1>
          <p className="text-gray-300">Here's your speaking performance overview and insights.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <p className="text-xs text-green-400 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change} from last week
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Progress */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-400" />
                  Skills Assessment
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Your current speaking skills breakdown and areas for improvement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsData.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-300">{skill.skill}</span>
                        <span className="text-sm text-white">{skill.score}%</span>
                      </div>
                      <Progress value={skill.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-400" />
                      Recent Sessions
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Your latest practice sessions and performance.
                    </CardDescription>
                  </div>
                  <Button variant="outline" className="border-blue-500/30 text-blue-400" asChild>
                    <Link to="/practice">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          {session.type === "Debate" ? <Users className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <div className="font-medium text-white">{session.topic}</div>
                          <div className="text-sm text-gray-300">{session.type} • {session.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">{session.score}/10</div>
                        <div className="text-sm text-gray-300">{session.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" asChild>
                  <Link to="/practice">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Practice
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-blue-500/30 text-blue-400" asChild>
                  <Link to="/debate">
                    <Users className="w-4 h-4 mr-2" />
                    New Debate
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-blue-500/30 text-blue-400" asChild>
                  <Link to="/teams">
                    <Users className="w-4 h-4 mr-2" />
                    Join Team
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-2 rounded-lg ${achievement.earned ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-green-500' : 'bg-gray-500'}`}>
                        {achievement.earned ? <CheckCircle className="w-4 h-4 text-white" /> : <Award className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${achievement.earned ? 'text-green-400' : 'text-gray-400'}`}>
                          {achievement.name}
                        </div>
                        <div className="text-xs text-gray-500">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* This Week's Goal */}
            <Card className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  This Week's Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">5/7</div>
                  <div className="text-sm text-gray-300 mb-4">Practice sessions completed</div>
                  <Progress value={71} className="mb-4" />
                  <p className="text-xs text-gray-400">Keep it up! 2 more sessions to reach your weekly goal.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
