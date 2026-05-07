'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Avatar from './avatar'

type Claims = {
  sub: string
  email?: string
  [key: string]: unknown
}

export default function AccountForm({
  claims,
}: {
  claims: Claims | null
}) {
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

      if (error && status !== 406) {
        throw error
      }

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
    <div className="w-full max-w-3xl mx-auto">
      
      {/* Profile Card */}
      <div className="card p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Account Settings
          </h1>

          <p className="text-muted mt-2">
            Manage your profile information and account details.
          </p>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="mb-4">
            <Avatar
              uid={claims?.sub ?? null}
              url={avatar_url}
              size={150}
              onUpload={(url) => {
                setAvatarUrl(url)
              }}
            />
          </div>

          <p className="text-sm text-muted">
            Upload a profile picture
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Email */}
          <div className="md:col-span-2">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="text"
              value={claims?.email ?? ''}
              disabled
              className="opacity-70 cursor-not-allowed"
            />
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="@johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Website */}
          <div className="md:col-span-2">
            <label htmlFor="website">
              Website
            </label>

            <input
              id="website"
              type="url"
              placeholder="https://yourwebsite.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          
          <button
            onClick={updateProfile}
            disabled={loading || !claims?.sub}
            className="primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>

          <form action="/auth/signout" method="post" className="flex-1">
            <button
              type="submit"
              className="secondary w-full"
            >
              Sign Out
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}