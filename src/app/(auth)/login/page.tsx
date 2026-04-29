'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { setAuthToken } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="w-full max-w-[400px] space-y-6 md:space-y-8 glass p-6 md:p-10 rounded-3xl animate-in fade-in zoom-in duration-500">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Sign in</h1>
          <p className="text-sm md:text-base text-muted-foreground text-balance">Enter your credentials to access your account</p>
        </div>

        <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" required>Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                error={errors.email}
                disabled={loading}
                className="h-10 md:h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" required>Password</Label>
                <a href="/forgot-password" className="text-xs text-primary hover:underline whitespace-nowrap">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                error={errors.password}
                disabled={loading}
                className="h-10 md:h-11"
              />
            </div>
          </div>

          {errors.form && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium animate-in shake">
              {errors.form}
            </div>
          )}

          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}
