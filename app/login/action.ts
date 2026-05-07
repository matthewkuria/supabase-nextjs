'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type ActionState = {
  error?: string
  success?: boolean
  message?: string
}

/* =========================================
   LOGIN ACTION
========================================= */

export async function login(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()

  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString().trim()

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login Error:', error.message)
    
    // Return user-friendly error messages
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password' }
    }
    return { error: 'Failed to login. Please try again.' }
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

/* =========================================
   SIGNUP ACTION
========================================= */

export async function signup(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()

  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString().trim()

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Signup Error:', error.message)
    
    if (error.message.includes('User already registered')) {
      return { error: 'Email already registered. Please login instead.' }
    }
    return { error: 'Failed to create account. Please try again.' }
  }

  // Create profile row
  if (authData.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email: authData.user.email,
      full_name: '',
      username: '',
      website: '',
      avatar_url: '',
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error('Profile Insert Error:', profileError.message)
      // You might want to delete the auth user here if profile creation fails
      return { error: 'Account created but profile setup failed. Please contact support.' }
    }
  }

  revalidatePath('/', 'layout')

  // Handle email confirmation flow
  if (!authData.session) {
    return { 
      success: true,
      message: 'Account created! Please check your email to confirm your account.' 
    }
  }

  redirect('/account')
}