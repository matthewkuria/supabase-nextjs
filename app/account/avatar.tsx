'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClient()
  // FIX: Initialize with null so Image doesn't try to render a raw path string
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let currentUrl: string | null = null

    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) throw error

        currentUrl = URL.createObjectURL(data)
        setAvatarUrl(currentUrl)
      } catch (error) {
        console.error('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)

    // Cleanup function to prevent memory leaks
    return () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl)
    }
  }, [url, supabase])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
      if (uploadError) throw uploadError

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative group" style={{ width: size }}>
      <div 
        className="relative overflow-hidden rounded-full bg-zinc-800 border border-zinc-700 shadow-inner"
        style={{ height: size, width: size }}
      >
        {avatarUrl ? (
          <Image
            fill
            src={avatarUrl}
            alt="Avatar"
            className="object-cover transition-opacity duration-300"
            unoptimized // Necessary for blob URLs
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500">
            <svg className="w-1/2 h-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}

        {/* Upload Overlay */}
        <label 
          className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${uploading ? 'opacity-100' : ''}`}
          htmlFor="single"
        >
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
            {uploading ? '...' : 'Edit'}
          </span>
        </label>
      </div>

      <input
        className="hidden"
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
    </div>
  )
}