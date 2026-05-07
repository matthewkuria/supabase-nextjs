'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  return (
    // Max-width container with top padding
    <div className="max-w-6xl mx-auto pt-20 px-4 text-center">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
          User Management System
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl">
          Secure authentication and profile management for your Next.js applications.
        </p>
        
        <div className="flex gap-4 pt-4">
          {!user ? (
            <>
              <Link href="/login" className="btn-primary">
                Login
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign Up
              </Link>
            </>
          ) : (
            <Link href="/account" className="btn-primary !bg-green-600 hover:!bg-green-500 !text-white">
              Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Features Grid using the .card class from globals.css */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
        <div className="card p-8 text-left group hover:border-zinc-700 transition-colors">
          <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
            <span>🔒</span> Secure
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Protect user data with Row Level Security (RLS) policies and robust Supabase authentication.
          </p>
        </div>
        
        <div className="card p-8 text-left group hover:border-zinc-700 transition-colors">
          <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
            <span>⚡</span> Fast
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Optimized for performance using Next.js 15 server components and streaming.
          </p>
        </div>
        
        <div className="card p-8 text-left group hover:border-zinc-700 transition-colors">
          <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
            <span>🎨</span> Modern
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Beautifully crafted UI built with TypeScript and customized Tailwind CSS utilities.
          </p>
        </div>
      </div>

      {/* Footer styled with variables from globals.css */}
      <footer className="mt-24 py-10 border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">
          Built with Next.js and Supabase
        </p>
      </footer>
    </div>
  )
}