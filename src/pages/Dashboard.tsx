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
import { useUserData } from "../hooks/useUserData";

const Dashboard = () => {
  const { 
    user, 
    speechSessions, 
    debateSessions, 
    achievements, 
    loading, 
    getUserStats, 
    getRecentActivity 
  } = useUserData();

  const stats = getUserStats();
  const recentActivity = getRecentActivity();

  // Debug logging
  console.log('Dashboard render:', { 
    user, 
    speechSessions: speechSessions.length, 
    debateSessions: debateSessions.length, 
    loading, 
    stats,
    recentActivity: recentActivity.length
  });

  // Calculate skills data from speech sessions
  const getSkillsData = () => {
    if (speechSessions.length === 0) {
      return [
        { skill: "Clarity", score: 0, color: "bg-blue-500" },
        { skill: "Pace", score: 0, color: "bg-green-500" },
        { skill: "Tone Variety", score: 0, color: "bg-purple-500" },
        { skill: "Engagement", score: 0, color: "bg-yellow-500" },
        { skill: "Structure", score: 0, color: "bg-pink-500" }
      ];
    }

    const latestSession = speechSessions[0];
    return [
      { skill: "Clarity", score: latestSession.clarity_score || 0, color: "bg-blue-500" },
      { skill: "Pace", score: latestSession.pace_score || 0, color: "bg-green-500" },
      { skill: "Tone Variety", score: latestSession.tone_score || 0, color: "bg-purple-500" },
      { skill: "Engagement", score: latestSession.engagement_score || 0, color: "bg-yellow-500" },
      { skill: "Structure", score: Math.round(((latestSession.clarity_score || 0) + (latestSession.pace_score || 0)) / 2), color: "bg-pink-500" }
    ];
  };

  const skillsData = getSkillsData();

  const statsCards = [
    { 
      title: "Total Sessions", 
      value: stats.totalSessions.toString(), 
      icon: Clock, 
      color: "text-blue-400" 
    },
    { 
      title: "Average Score", 
      value: stats.avgPracticeScore.toString(), 
      icon: Target, 
      color: "text-green-400" 
    },
    { 
      title: "Practice Time", 
      value: `${stats.totalPracticeTime}m`, 
      icon: Mic, 
      color: "text-purple-400" 
    },
    { 
      title: "Debates Won", 
      value: stats.debatesWon.toString(), 
      icon: Trophy, 
      color: "text-yellow-400" 
    }
  ];

  if (loading) {
    console.log('Dashboard loading...');
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-500 py-12">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  console.log('Dashboard rendering content...');
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name || 'Speaker'}!
          </h1>
          <p className="text-gray-600">Here's your speaking performance overview and insights.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Progress */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Skills Assessment
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {speechSessions.length > 0 
                    ? "Your current speaking skills breakdown and areas for improvement."
                    : "Start practicing to see your skills assessment."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsData.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                        <span className="text-sm text-gray-900 font-semibold">{skill.score}%</span>
                      </div>
                      <Progress value={skill.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-600" />
                      Recent Sessions
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Your latest practice sessions and performance.
                    </CardDescription>
                  </div>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
                    <Link to="/practice">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Mic className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No sessions yet. Start practicing to see your activity here!</p>
                    <Button className="mt-4" asChild>
                      <Link to="/practice">Start Your First Session</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            {session.type === "debate" ? <Users className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{session.title}</div>
                            <div className="text-sm text-gray-600">
                              {session.type === "debate" ? "Debate" : "Practice"} • {new Date(session.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {session.type === "debate" ? `${session.user_score}/10` : `${session.score}/10`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {Math.round((session.duration_seconds || 0) / 60)}min
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white" asChild>
                  <Link to="/practice">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Practice
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
                  <Link to="/debate">
                    <Users className="w-4 h-4 mr-2" />
                    New Debate
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
                  <Link to="/teams">
                    <Users className="w-4 h-4 mr-2" />
                    Join Team
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No achievements yet. Keep practicing to earn badges!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {achievements.slice(0, 5).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{achievement.title}</div>
                          <div className="text-xs text-gray-600">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                    {achievements.length > 5 && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to="/achievements">View All ({achievements.length})</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
