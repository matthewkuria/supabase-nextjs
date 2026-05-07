'use client'

import { useActionState } from 'react'
import { login, signup } from "./action"

export default function LoginPage() {
  const [loginState, loginAction, isLoginPending] = useActionState(login, null)
  const [signupState, signupAction, isSignupPending] = useActionState(signup, null)

  // Use the appropriate state based on which action was last called
  const state = loginState || signupState
  const isPending = isLoginPending || isSignupPending

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>
          <p className="text-gray-300 mt-2">
            Login or create an account
          </p>
        </div>

        {/* Error/Success Messages */}
        {state?.error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-200 text-sm">
            {state.error}
          </div>
        )}
        
        {state?.success && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/50 text-green-200 text-sm">
            {state.message}
          </div>
        )}

        {/* Form - Using onSubmit to handle different actions */}
        <form>
          {/* Email */}
          <div className="flex flex-col gap-2 mb-4">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-200"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              disabled={isPending}
              className="w-full rounded-xl border border-gray-600 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 mb-4">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-200"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              minLength={6}
              disabled={isPending}
              className="w-full rounded-xl border border-gray-600 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 pt-4">
            <button
              type="submit"
              formAction={loginAction}
              disabled={isPending}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoginPending ? 'Logging in...' : 'Log In'}
            </button>

            <button
              type="submit"
              formAction={signupAction}
              disabled={isPending}
              className="w-full rounded-xl border border-gray-500 bg-transparent py-3 font-semibold text-white transition hover:bg-white/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSignupPending ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Optional: Password hint */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Password must be at least 6 characters long
        </p>
      </div>
    </div>
  )
}