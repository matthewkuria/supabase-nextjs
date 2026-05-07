'use client'

import { useActionState } from 'react'
import { login, signup } from "./action"

export default function LoginPage() {
  const [loginState, loginAction, isLoginPending] = useActionState(login, null)
  const [signupState, signupAction, isSignupPending] = useActionState(signup, null)

  const state = loginState || signupState
  const isPending = isLoginPending || isSignupPending

  return (
    // Uses the base background and text colors defined in :root
    <div className="min-h-screen flex items-center justify-center p-4">
      
      {/* Uses the .card component class from globals.css */}
      <div className="card w-full max-w-md p-8 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-muted">
            Login or create an account
          </p>
        </div>

        {/* Error Message - Styled with red tints to contrast dark theme */}
        {state?.error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {state.error}
          </div>
        )}
        
        {/* Success Message - Styled with green tints */}
        {state?.success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
            {state.message}
          </div>
        )}

        {/* Form - Input and Label styles are automatically applied via @layer base in globals.css */}
        <form className="space-y-6">
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              disabled={isPending}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              minLength={6}
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {/* Uses .btn-primary component class */}
            <button 
              type="submit" 
              formAction={loginAction} 
              disabled={isPending}
              className="btn-primary w-full"
            >
              {isLoginPending ? 'Logging in...' : 'Log In'}
            </button>
            
            {/* Uses .btn-secondary component class[cite: 1] */}
            <button 
              type="submit" 
              formAction={signupAction} 
              disabled={isPending}
              className="btn-secondary w-full"
            >
              {isSignupPending ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="text-muted text-xs text-center mt-8">
          Password must be at least 6 characters long
        </p>
      </div>
    </div>
  )
}