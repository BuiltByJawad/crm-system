'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Briefcase, ShieldCheck, BarChart3 } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const { confirmPassword: _, ...registerData } = formData;
      const response = await authApi.register(registerData);

      if (response.success) {
        router.push('/login?registered=true');
      } else {
        setErrors({ form: response.error?.message || 'Registration failed' });
      }
    } catch (err) {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 md:grid-cols-2">
        <section className="hidden md:flex flex-col justify-between p-10 lg:p-14 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200/60 dark:border-zinc-800/60">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Nexus CRM</span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl font-black tracking-tight leading-[1.05]">
              Start closing deals faster.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Create your workspace and start tracking contacts and opportunities in minutes.
            </p>

            <div className="grid gap-4">
              <div className="flex items-start gap-3 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-background p-4">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Pipeline visibility</p>
                  <p className="text-sm text-muted-foreground">Keep every deal stage visible and actionable.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-background p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Audit-ready security</p>
                  <p className="text-sm text-muted-foreground">Secure defaults and role-based access.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">© 2024 Nexus CRM</p>
        </section>

        <section className="flex items-center justify-center p-4 md:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <div className="md:hidden mb-8">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <Briefcase className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">Nexus CRM</span>
              </Link>
            </div>

            <div className="glass rounded-3xl p-6 md:p-10">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Create account</h2>
                <p className="text-sm md:text-base text-muted-foreground">Use your work email to get started.</p>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" required>First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        disabled={loading}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" required>Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        disabled={loading}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" required>Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      inputMode="email"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                      error={errors.email}
                      disabled={loading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" required>Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                      error={errors.password}
                      disabled={loading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" required>Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                      error={errors.confirmPassword}
                      disabled={loading}
                      className="h-11"
                    />
                  </div>
                </div>

                {errors.form && (
                  <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium animate-in shake">
                    {errors.form}
                  </div>
                )}

                <Button type="submit" className="w-full h-12 text-base font-semibold rounded-2xl" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating account...
                    </span>
                  ) : (
                    'Create account'
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

