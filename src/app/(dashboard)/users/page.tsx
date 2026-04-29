'use client';

import { useState } from 'react';
import { UserPlus, Search, Shield, MoreVertical, Crown, UserCircle, Briefcase, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'SALES_REP';
  isActive: boolean;
  lastActive: string;
}

const mockUsers: User[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'admin@crm.com', role: 'ADMIN', isActive: true, lastActive: 'Just now' },
  { id: '2', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@crm.com', role: 'MANAGER', isActive: true, lastActive: '5 min ago' },
  { id: '3', firstName: 'Alex', lastName: 'Rivera', email: 'alex.rivera@crm.com', role: 'SALES_REP', isActive: true, lastActive: '1 hour ago' },
  { id: '4', firstName: 'Emily', lastName: 'Park', email: 'emily.park@crm.com', role: 'SALES_REP', isActive: true, lastActive: '3 hours ago' },
  { id: '5', firstName: 'Michael', lastName: 'Torres', email: 'michael.torres@crm.com', role: 'MANAGER', isActive: false, lastActive: '2 days ago' },
  { id: '6', firstName: 'Lisa', lastName: 'Johnson', email: 'lisa.johnson@crm.com', role: 'SALES_REP', isActive: true, lastActive: '30 min ago' },
  { id: '7', firstName: 'David', lastName: 'Kim', email: 'david.kim@crm.com', role: 'SALES_REP', isActive: false, lastActive: '1 week ago' },
  { id: '8', firstName: 'Rachel', lastName: 'Green', email: 'rachel.green@crm.com', role: 'MANAGER', isActive: true, lastActive: '15 min ago' },
];

const roleConfig = {
  ADMIN: { label: 'Admin', color: 'bg-blue-700 text-white', icon: Crown },
  MANAGER: { label: 'Manager', color: 'bg-purple-700 text-white', icon: Shield },
  SALES_REP: { label: 'Sales Rep', color: 'bg-emerald-600 text-white', icon: Briefcase },
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState<User[]>(mockUsers);

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = users.filter(u => u.isActive).length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const managerCount = users.filter(u => u.role === 'MANAGER').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage team members and their access permissions.</p>
        </div>
        <Button className="h-10 px-6 shadow-lg shadow-primary/20">
          <UserPlus className="mr-2 h-5 w-5" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="p-4 md:p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-2 md:p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/20">
              <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 md:mt-4">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Active Users</p>
            <h3 className="text-xl md:text-2xl font-bold mt-1">{activeCount} <span className="text-sm font-medium text-muted-foreground">/ {users.length}</span></h3>
          </div>
        </div>
        <div className="p-4 md:p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-2 md:p-3 rounded-xl bg-blue-100 dark:bg-blue-500/20">
              <Crown className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3 md:mt-4">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Administrators</p>
            <h3 className="text-xl md:text-2xl font-bold mt-1">{adminCount}</h3>
          </div>
        </div>
        <div className="p-4 md:p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-2 md:p-3 rounded-xl bg-purple-100 dark:bg-purple-500/20">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-3 md:mt-4">
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Managers</p>
            <h3 className="text-xl md:text-2xl font-bold mt-1">{managerCount}</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or role..." 
            className="pl-10 h-10 border-none bg-secondary/50 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-secondary/30 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-muted-foreground/90 dark:text-foreground/70">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 hidden sm:table-cell">Last Active</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 border-t border-slate-100 dark:border-white/5">
              {filteredUsers.map((user) => {
                const role = roleConfig[user.role];
                const RoleIcon = role.icon;
                return (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold border border-primary/20">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{user.firstName} {user.lastName}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm ring-1 ring-black/5", role.color)}>
                        <RoleIcon className="h-3 w-3" />
                        {role.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("h-2.5 w-2.5 rounded-full", user.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-400 dark:bg-slate-600")} />
                        <span className={cn("text-xs font-black uppercase tracking-wider", user.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400")}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground font-medium">{user.lastActive}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary/50">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
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
