'use client'

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { CommandMenu } from '@/components/shared/command-menu';
import { NotificationsMenu } from '@/components/shared/notifications-menu';
import { UserMenu } from '@/components/shared/user-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 md:px-8 backdrop-blur">
      <CommandMenu />

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        <NotificationsMenu />
        
        <div className="h-8 w-[1px] bg-border mx-1 md:mx-2 hidden sm:block" />

        <UserMenu initials="JD" name="John Doe" role="Admin" />
      </div>
    </header>
  );
}
