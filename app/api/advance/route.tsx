import { createClient } from '../../../utils/supabase/server'
import { NextResponse } from 'next/server'
import { calculateNextTurn } from '@/lib/game-engine'
import { z } from 'zod'

// Define the strict validation schema for player inputs
const DecisionSchema = z.object({
  price: z.number().min(0, "Price cannot be negative"),
  salary_pct: z.number().min(1, "Salary percentage must be at least 1"),
  engineer_to_be_hired: z.number().int("Must be a whole number").min(0, "Cannot hire negative engineers"),
  sales_to_be_hired: z.number().int("Must be a whole number").min(0, "Cannot hire negative sales staff")
})

export async function POST(request: Request) {
  const supabase = await createClient()

  // 1. Authenticate the request
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 2. Parse player decisions: unit price, new engineers, new sales, salary pct
    const body = await request.json()
    const validation = DecisionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors }, 
        { status: 400 }
      )
    }

    const decisions = validation.data

    // 3. Fetch current game state from the server (Server-Authoritative)
    const { data: gameState, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (gameError || !gameState) {
      return NextResponse.json({ error: 'Game state not found' }, { status: 404 })
    }
    
    // Prevent advancing if the game is already won or lost
    if (gameState.status !== 'active') {
      return NextResponse.json({ error: 'Game is already over' }, { status: 400 })
    }

    // 4. Run the simulation model on the server
    const { newState, metrics } = calculateNextTurn(gameState, decisions)

    // 5. Check Win/Lose conditions
    let newStatus = 'active'
    if (newState.cash <= 0) {
      newStatus = 'lost' // Bankrupt
    } else if (newState.current_quarter > 40) {
      // Completing 10 Years with positive cash is a win
      newStatus = 'won' 
    }

    // 6. Persist the updated game state
    const { error: rpcError } = await supabase.rpc('advance_game_turn', {
      p_game_id: gameState.id,
      p_cash: newState.cash,
      p_engineer_count: newState.engineer_count,
      p_sales_staff_count: newState.sales_staff_count,
      p_quality: newState.product_quality,
      p_quarter: newState.current_quarter,
      p_status: newStatus,
      p_price: decisions.price,
      p_salary_pct: decisions.salary_pct,
      p_engineer_to_be_hired: decisions.engineer_to_be_hired,
      p_sales_to_be_hired: decisions.sales_to_be_hired,
      p_revenue: metrics.revenue,
      p_net_income: metrics.net_income
    })

    if (rpcError) {
      throw new Error(`Transaction failed: ${rpcError.message}`)
    }

    // 8. Return success so the client can refresh
    return NextResponse.json({ success: true, status: newStatus })

  } catch (error: any) {
    console.error('API /advance error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}