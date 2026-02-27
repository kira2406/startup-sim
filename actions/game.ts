// actions/game.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function startNewGame() {
  const supabase = await createClient()
  
  // 1. Verify user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }
  
  console.log("Starting new game for user:", user.email, user.id)
  // 2. Delete existing game and deletes turn_history by cascading
  await supabase.from('games').delete().eq('user_id', user.id)

  // 3. Insert fresh initial state based on the simulation spec
  await supabase.from('games').insert({
    user_id: user.id,
    cash: 1000000,       // $1,000,000 initial cash
    engineer_count: 4,   // 4 initial engineers
    sales_staff_count: 2,      // 2 initial sales staff
    product_quality: 50, // 50 initial product quality
    current_quarter: 1,
    status: 'active',
    engineer_to_be_hired: 4,
    sales_to_be_hired: 2,
  })

  // 4. Send user to the dashboard to play
  redirect('/dashboard')
}