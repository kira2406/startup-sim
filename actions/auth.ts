'use server'

import { createClient } from '../utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  console.log(`Attempting login for: ${email}`)

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=Could not authenticate user')
    return
  }

  // Session is automatically persisted in cookies by the Supabase SSR client 
  redirect('/menu')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.log("error", error)
    redirect('/login?error=Could not create user')
    return
  }

  // Initialize the new user's game state based on the spec's Initial State
  if (data.user) {
    await supabase.from('games').insert({
      user_id: data.user.id,
      cash: 1000000,
      engineers: 4,
      sales_staff: 2,
      product_quality: 50,
      current_quarter: 1
    })
  }

  redirect('/menu')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}