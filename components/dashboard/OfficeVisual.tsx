export default function OfficeVisual({ engineers, sales }: { engineers: number, sales: number }) {
  // Calculate total desk capacity needed (clusters of 4)
  const engCapacity = Math.max(4, Math.ceil(engineers / 4) * 4)
  const salesCapacity = Math.max(4, Math.ceil(sales / 4) * 4)

  const renderDesks = (count: number, capacity: number, role: 'engineer' | 'sales') => {
    const desks = []
    for (let i = 0; i < capacity; i++) {
      const isOccupied = i < count
      // Engineering and Sales are visually distinct 
      const colorClass = role === 'engineer' ? 'bg-indigo-600' : 'bg-teal-500'
      
      desks.push(
        <div key={i} className={`flex flex-col items-center justify-center p-2 border-2 rounded w-16 h-16 ${isOccupied ? 'border-gray-300 bg-gray-50' : 'border-dashed border-gray-200 bg-transparent'}`}>
          {/* Desk Shape */}
          <div className="w-8 h-4 mb-1 bg-gray-200 rounded-sm"></div>
          {/* Employee Dot */}
          {isOccupied ? (
            <div className={`w-4 h-4 rounded-full ${colorClass}`}></div>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-gray-100"></div>
          )}
        </div>
      )
    }
    return desks
  }

  return (
    <div className="p-6 bg-gray-700 border rounded shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-center border-b pb-2">Office Floorplan</h2>
      
      <div className="flex justify-between gap-8">
        {/* Engineering Section */}
        <div className="flex-1 p-4 border-r-2 border-dashed border-gray-200">
          <h3 className="mb-4 font-semibold text-indigo-700 flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
            Engineering
          </h3>
          <div className="flex flex-wrap gap-4">
            {renderDesks(engineers, engCapacity, 'engineer')}
          </div>
        </div>

        {/* Sales & Admin Section */}
        <div className="flex-1 p-4">
          <h3 className="mb-4 font-semibold text-teal-700 flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            Sales & Admin
          </h3>
          <div className="flex flex-wrap gap-4">
            {renderDesks(sales, salesCapacity, 'sales')}
          </div>
        </div>
      </div>
    </div>
  )
}