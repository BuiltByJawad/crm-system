import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative inline-flex mb-4">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-primary/20">
            <FileQuestion className="h-16 w-16" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-6xl font-black tracking-tighter text-primary">404</h1>
          <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
          <p className="text-muted-foreground text-balance">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            asChild
            variant="default" 
            className="flex-1 h-12 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          <Button 
            asChild
            variant="outline" 
            className="flex-1 h-12 rounded-xl font-bold gap-2 border-2"
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
