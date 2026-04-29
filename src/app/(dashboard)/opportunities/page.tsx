'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Building2, 
  DollarSign,
  LayoutGrid,
  List as ListIcon,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { opportunitiesApi, Opportunity } from '@/lib/api/opportunities';
import { cn } from '@/lib/utils';
import { OpportunityModal } from './components/opportunity-modal';

const STAGES = [
  { id: 'PROSPECT', label: 'Prospect', color: 'bg-slate-600 text-white dark:bg-slate-500/20 dark:text-slate-200 border-none' },
  { id: 'QUALIFIED', label: 'Qualified', color: 'bg-blue-600 text-white dark:bg-blue-500/20 dark:text-blue-200 border-none' },
  { id: 'PROPOSAL', label: 'Proposal', color: 'bg-purple-600 text-white dark:bg-purple-500/20 dark:text-purple-200 border-none' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-orange-600 text-white dark:bg-orange-500 dark:text-orange-950 border-none' },
  { id: 'CLOSED_WON', label: 'Closed Won', color: 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950 border-none' },
  { id: 'CLOSED_LOST', label: 'Closed Lost', color: 'bg-rose-600 text-white dark:bg-rose-500 dark:text-rose-950 border-none' },
];

export default function OpportunitiesPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [initialStage, setInitialStage] = useState<Opportunity['stage'] | undefined>(undefined);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const handleAddOpportunity = (stage?: Opportunity['stage']) => {
    setSelectedOpportunity(null);
    setInitialStage(stage);
    setIsModalOpen(true);
  };

  const handleEditOpportunity = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setIsModalOpen(true);
  };

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const response = await opportunitiesApi.getOpportunities();
      if (response.success && response.data) {
        setOpportunities(response.data);
      }
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStage = destination.droppableId as Opportunity['stage'];
    const updatedOpps = Array.from(opportunities);
    const oppIndex = updatedOpps.findIndex(o => o.id === draggableId);
    
    if (oppIndex !== -1) {
      const [removed] = updatedOpps.splice(oppIndex, 1);
      removed.stage = newStage;
      updatedOpps.splice(destination.index, 0, removed);
      setOpportunities(updatedOpps);

      try {
        await opportunitiesApi.updateOpportunity(draggableId, { stage: newStage });
      } catch (error) {
        console.error('Failed to update stage:', error);
        loadOpportunities(); // Rollback
      }
    }
  };

  const filteredOpps = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Track and manage your deals through the stages.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-secondary/50 dark:bg-white/5 p-1 rounded-xl">
            <Button 
              variant={view === 'kanban' ? 'secondary' : 'ghost'} 
              size="sm" 
              className={cn("rounded-lg h-8 px-3 transition-all", view === 'kanban' && "bg-background shadow-sm")}
              onClick={() => setView('kanban')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Board
            </Button>
            <Button 
              variant={view === 'list' ? 'secondary' : 'ghost'} 
              size="sm" 
              className={cn("rounded-lg h-8 px-3 transition-all", view === 'list' && "bg-background shadow-sm")}
              onClick={() => setView('list')}
            >
              <ListIcon className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <Button onClick={() => handleAddOpportunity()} className="h-10 px-6 shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-5 w-5" />
            New Deal
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search deals or companies..." 
            className="pl-10 h-10 border-none bg-secondary/50 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      ) : view === 'kanban' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-secondary dark:scrollbar-thumb-white/10 scroll-smooth">
            {STAGES.map((stage) => (
              <div key={stage.id} className="flex-shrink-0 w-[280px] sm:w-80 flex flex-col gap-3">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] border-none shadow-md ring-1 ring-black/5",
                      stage.id === 'PROSPECT' ? "bg-slate-700 text-white" :
                      stage.id === 'QUALIFIED' ? "bg-blue-700 text-white" :
                      stage.id === 'PROPOSAL' ? "bg-purple-700 text-white" :
                      stage.id === 'NEGOTIATION' ? "bg-orange-600 text-white" :
                      stage.id === 'CLOSED_WON' ? "bg-emerald-600 text-white" :
                      "bg-rose-600 text-white"
                    )}>
                      {stage.label}
                    </span>
                    <span className="text-xs font-black text-slate-500 dark:text-foreground/90 bg-secondary/50 px-2 py-0.5 rounded-md">
                      {filteredOpps.filter(o => o.stage === stage.id).length}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl hover:bg-secondary/80 dark:hover:bg-white/10 active:scale-95 transition-all"
                    onClick={() => handleAddOpportunity(stage.id as Opportunity['stage'])}
                  >
                    <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </Button>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "flex-1 min-h-[400px] max-h-[calc(100vh-320px)] overflow-y-auto overflow-x-hidden rounded-2xl p-2 transition-colors scrollbar-none",
                        snapshot.isDraggingOver ? "bg-primary/5 dark:bg-primary/10" : "bg-secondary/40 dark:bg-white/5"
                      )}
                    >
                      <div className="space-y-3">
                        {filteredOpps
                          .filter(opp => opp.stage === stage.id)
                          .map((opp, index) => (
                            <Draggable key={opp.id} draggableId={opp.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "p-4 rounded-xl shadow-sm border border-slate-200 dark:border-white/10 transition-all group cursor-pointer",
                                    snapshot.isDragging 
                                      ? "shadow-2xl ring-2 ring-primary scale-105 rotate-1 z-50 bg-white dark:bg-card" 
                                      : "hover:shadow-md hover:border-primary/30 bg-white dark:bg-card/40"
                                  )}
                                  onClick={() => handleEditOpportunity(opp)}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                      {opp.title}
                                    </h4>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary/50">
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400 font-black group-hover:text-blue-800 transition-colors">
                                      <Building2 className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-500" />
                                      <span className="truncate">{opp.contact.company}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                        <DollarSign className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(opp.value)}
                                      </div>
                                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                                        {opp.contact.firstName[0]}{opp.contact.lastName[0]}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <div className="glass rounded-3xl overflow-hidden bg-white/30 dark:bg-card/30 backdrop-blur-sm border-none shadow-sm">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-secondary dark:scrollbar-thumb-white/10">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/30 dark:bg-white/5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Deal</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 border-t border-border/50">
                {filteredOpps.map((opp) => (
                  <tr key={opp.id} className="hover:bg-secondary/20 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleEditOpportunity(opp)}>
                    <td className="px-6 py-4 font-bold text-sm">{opp.title}</td>
                    <td className="px-6 py-4 text-sm text-blue-700 dark:text-blue-400 font-black">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {opp.contact.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(opp.value)}
                    </td>
                    <td className="px-6 py-4">
                    <span className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border-none ring-1 ring-black/5",
                        opp.stage === 'PROSPECT' ? "bg-slate-700 text-white" :
                        opp.stage === 'QUALIFIED' ? "bg-blue-700 text-white" :
                        opp.stage === 'PROPOSAL' ? "bg-purple-700 text-white" :
                        opp.stage === 'NEGOTIATION' ? "bg-orange-600 text-white" :
                        opp.stage === 'CLOSED_WON' ? "bg-emerald-600 text-white" :
                        "bg-rose-600 text-white"
                      )}>
                        {STAGES.find(s => s.id === opp.stage)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                          {opp.contact.firstName[0]}{opp.contact.lastName[0]}
                        </div>
                        <span className="text-sm font-medium">{opp.contact.firstName} {opp.contact.lastName}</span>
                      </div>
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
      <OpportunityModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        opportunity={selectedOpportunity} 
        initialStage={initialStage}
        onSuccess={loadOpportunities} 
      />
    </div>
  );
}

