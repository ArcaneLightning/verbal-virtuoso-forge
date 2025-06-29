
import { useState } from "react";
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

const Practice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasAnalysis, setHasAnalysis] = useState(false);

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

  const analysisResults = {
    overallScore: 8.2,
    clarity: 85,
    pace: 78,
    volume: 92,
    toneVariety: 67,
    engagement: 89,
    recommendations: [
      "Try to vary your tone more throughout the speech to maintain audience interest",
      "Consider slowing down slightly during key points for better emphasis",
      "Great job on maintaining clear articulation throughout",
      "Your volume control was excellent - very consistent"
    ]
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setHasAnalysis(false);
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Auto-stop after 30 seconds for demo
    setTimeout(() => {
      setIsRecording(false);
      setHasAnalysis(true);
      clearInterval(timer);
    }, 5000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasAnalysis(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Speech Practice</h1>
          <p className="text-gray-300">Record your speech and get AI-powered feedback to improve your skills.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Selection */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-400" />
                  Choose Your Topic
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Select from our curated topics or create your own custom topic.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Practice Topics</label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="bg-black/60 border-blue-500/30 text-white">
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
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Or Create Custom Topic</label>
                  <Textarea
                    placeholder="Enter your custom speech topic..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="bg-black/60 border-blue-500/30 text-white placeholder-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recording Interface */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-blue-400" />
                  Recording Studio
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Click record to start your speech practice session.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  {/* Recording Visualizer */}
                  <div className="relative">
                    <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                      isRecording 
                        ? 'border-red-500 bg-red-500/20 animate-pulse' 
                        : 'border-blue-500 bg-blue-500/20'
                    }`}>
                      <Mic className={`w-12 h-12 ${isRecording ? 'text-red-400' : 'text-blue-400'}`} />
                    </div>
                    {isRecording && (
                      <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping"></div>
                    )}
                  </div>

                  {/* Timer */}
                  <div className="text-2xl font-mono text-white">
                    {formatTime(recordingTime)}
                  </div>

                  {/* Recording Controls */}
                  <div className="flex justify-center space-x-4">
                    {!isRecording ? (
                      <Button
                        onClick={handleStartRecording}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3"
                        disabled={!selectedTopic && !customTopic}
                      >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button
                        onClick={handleStopRecording}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3"
                      >
                        <Square className="w-5 h-5 mr-2" />
                        Stop Recording
                      </Button>
                    )}
                  </div>

                  {isRecording && (
                    <div className="text-sm text-gray-300">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Recording in progress...</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {hasAnalysis && (
              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                    AI Analysis Results
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Here's your detailed performance analysis and feedback.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">{analysisResults.overallScore}/10</div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Excellent Performance
                    </Badge>
                  </div>

                  {/* Detailed Metrics */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Clarity</span>
                        <span className="text-sm text-white">{analysisResults.clarity}%</span>
                      </div>
                      <Progress value={analysisResults.clarity} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Pace</span>
                        <span className="text-sm text-white">{analysisResults.pace}%</span>
                      </div>
                      <Progress value={analysisResults.pace} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Volume</span>
                        <span className="text-sm text-white">{analysisResults.volume}%</span>
                      </div>
                      <Progress value={analysisResults.volume} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Tone Variety</span>
                        <span className="text-sm text-white">{analysisResults.toneVariety}%</span>
                      </div>
                      <Progress value={analysisResults.toneVariety} className="h-2" />
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                      AI Recommendations
                    </h4>
                    <div className="space-y-2">
                      {analysisResults.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
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
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Sessions</span>
                  <span className="text-white font-bold">3/5</span>
                </div>
                <Progress value={60} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Practice Time</span>
                  <span className="text-white font-bold">24min</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Avg Score</span>
                  <span className="text-white font-bold">8.2/10</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Practice Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Practice in a quiet environment for best results</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Speak naturally - our AI adapts to your style</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Review your analytics after each session</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Focus on one skill at a time for improvement</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Topics */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Recent Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Climate Change", "AI Ethics", "Education Reform"].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-blue-500/10">
                      <span className="text-sm text-gray-300">{topic}</span>
                      <span className="text-xs text-blue-400">8.{index + 5}/10</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
