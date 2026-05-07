'use client'

import { useActionState } from 'react'
import { login, signup } from "./action"

export default function LoginPage() {
  const [loginState, loginAction, isLoginPending] = useActionState(login, null)
  const [signupState, signupAction, isSignupPending] = useActionState(signup, null)

  const state = loginState || signupState
  const isPending = isLoginPending || isSignupPending

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '28rem', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>
            Welcome Back
          </h1>
          <p className="text-muted">
            Login or create an account
          </p>
        </div>

        {/* Messages */}
        {state?.error && (
          <div className="card" style={{ 
            marginBottom: '1rem', 
            padding: '0.75rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {state.error}
          </div>
        )}
        
        {state?.success && (
          <div className="card" style={{ 
            marginBottom: '1rem', 
            padding: '0.75rem',
            background: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            color: '#86efac',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {state.message}
          </div>
        )}

        {/* Form */}
        <form>
          <div style={{ marginBottom: '1rem' }}>
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

          <div style={{ marginBottom: '1.5rem' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              type="submit" 
              formAction={loginAction} 
              disabled={isPending}
              className="primary"
              style={{ 
                width: '100%',
                opacity: isPending ? 0.5 : 1,
                cursor: isPending ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoginPending ? 'Logging in...' : 'Log In'}
            </button>
            
            <button 
              type="submit" 
              formAction={signupAction} 
              disabled={isPending}
              className="secondary"
              style={{ 
                width: '100%',
                opacity: isPending ? 0.5 : 1,
                cursor: isPending ? 'not-allowed' : 'pointer'
              }}
            >
              {isSignupPending ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="text-muted text-sm" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          Password must be at least 6 characters long
        </p>
      </div>
    </div>
  )
}