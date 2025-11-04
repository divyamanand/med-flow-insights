import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Users,
  Calendar,
  Stethoscope,
  PackageSearch,
  BedDouble,
  UserCog,
  FileText,
  ArrowRight,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Patient Management",
      description: "Comprehensive patient records, medical history, and admission tracking",
    },
    {
      icon: Stethoscope,
      title: "Doctor Scheduling",
      description: "Manage doctor timings, specialities, and patient appointments",
    },
    {
      icon: Calendar,
      title: "Appointments",
      description: "Schedule and track appointments with automated reminders",
    },
    {
      icon: UserCog,
      title: "Staff Management",
      description: "Track staff availability, leaves, and room assignments",
    },
    {
      icon: BedDouble,
      title: "Room Allocation",
      description: "Real-time room status, occupancy, and equipment tracking",
    },
    {
      icon: PackageSearch,
      title: "Inventory Control",
      description: "Medicine, blood, and equipment inventory with stock alerts",
    },
    {
      icon: FileText,
      title: "Prescriptions",
      description: "Digital prescription management and history tracking",
    },
    {
      icon: Activity,
      title: "Role-Based Access",
      description: "Secure access control for Admin, Doctor, Nurse, and more",
    },
  ];

  const stats = [
    { icon: Shield, label: "Secure & Compliant", value: "HIPAA Ready" },
    { icon: Clock, label: "Real-Time Updates", value: "24/7 Access" },
    { icon: TrendingUp, label: "Efficiency Boost", value: "40% Faster" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              HealthCare Pro
            </h1>
          </div>
          <Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            Modern Healthcare
            <span className="block text-primary mt-2">Management System</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline hospital operations with our comprehensive management platform.
            From patient records to inventory control, everything in one place.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate("/auth")} variant="outline" size="lg">
              Request Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center space-y-2">
                <stat.icon className="h-8 w-8 mx-auto text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive features designed for modern healthcare facilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50"
            >
              <CardContent className="pt-6 space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-lg">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Healthcare Operations?
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join healthcare facilities that trust our platform for efficient management
            </p>
            <Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
              Start Now <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 HealthCare Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
