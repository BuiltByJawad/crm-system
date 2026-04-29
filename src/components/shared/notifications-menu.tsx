'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Bell, CheckCircle2 } from 'lucide-react'

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
}

const demoNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New opportunity created',
    description: 'A new opportunity was added to your pipeline.',
    time: '2m ago',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Contact updated',
    description: 'A contact record was updated successfully.',
    time: '1h ago',
    unread: false,
  },
  {
    id: 'n3',
    title: 'Weekly summary ready',
    description: 'Your weekly sales summary is available.',
    time: 'Mon',
    unread: false,
  },
]

export function NotificationsMenu() {
  const unreadCount = demoNotifications.filter(n => n.unread).length

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors hidden sm:block"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary border-2 border-background" />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-2xl"
        >
          <div className="px-2 py-2 flex items-center justify-between">
            <p className="text-sm font-semibold">Notifications</p>
            <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
          </div>

          <DropdownMenu.Separator className="my-2 h-px bg-border" />

          <div className="max-h-[320px] overflow-auto">
            {demoNotifications.map((n) => (
              <DropdownMenu.Item
                key={n.id}
                className="cursor-default select-none rounded-2xl px-3 py-3 outline-none hover:bg-accent"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-9 w-9 rounded-2xl bg-secondary flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold truncate">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.description}</p>
                  </div>
                </div>
              </DropdownMenu.Item>
            ))}
          </div>

          <DropdownMenu.Separator className="my-2 h-px bg-border" />

          <DropdownMenu.Item
            onSelect={() => {
              window.location.href = '/settings?tab=notifications'
            }}
            className="cursor-default select-none rounded-xl px-3 py-2 text-sm outline-none hover:bg-accent text-center"
          >
            View all
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
