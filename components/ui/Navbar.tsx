import Link from 'next/link'
import { logout } from '@/actions/auth'

export default function Navbar({ showBack = false }: { showBack?: boolean }) {
  return (
    <nav className="flex items-center justify-between p-4 text-white bg-slate-800 shadow-md">
      <div>
        {showBack ? (
          <Link 
            href="/menu" 
            className="px-4 py-2 text-sm font-semibold transition-colors bg-slate-700 rounded hover:bg-slate-600"
          >
            &larr; Back to Menu
          </Link>
        ) : (
          <span className="text-xl font-bold tracking-tight">Startup Simulator</span>
        )}
      </div>
      
      <form action={logout}>
        <button 
          type="submit" 
          className="px-4 py-2 text-sm font-semibold transition-colors bg-red-600 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </form>
    </nav>
  )
}