import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Mic, 
  MessageSquare, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Target,
  Users,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

interface UserStats {
  totalSessions: number;
  averageScore: number;
  practiceStreak: number;
  totalPracticeTime: number;
  recentSessions: any[];
  achievements: any[];
}

const DashboardPage = () => {
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    averageScore: 0,
    practiceStreak: 0,
    totalPracticeTime: 0,
    recentSessions: [],
    achievements: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch recent speech sessions
      const { data: speechSessions } = await supabase
        .from('speech_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent debate sessions
      const { data: debateSessions } = await supabase
        .from('debate_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false })
        .limit(3);

      // Calculate stats
      const allSessions = [...(speechSessions || []), ...(debateSessions || [])];
      const totalSessions = allSessions.length;
      const averageScore = allSessions.length > 0 
        ? allSessions.reduce((sum, session) => sum + (session.overall_score || session.user_score || 0), 0) / allSessions.length
        : 0;
      const totalPracticeTime = allSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);

      setStats({
        totalSessions,
        averageScore: Math.round(averageScore * 100) / 100,
        practiceStreak: 3, // This would be calculated from analytics table
        totalPracticeTime,
        recentSessions: allSessions.slice(0, 5),
        achievements: achievements || []
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
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
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Ready to improve your speech and debate skills?</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild>
            <Link to="/practice">
              <Mic className="mr-2 h-4 w-4" />
              Start Practice
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/debate">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Debate
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}/10</div>
            <p className="text-xs text-muted-foreground">
              +0.5 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Streak</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.practiceStreak} days</div>
            <p className="text-xs text-muted-foreground">
              Keep it up!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Practice Time</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(stats.totalPracticeTime)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>
                Your latest speech and debate practice sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Mic className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start your first practice session to see your progress here.
                  </p>
                  <div className="mt-6">
                    <Button asChild>
                      <Link to="/practice">Start Practice</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          session.overall_score ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {session.overall_score ? (
                            <Mic className="h-4 w-4 text-blue-600" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {session.overall_score ? 'Speech Practice' : 'Debate Session'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(session.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {session.overall_score || session.user_score || 'N/A'}/10
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.duration_seconds ? `${Math.round(session.duration_seconds / 60)}m` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievements & Quick Actions */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.achievements.length === 0 ? (
                <div className="text-center py-4">
                  <Award className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No achievements yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link to="/practice">
                  <Mic className="mr-2 h-4 w-4" />
                  Practice Speech
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/debate">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Debate
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/teams">
                  <Users className="mr-2 h-4 w-4" />
                  Join Team
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 