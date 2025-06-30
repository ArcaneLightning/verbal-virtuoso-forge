import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Mic,
  MessageSquare,
  Calendar,
  Award,
  ArrowRight,
  LineChart,
  PieChart,
  Activity,
  Zap,
  Star
} from "lucide-react";
import { useUserData } from "../hooks/useUserData";
import { useState } from "react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const { speechSessions, debateSessions, loading } = useUserData();

  // Calculate analytics data
  const getAnalyticsData = () => {
    const now = new Date();
    const timeRanges = {
      "7d": 7,
      "30d": 30,
      "90d": 90
    };
    
    const daysBack = timeRanges[timeRange as keyof typeof timeRanges] || 7;
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    const filteredSpeechSessions = speechSessions.filter(
      session => new Date(session.created_at) >= cutoffDate
    );
    
    const filteredDebateSessions = debateSessions.filter(
      session => new Date(session.created_at) >= cutoffDate
    );

    // Speech analytics
    const totalSpeechTime = filteredSpeechSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);
    const avgSpeechScore = filteredSpeechSessions.length > 0 
      ? filteredSpeechSessions.reduce((sum, session) => {
          return sum + (session.overall_score || 0);
        }, 0) / filteredSpeechSessions.length 
      : 0;

    // Debate analytics
    const totalDebateTime = filteredDebateSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);
    const avgDebateScore = filteredDebateSessions.length > 0 
      ? filteredDebateSessions.reduce((sum, session) => sum + (session.user_score || 0), 0) / filteredDebateSessions.length 
      : 0;
    const debatesWon = filteredDebateSessions.filter(session => (session.user_score || 0) > (session.ai_score || 0)).length;
    const winRate = filteredDebateSessions.length > 0 ? (debatesWon / filteredDebateSessions.length) * 100 : 0;

    // Skills breakdown (from speech sessions)
    const skillsData = {
      clarity: 0,
      pace: 0,
      volume: 0,
      tone: 0,
      engagement: 0
    };

    if (filteredSpeechSessions.length > 0) {
      const latestSession = filteredSpeechSessions[0];
      skillsData.clarity = latestSession.clarity_score || 0;
      skillsData.pace = latestSession.pace_score || 0;
      skillsData.volume = latestSession.volume_score || 0;
      skillsData.tone = latestSession.tone_score || 0;
      skillsData.engagement = latestSession.engagement_score || 0;
    }

    // Daily activity
    const dailyActivity = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + (24 * 60 * 60 * 1000));
      
      const daySpeechSessions = filteredSpeechSessions.filter(
        session => {
          const sessionDate = new Date(session.created_at);
          return sessionDate >= dayStart && sessionDate < dayEnd;
        }
      );
      
      const dayDebateSessions = filteredDebateSessions.filter(
        session => {
          const sessionDate = new Date(session.created_at);
          return sessionDate >= dayStart && sessionDate < dayEnd;
        }
      );

      dailyActivity.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        practice: daySpeechSessions.length,
        debate: dayDebateSessions.length,
        total: daySpeechSessions.length + dayDebateSessions.length
      });
    }

    return {
      totalSpeechTime: Math.round(totalSpeechTime / 60), // in minutes
      avgSpeechScore: Math.round(avgSpeechScore * 10) / 10,
      totalDebateTime: Math.round(totalDebateTime / 60), // in minutes
      avgDebateScore: Math.round(avgDebateScore * 10) / 10,
      winRate: Math.round(winRate),
      skillsData,
      dailyActivity,
      totalSessions: filteredSpeechSessions.length + filteredDebateSessions.length
    };
  };

  const analytics = getAnalyticsData();

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-500 py-12">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your speaking performance and improvement over time.</p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sessions</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalSessions}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Practice Time</CardTitle>
              <Clock className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalSpeechTime}m</div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Practice Score</CardTitle>
              <Target className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{analytics.avgSpeechScore}/10</div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Debate Win Rate</CardTitle>
              <Award className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{analytics.winRate}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Activity Chart */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <LineChart className="w-5 h-5 mr-2 text-blue-600" />
                  Daily Activity
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your daily practice and debate sessions over the selected period.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.dailyActivity.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No activity in the selected period. Start practicing to see your progress!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.dailyActivity.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 text-sm font-medium text-gray-700">{day.date}</div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              <Mic className="w-3 h-3 mr-1" />
                              {day.practice} Practice
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {day.debate} Debate
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {day.total} sessions
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Breakdown */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-green-600" />
                  Skills Assessment
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your current speaking skills breakdown based on recent practice sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Clarity</span>
                      <span className="text-sm text-gray-900">{analytics.skillsData.clarity}%</span>
                    </div>
                    <Progress value={analytics.skillsData.clarity} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Pace</span>
                      <span className="text-sm text-gray-900">{analytics.skillsData.pace}%</span>
                    </div>
                    <Progress value={analytics.skillsData.pace} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Volume</span>
                      <span className="text-sm text-gray-900">{analytics.skillsData.volume}%</span>
                    </div>
                    <Progress value={analytics.skillsData.volume} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Tone Variety</span>
                      <span className="text-sm text-gray-900">{analytics.skillsData.tone}%</span>
                    </div>
                    <Progress value={analytics.skillsData.tone} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Engagement</span>
                      <span className="text-sm text-gray-900">{analytics.skillsData.engagement}%</span>
                    </div>
                    <Progress value={analytics.skillsData.engagement} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Summary */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Speech Sessions</span>
                  <span className="text-gray-900 font-bold">{speechSessions.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Debate Sessions</span>
                  <span className="text-gray-900 font-bold">{debateSessions.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Practice Time</span>
                  <span className="text-gray-900 font-bold">
                    {Math.round(speechSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) / 60)}m
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Avg Debate Score</span>
                  <span className="text-gray-900 font-bold">
                    {debateSessions.length > 0 
                      ? (debateSessions.reduce((sum, session) => sum + (session.user_score || 0), 0) / debateSessions.length).toFixed(1)
                      : '0'
                    }/10
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-700">
                  {analytics.totalSessions === 0 ? (
                    <div className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Start your first practice session to see insights</span>
                    </div>
                  ) : (
                    <>
                      {analytics.totalSessions > 0 && (
                        <div className="flex items-start space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>You've completed {analytics.totalSessions} sessions in the last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}</span>
                        </div>
                      )}
                      
                      {analytics.winRate > 50 && (
                        <div className="flex items-start space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>Great debate performance with {analytics.winRate}% win rate</span>
                        </div>
                      )}
                      
                      {analytics.avgSpeechScore > 7 && (
                        <div className="flex items-start space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>Excellent practice score of {analytics.avgSpeechScore}/10</span>
                        </div>
                      )}
                      
                      {analytics.skillsData.clarity < 70 && (
                        <div className="flex items-start space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>Focus on clarity - current score: {analytics.skillsData.clarity}%</span>
                        </div>
                      )}
                      
                      {analytics.skillsData.engagement < 70 && (
                        <div className="flex items-start space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>Work on engagement - current score: {analytics.skillsData.engagement}%</span>
                        </div>
                      )}
                      
                      {analytics.totalSpeechTime < 30 && analytics.totalSessions > 0 && (
                        <div className="flex items-start space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>Consider longer practice sessions for deeper improvement</span>
                        </div>
                      )}
                      
                      {analytics.dailyActivity.filter(day => day.total > 0).length >= 5 && (
                        <div className="flex items-start space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>Consistent practice pattern - keep it up!</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Target className="w-4 h-4 mr-2" />
                  Set Goals
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 