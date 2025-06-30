import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mic, 
  Square, 
  PlayCircle, 
  Volume2, 
  Clock, 
  Target, 
  TrendingUp,
  BarChart3,
  Zap,
  CheckCircle,
  AlertCircle,
  Timer,
  Award
} from "lucide-react";
import { useUserData } from "../hooks/useUserData";

const Practice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  const { createSpeechSession, speechSessions, loading } = useUserData();

  const practiceTopics = [
    "Climate Change Solutions",
    "The Future of Artificial Intelligence",
    "Social Media's Impact on Society",
    "Renewable Energy Transition",
    "Education System Reform",
    "Mental Health Awareness",
    "Space Exploration Benefits",
    "Entrepreneurship in the Digital Age",
    "Cultural Diversity and Inclusion",
    "Technology and Privacy Rights"
  ];

  const handleStartRecording = () => {
    if (!selectedTopic && !customTopic.trim()) {
      setError("Please select a topic or enter a custom topic");
      return;
    }
    
    setError(null);
    setIsRecording(true);
    setHasAnalysis(false);
    setRecordingTime(0);
    
    // Start recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Store timer reference for cleanup
    setRecordingTimer(timer);
  };

  const handleStopRecording = async () => {
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
    
    setIsRecording(false);
    setHasAnalysis(true);
    
    // Generate mock analysis results
    const analysisResults = {
      overallScore: Math.floor(Math.random() * 3) + 7, // 7-9
      clarity: Math.floor(Math.random() * 20) + 75, // 75-95
      pace: Math.floor(Math.random() * 20) + 70, // 70-90
      volume: Math.floor(Math.random() * 20) + 80, // 80-100
      toneVariety: Math.floor(Math.random() * 30) + 60, // 60-90
      engagement: Math.floor(Math.random() * 20) + 75, // 75-95
      recommendations: [
        "Try to vary your tone more throughout the speech to maintain audience interest",
        "Consider slowing down slightly during key points for better emphasis",
        "Great job on maintaining clear articulation throughout",
        "Your volume control was excellent - very consistent"
      ]
    };

    // Save the practice session to Supabase
    try {
      setIsSaving(true);
      const topic = selectedTopic || customTopic.trim();
      
      await createSpeechSession({
        title: topic,
        topic_id: null,
        audio_url: null,
        transcript: null,
        duration_seconds: recordingTime,
        overall_score: analysisResults.overallScore,
        clarity_score: analysisResults.clarity,
        pace_score: analysisResults.pace,
        volume_score: analysisResults.volume,
        tone_score: analysisResults.toneVariety,
        engagement_score: analysisResults.engagement,
        feedback: analysisResults.recommendations
      });
      
      // Store analysis results for display
      setAnalysisResults(analysisResults);
    } catch (err: any) {
      setError(err.message || "Failed to save practice session");
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get recent topics from actual speech sessions
  const getRecentTopics = () => {
    const topics = speechSessions
      .slice(0, 3)
      .map(session => ({
        topic: session.title || 'Speech Session',
        score: session.overall_score || 0
      }));
    return topics;
  };

  const recentTopics = getRecentTopics();

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
    };
  }, [recordingTimer]);

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-500 py-12">Loading practice data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Speech Practice</h1>
          <p className="text-gray-600">Record your speech and get AI-powered feedback to improve your skills.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Selection */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Choose Your Topic
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Select from our curated topics or create your own custom topic.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Practice Topics</label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select a practice topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceTopics.map((topic) => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Or Create Custom Topic</label>
                  <Textarea
                    placeholder="Enter your custom speech topic..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {error && <div className="text-red-600 text-sm">{error}</div>}
              </CardContent>
            </Card>

            {/* Recording Interface */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-blue-600" />
                  Recording Studio
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Click record to start your speech practice session.
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
                      <Mic className={`w-12 h-12 ${isRecording ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                    {isRecording && (
                      <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping"></div>
                    )}
                  </div>

                  {/* Timer */}
                  <div className="text-2xl font-mono text-gray-900">
                    {formatTime(recordingTime)}
                  </div>

                  {/* Recording Controls */}
                  <div className="flex justify-center space-x-4">
                    {!isRecording ? (
                      <Button
                        onClick={handleStartRecording}
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3"
                        disabled={!selectedTopic && !customTopic.trim()}
                      >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button
                        onClick={handleStopRecording}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3"
                      >
                        <Square className="w-5 h-5 mr-2" />
                        Stop Recording
                      </Button>
                    )}
                  </div>

                  {isRecording && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Recording in progress...</span>
                      </div>
                    </div>
                  )}

                  {isSaving && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Analyzing your speech...</span>
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
                    AI Analysis Results
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Here's your detailed performance analysis and feedback.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">{analysisResults.overallScore}/10</div>
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Excellent Performance
                    </Badge>
                  </div>

                  {/* Skills Breakdown */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Clarity</span>
                        <span className="text-sm text-gray-900">{analysisResults.clarity}%</span>
                      </div>
                      <Progress value={analysisResults.clarity} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Pace</span>
                        <span className="text-sm text-gray-900">{analysisResults.pace}%</span>
                      </div>
                      <Progress value={analysisResults.pace} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Volume</span>
                        <span className="text-sm text-gray-900">{analysisResults.volume}%</span>
                      </div>
                      <Progress value={analysisResults.volume} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Tone Variety</span>
                        <span className="text-sm text-gray-900">{analysisResults.toneVariety}%</span>
                      </div>
                      <Progress value={analysisResults.toneVariety} className="h-2" />
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-gray-900 font-medium mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                      AI Recommendations
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
            {/* Today's Stats */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Sessions</span>
                  <span className="text-gray-900 font-bold">{speechSessions.filter(s => 
                    new Date(s.created_at).toDateString() === new Date().toDateString()
                  ).length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Practice Time</span>
                  <span className="text-gray-900 font-bold">
                    {Math.round(speechSessions.filter(s => 
                      new Date(s.created_at).toDateString() === new Date().toDateString()
                    ).reduce((sum, session) => sum + (session.duration_seconds || 0), 0) / 60)}min
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Avg Score</span>
                  <span className="text-gray-900 font-bold">
                    {speechSessions.length > 0 
                      ? (speechSessions.reduce((sum, session) => sum + (session.overall_score || 0), 0) / speechSessions.length).toFixed(1)
                      : '0'
                    }/10
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Practice Tips */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Practice Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Practice in a quiet environment for best results</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Speak naturally - our AI adapts to your style</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Review your analytics after each session</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Focus on one skill at a time for improvement</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Topics */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg">Recent Topics</CardTitle>
              </CardHeader>
              <CardContent>
                {recentTopics.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No practice sessions yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentTopics.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-blue-50">
                        <span className="text-sm text-gray-700 truncate">{item.topic}</span>
                        <span className="text-xs text-blue-600">{item.score}/10</span>
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

export default Practice;
