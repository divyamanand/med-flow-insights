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

const LoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof LoginSchema>

type LoginResponse = {
  user: { id: string; email: string; role: string; userType?: string; staffId?: string }
  accessExpires: string
}

export default function Login() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
      setErrorMessage(err?.message || 'Login failed')
    },
  })

  function onSubmit(values: LoginValues) {
    setErrorMessage(null)
    mutate(values)
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>LOGIN</CardTitle>
          <CardDescription>Access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...field} />
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
                    <Label htmlFor="password">Password</Label>
                    <FormControl>
                      <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm underline underline-offset-4 hover:text-primary">
                  Forgot Password?
                </Link>
              </div>
              {errorMessage ? (
                <div role="alert" className="text-sm text-destructive">
                  {errorMessage}
                </div>
              ) : null}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Logging in…' : 'LOGIN'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <Separator className="my-2" />
        <CardFooter className="justify-center">
          <span className="text-sm text-muted-foreground">Need an account?</span>
          <Link to="/signup" className="ml-2 text-sm underline underline-offset-4 hover:text-primary">
            Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
