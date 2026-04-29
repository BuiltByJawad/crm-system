'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Building2, 
  Users, 
  DollarSign, 
  UserCircle,
  MoreVertical,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Department {
  id: string;
  name: string;
  head: string;
  members: number;
  budget: number;
  color: string;
  performance: number;
}

const mockDepartments: Department[] = [
  { id: '1', name: 'Sales', head: 'John Doe', members: 12, budget: 250000, color: 'bg-blue-600', performance: 87 },
  { id: '2', name: 'Marketing', head: 'Sarah Chen', members: 8, budget: 180000, color: 'bg-purple-600', performance: 92 },
  { id: '3', name: 'Engineering', head: 'Alex Rivera', members: 15, budget: 400000, color: 'bg-emerald-600', performance: 78 },
  { id: '4', name: 'Customer Success', head: 'Emily Park', members: 6, budget: 120000, color: 'bg-orange-600', performance: 95 },
  { id: '5', name: 'Finance', head: 'Michael Torres', members: 4, budget: 90000, color: 'bg-rose-600', performance: 88 },
  { id: '6', name: 'Human Resources', head: 'Lisa Johnson', members: 5, budget: 95000, color: 'bg-slate-600', performance: 82 },
];

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departments] = useState<Department[]>(mockDepartments);

  const filteredDepts = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMembers = departments.reduce((sum, d) => sum + d.members, 0);
  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0);
  const avgPerformance = Math.round(departments.reduce((sum, d) => sum + d.performance, 0) / departments.length);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Organize your teams and track departmental performance.</p>
        </div>
        <Button className="h-10 px-6 shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-5 w-5" />
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="p-4 md:p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-2 md:p-3 rounded-xl bg-blue-100 dark:bg-blue-500/20">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3 md:mt-4">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Total Members</p>
            <h3 className="text-xl md:text-2xl font-bold mt-1">{totalMembers}</h3>
          </div>
        </div>
        <div className="p-4 md:p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-2 md:p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/20">
              <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 md:mt-4">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Total Budget</p>
            <h3 className="text-xl md:text-2xl font-bold mt-1">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalBudget)}
            </h3>
          </div>
        </div>
        <div className="p-4 md:p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-2 md:p-3 rounded-xl bg-purple-100 dark:bg-purple-500/20">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-3 md:mt-4">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Avg Performance</p>
            <h3 className="text-xl md:text-2xl font-bold mt-1">{avgPerformance}%</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search departments or leads..." 
            className="pl-10 h-10 border-none bg-secondary/50 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDepts.map((dept) => (
          <div key={dept.id} className="p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md", dept.color)}>
                  {dept.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{dept.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <UserCircle className="h-3 w-3" />
                    <span>{dept.head}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary/50">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-secondary/30 text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Members</p>
                <p className="text-lg font-black mt-0.5">{dept.members}</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/30 text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Budget</p>
                <p className="text-sm font-black mt-0.5">{(dept.budget / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/30 text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Perf</p>
                <p className={cn("text-lg font-black mt-0.5", dept.performance >= 90 ? "text-emerald-600 dark:text-emerald-400" : dept.performance >= 80 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400")}>{dept.performance}%</p>
              </div>
            </div>

            <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all", dept.color)} 
                style={{ width: `${dept.performance}%` }} 
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{dept.name} Department</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
