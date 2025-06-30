import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  MessageSquare, 
  Clock, 
  Target, 
  Trophy, 
  Users, 
  Mic,
  Send,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: number;
}

interface DebateMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  score?: number;
}

interface DebateSession {
  id: string;
  topic: string;
  position: 'for' | 'against';
  messages: DebateMessage[];
  userScore: number;
  aiScore: number;
  duration: number;
  isActive: boolean;
}

const DebatePage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<'for' | 'against'>('for');
  const [currentSession, setCurrentSession] = useState<DebateSession | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endDebate();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, timeRemaining]);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('difficulty_level', { ascending: true });

      if (error) throw error;
      setTopics(data || []);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Failed to load topics');
    }
  };

  const startDebate = () => {
    if (!selectedTopic) {
      setError('Please select a topic first');
      return;
    }

    const topic = topics.find(t => t.id === selectedTopic);
    if (!topic) return;

    const newSession: DebateSession = {
      id: Date.now().toString(),
      topic: topic.title,
      position: selectedPosition,
      messages: [],
      userScore: 0,
      aiScore: 0,
      duration: 0,
      isActive: true
    };

    setCurrentSession(newSession);
    setTimeRemaining(300);
    setIsTimerRunning(true);
    setError(null);

    // Add initial AI message
    setTimeout(() => {
      addAIMessage(`Welcome to the debate! You are arguing ${selectedPosition} the topic: "${topic.title}". I'll be your opponent arguing ${selectedPosition === 'for' ? 'against' : 'for'} this topic. Let's begin!`);
    }, 1000);
  };

  const endDebate = () => {
    if (!currentSession) return;

    setIsTimerRunning(false);
    setCurrentSession(prev => prev ? { ...prev, isActive: false } : null);

    // Save debate session to database
    saveDebateSession();
  };

  const saveDebateSession = async () => {
    if (!currentSession) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('debate_sessions')
        .insert({
          user_id: user.id,
          topic_id: selectedTopic,
          position: currentSession.position,
          duration_seconds: 300 - timeRemaining,
          ai_opponent_response: currentSession.messages
            .filter(m => m.sender === 'ai')
            .map(m => m.content)
            .join('\n\n'),
          user_score: currentSession.userScore,
          ai_score: currentSession.aiScore,
          feedback: {
            user_score: currentSession.userScore,
            ai_score: currentSession.aiScore,
            total_messages: currentSession.messages.length,
            user_messages: currentSession.messages.filter(m => m.sender === 'user').length,
            ai_messages: currentSession.messages.filter(m => m.sender === 'ai').length
          }
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error saving debate session:', err);
    }
  };

  const addUserMessage = (content: string) => {
    if (!currentSession || !content.trim()) return;

    const newMessage: DebateMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);

    setUserInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      generateAIResponse(content.trim());
    }, 1000 + Math.random() * 2000); // Random delay for realism
  };

  const addAIMessage = (content: string) => {
    if (!currentSession) return;

    const newMessage: DebateMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      content,
      timestamp: new Date()
    };

    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);

    setIsLoading(false);
  };

  const generateAIResponse = (userMessage: string) => {
    // Simulate AI debate responses based on the topic and position
    const topic = topics.find(t => t.id === selectedTopic);
    const aiPosition = selectedPosition === 'for' ? 'against' : 'for';
    
    const responses = [
      `That's an interesting point, but from the ${aiPosition} perspective, I would argue that...`,
      `While you make a valid argument, consider this counterpoint from the ${aiPosition} side...`,
      `I understand your position, but let me present an alternative viewpoint that supports the ${aiPosition} argument...`,
      `Your reasoning is compelling, however, the ${aiPosition} position would suggest that...`,
      `That's a thoughtful argument, but from the ${aiPosition} standpoint, we must consider...`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addAIMessage(randomResponse);

    // Update scores (simplified scoring)
    const userScoreIncrease = Math.floor(Math.random() * 3) + 1;
    const aiScoreIncrease = Math.floor(Math.random() * 2) + 1;

    setCurrentSession(prev => prev ? {
      ...prev,
      userScore: prev.userScore + userScoreIncrease,
      aiScore: prev.aiScore + aiScoreIncrease
    } : null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetDebate = () => {
    setCurrentSession(null);
    setTimeRemaining(300);
    setIsTimerRunning(false);
    setUserInput('');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isLoading) {
      addUserMessage(userInput);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Debate Simulator</h1>
          <p className="text-gray-600">Engage in structured debates with an AI opponent</p>
        </div>
      </div>

      {!currentSession ? (
        /* Setup Section */
        <Card>
          <CardHeader>
            <CardTitle>Start a New Debate</CardTitle>
            <CardDescription>
              Choose a topic and your position to begin debating
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Topic Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Debate Topic</label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a debate topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{topic.title}</span>
                        <Badge variant="outline" className="ml-2">
                          Level {topic.difficulty_level}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Position Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose Your Position</label>
              <div className="flex space-x-4">
                <Button
                  variant={selectedPosition === 'for' ? 'default' : 'outline'}
                  onClick={() => setSelectedPosition('for')}
                  className="flex-1"
                >
                  <Target className="mr-2 h-4 w-4" />
                  For
                </Button>
                <Button
                  variant={selectedPosition === 'against' ? 'default' : 'outline'}
                  onClick={() => setSelectedPosition('against')}
                  className="flex-1"
                >
                  <Target className="mr-2 h-4 w-4" />
                  Against
                </Button>
              </div>
            </div>

            {/* Debate Rules */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Debate Rules</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Each debate lasts 5 minutes</li>
                <li>• Take turns with the AI opponent</li>
                <li>• Present clear arguments and counter-arguments</li>
                <li>• Stay respectful and focused on the topic</li>
                <li>• Your score is based on argument quality and engagement</li>
              </ul>
            </div>

            <Button
              onClick={startDebate}
              disabled={!selectedTopic}
              className="w-full"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Debate
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Active Debate Section */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Debate Chat */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Debate: {currentSession.topic}</CardTitle>
                    <CardDescription>
                      You are arguing {currentSession.position} this topic
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {formatTime(timeRemaining)}
                      </div>
                      <div className="text-xs text-gray-500">Time Left</div>
                    </div>
                    <Button
                      onClick={endDebate}
                      variant="outline"
                      size="sm"
                    >
                      End Debate
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Messages */}
                <div className="h-96 overflow-y-auto space-y-4 mb-4">
                  {currentSession.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.sender === 'user' ? 'You' : 'AI Opponent'}
                          </span>
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your argument..."
                    className="flex-1"
                    disabled={isLoading || !currentSession.isActive}
                    rows={2}
                  />
                  <Button
                    type="submit"
                    disabled={!userInput.trim() || isLoading || !currentSession.isActive}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Score Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentSession.userScore}
                  </div>
                  <p className="text-sm text-gray-500">Your Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {currentSession.aiScore}
                  </div>
                  <p className="text-sm text-gray-500">AI Score</p>
                </div>
                <div className="text-center pt-4 border-t">
                  <div className="text-lg font-bold">
                    {currentSession.userScore > currentSession.aiScore ? 'You\'re Winning!' : 
                     currentSession.userScore < currentSession.aiScore ? 'AI is Ahead' : 'Tied!'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Debate Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Messages Sent:</span>
                  <span className="text-sm font-medium">
                    {currentSession.messages.filter(m => m.sender === 'user').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">AI Responses:</span>
                  <span className="text-sm font-medium">
                    {currentSession.messages.filter(m => m.sender === 'ai').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Time Elapsed:</span>
                  <span className="text-sm font-medium">
                    {formatTime(300 - timeRemaining)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={resetDebate}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              New Debate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebatePage; 