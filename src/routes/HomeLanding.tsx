import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Box,
  UserPlus,
  Users,
  FileText,
  DollarSign,
  BarChart2,
  HeartPulse,
  Activity,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Building,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

type FeatureCardProps = {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  gradient?: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, desc, gradient = "from-primary/10 to-accent/10" }) => {
  return (
    <Card className={`rounded-2xl border-2 border-border/50 hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden group bg-linear-to-br ${gradient}`}>
      <CardHeader className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center size-14 rounded-xl bg-linear-to-br from-primary to-accent shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110 duration-300">
            <Icon className="size-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold mb-2">{title}</CardTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

type StatCardProps = {
  number: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const StatCard: React.FC<StatCardProps> = ({ number, label, Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-card/50 backdrop-blur border border-border/50 hover:border-primary/30 transition-all duration-300 card-hover">
      <Icon className="size-10 text-primary mb-3" />
      <h3 className="text-4xl font-bold gradient-text mb-1">{number}</h3>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  );
};

export default function HomeLanding() {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);
  const features = [
    {
      Icon: UserPlus,
      title: "Comprehensive Patient Care",
      desc: "Complete patient records, detailed medical history, personalized treatment plans, and seamless care coordination.",
      gradient: "from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20",
    },
    {
      Icon: CalendarDays,
      title: "Smart Appointment System",
      desc: "Effortless scheduling with automated reminders, real-time doctor availability, and intelligent conflict resolution.",
      gradient: "from-teal-50/50 to-emerald-50/50 dark:from-teal-950/20 dark:to-emerald-950/20",
    },
    {
      Icon: Box,
      title: "Inventory Hub",
      desc: "Advanced tracking of medications, medical equipment, supplies with automated reordering and expiry alerts.",
      gradient: "from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20",
    },
    {
      Icon: FileText,
      title: "Billing & Claims",
      desc: "Streamlined invoicing, automated insurance claims processing, and comprehensive financial reporting.",
      gradient: "from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20",
    },
    {
      Icon: Users,
      title: "Staff Management",
      desc: "Complete staff directory, shift management, department access control, and performance tracking.",
      gradient: "from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20",
    },
    {
      Icon: HeartPulse,
      title: "Analytics Dashboard",
      desc: "Real-time data insights, performance metrics, operational trends, and predictive analytics.",
      gradient: "from-green-50/50 to-teal-50/50 dark:from-green-950/20 dark:to-teal-950/20",
    },
    {
      Icon: DollarSign,
      title: "Cost Optimization",
      desc: "Smart inventory management, reduced billing errors, and operational efficiency leading to significant savings.",
      gradient: "from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20",
    },
    {
      Icon: BarChart2,
      title: "Performance Reports",
      desc: "Customizable dashboards, KPI tracking, and detailed reports tailored to your hospital's needs.",
      gradient: "from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20",
    },
  ];

  const benefits = [
    "Reduce patient wait times by up to 40%",
    "Eliminate manual paperwork and errors",
    "Improve staff productivity and satisfaction",
    "Real-time inventory and resource tracking",
    "HIPAA compliant and secure data handling",
    "24/7 customer support and training",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/70 border-b border-border/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center size-11 rounded-xl bg-linear-to-br from-primary to-accent shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
              <Activity className="size-6 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight gradient-text">MedFlow Insights</div>
              <div className="text-xs text-muted-foreground">Hospital Operations Suite</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#benefits" className="hover:text-primary transition-colors">Benefits</a>
            <a href="#stats" className="hover:text-primary transition-colors">Stats</a>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button className="bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all">
                    Sign In
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-in-bottom">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="size-4 text-primary" />
                <span className="text-sm font-medium text-primary">Modern Hospital Management</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                Streamline Your
                <span className="block gradient-text mt-2">Hospital Operations</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Experience seamless management and superior patient outcomes with our integrated platform built for modern healthcare facilities.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                {isLoggedIn ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-xl text-lg px-8 py-6 group">
                      Go to Dashboard
                      <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button size="lg" className="bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-xl text-lg px-8 py-6 group">
                      Get Started Free
                      <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:border-primary hover:bg-primary/5">
                  Watch Demo
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                <div>
                  <h3 className="text-3xl font-bold gradient-text">99.9%</h3>
                  <p className="text-sm text-muted-foreground mt-1">Uptime</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold gradient-text">500+</h3>
                  <p className="text-sm text-muted-foreground mt-1">Hospitals</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold gradient-text">24/7</h3>
                  <p className="text-sm text-muted-foreground mt-1">Support</p>
                </div>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="relative lg:ml-auto animate-slide-in-right">
              <div className="glass-effect rounded-3xl p-8 space-y-6 border-2 border-border/50">
                <div className="flex items-center gap-4 p-4 bg-success/10 border border-success/20 rounded-xl">
                  <div className="flex items-center justify-center size-12 rounded-lg bg-success text-white">
                    <CheckCircle2 className="size-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Improved Efficiency</h4>
                    <p className="text-sm text-muted-foreground">Automated workflows & Digital records</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <div className="flex items-center justify-center size-12 rounded-lg bg-primary text-primary-foreground">
                    <HeartPulse className="size-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Elevated Patient Care</h4>
                    <p className="text-sm text-muted-foreground">Personalized plans & Secure sharing</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-accent/10 border border-accent/20 rounded-xl">
                  <div className="flex items-center justify-center size-12 rounded-lg bg-accent text-accent-foreground">
                    <Shield className="size-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Enterprise Security</h4>
                    <p className="text-sm text-muted-foreground">HIPAA compliant & Encrypted data</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-warning/10 border border-warning/20 rounded-xl">
                  <div className="flex items-center justify-center size-12 rounded-lg bg-warning text-white">
                    <Zap className="size-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Lightning Fast</h4>
                    <p className="text-sm text-muted-foreground">Instant access & Real-time updates</p>
                  </div>
                </div>
              </div>

              {/* Floating elements for visual appeal */}
              <div className="absolute -top-6 -right-6 size-24 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
              <div className="absolute -bottom-6 -left-6 size-32 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <Sparkles className="size-4 text-accent" />
            <span className="text-sm font-medium text-accent">Comprehensive Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Everything You Need in
            <span className="block gradient-text mt-2">One Powerful Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From patient care to inventory management and analytics — manage it all with a single, secure platform that scales with your hospital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <FeatureCard key={idx} Icon={f.Icon} title={f.title} desc={f.desc} gradient={f.gradient} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Trusted by Healthcare
              <span className="block gradient-text mt-2">Professionals Worldwide</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of hospitals and clinics that have transformed their operations with MedFlow Insights.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard number="500+" label="Active Hospitals" Icon={Building} />
            <StatCard number="1M+" label="Patients Served" Icon={Users} />
            <StatCard number="99.9%" label="System Uptime" Icon={TrendingUp} />
            <StatCard number="24/7" label="Expert Support" Icon={Clock} />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Visual */}
          <div className="relative">
            <div className="glass-effect rounded-3xl p-8 border-2 border-border/50">
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-all card-hover">
                    <CheckCircle2 className="size-6 text-success shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-8 -left-8 size-32 bg-success/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 size-40 bg-primary/20 rounded-full blur-3xl"></div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
              <CheckCircle2 className="size-4 text-success" />
              <span className="text-sm font-medium text-success">Why Choose Us</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Transform Your Hospital
              <span className="block gradient-text mt-2">Operations Today</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our platform integrates seamlessly with your existing workflows, providing real-time insights and automating routine tasks so your team can focus on what matters most — patient care.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg">
                    Start Free Trial
                  </Button>
                </Link>
              )}
              <Button size="lg" variant="outline" className="border-2">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-br from-primary/10 via-accent/10 to-secondary/10 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of healthcare professionals who trust MedFlow Insights to streamline their operations and improve patient outcomes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-xl text-lg px-10 py-7">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-xl text-lg px-10 py-7">
                    Get Started Free
                  </Button>
                </Link>
              )}
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-xl bg-linear-to-br from-primary to-accent shadow-lg">
                  <Activity className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-bold gradient-text">MedFlow Insights</div>
                  <div className="text-xs text-muted-foreground">Hospital Operations</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern hospital management platform built for healthcare excellence.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#benefits" className="hover:text-primary transition-colors">Benefits</a></li>
                <li><a href="#stats" className="hover:text-primary transition-colors">Statistics</a></li>
                <li>
                  {isLoggedIn ? (
                    <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                  ) : (
                    <Link to="/login" className="hover:text-primary transition-colors">Pricing</Link>
                  )}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><a className="hover:text-primary transition-colors">Careers</a></li>
                <li><a className="hover:text-primary transition-colors">Blog</a></li>
                <li><a className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a className="hover:text-primary transition-colors">Community</a></li>
                <li><a className="hover:text-primary transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© {new Date().getFullYear()} MedFlow Insights. All rights reserved.</div>
            <div className="flex gap-6">
              <a className="hover:text-primary transition-colors">Privacy Policy</a>
              <a className="hover:text-primary transition-colors">Terms of Service</a>
              <a className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
