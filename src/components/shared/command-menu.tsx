"use client";

import * as React from "react";
import {
  Settings,
  User,
  Users,
  LayoutGrid,
  Search,
  Briefcase
} from "lucide-react";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { contactsApi, Contact } from "@/lib/api/contacts";
import { opportunitiesApi, Opportunity } from "@/lib/api/opportunities";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    if (open) {
      loadSearchData();
    }
  }, [open]);

  const loadSearchData = async () => {
    try {
      const [contactsRes, oppsRes] = await Promise.all([
        contactsApi.getContacts(),
        opportunitiesApi.getOpportunities()
      ]);
      if (contactsRes.success) setContacts(contactsRes.data);
      if (oppsRes.success) setOpportunities(oppsRes.data);
    } catch (error) {
      console.error("Failed to load search data:", error);
    }
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-md items-center relative ml-12 lg:ml-0 bg-secondary/50 rounded-xl px-3 text-sm text-muted-foreground hover:bg-secondary/80 transition-colors border-none group"
      >
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
        <span className="flex-1 text-left">Search anything...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex ml-2">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] p-4">
            <Dialog.Title className="sr-only">Global Command Menu</Dialog.Title>

            <Command className="w-full max-w-[640px] overflow-hidden rounded-2xl border bg-card shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>

                <Command.Group heading="Navigation" className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/dashboard"))}
                    className="flex cursor-default select-none items-center rounded-xl px-3 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/opportunities"))}
                    className="flex cursor-default select-none items-center rounded-xl px-3 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Opportunities</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/contacts"))}
                    className="flex cursor-default select-none items-center rounded-xl px-3 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Contacts</span>
                  </Command.Item>
                </Command.Group>

                <Command.Separator className="h-px bg-border my-2" />

                {contacts.length > 0 && (
                  <>
                    <Command.Group heading="Contacts" className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {contacts.map((contact) => (
                        <Command.Item
                          key={contact.id}
                          onSelect={() => runCommand(() => router.push(`/contacts/${contact.id}`))}
                          className="flex cursor-default select-none items-center rounded-xl px-3 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground gap-2"
                        >
                          <User className="h-4 w-4" />
                          <span>{contact.firstName} {contact.lastName}</span>
                          <span className="ml-auto text-[10px] text-muted-foreground">{contact.company}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                    <Command.Separator className="h-px bg-border my-2" />
                  </>
                )}

                {opportunities.length > 0 && (
                  <>
                    <Command.Group heading="Opportunities" className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {opportunities.map((opp) => (
                        <Command.Item
                          key={opp.id}
                          onSelect={() => runCommand(() => router.push(`/opportunities/${opp.id}`))}
                          className="flex cursor-default select-none items-center rounded-xl px-3 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground gap-2"
                        >
                          <Briefcase className="h-4 w-4" />
                          <span>{opp.title}</span>
                          <span className="ml-auto text-[10px] text-muted-foreground">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(opp.value)}
                          </span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                    <Command.Separator className="h-px bg-border my-2" />
                  </>
                )}

                <Command.Group heading="Settings" className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/settings"))}
                    className="flex cursor-default select-none items-center rounded-xl px-3 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
