import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { api } from '@/lib/axios'
import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Activity, Lock, Mail, ArrowRight, Sparkles, Shield, Zap, UserCog, User, ShieldCheck } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const LoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof LoginSchema>

type LoginResponse = {
  user: { id: string; email: string; role: string; userType?: string; staffId?: string }
  accessExpires: string
}

// Demo credentials
const DEMO_CREDENTIALS = {
  admin: {
    email: 'at.divv@gmail.com',
    password: '@edpADMIN',
    label: 'Admin',
    icon: ShieldCheck,
  },
  staff: {
    email: 'staff@hospital.com',
    password: 'staff123',
    label: 'Staff/Doctor',
    icon: UserCog,
  },
  patient: {
    email: 'patient@hospital.com',
    password: 'patient123',
    label: 'Patient',
    icon: User,
  },
}

export default function Login() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showDemoOptions, setShowDemoOptions] = useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: (values: LoginValues) =>
      api.post<LoginResponse, LoginValues>('/auth/login', values),
    onSuccess: (data) => {
      setSession({ user: data.user, accessExpires: data.accessExpires })
      navigate('/dashboard')
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Login failed. Please check your credentials.')
    },
  })

  function onSubmit(values: LoginValues) {
    setErrorMessage(null)
    mutate(values)
  }

  function handleDemoLogin(role: keyof typeof DEMO_CREDENTIALS) {
    const credentials = DEMO_CREDENTIALS[role]
    form.setValue('email', credentials.email)
    form.setValue('password', credentials.password)
    setErrorMessage(null)
    mutate({ email: credentials.email, password: credentials.password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 size-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 size-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding and Info */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 p-8 animate-slide-in-bottom">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-14 rounded-2xl bg-linear-to-br from-primary to-accent shadow-xl">
                <Activity className="size-8 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">MedFlow Insights</h1>
                <p className="text-muted-foreground">Hospital Operations Suite</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight mt-8">
              Welcome back to your
              <span className="block gradient-text mt-2">Healthcare Command Center</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Access your comprehensive hospital management platform. Streamline operations, enhance patient care, and drive excellence.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 glass-effect rounded-xl border border-border/50">
              <div className="flex items-center justify-center size-10 rounded-lg bg-success/20 shrink-0">
                <Shield className="size-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">Bank-level encryption & HIPAA compliance</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 glass-effect rounded-xl border border-border/50">
              <div className="flex items-center justify-center size-10 rounded-lg bg-primary/20 shrink-0">
                <Zap className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-Time Access</h3>
                <p className="text-sm text-muted-foreground">Instant updates across all departments</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 glass-effect rounded-xl border border-border/50">
              <div className="flex items-center justify-center size-10 rounded-lg bg-accent/20 shrink-0">
                <Sparkles className="size-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">Smart analytics for better decisions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center items-center animate-slide-in-right">
          <Card className="w-full max-w-md glass-effect border-2 border-border/50 shadow-2xl">
            <CardHeader className="space-y-3 text-center">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-linear-to-br from-primary to-accent shadow-lg">
                    <Activity className="size-6 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold gradient-text text-xl">MedFlow</div>
                    <div className="text-xs text-muted-foreground">Insights</div>
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription className="text-base">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email" className="font-semibold">Email Address</Label>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              autoComplete="email"
                              placeholder="you@hospital.com"
                              className="pl-11 h-12 bg-background/50 border-2 focus:border-primary transition-colors"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password" className="font-semibold">Password</Label>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                            <Input
                              id="password"
                              type="password"
                              autoComplete="current-password"
                              placeholder="••••••••"
                              className="pl-11 h-12 bg-background/50 border-2 focus:border-primary transition-colors"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="remember" className="size-4 rounded border-border" />
                      <label htmlFor="remember" className="text-sm text-muted-foreground">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                      Forgot Password?
                    </Link>
                  </div>

                  {errorMessage && (
                    <Alert variant="destructive" className="animate-slide-in-bottom">
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg text-base font-semibold group"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or try demo</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-2"
                onClick={() => setShowDemoOptions(!showDemoOptions)}
                disabled={isPending}
              >
                <Sparkles className="size-4 mr-2" />
                {showDemoOptions ? 'Hide Demo Options' : 'Quick Demo Login'}
              </Button>

              {showDemoOptions && (
                <div className="grid grid-cols-1 gap-2 animate-slide-in-bottom">
                  {Object.entries(DEMO_CREDENTIALS).map(([key, cred]) => {
                    const Icon = cred.icon
                    return (
                      <Button
                        key={key}
                        type="button"
                        variant="outline"
                        className="w-full justify-start border-2 hover:bg-primary/5 hover:border-primary"
                        onClick={() => handleDemoLogin(key as keyof typeof DEMO_CREDENTIALS)}
                        disabled={isPending}
                      >
                        <Icon className="size-4 mr-2" />
                        <span className="flex-1 text-left">{cred.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {cred.email.split('@')[0]}
                        </span>
                      </Button>
                    )
                  })}
                </div>
              )}
            </CardContent>
            
            <Separator />
            
            <CardFooter className="flex flex-col gap-4 pt-6">
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-primary hover:underline">
                  Sign up now
                </Link>
              </div>
              <div className="text-center text-xs text-muted-foreground">
                Protected by enterprise-grade security
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
