import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-12 text-center glass-effect border-2 border-border/50 shadow-2xl">
        <div className="space-y-6">
          {/* 404 Number with gradient */}
          <div className="relative">
            <h1 className="text-9xl font-extrabold gradient-text">404</h1>
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Page Not Found</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/">
              <Button size="lg" className="bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity gap-2">
                <Home className="size-5" />
                Go to Homepage
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-2 gap-2">
                <ArrowLeft className="size-5" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Search className="size-4" />
              Try searching from the navigation menu or contact support if you need assistance.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
