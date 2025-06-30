import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  MessageSquare, 
  Clock, 
  Target, 
  TrendingUp,
  BarChart3,
  Zap,
  CheckCircle,
  AlertCircle,
  Timer,
  Award,
  Mic,
  PlayCircle,
  Square,
  Volume2,
  Star,
  Trophy
} from "lucide-react";
import { useUserData } from "../hooks/useUserData";

const Debate = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'prep' | 'speaking' | 'analysis'>('prep');
  
  const { createDebateSession, debateSessions, loading } = useUserData();

  const debateTopics = [
    "Should social media platforms be regulated more strictly?",
    "Is remote work better than office work for productivity?",
    "Should college education be free for all students?",
    "Are electric vehicles truly better for the environment?",
    "Should artificial intelligence development be paused?",
    "Is the gig economy beneficial for workers?",
    "Should professional athletes be paid less?",
    "Are video games beneficial for cognitive development?",
    "Should fast food advertising be banned?",
    "Is space exploration worth the investment?"
  ];

  const handleStartDebate = () => {
    if (!selectedTopic && !customTopic.trim()) {
      setError("Please select a topic or enter a custom topic");
      return;
    }
    
    setError(null);
    setCurrentPhase('speaking');
    setIsRecording(true);
    setHasAnalysis(false);
    setRecordingTime(0);
    
    // Simulate debate timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Auto-stop after 60 seconds for demo
    setTimeout(() => {
      handleStopDebate();
      clearInterval(timer);
    }, 60000);
  };

  const handleStopDebate = async () => {
    setIsRecording(false);
    setCurrentPhase('analysis');
    setHasAnalysis(true);
    
    // Generate mock debate analysis results
    const analysisResults = {
      overallScore: Math.floor(Math.random() * 3) + 7, // 7-9
      argumentStrength: Math.floor(Math.random() * 20) + 75, // 75-95
      rebuttalQuality: Math.floor(Math.random() * 20) + 70, // 70-90
      evidenceUsage: Math.floor(Math.random() * 20) + 80, // 80-100
      logicalFlow: Math.floor(Math.random() * 30) + 60, // 60-90
      audienceEngagement: Math.floor(Math.random() * 20) + 75, // 75-95
      recommendations: [
        "Strengthen your counter-arguments with more specific examples",
        "Consider addressing potential objections more directly",
        "Excellent use of evidence to support your main points",
        "Your logical structure was clear and easy to follow"
      ]
    };

    // Save the debate session to Supabase
    try {
      setIsSaving(true);
      const topic = selectedTopic || customTopic;
      
      await createDebateSession({
        position: topic,
        topic_id: null,
        duration_seconds: recordingTime,
        user_score: analysisResults.overallScore,
        ai_score: Math.floor(Math.random() * 3) + 6, // AI score 6-8
        ai_opponent_response: "This is a mock AI response for demonstration purposes.",
        feedback: analysisResults.recommendations
      });
      
      // Store analysis results for display
      setAnalysisResults(analysisResults);
    } catch (err: any) {
      setError(err.message || "Failed to save debate session");
    } finally {
      setIsSaving(false);
    }
  };

  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get recent debate topics from actual sessions
  const getRecentDebates = () => {
    const debates = debateSessions
      .slice(0, 3)
      .map(session => ({
        topic: session.position,
        score: session.user_score
      }));
    return debates;
  };

  const recentDebates = getRecentDebates();

  // Calculate debate statistics
  const getDebateStats = () => {
    if (debateSessions.length === 0) {
      return {
        totalDebates: 0,
        avgScore: 0,
        totalTime: 0,
        winRate: 0
      };
    }

    const totalDebates = debateSessions.length;
    const avgScore = debateSessions.reduce((sum, session) => sum + (session.user_score || 0), 0) / totalDebates;
    const totalTime = debateSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);
    const winRate = debateSessions.filter(session => (session.user_score || 0) >= 7).length / totalDebates * 100;

    return {
      totalDebates,
      avgScore: avgScore.toFixed(1),
      totalTime: Math.round(totalTime / 60),
      winRate: Math.round(winRate)
    };
  };

  const debateStats = getDebateStats();

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-500 py-12">Loading debate data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Debate Practice</h1>
          <p className="text-gray-600">Practice your debate skills with AI-powered analysis and feedback.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Debate Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Selection */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Choose Debate Topic
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Select a controversial topic to practice your argumentation skills.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Debate Topics</label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select a debate topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {debateTopics.map((topic) => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Or Create Custom Topic</label>
                  <Textarea
                    placeholder="Enter your custom debate topic..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {error && <div className="text-red-600 text-sm">{error}</div>}
              </CardContent>
            </Card>

            {/* Debate Interface */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                  Debate Studio
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Present your argument and receive AI-powered feedback on your debate skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  {/* Recording Visualizer */}
                  <div className="relative">
                    <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                      isRecording 
                        ? 'border-red-500 bg-red-50 animate-pulse' 
                        : 'border-blue-500 bg-blue-50'
                    }`}>
                      <MessageSquare className={`w-12 h-12 ${isRecording ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                    {isRecording && (
                      <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping"></div>
                    )}
                  </div>

                  {/* Timer */}
                  <div className="text-2xl font-mono text-gray-900">
                    {formatTime(recordingTime)}
                  </div>

                  {/* Debate Controls */}
                  <div className="flex justify-center space-x-4">
                    {!isRecording ? (
                      <Button
                        onClick={handleStartDebate}
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3"
                        disabled={!selectedTopic && !customTopic.trim()}
                      >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Start Debate
                      </Button>
                    ) : (
                      <Button
                        onClick={handleStopDebate}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3"
                      >
                        <Square className="w-5 h-5 mr-2" />
                        End Debate
                      </Button>
                    )}
                  </div>

                  {isRecording && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Debate in progress...</span>
                      </div>
                    </div>
                  )}

                  {isSaving && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Analyzing your debate...</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {hasAnalysis && analysisResults && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Debate Analysis Results
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Here's your detailed debate performance analysis and feedback.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">{analysisResults.overallScore}/10</div>
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Strong Performance
                    </Badge>
                  </div>

                  {/* Skills Breakdown */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Argument Strength</span>
                        <span className="text-sm text-gray-900">{analysisResults.argumentStrength}%</span>
                      </div>
                      <Progress value={analysisResults.argumentStrength} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Rebuttal Quality</span>
                        <span className="text-sm text-gray-900">{analysisResults.rebuttalQuality}%</span>
                      </div>
                      <Progress value={analysisResults.rebuttalQuality} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Evidence Usage</span>
                        <span className="text-sm text-gray-900">{analysisResults.evidenceUsage}%</span>
                      </div>
                      <Progress value={analysisResults.evidenceUsage} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Logical Flow</span>
                        <span className="text-sm text-gray-900">{analysisResults.logicalFlow}%</span>
                      </div>
                      <Progress value={analysisResults.logicalFlow} className="h-2" />
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-gray-900 font-medium mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                      Debate Recommendations
                    </h4>
                    <div className="space-y-2">
                      {analysisResults.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Debate Stats */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg">Debate Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Debates</span>
                  <span className="text-gray-900 font-bold">{debateStats.totalDebates}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Average Score</span>
                  <span className="text-gray-900 font-bold">{debateStats.avgScore}/10</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Time</span>
                  <span className="text-gray-900 font-bold">{debateStats.totalTime}min</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Win Rate</span>
                  <span className="text-gray-900 font-bold">{debateStats.winRate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Debate Tips */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Debate Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Start with a clear thesis statement</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Use specific evidence to support claims</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Address counter-arguments directly</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Maintain logical flow throughout</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Debates */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg">Recent Debates</CardTitle>
              </CardHeader>
              <CardContent>
                {recentDebates.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No debate sessions yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentDebates.map((debate, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-blue-50">
                        <span className="text-sm text-gray-700 truncate">{debate.topic}</span>
                        <span className="text-xs text-blue-600">{debate.score}/10</span>
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

export default Debate;
