import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingHeader } from '@/components/LandingHeader';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Trophy, 
  Zap, 
  BarChart3,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const LandingPage = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Create Custom Quizzes',
      description: 'Build engaging quizzes tailored to your curriculum with our intuitive quiz creator.',
    },
    {
      icon: Users,
      title: 'Classroom Management',
      description: 'Organize students into classrooms and track their progress with 6-digit join codes.',
    },
    {
      icon: Trophy,
      title: 'Real-Time Leaderboards',
      description: 'Gamify learning with live leaderboards that motivate students to excel.',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Students get immediate results and explanations to accelerate learning.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track student performance and identify areas that need attention.',
    },
    {
      icon: Sparkles,
      title: 'Dual Content Sources',
      description: 'Access thousands of questions from OpenTDB plus your custom quizzes.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <LandingHeader />
      
      {/* Hero Section */}
      <div id="hero" className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-center gap-3 mb-4 animate-in fade-in zoom-in-95 duration-1000">
            <div className="relative">
              <GraduationCap className="h-14 w-14 md:h-16 md:w-16 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-ping opacity-75" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-right-4 duration-1000 delay-300">
              Kahoot.uz
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            Transform learning into an engaging game. Create quizzes, track progress, and make education fun.
          </p>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            The all-in-one platform for teachers and students. Join thousands of educators making learning interactive.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000">
            <Button asChild size="lg" className="text-lg px-8 group hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
              <Link to="/register" className="flex items-center gap-2">
                Start Learning as Student
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 group hover:scale-105 transition-transform border-2">
              <Link to="/register/teacher" className="flex items-center gap-2">
                Register as Teacher
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground pt-2 animate-in fade-in duration-700 delay-1200">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Everything you need to gamify education
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto text-lg">
              Powerful features designed for both teachers and students to create an engaging learning experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const delayClass = index === 0 ? 'delay-0' : index === 1 ? 'delay-100' : index === 2 ? 'delay-200' : index === 3 ? 'delay-300' : index === 4 ? 'delay-400' : 'delay-500';
              return (
                <Card 
                  key={index} 
                  className={`hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-2 hover:border-primary/20 group animate-in fade-in slide-in-from-bottom-4 ${delayClass}`}
                >
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110">
                      <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">Workflow</p>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent">
            Launch a quiz in minutes
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Kahoot.uz keeps it simple: create, share, and track results with zero friction.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Create',
              description: 'Build quizzes with intuitive forms, question banks, and instant previews.',
            },
            {
              title: 'Share',
              description: 'Generate 6-digit codes and share with your class in seconds—no setup needed.',
            },
            {
              title: 'Measure',
              description: 'Track scores, leaderboard standings, and strengths vs. gaps per student.',
            },
          ].map((step, index) => (
            <Card
              key={step.title}
              className={`border-2 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 ${index === 1 ? 'delay-100' : index === 2 ? 'delay-200' : 'delay-0'}`}
            >
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {index + 1}
                </div>
                <CardTitle className="text-2xl mt-2">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-6 py-16 bg-gradient-to-b from-muted/30 via-muted/20 to-background">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card id="teachers" className="animate-in fade-in slide-in-from-left-4 duration-700 hover:shadow-xl transition-all hover:scale-105 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  For Teachers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-base">Create unlimited custom quizzes aligned with your curriculum</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-base">Track student progress and identify struggling areas</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-base">Manage multiple classrooms with easy join codes</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-base">Get detailed analytics and performance insights</p>
                </div>
              </CardContent>
            </Card>

            <Card id="students" className="animate-in fade-in slide-in-from-right-4 duration-700 hover:shadow-xl transition-all hover:scale-105 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  For Students
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-base">Join quizzes instantly with simple 6-digit codes</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-base">Get instant feedback and explanations</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-base">Compete on leaderboards and track your progress</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-base">Explore thousands of public quizzes and trivia</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div id="cta" className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Ready to transform your classroom?
            </h2>
            <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground">
            Join educators worldwide who are making learning fun and engaging.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="text-lg px-8 group hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
              <Link to="/register/teacher" className="flex items-center gap-2">
                Get Started as Teacher
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 group hover:scale-105 transition-transform border-2">
              <Link to="/register" className="flex items-center gap-2">
                Join as Student
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-semibold">Kahoot.uz</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Kahoot.uz. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
