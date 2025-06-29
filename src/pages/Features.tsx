
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Mic, 
  Users, 
  BarChart3, 
  Brain, 
  Target, 
  Trophy, 
  Clock, 
  Shield,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Timer,
  Award,
  TrendingUp
} from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      icon: Mic,
      title: "AI-Powered Speech Analysis",
      description: "Advanced speech recognition and analysis providing detailed feedback on every aspect of your presentation.",
      features: [
        "Real-time transcription and analysis",
        "Clarity, pace, and tone evaluation",
        "Volume and engagement scoring",
        "Personalized improvement recommendations",
        "Performance trending over time"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Interactive Debate Simulator",
      description: "Practice debates with our sophisticated AI opponent across hundreds of topics and formats.",
      features: [
        "AI opponent with dynamic responses",
        "5-minute timed debate rounds",
        "Real-time scoring system",
        "Multiple debate formats",
        "Post-debate analysis and feedback"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "Deep insights into your performance with advanced analytics and progress tracking.",
      features: [
        "Performance trend analysis",
        "Skills assessment radar charts",
        "Session history and comparisons",
        "Topic-specific performance data",
        "Weekly activity tracking"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Brain,
      title: "Team Collaboration",
      description: "Create and manage teams, collaborate with members, and track group progress.",
      features: [
        "Team creation and management",
        "Member role assignments",
        "Collaborative practice sessions",
        "Team performance analytics",
        "Activity feed and notifications"
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  const additionalFeatures = [
    { icon: Target, title: "Personalized Coaching", description: "AI-driven personalized recommendations" },
    { icon: Trophy, title: "Achievement System", description: "Badges and milestones to track progress" },
    { icon: Clock, title: "24/7 Availability", description: "Practice anytime with instant feedback" },
    { icon: Shield, title: "Secure & Private", description: "Your data is protected and encrypted" },
    { icon: Zap, title: "Instant Feedback", description: "Real-time analysis and recommendations" },
    { icon: Star, title: "Topic Library", description: "Curated practice topics across subjects" }
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Brain className="w-3 h-3 mr-1" />
            Comprehensive Features
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Excel</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            ForensIQ provides a complete suite of AI-powered tools designed to transform your speaking and debate skills.
          </p>
        </div>

        {/* Main Features */}
        <div className="space-y-16 mb-20">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div key={index} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                  <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm h-full">
                    <CardHeader>
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-300 text-lg">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center text-gray-300">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex-1">
                  <div className={`w-full h-64 rounded-xl bg-gradient-to-r ${feature.color} opacity-20 flex items-center justify-center`}>
                    <Icon className="w-24 h-24 text-white/50" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Additional Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-black/40 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-500/30 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6 mx-auto">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-4">
              Ready to Experience ForensIQ?
            </CardTitle>
            <CardDescription className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start your journey to becoming a confident, skilled speaker with our AI-powered coaching platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4"
                asChild
              >
                <Link to="/practice">
                  <Mic className="w-5 h-5 mr-2" />
                  Start Practicing
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-8 py-4"
                asChild
              >
                <Link to="/dashboard">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Features;
