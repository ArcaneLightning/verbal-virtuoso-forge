import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Mic, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Trophy, 
  Target,
  Play,
  Award,
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Brain,
  Headphones,
  Video,
  BookOpen
} from 'lucide-react';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Mic,
      title: 'AI Speech Analysis',
      description: 'Record your speeches and receive detailed feedback on clarity, pace, volume, tone, and engagement with real-time analysis.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      benefits: ['Real-time feedback', 'Detailed metrics', 'Personalized tips']
    },
    {
      icon: MessageSquare,
      title: 'AI Debate Simulator',
      description: 'Engage in structured debates with an intelligent AI opponent across various topics and difficulty levels.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      benefits: ['Adaptive difficulty', 'Multiple topics', 'Performance tracking']
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Create debate teams, manage members, and track collective progress together with built-in communication tools.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      benefits: ['Team challenges', 'Member management', 'Progress sharing']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track your improvement over time with detailed performance metrics, insights, and personalized recommendations.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      benefits: ['Progress tracking', 'Skill breakdown', 'Goal setting']
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Earn badges and track milestones as you progress in your speaking journey with gamified learning.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      benefits: ['Milestone badges', 'Leaderboards', 'Rewards system']
    },
    {
      icon: Target,
      title: 'Personalized Goals',
      description: 'Set custom goals and receive tailored recommendations for improvement based on your performance data.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      benefits: ['Custom goals', 'Smart recommendations', 'Progress alerts']
    }
  ];

  const stats = [
    { label: 'Practice Sessions', value: '10,000+', icon: Play, change: '+15% this month' },
    { label: 'Active Users', value: '5,000+', icon: Users, change: '+25% growth' },
    { label: 'Topics Available', value: '100+', icon: Target, change: 'New topics weekly' },
    { label: 'Average Improvement', value: '40%', icon: TrendingUp, change: 'In 3 months' }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Public Speaking Coach",
      content: "ForensIQ transformed how I train my students. The AI feedback is incredibly accurate and the analytics help track real progress.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Debate Team Captain",
      content: "Our debate team improved dramatically using ForensIQ. The AI simulator provides realistic practice and the team features are excellent.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emma Rodriguez",
      role: "TEDx Speaker",
      content: "The speech analysis helped me identify areas I never knew needed improvement. My presentations are now much more engaging.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "5 practice sessions per month",
        "Basic AI feedback",
        "3 debate topics",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      features: [
        "Unlimited practice sessions",
        "Advanced AI analysis",
        "All debate topics",
        "Team collaboration",
        "Advanced analytics",
        "Achievement system"
      ],
      popular: true
    },
    {
      name: "Team",
      price: "$49",
      period: "per month",
      features: [
        "Everything in Pro",
        "Up to 10 team members",
        "Team analytics",
        "Custom topics",
        "Priority support",
        "API access"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">ForensIQ</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Speech & Debate Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Master the Art of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Speech & Debate</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your communication skills with AI-powered coaching. Practice speeches, engage in debates, 
            and track your progress with advanced analytics designed for real improvement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              Free forever plan
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className="text-xs text-green-600 font-medium">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700">Features</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From AI-powered speech analysis to team collaboration, ForensIQ provides 
              comprehensive tools to improve your communication skills.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    activeFeature === index ? 'ring-2 ring-blue-500 shadow-lg' : ''
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-3">
                      {feature.description}
                    </CardDescription>
                    <div className="space-y-1">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Feature Preview */}
            <div className="lg:pl-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg ${features[activeFeature].bgColor}`}>
                    {(() => {
                      const ActiveIcon = features[activeFeature].icon;
                      return <ActiveIcon className={`h-8 w-8 ${features[activeFeature].color}`} />;
                    })()}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{features[activeFeature].title}</h3>
                    <p className="text-gray-600">{features[activeFeature].description}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Key Benefits:</h4>
                  {features[activeFeature].benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up & Choose</h3>
              <p className="text-gray-600">
                Create your account and select from our library of practice topics or create your own.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Practice & Record</h3>
              <p className="text-gray-600">
                Record your speech or engage in a debate with our AI opponent. Get real-time feedback.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Improve & Track</h3>
              <p className="text-gray-600">
                Review detailed analytics, track your progress, and celebrate achievements as you improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700">Testimonials</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Speakers Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how ForensIQ is helping people improve their communication skills and achieve their goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700">Pricing</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free and upgrade as you grow. All plans include our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative bg-white border-2 transition-all duration-300 hover:shadow-lg ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    {plan.name === "Free" ? "Get Started Free" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Speaking Skills?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students, professionals, and public speakers who are already improving with ForensIQ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Start Your Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent transition-all duration-200">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4">ForensIQ</h3>
              <p className="text-gray-400">
                AI-powered speech and debate coaching platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Speech Practice</li>
                <li>Debate Simulator</li>
                <li>Team Collaboration</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>YouTube</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ForensIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 