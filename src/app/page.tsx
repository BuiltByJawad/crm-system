import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 md:px-6 lg:px-12 h-16 md:h-20 flex items-center border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
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
            <Button size="sm" className="px-3 md:px-5 text-xs md:text-sm h-8 md:h-10">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="w-full pt-0 bg-gradient-to-b from-background to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] -z-10" />
          <div className="container px-4 md:px-6 mx-auto pt-6 md:pt-10 pb-10 md:pb-16 lg:pb-20">
            <div className="flex flex-col items-center space-y-3 md:space-y-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <Link 
                href="/enterprise" 
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-sm font-medium text-primary hover:bg-primary/10 transition-colors mb-2"
              >
                <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary mr-2 animate-pulse" />
                Available now for Enterprise
              </Link>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-balance">
                Scale your sales with <span className="text-primary italic">Nexus intelligence</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-sm md:text-lg lg:text-xl leading-relaxed text-balance">
                The next generation CRM for modern teams. Automated workflows, predictive insights, and complete pipeline visibility in one beautiful interface.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-xl md:rounded-2xl shadow-xl shadow-primary/20 group">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-xl md:rounded-2xl bg-background/50 backdrop-blur-sm">
                    Live Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center p-6 md:p-8 rounded-3xl border border-transparent hover:border-primary/10 hover:bg-primary/5 transition-all duration-300">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center mb-2">
                  <Zap className="h-7 w-7 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Lightning Fast</h3>
                <p className="text-sm md:text-base text-muted-foreground text-balance">Global edge network ensures your data is accessible instantly, anywhere in the world.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 md:p-8 rounded-3xl border border-transparent hover:border-primary/10 hover:bg-primary/5 transition-all duration-300">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center mb-2">
                  <BarChart3 className="h-7 w-7 md:h-8 md:w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Deep Analytics</h3>
                <p className="text-sm md:text-base text-muted-foreground text-balance">Advanced visualization tools to track your pipeline performance and revenue growth.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 md:p-8 rounded-3xl border border-transparent hover:border-primary/10 hover:bg-primary/5 transition-all duration-300">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-2 border border-emerald-200 dark:border-emerald-500/20">
                  <ShieldCheck className="h-7 w-7 md:h-8 md:w-8 text-emerald-800 dark:text-emerald-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Bank-level Security</h3>
                <p className="text-sm md:text-base text-muted-foreground text-balance">Enterprise-grade encryption and access controls to keep your customer data safe.</p>
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

