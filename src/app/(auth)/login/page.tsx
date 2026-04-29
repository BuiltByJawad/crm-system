'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { setAuthToken } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Briefcase, ShieldCheck, Zap } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address'
    if (!password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    setLoading(true)
    setErrors({}) // Clear existing errors
    try {
      const response = await authApi.login({ email, password })

      if (response.success && response.data) {
        setAuthToken(response.data.token)
        router.push('/dashboard')
      } else {
        setErrors({ form: response.error?.message || 'Login failed' })
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setErrors({ form: err.message || 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 md:grid-cols-2">
        <section className="hidden md:flex flex-col justify-between p-10 lg:p-14">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Nexus CRM</span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl font-black tracking-tight leading-[1.05]">
              Welcome back.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Sign in to manage your pipeline, follow-ups, and team performance.
            </p>

            <div className="grid gap-4">
              <div className="flex items-start gap-3 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/40 p-4">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Fast workflows</p>
                  <p className="text-sm text-muted-foreground">Create contacts and opportunities in seconds.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/40 p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Secure by design</p>
                  <p className="text-sm text-muted-foreground">Role-based access and token-based auth.</p>
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
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Sign in</h2>
                <p className="text-sm md:text-base text-muted-foreground">Use your work email to continue.</p>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" required>Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      error={errors.email}
                      disabled={loading}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" required>Password</Label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline whitespace-nowrap">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      error={errors.password}
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
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="font-semibold text-primary hover:underline">
                    Create an account
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
