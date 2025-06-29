
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Brain, 
  Mic, 
  Users, 
  BarChart3, 
  Target, 
  Trophy, 
  Zap, 
  Shield, 
  ArrowRight,
  PlayCircle,
  Clock,
  Star
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Mic,
      title: "AI Speech Analysis",
      description: "Get detailed feedback on clarity, pace, tone, and engagement with our advanced AI coaching system.",
      color: "text-blue-400"
    },
    {
      icon: Users,
      title: "Debate Simulator",
      description: "Practice debates with our AI opponent across various topics with real-time scoring and feedback.",
      color: "text-cyan-400"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track your progress with comprehensive dashboards, performance trends, and personalized insights.",
      color: "text-purple-400"
    },
    {
      icon: Target,
      title: "Personalized Coaching",
      description: "Receive tailored recommendations and practice sessions based on your specific needs and goals.",
      color: "text-green-400"
    }
  ];

  const stats = [
    { number: "95%", label: "Improvement Rate", icon: Target },
    { number: "10k+", label: "Active Users", icon: Users },
    { number: "50+", label: "Practice Topics", icon: Brain },
    { number: "24/7", label: "AI Coaching", icon: Clock }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Coaching
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              Master Speech & Debate
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              with AI Precision
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            ForensIQ combines cutting-edge AI technology with personalized coaching to transform 
            your public speaking and debate skills. Get real-time feedback, practice with AI opponents, 
            and track your progress like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 text-lg"
              asChild
            >
              <Link to="/practice">
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Practicing
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-8 py-4 text-lg"
              asChild
            >
              <Link to="/features">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-3">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Every Speaker</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From beginners to advanced speakers, ForensIQ provides the tools and insights you need to excel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-black/40 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 group">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6 mx-auto">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Speaking Skills?
              </CardTitle>
              <CardDescription className="text-xl text-gray-300 max-w-2xl mx-auto">
                Join thousands of speakers who have improved their skills with ForensIQ's AI-powered coaching platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4"
                  asChild
                >
                  <Link to="/dashboard">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Dashboard
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-8 py-4"
                  asChild
                >
                  <Link to="/debate">
                    <Users className="w-5 h-5 mr-2" />
                    Try Debate Simulator
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Free to start • No credit card required • AI-powered feedback</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
