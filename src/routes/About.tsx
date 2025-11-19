import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Shield, Zap, Users, Clock, Award, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-8 animate-slide-in-bottom">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-medium text-primary">About Us</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          About <span className="gradient-text">MedFlow Insights</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          A modern, comprehensive hospital management platform designed to streamline operations and enhance patient care.
        </p>
      </div>

      {/* Mission Card */}
      <Card className="border-2 border-border/50 shadow-xl overflow-hidden card-hover">
        <div className="absolute top-0 right-0 size-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-12 rounded-xl bg-linear-to-br from-primary to-accent shadow-lg">
              <Activity className="size-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">
            To revolutionize healthcare management by providing hospitals with cutting-edge technology that improves 
            operational efficiency, enhances patient outcomes, and empowers medical professionals to focus on what matters most—patient care.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary/20 bg-linear-to-br from-card to-primary/5 card-hover">
          <CardHeader>
            <div className="flex items-center justify-center size-12 rounded-lg bg-primary/20 mb-3">
              <Heart className="size-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Patient-Centered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Designed with patient care at the core of every feature and workflow.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-success/20 bg-linear-to-br from-card to-success/5 card-hover">
          <CardHeader>
            <div className="flex items-center justify-center size-12 rounded-lg bg-success/20 mb-3">
              <Shield className="size-6 text-success" />
            </div>
            <CardTitle className="text-lg">Secure & Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              HIPAA compliant with enterprise-grade security and data protection.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20 bg-linear-to-br from-card to-accent/5 card-hover">
          <CardHeader>
            <div className="flex items-center justify-center size-12 rounded-lg bg-accent/20 mb-3">
              <Zap className="size-6 text-accent" />
            </div>
            <CardTitle className="text-lg">Lightning Fast</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Real-time updates and instant access to critical information.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning/20 bg-linear-to-br from-card to-warning/5 card-hover">
          <CardHeader>
            <div className="flex items-center justify-center size-12 rounded-lg bg-warning/20 mb-3">
              <Users className="size-6 text-warning" />
            </div>
            <CardTitle className="text-lg">Team Collaboration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Seamless coordination across departments and medical teams.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <Card className="border-2 border-border/50 shadow-xl glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl">Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Active Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">Patients Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card className="border-2 border-border/50 shadow-xl overflow-hidden">
        <div className="absolute bottom-0 left-0 size-40 bg-accent/10 rounded-full blur-3xl -z-10"></div>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-12 rounded-xl bg-accent/20">
              <Award className="size-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-2xl">Built with Modern Technology</CardTitle>
              <p className="text-muted-foreground mt-1">React, TypeScript, Vite & TailwindCSS</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="px-3 py-1.5 border-2">React 18</Badge>
            <Badge variant="outline" className="px-3 py-1.5 border-2">TypeScript</Badge>
            <Badge variant="outline" className="px-3 py-1.5 border-2">Vite</Badge>
            <Badge variant="outline" className="px-3 py-1.5 border-2">TailwindCSS</Badge>
            <Badge variant="outline" className="px-3 py-1.5 border-2">React Query</Badge>
            <Badge variant="outline" className="px-3 py-1.5 border-2">React Router</Badge>
            <Badge variant="outline" className="px-3 py-1.5 border-2">Radix UI</Badge>
            <Badge variant="outline" className="px-3 py-1.5 border-2">Zod Validation</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
