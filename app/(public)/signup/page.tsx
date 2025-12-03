'use client'

import { signup, type ActionState } from '@/app/actions'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Spinner className="mr-2" />
          Creating account...
        </>
      ) : (
        'Sign Up'
      )}
    </Button>
  )
}

export default function SignupPage() {
  const [state, formAction] = useActionState<ActionState, FormData>(signup, {})

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-zinc-100">Create Account</CardTitle>
          <CardDescription className="text-zinc-500">Start managing your events today</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="text-zinc-300 hover:text-zinc-100 underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
