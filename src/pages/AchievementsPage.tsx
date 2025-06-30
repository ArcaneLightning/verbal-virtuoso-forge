import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Award, 
  Star, 
  Target, 
  TrendingUp,
  Calendar,
  Mic,
  MessageSquare,
  Users,
  Zap,
  CheckCircle,
  Lock,
  Crown,
  Medal,
  Flame
} from "lucide-react";
import { useUserData } from "../hooks/useUserData";

const AchievementsPage = () => {
  const { speechSessions, debateSessions, loading } = useUserData();

  // Generate achievements based on actual user data
  const generateAchievements = () => {
    const achievements = [];
    
    // Practice-based achievements
    const totalPracticeSessions = speechSessions.length;
    const totalPracticeTime = speechSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);
    const avgPracticeScore = speechSessions.length > 0 
      ? speechSessions.reduce((sum, session) => sum + (session.overall_score || 0), 0) / speechSessions.length 
      : 0;

    // Debate-based achievements
    const totalDebateSessions = debateSessions.length;
    const debatesWon = debateSessions.filter(session => (session.user_score || 0) > (session.ai_score || 0)).length;
    const winRate = debateSessions.length > 0 ? (debatesWon / debateSessions.length) * 100 : 0;

    // First Steps
    if (totalPracticeSessions >= 1) {
      achievements.push({
        id: 'first-practice',
        title: 'First Steps',
        description: 'Complete your first practice session',
        icon: '🎯',
        category: 'practice',
        unlocked: true,
        progress: 100,
        unlockedAt: speechSessions[0]?.created_at
      });
    } else {
      achievements.push({
        id: 'first-practice',
        title: 'First Steps',
        description: 'Complete your first practice session',
        icon: '🎯',
        category: 'practice',
        unlocked: false,
        progress: 0,
        required: 1
      });
    }

    // Practice Milestones
    if (totalPracticeSessions >= 5) {
      achievements.push({
        id: 'practice-5',
        title: 'Getting Started',
        description: 'Complete 5 practice sessions',
        icon: '🌟',
        category: 'practice',
        unlocked: true,
        progress: 100,
        unlockedAt: speechSessions[4]?.created_at
      });
    } else {
      achievements.push({
        id: 'practice-5',
        title: 'Getting Started',
        description: 'Complete 5 practice sessions',
        icon: '🌟',
        category: 'practice',
        unlocked: false,
        progress: (totalPracticeSessions / 5) * 100,
        required: 5,
        current: totalPracticeSessions
      });
    }

    if (totalPracticeSessions >= 10) {
      achievements.push({
        id: 'practice-10',
        title: 'Dedicated Learner',
        description: 'Complete 10 practice sessions',
        icon: '🔥',
        category: 'practice',
        unlocked: true,
        progress: 100,
        unlockedAt: speechSessions[9]?.created_at
      });
    } else {
      achievements.push({
        id: 'practice-10',
        title: 'Dedicated Learner',
        description: 'Complete 10 practice sessions',
        icon: '🔥',
        category: 'practice',
        unlocked: false,
        progress: (totalPracticeSessions / 10) * 100,
        required: 10,
        current: totalPracticeSessions
      });
    }

    // Time-based achievements
    if (totalPracticeTime >= 1800) { // 30 minutes
      achievements.push({
        id: 'time-30min',
        title: 'Time Investment',
        description: 'Spend 30 minutes practicing',
        icon: '⏰',
        category: 'practice',
        unlocked: true,
        progress: 100,
        unlockedAt: speechSessions.find(s => (s.duration_seconds || 0) >= 1800)?.created_at
      });
    } else {
      achievements.push({
        id: 'time-30min',
        title: 'Time Investment',
        description: 'Spend 30 minutes practicing',
        icon: '⏰',
        category: 'practice',
        unlocked: false,
        progress: (totalPracticeTime / 1800) * 100,
        required: 1800,
        current: totalPracticeTime
      });
    }

    // Score-based achievements
    if (avgPracticeScore >= 7) {
      achievements.push({
        id: 'score-7',
        title: 'Above Average',
        description: 'Maintain an average score of 7.0+',
        icon: '📈',
        category: 'practice',
        unlocked: true,
        progress: 100,
        unlockedAt: speechSessions.find(s => (s.overall_score || 0) >= 7)?.created_at
      });
    } else {
      achievements.push({
        id: 'score-7',
        title: 'Above Average',
        description: 'Maintain an average score of 7.0+',
        icon: '📈',
        category: 'practice',
        unlocked: false,
        progress: (avgPracticeScore / 7) * 100,
        required: 7,
        current: avgPracticeScore
      });
    }

    // Debate achievements
    if (totalDebateSessions >= 1) {
      achievements.push({
        id: 'first-debate',
        title: 'Debate Debut',
        description: 'Complete your first debate',
        icon: '🗣️',
        category: 'debate',
        unlocked: true,
        progress: 100,
        unlockedAt: debateSessions[0]?.created_at
      });
    } else {
      achievements.push({
        id: 'first-debate',
        title: 'Debate Debut',
        description: 'Complete your first debate',
        icon: '🗣️',
        category: 'debate',
        unlocked: false,
        progress: 0,
        required: 1
      });
    }

    if (debatesWon >= 1) {
      achievements.push({
        id: 'first-win',
        title: 'First Victory',
        description: 'Win your first debate',
        icon: '🏆',
        category: 'debate',
        unlocked: true,
        progress: 100,
        unlockedAt: debateSessions.find(s => (s.user_score || 0) > (s.ai_score || 0))?.created_at
      });
    } else {
      achievements.push({
        id: 'first-win',
        title: 'First Victory',
        description: 'Win your first debate',
        icon: '🏆',
        category: 'debate',
        unlocked: false,
        progress: 0,
        required: 1
      });
    }

    if (winRate >= 50 && totalDebateSessions >= 2) {
      achievements.push({
        id: 'winning-streak',
        title: 'Winning Streak',
        description: 'Maintain a 50%+ win rate',
        icon: '👑',
        category: 'debate',
        unlocked: true,
        progress: 100,
        unlockedAt: debateSessions.find(s => (s.user_score || 0) > (s.ai_score || 0))?.created_at
      });
    } else if (totalDebateSessions >= 2) {
      achievements.push({
        id: 'winning-streak',
        title: 'Winning Streak',
        description: 'Maintain a 50%+ win rate',
        icon: '👑',
        category: 'debate',
        unlocked: false,
        progress: winRate,
        required: 50,
        current: winRate
      });
    } else {
      achievements.push({
        id: 'winning-streak',
        title: 'Winning Streak',
        description: 'Maintain a 50%+ win rate',
        icon: '👑',
        category: 'debate',
        unlocked: false,
        progress: 0,
        required: 50
      });
    }

    // Consistency achievements
    const today = new Date();
    const lastWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const sessionsThisWeek = speechSessions.filter(s => new Date(s.created_at) >= lastWeek).length;
    
    if (sessionsThisWeek >= 3) {
      achievements.push({
        id: 'weekly-consistency',
        title: 'Weekly Warrior',
        description: 'Practice 3+ times this week',
        icon: '📅',
        category: 'consistency',
        unlocked: true,
        progress: 100,
        unlockedAt: speechSessions.find(s => new Date(s.created_at) >= lastWeek)?.created_at
      });
    } else {
      achievements.push({
        id: 'weekly-consistency',
        title: 'Weekly Warrior',
        description: 'Practice 3+ times this week',
        icon: '📅',
        category: 'consistency',
        unlocked: false,
        progress: (sessionsThisWeek / 3) * 100,
        required: 3,
        current: sessionsThisWeek
      });
    }

    return achievements;
  };

  const achievements = generateAchievements();
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  // Calculate stats
  const totalAchievements = achievements.length;
  const unlockedCount = unlockedAchievements.length;
  const completionRate = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;

  // Get recent debate topics from actual sessions
  const getRecentDebates = () => {
    const debates = debateSessions
      .slice(0, 3)
      .map(session => ({
        topic: session.position || 'Debate Session',
        score: session.user_score || 0
      }));
    return debates;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-500 py-12">Loading achievements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">Track your progress and unlock badges as you improve your speaking skills.</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalAchievements}</div>
              <p className="text-xs text-gray-600">Available to unlock</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Unlocked</CardTitle>
              <Award className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{unlockedCount}</div>
              <p className="text-xs text-green-600">Achievements earned</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completion</CardTitle>
              <Target className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{Math.round(completionRate)}%</div>
              <p className="text-xs text-blue-600">Progress complete</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Unlocked Achievements */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Unlocked Achievements ({unlockedCount})
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Achievements you've earned through your hard work and dedication.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {unlockedAchievements.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No achievements unlocked yet. Start practicing to earn your first badge!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {unlockedAchievements.map((achievement) => (
                      <div key={achievement.id} className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{achievement.title}</div>
                            <div className="text-sm text-gray-600">{achievement.description}</div>
                            {achievement.unlockedAt && (
                              <div className="text-xs text-green-600 mt-1">
                                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Locked Achievements */}
          <div>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-gray-600" />
                  Locked Achievements ({lockedAchievements.length})
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Keep practicing to unlock these achievements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lockedAchievements.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <Crown className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">All achievements unlocked!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lockedAchievements.map((achievement) => (
                      <div key={achievement.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-start space-x-3">
                          <div className="text-xl opacity-50">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-700">{achievement.title}</div>
                            <div className="text-sm text-gray-500">{achievement.description}</div>
                            {achievement.current !== undefined && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span>Progress</span>
                                  <span>{achievement.current}/{achievement.required}</span>
                                </div>
                                <Progress value={achievement.progress} className="h-1" />
                              </div>
                            )}
                          </div>
                          <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
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

export default AchievementsPage; 