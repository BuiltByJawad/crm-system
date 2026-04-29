'use client';

import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
];

const winRateData = [
  { stage: 'Prospect', count: 45, color: '#6366f1' },
  { stage: 'Qualified', count: 32, color: '#8b5cf6' },
  { stage: 'Proposal', count: 24, color: '#ec4899' },
  { stage: 'Negotiation', count: 18, color: '#f59e0b' },
  { stage: 'Won', count: 12, color: '#10b981' },
];

const stats = [
  { 
    label: 'Total Opportunities', 
    value: '128', 
    change: '+12%', 
    trend: 'up', 
    icon: Briefcase,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-500/20'
  },
  { 
    label: 'Total Contacts', 
    value: '2,450', 
    change: '+5%', 
    trend: 'up', 
    icon: Users,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-500/20'
  },
  { 
    label: 'Pipeline Value', 
    value: '$4.2M', 
    change: '+18%', 
    trend: 'up', 
    icon: TrendingUp,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-500/20'
  },
  { 
    label: 'Closed Won', 
    value: '42', 
    change: '-2%', 
    trend: 'down', 
    icon: CheckCircle2,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-500/20'
  },
];

const recentOpportunities = [
  { id: 1, title: 'Enterprise License Deal', company: 'TechCorp', value: '$50,000', stage: 'Proposal', status: 'High' },
  { id: 2, title: 'Cloud Migration Project', company: 'DataSystems', value: '$120,000', stage: 'Negotiation', status: 'Medium' },
  { id: 3, title: 'Security Audit Service', company: 'SafeBank', value: '$15,000', stage: 'Qualified', status: 'Low' },
  { id: 4, title: 'Annual Support Contract', company: 'GlobalLogistics', value: '$35,000', stage: 'Prospecting', status: 'High' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 md:px-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base text-balance">Welcome back, here's what's happening with your sales pipeline.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex-1 sm:flex-none h-10 md:h-11 bg-secondary/50 border-none shadow-sm">Download Report</Button>
          <Button className="flex-1 sm:flex-none h-10 md:h-11 shadow-lg shadow-primary/20">Generate Insights</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass p-4 md:p-6 rounded-2xl card-hover relative overflow-hidden group border-none">
            <div className={cn("absolute -right-4 -top-4 h-20 w-20 md:h-24 md:w-24 rounded-full opacity-10 transition-transform group-hover:scale-150", stat.bg)} />
            <div className="flex items-start justify-between relative">
              <div className={cn("p-2 md:p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-5 w-5 md:h-6 md:w-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs sm:text-sm font-black px-3 py-2 rounded-full shadow-md",
                stat.trend === 'up'
                  ? "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-emerald-950"
                  : "bg-rose-500 text-white dark:bg-rose-400 dark:text-rose-950"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-3 md:mt-4 relative">
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">{stat.label}</p>
              <h3 className="text-xl md:text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="glass rounded-3xl p-6 border-none space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Revenue Growth</h3>
            </div>
            <select className="bg-secondary/50 border-none rounded-lg px-2 py-1 text-xs font-medium focus:ring-1 focus:ring-primary outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.627 0.194 256.747)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(0.627 0.194 256.747)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.922 0 0 / 0.1)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'oklch(0.627 0 0 / 0.5)' }}
                  dy={10}
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'oklch(0.145 0 0)', 
                    border: 'none', 
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="oklch(0.627 0.194 256.747)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 border-none space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Pipeline Conversion</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-xs font-medium">Full Report</Button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winRateData} layout="vertical" margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="oklch(0.922 0 0 / 0.1)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="stage" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: 'oklch(0.439 0 0 / 0.8)' }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: 'oklch(0.145 0 0)', 
                    border: 'none', 
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={32}>
                  {winRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 glass rounded-3xl overflow-hidden flex flex-col min-w-0 border-none">
          <div className="p-4 md:p-6 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-lg font-bold">Priority Opportunities</h3>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">View All</Button>
          </div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-secondary">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-secondary/40 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-muted-foreground/90 dark:text-foreground/70">
                  <th className="px-4 md:px-6 py-4">Opportunity</th>
                  <th className="px-4 md:px-6 py-4">Company</th>
                  <th className="px-4 md:px-6 py-4">Value</th>
                  <th className="px-4 md:px-6 py-4">Stage</th>
                  <th className="px-4 md:px-6 py-4 hidden sm:table-cell">Priority</th>
                  <th className="px-4 md:px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 border-t border-border/50">
                {recentOpportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-secondary/40 transition-colors group">
                    <td className="px-4 md:px-6 py-4">
                      <p className="text-sm font-semibold truncate max-w-[150px]">{opp.title}</p>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-blue-700 dark:text-blue-400 font-bold truncate max-w-[100px]">{opp.company}</td>
                    <td className="px-4 md:px-6 py-4 text-sm font-bold">{opp.value}</td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border-none ring-1 ring-black/5 whitespace-nowrap",
                        opp.stage === 'Prospecting' ? "bg-slate-700 text-white" :
                        opp.stage === 'Qualified' ? "bg-blue-700 text-white" :
                        opp.stage === 'Proposal' ? "bg-purple-700 text-white" :
                        opp.stage === 'Negotiation' ? "bg-orange-600 text-white" :
                        opp.stage === 'Won' ? "bg-emerald-600 text-white" :
                        "bg-rose-600 text-white"
                      )}>
                        {opp.stage}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          opp.status === 'High' ? "bg-emerald-500" : opp.status === 'Medium' ? "bg-orange-500" : "bg-blue-500"
                        )} />
                        <span className="text-xs sm:text-sm font-semibold">{opp.status}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-3xl p-4 md:p-6 space-y-6 border-none">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Activity</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-secondary/50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="h-8 w-8 rounded-full bg-background border-4 border-secondary/50 z-10 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Sarah updated opportunity stage</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Nexus Deal • 2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 bg-secondary/50 border-none shadow-sm">View All Activity</Button>
        </div>
      </div>
    </div>
  );
}
