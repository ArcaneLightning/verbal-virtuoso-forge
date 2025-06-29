
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Clock, 
  Target, 
  Trophy, 
  PlayCircle,
  Square,
  Timer,
  Brain,
  Zap,
  CheckCircle,
  Award,
  TrendingUp,
  Volume2
} from "lucide-react";

const Debate = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [debateTime, setDebateTime] = useState(300); // 5 minutes
  const [hasResult, setHasResult] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("preparation"); // preparation, opening, rebuttals, closing

  const debateTopics = [
    "Artificial Intelligence should be regulated by government",
    "Social media does more harm than good",
    "Remote work is better than office work",
    "Nuclear energy is essential for climate goals",
    "Universal basic income should be implemented",
    "Space exploration is worth the investment",
    "Genetic engineering should be allowed",
    "Cryptocurrency will replace traditional currency",
    "Online education is as effective as in-person",
    "Renewable energy can fully replace fossil fuels"
  ];

  const debateResult = {
    yourScore: 8.3,
    aiScore: 7.8,
    winner: "You",
    strengths: [
      "Strong opening statement with clear thesis",
      "Effective use of evidence and examples",
      "Good rebuttal to opponent's arguments",
      "Maintained composure throughout"
    ],
    improvements: [
      "Could have addressed counterarguments more thoroughly",
      "Consider varying speech pace for emphasis",
      "Stronger closing statement would be beneficial"
    ]
  };

  const handleStartDebate = () => {
    setIsDebating(true);
    setHasResult(false);
    setCurrentPhase("opening");
    
    // Simulate debate phases
    const phases = ["opening", "rebuttals", "closing", "finished"];
    let phaseIndex = 0;
    
    const phaseTimer = setInterval(() => {
      phaseIndex++;
      if (phaseIndex < phases.length) {
        setCurrentPhase(phases[phaseIndex]);
      } else {
        setIsDebating(false);
        setHasResult(true);
        clearInterval(phaseTimer);
      }
    }, 3000);

    // Countdown timer
    const timer = setInterval(() => {
      setDebateTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Debate Simulator</h1>
          <p className="text-gray-300">Challenge our AI opponent in structured debates and improve your argumentation skills.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Debate Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic & Position Selection */}
            {!isDebating && !hasResult && (
              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-400" />
                    Debate Setup
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Choose your topic and position for the debate.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Debate Topic</label>
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger className="bg-black/60 border-blue-500/30 text-white">
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
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Your Position</label>
                    <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                      <SelectTrigger className="bg-black/60 border-blue-500/30 text-white">
                        <SelectValue placeholder="Choose your position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="for">For (Supporting the statement)</SelectItem>
                        <SelectItem value="against">Against (Opposing the statement)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleStartDebate}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3"
                    disabled={!selectedTopic || !selectedPosition}
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Start Debate
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Active Debate Interface */}
            {isDebating && (
              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Users className="w-5 h-5 mr-2 text-red-400" />
                      Live Debate
                    </CardTitle>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                      LIVE
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300">
                    Topic: {selectedTopic}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Timer */}
                    <div className="text-center">
                      <div className="text-4xl font-mono text-white mb-2">
                        {formatTime(debateTime)}
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase
                      </Badge>
                    </div>

                    {/* Debate Interface */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Your Side */}
                      <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium">You</h4>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {selectedPosition === "for" ? "For" : "Against"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                            <Volume2 className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-sm text-gray-300 text-center">Your turn to speak</p>
                        </div>
                      </div>

                      {/* AI Side */}
                      <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium">AI Opponent</h4>
                          <Badge className="bg-purple-500/20 text-purple-400">
                            {selectedPosition === "for" ? "Against" : "For"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                            <Brain className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-sm text-gray-300 text-center">Analyzing your argument...</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>Debate Progress</span>
                        <span>{Math.round(((300 - debateTime) / 300) * 100)}%</span>
                      </div>
                      <Progress value={((300 - debateTime) / 300) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Debate Results */}
            {hasResult && (
              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                    Debate Results
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Here's how you performed against our AI opponent.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Winner Announcement */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">Victory!</div>
                    <p className="text-gray-300">You won this debate with a score of {debateResult.yourScore}/10</p>
                  </div>

                  {/* Score Comparison */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/20">
                      <div className="text-2xl font-bold text-blue-400">{debateResult.yourScore}</div>
                      <div className="text-sm text-gray-300">Your Score</div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-4 text-center border border-purple-500/20">
                      <div className="text-2xl font-bold text-purple-400">{debateResult.aiScore}</div>
                      <div className="text-sm text-gray-300">AI Score</div>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                      Your Strengths
                    </h4>
                    <div className="space-y-2">
                      {debateResult.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Improvements */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                      Areas for Improvement
                    </h4>
                    <div className="space-y-2">
                      {debateResult.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm text-gray-300">
                          <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span>{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setHasResult(false);
                      setSelectedTopic("");
                      setSelectedPosition("");
                      setDebateTime(300);
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Start New Debate
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Debate Stats */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Your Debate Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Debates Won</span>
                  <span className="text-white font-bold">15</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Win Rate</span>
                  <span className="text-white font-bold">68%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Avg Score</span>
                  <span className="text-white font-bold">7.8/10</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Time</span>
                  <span className="text-white font-bold">3.2h</span>
                </div>
              </CardContent>
            </Card>

            {/* Debate Tips */}
            <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Debate Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Start with a clear thesis statement</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Brain className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>Listen carefully to opponent's arguments</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Use evidence to support your points</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Stay calm and composed throughout</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Opponents */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Recent Debates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { topic: "AI Regulation", result: "Won", score: "8.3" },
                    { topic: "Social Media", result: "Lost", score: "7.1" },
                    { topic: "Remote Work", result: "Won", score: "8.7" }
                  ].map((debate, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-blue-500/10">
                      <div>
                        <div className="text-sm text-white">{debate.topic}</div>
                        <div className={`text-xs ${debate.result === "Won" ? "text-green-400" : "text-red-400"}`}>
                          {debate.result}
                        </div>
                      </div>
                      <div className="text-sm text-blue-400">{debate.score}/10</div>
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

export default Debate;
