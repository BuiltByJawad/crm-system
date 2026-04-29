'use client';

import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Smartphone, 
  Globe, 
  Key, 
  Camera,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="bg-secondary/40 dark:bg-white/5 p-1 h-12 inline-flex min-w-max md:min-w-0">
            <TabsTrigger value="profile" className="px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Smartphone className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-6 animate-in fade-in duration-500">
          <div className="rounded-2xl p-6 md:p-8 space-y-8 bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative group">
                <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border border-primary/20 shadow-inner">
                  JD
                </div>
                <button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-transform">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-sm text-muted-foreground font-medium">Administrator • Joined April 2024</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">Online</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" className="bg-secondary/40 dark:bg-white/5 border-none shadow-sm h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" className="bg-secondary/40 dark:bg-white/5 border-none shadow-sm h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" defaultValue="admin@crm.com" className="bg-secondary/40 dark:bg-white/5 border-none shadow-sm pl-10 h-11" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio" 
                    className="flex min-h-[120px] w-full rounded-xl bg-secondary/40 dark:bg-white/5 border-none shadow-sm px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us a little bit about yourself..."
                    defaultValue="Sales administrator with 5+ years of experience in managing high-performance teams."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="h-11 px-8 shadow-lg shadow-primary/20">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-2xl p-6 md:p-8 space-y-6 bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
              </div>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" className="bg-secondary/40 dark:bg-white/5 border-none shadow-sm h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" className="bg-secondary/40 dark:bg-white/5 border-none shadow-sm h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input id="confirmNewPassword" type="password" className="bg-secondary/40 dark:bg-white/5 border-none shadow-sm h-11" />
                </div>
                <Button className="h-11 px-6 shadow-lg shadow-primary/20">Update Password</Button>
              </div>
            </div>

            <div className="rounded-2xl p-6 space-y-6 bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm h-fit">
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                  <Key className="h-5 w-5 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-500">Enable Two-Factor</h4>
                    <p className="text-[11px] text-amber-500/80 leading-relaxed">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full h-11 bg-secondary/40 dark:bg-white/5 border-none shadow-sm hover:bg-secondary/50">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 animate-in fade-in duration-500">
          <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-6">
              {[
                { title: 'Email Notifications', desc: 'Receive updates about your opportunities and contacts.', icon: Globe },
                { title: 'Browser Push', desc: 'Get real-time alerts even when the tab is inactive.', icon: Smartphone },
                { title: 'Direct Messages', desc: 'Notifications when a team member mentions you.', icon: Mail },
                { title: 'Weekly Reports', desc: 'Receive a summary of your sales performance every Monday.', icon: Calendar }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-secondary/50 dark:bg-white/10 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "h-6 w-11 rounded-full relative cursor-pointer transition-colors",
                    idx < 2 ? "bg-primary" : "bg-secondary dark:bg-accent"
                  )}>
                    <div className={cn(
                      "absolute top-1 left-1 h-4 w-4 rounded-full bg-white dark:bg-foreground shadow-sm transition-transform",
                      idx < 2 ? "translate-x-5" : "translate-x-0"
                    )} />
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preferences" className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 md:p-8 space-y-6 bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Appearance</h3>
                <p className="text-sm text-muted-foreground">Customize how the application looks and feels.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Light', active: true, icon: '☀️' },
                      { label: 'Dark', active: false, icon: '🌙' },
                      { label: 'System', active: false, icon: '💻' },
                    ].map((theme) => (
                      <button
                        key={theme.label}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-semibold",
                          theme.active
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-slate-200 dark:border-white/10 hover:border-primary/30"
                        )}
                      >
                        <span className="text-xl">{theme.icon}</span>
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Language</Label>
                  <select className="w-full h-11 rounded-xl bg-secondary/40 dark:bg-white/5 border-none shadow-sm px-4 text-sm font-medium focus:ring-2 focus:ring-primary">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <Label>Timezone</Label>
                  <select className="w-full h-11 rounded-xl bg-secondary/40 dark:bg-white/5 border-none shadow-sm px-4 text-sm font-medium focus:ring-2 focus:ring-primary">
                    <option>UTC-05:00 Eastern Time</option>
                    <option>UTC-06:00 Central Time</option>
                    <option>UTC-07:00 Mountain Time</option>
                    <option>UTC-08:00 Pacific Time</option>
                    <option>UTC+00:00 GMT</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl p-6 space-y-6 bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Date & Time</h3>
                  <p className="text-sm text-muted-foreground">Configure date and time formatting.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Date Format</Label>
                    <select className="w-full h-11 rounded-xl bg-secondary/40 dark:bg-white/5 border-none shadow-sm px-4 text-sm font-medium focus:ring-2 focus:ring-primary">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <Label>Time Format</Label>
                    <div className="flex gap-3">
                      <button className={cn("flex-1 h-11 rounded-xl text-sm font-bold transition-all", "bg-primary text-primary-foreground shadow-sm")}>12 Hour</button>
                      <button className={cn("flex-1 h-11 rounded-xl text-sm font-bold transition-all", "bg-secondary/40 dark:bg-white/5 hover:bg-secondary/50")}>24 Hour</button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Currency</Label>
                    <select className="w-full h-11 rounded-xl bg-secondary/40 dark:bg-white/5 border-none shadow-sm px-4 text-sm font-medium focus:ring-2 focus:ring-primary">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>JPY (¥)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 space-y-4 bg-white dark:bg-card border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Data & Privacy</h3>
                  <p className="text-sm text-muted-foreground">Manage your data and privacy settings.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'Activity Status', desc: 'Show when you are online', on: true },
                    { title: 'Analytics', desc: 'Help improve the product', on: false },
                    { title: 'Data Export', desc: 'Allow exporting your data', on: true },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-bold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <div className={cn(
                        "h-6 w-11 rounded-full relative cursor-pointer transition-colors",
                        item.on ? "bg-primary" : "bg-secondary dark:bg-accent"
                      )}>
                        <div className={cn(
                          "absolute top-1 left-1 h-4 w-4 rounded-full bg-white dark:bg-foreground shadow-sm transition-transform",
                          item.on ? "translate-x-5" : "translate-x-0"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
