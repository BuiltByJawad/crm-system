import { Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { CommandMenu } from '@/components/shared/command-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 md:px-8 backdrop-blur">
      <CommandMenu />

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors hidden sm:block">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary border-2 border-background" />
        </button>
        
        <div className="h-8 w-[1px] bg-border mx-1 md:mx-2 hidden sm:block" />

        <button className="flex items-center gap-2 rounded-full pl-1 pr-1 md:pr-3 py-1 hover:bg-secondary transition-colors group">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 shrink-0">
            JD
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold leading-none">John Doe</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}
