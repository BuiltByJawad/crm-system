'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-2xl border border-border/50 text-center space-y-6">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-destructive/10 text-destructive mb-2">
          <AlertTriangle className="h-10 w-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="default" 
            className="flex-1 h-12 rounded-xl font-bold gap-2"
            onClick={() => reset()}
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 h-12 rounded-xl font-bold"
            onClick={() => window.location.href = '/'}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
