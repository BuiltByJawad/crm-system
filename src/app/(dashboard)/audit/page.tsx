'use client';

import { useState } from 'react';
import { 
  Search, 
  ShieldAlert, 
  FileEdit, 
  Trash2, 
  LogIn, 
  LogOut,
  Settings,
  Eye,
  Download,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type EventType = 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'SETTINGS_CHANGE';
type Severity = 'INFO' | 'WARN' | 'CRITICAL';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: EventType;
  resource: string;
  details: string;
  severity: Severity;
  ip: string;
}

const mockLogs: AuditLog[] = [
  { id: '1', timestamp: '2024-04-28 14:32:05', user: 'John Doe', action: 'LOGIN', resource: 'Session', details: 'Successful login from Chrome/Windows', severity: 'INFO', ip: '192.168.1.45' },
  { id: '2', timestamp: '2024-04-28 14:28:12', user: 'Sarah Chen', action: 'UPDATE', resource: 'Opportunity', details: 'Updated stage of "Enterprise Deal" from Proposal to Negotiation', severity: 'INFO', ip: '10.0.0.22' },
  { id: '3', timestamp: '2024-04-28 13:55:30', user: 'Alex Rivera', action: 'CREATE', resource: 'Contact', details: 'Created new contact "Maria Santos" at TechCorp', severity: 'INFO', ip: '10.0.0.35' },
  { id: '4', timestamp: '2024-04-28 13:42:18', user: 'John Doe', action: 'DELETE', resource: 'Contact', details: 'Deleted contact "Old Lead Inc."', severity: 'WARN', ip: '192.168.1.45' },
  { id: '5', timestamp: '2024-04-28 12:15:44', user: 'Emily Park', action: 'UPDATE', resource: 'Opportunity', details: 'Changed value of "SaaS Contract" from $45,000 to $52,000', severity: 'INFO', ip: '10.0.0.48' },
  { id: '6', timestamp: '2024-04-28 11:30:00', user: 'System', action: 'SETTINGS_CHANGE', resource: 'Security', details: 'Password policy updated: minimum length changed to 12 characters', severity: 'WARN', ip: 'System' },
  { id: '7', timestamp: '2024-04-28 10:22:33', user: 'Michael Torres', action: 'LOGIN', resource: 'Session', details: 'Failed login attempt (3rd attempt)', severity: 'CRITICAL', ip: '203.0.113.42' },
  { id: '8', timestamp: '2024-04-28 09:45:11', user: 'Lisa Johnson', action: 'VIEW', resource: 'Report', details: 'Viewed Q1 Sales Performance Report', severity: 'INFO', ip: '10.0.0.55' },
  { id: '9', timestamp: '2024-04-28 09:10:28', user: 'Sarah Chen', action: 'CREATE', resource: 'Opportunity', details: 'Created new opportunity "Cloud Migration Project" worth $120,000', severity: 'INFO', ip: '10.0.0.22' },
  { id: '10', timestamp: '2024-04-28 08:55:02', user: 'John Doe', action: 'LOGOUT', resource: 'Session', details: 'Manual logout', severity: 'INFO', ip: '192.168.1.45' },
  { id: '11', timestamp: '2024-04-27 17:30:15', user: 'Rachel Green', action: 'UPDATE', resource: 'User', details: 'Changed role of David Kim from Sales Rep to Manager', severity: 'WARN', ip: '10.0.0.60' },
  { id: '12', timestamp: '2024-04-27 16:12:44', user: 'System', action: 'SETTINGS_CHANGE', resource: 'System', details: 'Session timeout reduced from 60min to 30min', severity: 'WARN', ip: 'System' },
];

const eventConfig: Record<EventType, { label: string; icon: React.ElementType; color: string }> = {
  LOGIN: { label: 'Login', icon: LogIn, color: 'bg-blue-700 text-white' },
  LOGOUT: { label: 'Logout', icon: LogOut, color: 'bg-slate-600 text-white' },
  CREATE: { label: 'Create', icon: FileEdit, color: 'bg-emerald-700 text-white' },
  UPDATE: { label: 'Update', icon: FileEdit, color: 'bg-purple-700 text-white' },
  DELETE: { label: 'Delete', icon: Trash2, color: 'bg-rose-700 text-white' },
  VIEW: { label: 'View', icon: Eye, color: 'bg-cyan-700 text-white' },
  SETTINGS_CHANGE: { label: 'Settings', icon: Settings, color: 'bg-amber-700 text-white' },
};

const severityConfig: Record<Severity, { label: string; color: string; dotColor: string }> = {
  INFO: { label: 'Info', color: 'text-blue-600 dark:text-blue-400', dotColor: 'bg-blue-500' },
  WARN: { label: 'Warning', color: 'text-amber-600 dark:text-amber-400', dotColor: 'bg-amber-500' },
  CRITICAL: { label: 'Critical', color: 'text-rose-600 dark:text-rose-400', dotColor: 'bg-rose-500' },
};

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventType | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'ALL'>('ALL');

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === 'ALL' || log.action === selectedEvent;
    const matchesSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
    return matchesSearch && matchesEvent && matchesSeverity;
  });

  const criticalCount = mockLogs.filter(l => l.severity === 'CRITICAL').length;
  const warnCount = mockLogs.filter(l => l.severity === 'WARN').length;
  const todayCount = mockLogs.filter(l => l.timestamp.startsWith('2024-04-28')).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Track all system activities and security events.</p>
        </div>
        <Button variant="outline" className="h-10 bg-secondary/40 border-none shadow-sm hover:bg-secondary/50">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="p-4 md:p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-2 md:p-3 rounded-xl bg-blue-100 dark:bg-blue-500/20">
              <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3 md:mt-4">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Today's Events</p>
            <h3 className="text-xl md:text-2xl font-bold mt-1">{todayCount}</h3>
          </div>
        </div>
        <div className="p-4 md:p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-2 md:p-3 rounded-xl bg-amber-100 dark:bg-amber-500/20">
              <ShieldAlert className="h-5 w-5 md:h-6 md:w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-3 md:mt-4">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Warnings</p>
            <h3 className="text-xl md:text-2xl font-bold mt-1">{warnCount}</h3>
          </div>
        </div>
        <div className="p-4 md:p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-2 md:p-3 rounded-xl bg-rose-100 dark:bg-rose-500/20">
              <ShieldAlert className="h-5 w-5 md:h-6 md:w-6 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <div className="mt-3 md:mt-4">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Critical Events</p>
            <h3 className="text-xl md:text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400">{criticalCount}</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by user, action, or details..." 
            className="pl-10 h-10 border-none bg-secondary/50 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select 
            className="h-10 rounded-xl bg-secondary/50 border-none shadow-sm px-3 text-sm font-medium focus:ring-2 focus:ring-primary"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value as EventType | 'ALL')}
          >
            <option value="ALL">All Events</option>
            {Object.entries(eventConfig).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <select 
            className="h-10 rounded-xl bg-secondary/50 border-none shadow-sm px-3 text-sm font-medium focus:ring-2 focus:ring-primary"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as Severity | 'ALL')}
          >
            <option value="ALL">All Severity</option>
            <option value="INFO">Info</option>
            <option value="WARN">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-secondary/30 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-muted-foreground/90 dark:text-foreground/70">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4 hidden lg:table-cell">Details</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4 hidden md:table-cell">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 border-t border-slate-100 dark:border-white/5">
              {filteredLogs.map((log) => {
                const event = eventConfig[log.action];
                const EventIcon = event.icon;
                const sev = severityConfig[log.severity];
                return (
                  <tr key={log.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-muted-foreground">{log.timestamp}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                          {log.user === 'System' ? 'SY' : log.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-bold">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm ring-1 ring-black/5", event.color)}>
                        <EventIcon className="h-3 w-3" />
                        {event.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold">{log.resource}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{log.details}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", sev.dotColor)} />
                        <span className={cn("text-[10px] font-black uppercase tracking-wider", sev.color)}>{sev.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-xs font-mono text-muted-foreground">{log.ip}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
