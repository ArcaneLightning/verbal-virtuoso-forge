import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Upload,
  Download,
  Target,
  Clock,
  Volume2,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { format } from 'date-fns';

interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: number;
}

interface SpeechFeedback {
  clarity_score: number;
  pace_score: number;
  volume_score: number;
  tone_score: number;
  engagement_score: number;
  overall_score: number;
  feedback: {
    clarity: string;
    pace: string;
    volume: string;
    tone: string;
    engagement: string;
    overall: string;
  };
}

interface PastSession {
  id: string;
  topic_id: string | null;
  title: string | null;
  audio_url: string | null;
  transcript: string | null;
  created_at: string | null;
}

// Mock topics since the table doesn't exist in the database
const MOCK_TOPICS: Topic[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence',
    description: 'Discuss the potential impact of AI on society and the workforce',
    category: 'Technology',
    difficulty_level: 3
  },
  {
    id: '2',
    title: 'Climate Change Solutions',
    description: 'Present solutions for addressing climate change at individual and global levels',
    category: 'Environment',
    difficulty_level: 2
  },
  {
    id: '3',
    title: 'The Importance of Mental Health',
    description: 'Discuss the significance of mental health awareness and support',
    category: 'Health',
    difficulty_level: 1
  },
  {
    id: '4',
    title: 'Remote Work vs. Office Work',
    description: 'Compare the benefits and challenges of remote and traditional office work',
    category: 'Business',
    difficulty_level: 2
  },
  {
    id: '5',
    title: 'Social Media and Society',
    description: 'Analyze the impact of social media on modern society and relationships',
    category: 'Social',
    difficulty_level: 3
  }
];

// Utility to ensure only valid numbers or null are sent to the DB
const safeNumber = (val: any) => (typeof val === 'number' && isFinite(val) ? val : null);

const PracticePage = () => {
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [feedback, setFeedback] = useState<SpeechFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [pastSessions, setPastSessions] = useState<PastSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Use mock topics instead of fetching from database
    setTopics(MOCK_TOPICS);
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Fetch past sessions for the logged-in user
  useEffect(() => {
    const fetchPastSessions = async () => {
      setLoadingSessions(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setPastSessions([]);
          setLoadingSessions(false);
          return;
        }
        const { data, error } = await supabase
          .from('speech_sessions')
          .select('id, topic_id, title, audio_url, transcript, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        if (error) throw error;
        setPastSessions(data || []);
      } catch (err) {
        setPastSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchPastSessions();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        
        // Generate mock transcript
        const mockTranscript = "This is a sample transcript of your recorded speech. In a real implementation, this would be generated using speech-to-text technology. The transcript would contain the actual words you spoke during your recording.";
        setTranscript(mockTranscript);
        setShowTranscript(true);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError(null);
      setShowTranscript(false);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const analyzeSpeech = async () => {
    if (!audioBlob || !selectedTopic) {
      setError('Please record audio and select a topic first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Debug: Log audioBlob
      console.log('audioBlob:', audioBlob);
      console.log('audioBlob size:', audioBlob ? audioBlob.size : 'no blob');

      // Upload audio to Supabase Storage
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      if (!user) throw new Error('User not authenticated');

      const fileName = `speech_${Date.now()}.wav`;
      console.log('Uploading to:', `${user.id}/${fileName}`);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-audio')
        .upload(`${user.id}/${fileName}`, audioBlob);
      console.log('Upload result:', uploadData, uploadError);

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        setError('Failed to upload audio. Please check your Supabase Storage bucket policies and try again.');
        setLoading(false);
        // Reminder: You must have a Storage policy that allows authenticated users to upload files.
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-audio')
        .getPublicUrl(`${user.id}/${fileName}`);

      // Simulate AI analysis (replace with actual AI service)
      const mockFeedback: SpeechFeedback = {
        clarity_score: 8.5,
        pace_score: 7.8,
        volume_score: 9.2,
        tone_score: 8.1,
        engagement_score: 7.9,
        overall_score: 8.3,
        feedback: {
          clarity: "Your speech was clear and well-articulated. Consider varying your pace slightly for better emphasis.",
          pace: "Good overall pace, but try to slow down during key points for better impact.",
          volume: "Excellent volume control throughout your speech.",
          tone: "Your tone was engaging and appropriate for the topic.",
          engagement: "Good use of pauses and emphasis. Consider adding more vocal variety.",
          overall: "Strong performance! Focus on pace variation and vocal variety for even better results."
        }
      };

      // Save session to database
      const { error: dbError } = await supabase
        .from('speech_sessions')
        .insert({
          user_id: user.id,
          topic_id: selectedTopic,
          title: topics.find(t => t.id === selectedTopic)?.title || 'Speech Practice',
          audio_url: publicUrl,
          transcript: transcript || 'Transcription not available',
          duration_seconds: safeNumber(recordingTime),
          clarity_score: safeNumber(mockFeedback.clarity_score),
          pace_score: safeNumber(mockFeedback.pace_score),
          volume_score: safeNumber(mockFeedback.volume_score),
          tone_score: safeNumber(mockFeedback.tone_score),
          engagement_score: safeNumber(mockFeedback.engagement_score),
          overall_score: safeNumber(mockFeedback.overall_score),
          feedback: mockFeedback.feedback
        });

      if (dbError) throw dbError;

      setFeedback(mockFeedback);
    } catch (err) {
      console.error('Error analyzing speech:', err);
      setError('Failed to analyze speech. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setAudioBlob(null);
    setAudioUrl('');
    setTranscript('');
    setFeedback(null);
    setRecordingTime(0);
    setError(null);
    setShowTranscript(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Speech Practice</h1>
          <p className="text-gray-600">Record your speech and get AI-powered feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recording Section */}
        <Card>
          <CardHeader>
            <CardTitle>Record Your Speech</CardTitle>
            <CardDescription>
              Choose a topic and record your speech for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Topic Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Topic</label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a practice topic" />
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

            {/* Recording Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isRecording ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-red-600">Recording</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Ready to record</span>
                  )}
                </div>
                {isRecording && (
                  <div className="text-lg font-mono">
                    {formatTime(recordingTime)}
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    disabled={!selectedTopic}
                    className="flex items-center"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    className="flex items-center"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                )}
              </div>
            </div>

            {/* Audio Playback */}
            {audioUrl && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Your Recording</h4>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
                  {!isPlaying ? (
                    <Button onClick={playAudio} size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Play
                    </Button>
                  ) : (
                    <Button onClick={pauseAudio} size="sm" variant="outline">
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  <span className="text-sm text-gray-600">
                    Duration: {formatTime(recordingTime)}
                  </span>
                </div>
              </div>
            )}

            {/* Transcript Display */}
            {showTranscript && transcript && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Transcript</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTranscript(!showTranscript)}
                  >
                    {showTranscript ? 'Hide' : 'Show'}
                  </Button>
                </div>
                {showTranscript && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{transcript}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={analyzeSpeech}
                disabled={!audioBlob || loading}
                className="flex-1"
              >
                {loading ? 'Analyzing...' : 'Analyze Speech'}
              </Button>
              <Button
                onClick={resetSession}
                variant="outline"
                disabled={!audioBlob}
              >
                Reset
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card>
          <CardHeader>
            <CardTitle>AI Feedback</CardTitle>
            <CardDescription>
              Detailed analysis of your speech performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!feedback ? (
              <div className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Record and analyze your speech to see detailed feedback here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {feedback.overall_score}/10
                  </div>
                  <p className="text-sm text-gray-500">Overall Score</p>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Clarity</span>
                      <span>{feedback.clarity_score}/10</span>
                    </div>
                    <Progress value={feedback.clarity_score * 10} max={100} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pace</span>
                      <span>{feedback.pace_score}/10</span>
                    </div>
                    <Progress value={feedback.pace_score * 10} max={100} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Volume</span>
                      <span>{feedback.volume_score}/10</span>
                    </div>
                    <Progress value={feedback.volume_score * 10} max={100} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tone</span>
                      <span>{feedback.tone_score}/10</span>
                    </div>
                    <Progress value={feedback.tone_score * 10} max={100} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engagement</span>
                      <span>{feedback.engagement_score}/10</span>
                    </div>
                    <Progress value={feedback.engagement_score * 10} max={100} />
                  </div>
                </div>

                {/* Detailed Feedback */}
                <div className="space-y-3">
                  <h4 className="font-medium">Detailed Feedback</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Clarity:</span> {feedback.feedback.clarity}
                    </div>
                    <div>
                      <span className="font-medium">Pace:</span> {feedback.feedback.pace}
                    </div>
                    <div>
                      <span className="font-medium">Volume:</span> {feedback.feedback.volume}
                    </div>
                    <div>
                      <span className="font-medium">Tone:</span> {feedback.feedback.tone}
                    </div>
                    <div>
                      <span className="font-medium">Engagement:</span> {feedback.feedback.engagement}
                    </div>
                    <div>
                      <span className="font-medium">Overall:</span> {feedback.feedback.overall}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audio and Transcript after recording (always visible if available) */}
      {(audioUrl || transcript) && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Your Recording & Transcript</h2>
          {audioUrl && (
            <div className="mb-2">
              <audio controls src={audioUrl} className="w-full" />
            </div>
          )}
          {transcript && (
            <div className="bg-gray-50 p-3 rounded border text-sm text-gray-700">
              <div className="font-medium mb-1">Transcript:</div>
              <div>{transcript}</div>
            </div>
          )}
        </div>
      )}

      {/* Past Sessions Section (detailed, not just sidebar) */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Practice Sessions (Detailed)</h2>
        {loadingSessions ? (
          <div>Loading...</div>
        ) : pastSessions.length === 0 ? (
          <div className="text-gray-500">No past sessions found.</div>
        ) : (
          <div className="space-y-4">
            {pastSessions.map(session => (
              <div key={session.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div>
                    <div className="font-semibold">{session.title || 'Speech Practice'}</div>
                    <div className="text-xs text-gray-500">
                      {session.created_at ? format(new Date(session.created_at), 'PPpp') : ''}
                    </div>
                  </div>
                </div>
                {session.audio_url && (
                  <audio controls src={session.audio_url} className="w-full my-2" />
                )}
                {session.transcript && (
                  <div className="mt-2">
                    <div className="font-medium text-sm mb-1">Transcript:</div>
                    <div className="bg-white p-2 rounded text-sm text-gray-700 border">
                      {session.transcript}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticePage; 