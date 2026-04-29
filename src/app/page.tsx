import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 md:px-6 lg:px-12 h-16 md:h-20 flex items-center border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center">
          <Link className="flex items-center justify-center gap-2 group shrink-0" href="/">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight whitespace-nowrap">Nexus CRM</span>
          </Link>
          <nav className="ml-auto flex gap-3 md:gap-6 items-center">
            <Link className="text-xs md:text-sm font-medium hover:text-primary transition-colors whitespace-nowrap" href="/login">
              Sign In
            </Link>
            <Link href="/register">
              <Button size="sm" className="px-3 md:px-5 text-xs md:text-sm h-8 md:h-10 rounded-full">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="w-full pt-12 md:pt-24 lg:pt-32 pb-12 md:pb-24 bg-gradient-to-b from-background to-zinc-50 dark:to-zinc-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-zinc-200/50 dark:bg-grid-zinc-800/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] -z-10" />
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <Link 
                href="/enterprise" 
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-sm font-medium text-primary hover:bg-primary/10 transition-all mb-2"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                Trusted by 500+ enterprises
              </Link>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl leading-[0.9] text-balance">
                The CRM built for <span className="text-primary">high-velocity</span> teams
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-base md:text-xl lg:text-2xl leading-relaxed text-balance">
                Nexus is the workspace that combines leads, deals, and automated workflows into one unified platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0 pt-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 md:h-16 px-10 md:px-12 text-lg md:text-xl rounded-full shadow-2xl shadow-primary/30 group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 md:h-16 px-10 md:px-12 text-lg md:text-xl rounded-full bg-background/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24 md:py-32 bg-background border-y border-zinc-100 dark:border-zinc-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to close more deals</h2>
              <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">Powerful features designed to simplify your workflow and maximize output.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-4 text-center p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                <div className="h-16 w-16 rounded-3xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-2 border border-blue-200/50 dark:border-blue-500/20">
                  <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">Global edge network ensures your data is accessible instantly, anywhere in the world.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                <div className="h-16 w-16 rounded-3xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center mb-2 border border-purple-200/50 dark:border-purple-500/20">
                  <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold">Deep Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">Advanced visualization tools to track your pipeline performance and revenue growth.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                <div className="h-16 w-16 rounded-3xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-2 border border-emerald-200/50 dark:border-emerald-500/20">
                  <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold">Bank Security</h3>
                <p className="text-muted-foreground leading-relaxed">Enterprise-grade encryption and access controls to keep your customer data safe.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 lg:px-12 border-t bg-secondary/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © 2024 Nexus CRM. All rights reserved.
          </p>
          <nav className="flex gap-8">
            <Link className="text-sm text-muted-foreground hover:text-primary" href="#">Terms</Link>
            <Link className="text-sm text-muted-foreground hover:text-primary" href="#">Privacy</Link>
            <Link className="text-sm text-muted-foreground hover:text-primary" href="#">Help</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

