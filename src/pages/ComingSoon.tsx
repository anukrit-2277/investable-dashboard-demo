import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, Mail, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';

const ComingSoon = () => {
  const navigate = useNavigate();
  const { userType } = useUser();

  const features = [
    {
      icon: Building2,
      title: "Company Dashboard",
      description: "Comprehensive analytics and insights for your business"
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Monitor your investment readiness scores over time"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Collaborate with your team on improvement strategies"
    },
    {
      icon: Mail,
      title: "Investor Communication",
      description: "Direct communication with potential investors"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full opacity-10 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/home')}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-lg">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Company Portal
          </h1>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Calendar className="w-4 h-4" />
            Coming Soon
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're building something amazing for companies. Get ready to unlock powerful insights and connect with investors like never before.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/20 hover:bg-card/70 transition-all duration-300 hover-lift">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-3">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-card/30 backdrop-blur-sm border-border/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Be the First to Know
              </h2>
              <p className="text-gray-300 mb-6">
                Get notified when the company portal launches and be among the first to experience the future of investment readiness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => navigate('/signup')}
                >
                  Join Waitlist
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/home')}
                >
                  Explore Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            © 2024 Investable. Empowering companies to achieve investment readiness.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon; 