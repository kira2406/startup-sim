// app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DecisionPanel from '@/components/dashboard/DecisionPanel'
import MetricsBar from '@/components/dashboard/MetricsBar'
import HistoryChart from '@/components/dashboard/HistoryChart'
import OfficeVisual from '@/components/dashboard/OfficeVisual'
import Navbar from '@/components/ui/Navbar'
import { formatQuarter } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Verify Authentication and Session Persistence
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. Fetch current game state
  const { data: game, error: gameError } = await supabase
    .from('games')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (gameError || !game) {
    return <div>Error loading game state. Please contact support.</div>
  }

  // 3. Fetch the last 4 quarters of history
  const { data: history } = await supabase
    .from('turn_history')
    .select('*')
    .eq('game_id', game.id)
    .order('quarter', { ascending: false })
    .limit(4)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add Navbar with the back button enabled */}
      <Navbar showBack={true} />
    <main className="container p-8 mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Startup Simulator</h1>
        <div className="text-xl font-semibold text-slate-800">{formatQuarter(game.current_quarter)}</div>
      </header>

      {/* Renders cash, revenue, net income, headcount */}
      <MetricsBar game={game} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Form for unit price, new hires, and salary */}
          <DecisionPanel game={game} />
          
          <div className="mt-8">
            {/* Chart or table of historical data */}
            <HistoryChart history={history || []} />
          </div>
        </div>

        <div>
          {/* Visual representation of the startup */}
          <OfficeVisual 
            engineers={game.engineer_count} 
            sales={game.sales_staff_count} 
          />
        </div>
      </div>
    </main>
    </div>
  )
}