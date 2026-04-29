'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  User as UserIcon,
  Edit2,
  Trash2,
  CheckCircle2,
  MessageSquare,
  PhoneCall,
  Video,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { contactsApi, Contact } from '@/lib/api/contacts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ContactModal } from '../components/contact-modal';
import { DeleteConfirmModal } from '@/components/shared/delete-confirm-modal';

const activityLogs = [
  { id: 1, type: 'call', description: 'Outbound call - No answer', date: '2024-04-28T10:30:00Z', user: 'John Doe' },
  { id: 2, type: 'email', description: 'Sent proposal follow-up email', date: '2024-04-27T15:45:00Z', user: 'John Doe' },
  { id: 3, type: 'note', description: 'Interested in enterprise license for 50 seats', date: '2024-04-26T09:15:00Z', user: 'John Doe' },
  { id: 4, type: 'stage', description: 'Moved to Qualified stage', date: '2024-04-25T14:20:00Z', user: 'Sarah Chen' },
];

export default function ContactDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadContact();
    }
  }, [id]);

  const loadContact = async () => {
    setLoading(true);
    try {
      const response = await contactsApi.getContact(id as string);
      if (response.success && response.data) {
        setContact(response.data);
      } else {
        toast.error('Contact not found');
        router.push('/contacts');
      }
    } catch (error) {
      console.error('Failed to load contact:', error);
      toast.error('An error occurred while loading contact details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await contactsApi.deleteContact(id as string);
      toast.success('Contact deleted successfully');
      router.push('/contacts');
    } catch (error) {
      console.error('Failed to delete contact:', error);
      toast.error('Failed to delete contact');
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!contact) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/contacts')}
          className="hover:bg-secondary/50 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contacts
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-3xl p-6 space-y-6 border-none text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border border-primary/20 shadow-inner">
                {contact.firstName[0]}{contact.lastName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{contact.firstName} {contact.lastName}</h1>
                <p className="text-muted-foreground font-medium">{contact.company || 'Private'}</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-3">
              <Button size="icon" variant="secondary" className="rounded-xl h-10 w-10">
                <Mail className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-xl h-10 w-10">
                <PhoneCall className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-xl h-10 w-10">
                <Video className="h-5 w-5" />
              </Button>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email</p>
                  <p className="font-semibold truncate">{contact.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone</p>
                  <p className="font-semibold">{contact.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Company</p>
                  <p className="font-semibold">{contact.company || 'Private'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 space-y-4 border-none">
            <h3 className="font-bold flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-primary" />
              Internal Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Assigned To</span>
                <span className="font-semibold">{contact.assignedTo?.firstName} {contact.assignedTo?.lastName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created By</span>
                <span className="font-semibold">{contact.createdBy.firstName} {contact.createdBy.lastName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lead Source</span>
                <span className="font-semibold">Direct Referral</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6 border-none space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Activity Log</h3>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="h-8 rounded-lg">
                  <MessageSquare className="h-3.5 w-3.5 mr-2" />
                  Add Note
                </Button>
                <Button variant="secondary" size="sm" className="h-8 rounded-lg">
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  Log Task
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {activityLogs.map((activity, idx) => (
                <div key={activity.id} className="relative flex gap-4">
                  {idx !== activityLogs.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-secondary/50" />
                  )}
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10",
                    activity.type === 'call' ? "bg-blue-500/10 text-blue-500" :
                    activity.type === 'email' ? "bg-purple-500/10 text-purple-500" :
                    activity.type === 'note' ? "bg-orange-500/10 text-orange-500" :
                    "bg-emerald-500/10 text-emerald-500"
                  )}>
                    {activity.type === 'call' && <PhoneCall className="h-5 w-5" />}
                    {activity.type === 'email' && <Mail className="h-5 w-5" />}
                    {activity.type === 'note' && <MessageSquare className="h-5 w-5" />}
                    {activity.type === 'stage' && <CheckCircle2 className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 pt-1 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm">{activity.description}</p>
                      <time className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        {new Date(activity.date).toLocaleDateString()}
                      </time>
                    </div>
                    <p className="text-xs text-muted-foreground">Logged by {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass rounded-3xl p-6 border-none">
            <h3 className="text-lg font-bold mb-6">Upcoming Tasks</h3>
            <div className="p-12 text-center space-y-4">
              <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <div className="max-w-[250px] mx-auto">
                <p className="font-bold">No upcoming tasks</p>
                <p className="text-sm text-muted-foreground">Everything is caught up. Create a new task to get started.</p>
              </div>
              <Button size="sm">Create Task</Button>
            </div>
          </div>
        </div>
      </div>

      <ContactModal 
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        contact={contact}
        onSuccess={loadContact}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Contact"
        description={`Are you sure you want to delete ${contact.firstName} ${contact.lastName}? This action cannot be undone.`}
      />
    </div>
  );
}
