'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Avatar from './avatar'

type Claims = {
  sub: string
  email?: string
  [key: string]: unknown
}

export default function AccountForm({ claims }: { claims: Claims | null }) {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatar_url, setAvatarUrl] = useState('')

  const getProfile = useCallback(async () => {
    try {
      if (!claims?.sub) {
        setLoading(false)
        return
      }

      setLoading(true)
      const { data, error, status } = await supabase
        .from('profiles')
        .select('full_name, username, website, avatar_url')
        .eq('id', claims.sub)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        setFullname(data.full_name || '')
        setUsername(data.username || '')
        setWebsite(data.website || '')
        setAvatarUrl(data.avatar_url || '')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to load profile.')
    } finally {
      setLoading(false)
    }
  }, [claims, supabase])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  async function updateProfile() {
    try {
      if (!claims?.sub) {
        alert('You must be logged in.')
        return
      }

      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: claims.sub,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      alert('Profile updated successfully!')
    } catch (error) {
      console.error(error)
      alert('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Header Section */}
        <div className="p-8 border-b border-zinc-800 bg-zinc-900/30">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your public profile and account security.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Avatar row */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-zinc-800/20 border border-zinc-800/50">
            <Avatar
              uid={claims?.sub ?? null}
              url={avatar_url}
              size={80}
              onUpload={(url) => setAvatarUrl(url)}
            />
            <div className="text-center sm:text-left">
              <h3 className="text-white font-medium">Profile Picture</h3>
              <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                A personalized photo helps people recognize you. PNG or JPG preferred.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email - Spans full width */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2 flex items-center justify-between">
                Email Address
                <span className="text-[10px] uppercase tracking-wider bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 border border-zinc-700">
                  Read Only
                </span>
              </label>
              <input
                id="email"
                type="email"
                value={claims?.email ?? ''}
                disabled
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-500 cursor-not-allowed"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-zinc-300">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Matthew Kuria"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="@mkuria"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Website */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="website" className="block text-sm font-medium text-zinc-300">
                Website
              </label>
              <input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={updateProfile}
              disabled={loading || !claims?.sub}
              className="flex-1 bg-white hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-800 rounded-full animate-spin" />
                  Updating...
                </span>
              ) : 'Save Changes'}
            </button>

            <form action="/auth/signout" method="post" className="flex-1">
              <button 
                type="submit" 
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors border border-zinc-700"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}