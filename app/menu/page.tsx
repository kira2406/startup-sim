// app/menu/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { startNewGame } from '@/actions/game'
import Navbar from '@/components/ui/Navbar'

export default async function MenuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's current game status
  const { data: game } = await supabase
    .from('games')
    .select('status, current_quarter')
    .eq('user_id', user.id)
    .single()

  const hasActiveGame = game?.status === 'active'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add Navbar at the top */}
      <Navbar />
    <main className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md p-8 text-center bg-white border rounded shadow-md">
        <h1 className="mb-6 text-3xl font-bold">Startup Simulator</h1>
        
        {game && game.status !== 'active' && (
          <div className="p-4 mb-6 rounded bg-blue-50">
            <p className="font-semibold text-blue-800">
              {game.status === 'won' ? '🎉 You won your last game!' : '📉 Your startup went bankrupt.'}
            </p>
            <p className="text-sm text-blue-600">You made it to Quarter {game.current_quarter}.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {hasActiveGame && (
            <Link 
              href="/dashboard" 
              className="w-full p-3 font-bold text-white bg-green-600 rounded hover:bg-green-700"
            >
              Continue Game (Q{game.current_quarter})
            </Link>
          )}

          <form action={startNewGame}>
            <button 
              type="submit" 
              className={`w-full p-3 font-bold rounded ${
                hasActiveGame 
                  ? 'text-gray-700 bg-gray-200 hover:bg-gray-300' 
                  : 'text-white bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {hasActiveGame ? 'Abandon & Start New Game' : 'Start New Game'}
            </button>
          </form>
        </div>
      </div>
    </main>
    </div>
  )
}