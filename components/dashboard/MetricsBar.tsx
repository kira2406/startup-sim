export default function MetricsBar({ game }: { game: any }) {
  // Displays cash on hand, revenue, net income, headcount by role, and current quarter 
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 ">
      <div className="p-4 bg-green-300 border-l-4 border-green-500 rounded shadow-sm">
        <p className="text-sm text-slate-800">Cash on Hand</p>
        <p className="text-2xl font-bold">{Number(game.cash).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}</p>
      </div>
      <div className="p-4 bg-blue-300 border-l-4 border-blue-500 rounded shadow-sm">
        <p className="text-sm text-slate-800">Product Quality</p>
        <p className="text-2xl font-bold">{Number(game.product_quality).toFixed(1)} / 100</p>
      </div>
      <div className="p-4 bg-purple-300 border-l-4 border-purple-500 rounded shadow-sm">
        <p className="text-sm text-slate-800">Engineers</p>
        <p className="text-2xl font-bold">{game.engineer_count}</p>
      </div>
      <div className="p-4 bg-orange-300 border-l-4 border-orange-500 rounded shadow-sm">
        <p className="text-sm text-slate-800">Sales Staff</p>
        <p className="text-2xl font-bold">{game.sales_staff_count}</p>
      </div>
    </div>
  )
}