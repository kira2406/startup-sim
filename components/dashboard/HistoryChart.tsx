import { formatQuarter } from "@/lib/utils"

export default function HistoryChart({ history }: { history: any[] }) {
  if (!history || history.length === 0) {
    return <div className="p-6 text-gray-500 bg-white border rounded">No history yet. Advance a quarter to see results!</div>
  }

  return (
    <div className="bg-white border rounded shadow-sm overflow-hidden text-slate-800">
      <h3 className="p-4 text-lg font-bold border-b bg-gray-50">Last 4 Quarters Performance</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-sm font-semibold text-gray-600">Quarter</th>
            <th className="p-3 text-sm font-semibold text-gray-600">Revenue</th>
            <th className="p-3 text-sm font-semibold text-gray-600">Net Income</th>
            <th className="p-3 text-sm font-semibold text-gray-600">Ending Cash</th>
          </tr>
        </thead>
        <tbody>
          {history.map((turn) => (
            <tr key={turn.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="p-3">{formatQuarter(turn.quarter, true)}</td>
              <td className="p-3">{Number(turn.revenue).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
              <td className={`p-3 font-medium ${Number(turn.net_income) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(turn.net_income).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
              </td>
              <td className="p-3">{Number(turn.cash_end).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}