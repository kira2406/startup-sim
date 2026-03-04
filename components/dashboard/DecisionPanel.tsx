'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface GameData {
  id: string;
  status: string;
  engineer_count: number;
  sales_staff_count: number;
  price?: number; 
  salary_pct?: number;
  engineer_to_be_hired?: number;
  sales_to_be_hired?: number;
}

export default function DecisionPanel({ game }: { game: GameData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // The player's decisions for the CURRENT quarter
  const [price, setPrice] = useState(game.price || 100)
  const [salaryPct, setSalaryPct] = useState(game.salary_pct || 100) 
  const [engineersToHire, setEngineersToHire] = useState(game.engineer_to_be_hired || 4)
  const [salesToHire, setSalesToHire] = useState(game.sales_to_be_hired || 2)

  // The current total number of employees 
  const currentTotalEngineers = game.engineer_count
  const currentTotalSales = game.sales_staff_count
  
  // The projected number of employees in next quarter
  const projectedTotalEngineers = currentTotalEngineers + engineersToHire
  const projectedTotalSales = currentTotalSales + salesToHire

  const handleAdvance = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/advance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price,
        salary_pct: salaryPct,
        engineer_to_be_hired: engineersToHire,
        sales_to_be_hired: salesToHire,
      })
    })

    if (res.ok) {
      router.refresh()
    } else {
      const data = await res.json()
      alert(`Error: ${data.error}`)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleAdvance} className="p-6 bg-white border rounded shadow-sm text-slate-800">
      <h2 className="mb-4 text-xl font-bold ">Quarterly Decisions</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Unit Price ($)</label>
          <input type="number" min="0" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Salary (% of Avg)</label>
          <input type="number" min="1" value={salaryPct} onChange={e => setSalaryPct(Number(e.target.value))} className="w-full p-2 border rounded" required />
        </div>
        
        {/* Engineering Hiring Input */}
        <div className="p-3 bg-indigo-50 rounded border border-indigo-100">
          <label className="block text-sm font-medium text-indigo-900">Hire Engineers ($5k ea)</label>
          <input type="number" min="0" value={engineersToHire} onChange={e => setEngineersToHire(Number(e.target.value))} className="w-full p-2 mt-1 border rounded" required />
          <p className="mt-2 text-xs text-indigo-700">
            Current: {currentTotalEngineers} &rarr; Projected: <span className="font-bold">{projectedTotalEngineers}</span>
          </p>
        </div>

        {/* Sales Hiring Input */}
        <div className="p-3 bg-teal-50 rounded border border-teal-100">
          <label className="block text-sm font-medium text-teal-900">Hire Sales ($5k ea)</label>
          <input type="number" min="0" value={salesToHire} onChange={e => setSalesToHire(Number(e.target.value))} className="w-full p-2 mt-1 border rounded" required />
          <p className="mt-2 text-xs text-teal-700">
            Current: {currentTotalSales} &rarr; Projected: <span className="font-bold">{projectedTotalSales}</span>
          </p>
        </div>
      </div>

      <button disabled={loading || game.status !== 'active'} type="submit" className="w-full p-3 font-bold text-white bg-blue-600 rounded disabled:bg-gray-400">
        {loading ? 'Processing...' : 'Advance Quarter'}
      </button>
    </form>
  )
}