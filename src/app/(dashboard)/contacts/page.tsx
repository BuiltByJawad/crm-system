'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building2, 
  MoreVertical,
  ChevronRight,
  UserCheck,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contactsApi, Contact } from '@/lib/api/contacts';
import { cn } from '@/lib/utils';
import { ContactModal } from './components/contact-modal';

export default function ContactsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await contactsApi.getContacts();
      if (response.success && response.data) {
        setContacts(response.data);
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base text-balance">Manage your customer relationships and contact details.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-secondary/50 p-1 rounded-xl">
            <Button 
              variant={view === 'grid' ? 'secondary' : 'ghost'} 
              size="sm" 
              className={cn("rounded-lg h-8 px-3", view === 'grid' && "bg-background shadow-sm")}
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button 
              variant={view === 'list' ? 'secondary' : 'ghost'} 
              size="sm" 
              className={cn("rounded-lg h-8 px-3", view === 'list' && "bg-background shadow-sm")}
              onClick={() => setView('list')}
            >
              <ListIcon className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <Button onClick={handleAddContact} className="h-10 px-6 shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-5 w-5" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or company..." 
            className="pl-10 h-10 border-none bg-secondary/50 shadow-sm"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-10 bg-secondary/50 border-none shadow-sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="p-6 rounded-2xl card-hover group relative overflow-hidden bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer" onClick={() => handleEditContact(contact)}>
              <div className="absolute right-0 top-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border border-primary/20 shadow-inner">
                  {contact.firstName[0]}{contact.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{contact.firstName} {contact.lastName}</h3>
                  <p className="text-sm text-muted-foreground font-medium truncate max-w-[150px]">{contact.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="font-black text-blue-700 dark:text-blue-400 truncate">{contact.company || 'No Company'}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm group/item cursor-pointer">
                  <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground group-hover/item:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground group-hover/item:text-foreground transition-colors truncate">{contact.email}</span>
                </div>

                <div className="flex items-center gap-3 text-sm group/item cursor-pointer">
                  <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground group-hover/item:text-primary transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground group-hover/item:text-foreground transition-colors truncate">{contact.phone || 'No phone'}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {contact.assignedTo ? `${contact.assignedTo.firstName} ${contact.assignedTo.lastName}` : 'Unassigned'}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/30">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden bg-white/30 dark:bg-card/30 backdrop-blur-sm">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-secondary">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-secondary/30 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-muted-foreground/90 dark:text-foreground/70">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y border-t">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-secondary/20 transition-colors group cursor-pointer" onClick={() => handleEditContact(contact)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {contact.firstName[0]}{contact.lastName[0]}
                        </div>
                        <span className="font-bold text-sm">{contact.firstName} {contact.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-700 dark:text-blue-400 font-black">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {contact.company || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{contact.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{contact.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {contact.assignedTo ? `${contact.assignedTo.firstName} ${contact.assignedTo.lastName}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ContactModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        contact={selectedContact} 
        onSuccess={loadContacts} 
      />
    </div>
  );
}

