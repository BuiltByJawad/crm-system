'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User as UserIcon,
  Edit2,
  Trash2,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  Briefcase
} from 'lucide-react';

export const runtime = 'edge';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { opportunitiesApi, Opportunity } from '@/lib/api/opportunities';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { OpportunityModal } from '../components/opportunity-modal';
import { DeleteConfirmModal } from '@/components/shared/delete-confirm-modal';

const stageHistory = [
  { id: 1, from: 'Prospect', to: 'Qualified', date: '2024-04-25T14:20:00Z', user: 'John Doe' },
  { id: 2, from: 'Qualified', to: 'Proposal', date: '2024-04-27T10:30:00Z', user: 'John Doe' },
];

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadOpportunity();
    }
  }, [id]);

  const loadOpportunity = async () => {
    setLoading(true);
    try {
      const response = await opportunitiesApi.getOpportunity(id as string);
      if (response.success && response.data) {
        setOpportunity(response.data);
      } else {
        toast.error('Opportunity not found');
        router.push('/opportunities');
      }
    } catch (error) {
      console.error('Failed to load opportunity:', error);
      toast.error('An error occurred while loading opportunity details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await opportunitiesApi.deleteOpportunity(id as string);
      toast.success('Opportunity deleted successfully');
      router.push('/opportunities');
    } catch (error) {
      console.error('Failed to delete opportunity:', error);
      toast.error('Failed to delete opportunity');
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

  if (!opportunity) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/opportunities')}
          className="hover:bg-secondary/50 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pipeline
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
        {/* Deal Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-3xl p-6 space-y-6 border-none">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                <Briefcase className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold truncate">{opportunity.title}</h1>
                <p className="text-sm text-muted-foreground font-medium truncate">{opportunity.contact.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-secondary/30">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Value</p>
                <p className="text-lg font-black text-foreground">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(opportunity.value)}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/30">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Probability</p>
                <p className="text-lg font-black text-foreground">65%</p>
              </div>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Stage</span>
                <span className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border-none ring-1 ring-black/5",
                  opportunity.stage === 'PROSPECT' ? "bg-slate-700 text-white" :
                  opportunity.stage === 'QUALIFIED' ? "bg-blue-700 text-white" :
                  opportunity.stage === 'PROPOSAL' ? "bg-purple-700 text-white" :
                  opportunity.stage === 'NEGOTIATION' ? "bg-orange-600 text-white" :
                  opportunity.stage === 'CLOSED_WON' ? "bg-emerald-600 text-white" :
                  "bg-rose-600 text-white"
                )}>
                  {opportunity.stage.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Close Date</span>
                <span className="font-semibold">May 15, 2024</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Owner</span>
                <span className="font-semibold">John Doe</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 space-y-4 border-none">
            <h3 className="font-bold flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-primary" />
              Contact Details
            </h3>
            <div className="p-4 rounded-2xl bg-secondary/20 border border-border/50 group cursor-pointer hover:bg-secondary/40 transition-colors" onClick={() => router.push(`/contacts/${opportunity.contact.id}`)}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {opportunity.contact.firstName[0]}{opportunity.contact.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{opportunity.contact.firstName} {opportunity.contact.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate">{opportunity.contact.company}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* History & Notes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6 border-none space-y-6">
            <h3 className="text-lg font-bold">Stage History</h3>
            <div className="space-y-6">
              {stageHistory.map((history, idx) => (
                <div key={history.id} className="relative flex gap-4">
                  {idx !== stageHistory.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-secondary/50" />
                  )}
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 z-10">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="flex-1 pt-1 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm">
                        Moved from <span className="text-muted-foreground font-medium">{history.from}</span> to <span className="text-primary">{history.to}</span>
                      </p>
                      <time className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        {new Date(history.date).toLocaleDateString()}
                      </time>
                    </div>
                    <p className="text-xs text-muted-foreground">Updated by {history.user}</p>
                  </div>
                </div>
              ))}
              <div className="relative flex gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 z-10 font-bold text-xs italic">
                  NEW
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-bold text-sm">Opportunity Created</p>
                  <p className="text-xs text-muted-foreground">Initial entry into Prospect stage</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border-none space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Internal Notes</h3>
              <Button variant="secondary" size="sm" className="h-8 rounded-lg">
                <MessageSquare className="h-3.5 w-3.5 mr-2" />
                Add Note
              </Button>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/20 border border-dashed border-border/50 text-center py-8">
              <p className="text-sm text-muted-foreground">No internal notes for this deal yet.</p>
            </div>
          </div>
        </div>
      </div>

      <OpportunityModal 
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        opportunity={opportunity}
        onSuccess={loadOpportunity}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Opportunity"
        description={`Are you sure you want to delete ${opportunity.title}? This action cannot be undone.`}
      />
    </div>
  );
}
