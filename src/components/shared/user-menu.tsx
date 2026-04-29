'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import { LogOut, Settings, User } from 'lucide-react'

interface UserMenuProps {
  initials: string
  name: string
  role: string
}

export function UserMenu({ initials, name, role }: UserMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 rounded-full pl-1 pr-1 md:pr-3 py-1 hover:bg-secondary transition-colors group">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 shrink-0">
            {initials}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold leading-none">{name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{role}</p>
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 min-w-[220px] overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-2xl"
        >
          <div className="px-2 py-2">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>

          <DropdownMenu.Separator className="my-2 h-px bg-border" />

          <DropdownMenu.Item asChild>
            <Link href="/settings" className="flex cursor-default select-none items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none hover:bg-accent">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link href="/settings" className="flex cursor-default select-none items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none hover:bg-accent">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-2 h-px bg-border" />

          <DropdownMenu.Item
            onSelect={() => {
              window.location.href = '/login'
            }}
            className="flex cursor-default select-none items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
