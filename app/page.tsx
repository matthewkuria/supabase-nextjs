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
    <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
      {/* Hero */}
      <div className="flex-center" style={{ flexDirection: 'column' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          User Management System
        </h1>
        
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '2rem' }}>
          Secure authentication and profile management for your Next.js applications
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {!user ? (
            <>
              <Link href="/login">
                <button className="primary">Login</button>
              </Link>
              <Link href="/login">
                <button className="secondary">Sign Up</button>
              </Link>
            </>
          ) : (
            <Link href="/account">
              <button className="primary" style={{ background: '#22c55e' }}>
                Dashboard
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginTop: '4rem'
      }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3>🔒 Secure</h3>
          <p className="text-sm">RLS policies and Supabase auth</p>
        </div>
        
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3>⚡ Fast</h3>
          <p className="text-sm">Next.js 15 server components</p>
        </div>
        
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3>🎨 Modern</h3>
          <p className="text-sm">TypeScript + Tailwind CSS</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border)' }}>
        <p className="text-muted text-sm">Built with Next.js and Supabase</p>
      </footer>
    </div>
  )
}