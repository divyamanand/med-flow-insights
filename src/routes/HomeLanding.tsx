import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CalendarDays,
  Box,
  UserPlus,
  Users,
  FileText,
  DollarSign,
  BarChart2,
  HeartPulse,
} from "lucide-react";

type FeatureCardProps = {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  gradient?: string;
};

const heroImg = "/mnt/data/96a04be0-bca3-4c3a-884c-e86991739266.png";
const featuresGridImg = "/mnt/data/2cecd575-ec45-4d8e-a9ea-a92695f52e47.png";

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, desc, gradient = "bg-white" }) => {
  return (
    <Card className={`rounded-2xl shadow-lg overflow-hidden ${gradient}`}>
      <CardHeader className="flex items-center gap-3 p-4 bg-transparent">
        <div className="w-12 h-12 rounded-lg bg-white/30 flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-semibold">{title}</h4>
        </div>
      </CardHeader>
      <CardContent className="p-4 bg-white/80">
        <p className="text-xs text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
};

export default function HomeLanding() {
  const features = [
    {
      Icon: UserPlus,
      title: "Patient Care",
      desc: "Comprehensive patient records, medical history and treatment plans.",
      gradient: "bg-gradient-to-br from-sky-200 to-sky-400",
    },
    {
      Icon: CalendarDays,
      title: "Appointments+",
      desc: "Effortless scheduling, reminders, and doctor availability.",
      gradient: "bg-gradient-to-br from-teal-200 to-teal-400",
    },
    {
      Icon: Box,
      title: "Inventory Hub",
      desc: "Manage tracking of medications, equipment, and supplies.",
      gradient: "bg-gradient-to-br from-emerald-200 to-emerald-400",
    },
    {
      Icon: FileText,
      title: "Billing & Claims",
      desc: "Automated invoicing, insurance claims, and financial reports.",
      gradient: "bg-gradient-to-br from-indigo-200 to-indigo-400",
    },
    {
      Icon: Users,
      title: "Staff Connect",
      desc: "Manage staff information, shifts, and departmental access.",
      gradient: "bg-gradient-to-br from-blue-200 to-blue-400",
    },
    {
      Icon: HeartPulse,
      title: "Analytics Dash",
      desc: "Data-driven insights, performance metrics and operational trends.",
      gradient: "bg-gradient-to-br from-green-200 to-green-400",
    },
    {
      Icon: DollarSign,
      title: "Achieve Cost Savings",
      desc: "Inventory management and fewer billing errors leading to savings.",
      gradient: "bg-gradient-to-br from-orange-200 to-amber-400",
    },
    {
      Icon: BarChart2,
      title: "Performance & Reports",
      desc: "Operational dashboards and KPIs tailored to your hospital.",
      gradient: "bg-gradient-to-br from-violet-200 to-violet-400",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-slate-50 text-slate-900">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center shadow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="10" y="3" width="4" height="18" rx="1" fill="#2563EB" />
              <rect x="3" y="10" width="18" height="4" rx="1" fill="#2563EB" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold">HEALTHFLOW</div>
            <div className="text-xs text-muted-foreground">Hospital Ops Suite</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="hover:underline">Features</a>
          <a className="hover:underline">Solutions</a>
          <a className="hover:underline">About</a>
          <a className="hover:underline">Contact</a>
          <Button variant="outline" className="ml-2">Login</Button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <section className="py-10">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">Streamline Your<br/>Hospital Operations,
            <span className="text-indigo-600"> Enhance Patient Care</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">Experience seamless management and superior patient outcomes with an integrated platform built for modern hospitals.</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button className="shadow-lg" size="lg">Request a Demo</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="rounded-xl shadow-md">
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-sky-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Improved Efficiency</h4>
                    <p className="text-xs text-muted-foreground">Automated Appointments · Reduced Wait Times · Digital Records Access</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="rounded-xl shadow-md">
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <HeartPulse className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Elevated Patient Care</h4>
                    <p className="text-xs text-muted-foreground">Personalized Treatment Plans · Secure Data Sharing · Remote Monitoring</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </section>

        <aside className="relative py-10 flex justify-center md:justify-end">
          <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl bg-white p-6">
            <img src={heroImg} alt="hospital hero" className="w-full h-auto object-cover rounded-lg" />
            <div className="mt-4 text-sm text-muted-foreground">Our system is designed to empower medical professionals and institutions, leading better outcomes and a healthier future.</div>
            <div className="mt-6 flex justify-end">
              <Button>Experience the Difference</Button>
            </div>
          </div>
        </aside>
      </main>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white/60 rounded-2xl p-8 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.slice(0,4).map((f, idx) => (
              <FeatureCard key={idx} Icon={f.Icon} title={f.title} desc={f.desc} gradient={f.gradient} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.slice(4).map((f, idx) => (
              <FeatureCard key={idx+4} Icon={f.Icon} title={f.title} desc={f.desc} gradient={f.gradient} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="rounded-2xl overflow-hidden shadow-lg bg-linear-to-r from-white to-slate-50 p-8 flex flex-col md:flex-row items-center gap-6">
          <img src={featuresGridImg} alt="features grid" className="w-full md:w-1/2 rounded-xl shadow" />

          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold">All your hospital operations in one place</h3>
            <p className="mt-3 text-muted-foreground">From patient care to inventory management and billing — manage it all with a single, secure platform that scales with your hospital.</p>
            <div className="mt-6 flex gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">Talk to Sales</Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-8 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} HealthFlow. All rights reserved.</div>
          <div className="flex gap-4">
            <a>Privacy</a>
            <a>Terms</a>
            <a>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
