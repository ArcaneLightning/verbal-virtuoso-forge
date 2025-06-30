import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target,
  Clock,
  Trophy,
  Mic,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface AnalyticsData {
  totalSessions: number;
  averageScore: number;
  practiceStreak: number;
  totalPracticeTime: number;
  weeklyActivity: number[];
  monthlyProgress: {
    speech: number;
    debate: number;
  };
  topTopics: Array<{
    name: string;
    sessions: number;
    averageScore: number;
  }>;
}

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSessions: 0,
    averageScore: 0,
    practiceStreak: 0,
    totalPracticeTime: 0,
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
    monthlyProgress: { speech: 0, debate: 0 },
    topTopics: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch speech sessions
      const { data: speechSessions } = await supabase
        .from('speech_sessions')
        .select('*')
        .eq('user_id', user.id);

      // Fetch debate sessions
      const { data: debateSessions } = await supabase
        .from('debate_sessions')
        .select('*')
        .eq('user_id', user.id);

      const allSessions = [...(speechSessions || []), ...(debateSessions || [])];
      
      // Calculate analytics
      const totalSessions = allSessions.length;
      const averageScore = allSessions.length > 0 
        ? allSessions.reduce((sum, session) => sum + (session.overall_score || session.user_score || 0), 0) / allSessions.length
        : 0;
      const totalPracticeTime = allSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);

      // Mock weekly activity (in a real app, this would be calculated from actual data)
      const weeklyActivity = [3, 5, 2, 7, 4, 6, 3];

      // Mock monthly progress
      const monthlyProgress = {
        speech: speechSessions?.length || 0,
        debate: debateSessions?.length || 0
      };

      // Mock top topics
      const topTopics = [
        { name: 'Climate Change', sessions: 5, averageScore: 8.2 },
        { name: 'AI in Education', sessions: 3, averageScore: 7.8 },
        { name: 'Remote Work', sessions: 4, averageScore: 8.5 }
      ];

      setAnalytics({
        totalSessions,
        averageScore: Math.round(averageScore * 100) / 100,
        practiceStreak: 7, // Mock data
        totalPracticeTime,
        weeklyActivity,
        monthlyProgress,
        topTopics
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your performance and progress over time</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Month
          </Button>
          <Button
            variant={timeRange === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageScore}/10</div>
            <p className="text-xs text-muted-foreground">
              +0.3 from last {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.practiceStreak} days</div>
            <p className="text-xs text-muted-foreground">
              Keep it up!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Practice Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(analytics.totalPracticeTime)}</div>
            <p className="text-xs text-muted-foreground">
              This {timeRange}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>
              Your practice sessions over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.weeklyActivity.map((sessions, index) => {
                const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dayNames[index]}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(sessions / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{sessions}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Types</CardTitle>
            <CardDescription>
              Distribution of speech vs debate sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mic className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Speech Practice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{analytics.monthlyProgress.speech}</span>
                  <Badge variant="secondary">
                    {analytics.totalSessions > 0 
                      ? Math.round((analytics.monthlyProgress.speech / analytics.totalSessions) * 100)
                      : 0}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Debate Sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{analytics.monthlyProgress.debate}</span>
                  <Badge variant="secondary">
                    {analytics.totalSessions > 0 
                      ? Math.round((analytics.monthlyProgress.debate / analytics.totalSessions) * 100)
                      : 0}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Top Practice Topics</CardTitle>
          <CardDescription>
            Your most practiced topics and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{topic.name}</p>
                    <p className="text-sm text-gray-500">{topic.sessions} sessions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{topic.averageScore}/10</p>
                  <p className="text-sm text-gray-500">Average Score</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage; 