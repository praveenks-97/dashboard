import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#FFCC00', '#F59E0B', '#3B82F6', '#10B981', '#6366F1', '#EC4899', '#8B5CF6']

const FIELD_MAP = {
  id:          o => String(o.id),
  customerName:o => `${o.firstName} ${o.lastName}`,
  email:       o => o.email,
  address:     o => o.streetAddress,
  createdAt:   o => new Date(o.createdAt).toLocaleDateString(),
  product:     o => o.product,
  createdBy:   o => o.createdBy,
  status:      o => o.status,
  totalAmount: o => parseFloat(o.totalAmount ?? 0),
  unitPrice:   o => parseFloat(o.unitPrice   ?? 0),
  quantity:    o => parseInt(o.quantity       ?? 0),
}


export default function PieWidget({ settings = {}, orders = [], title = 'Untitled' }) {
  const { dataField = 'status', showLegend = true } = settings

  const grouped = useMemo(() => {
    if (!orders.length) return []
    const g = {}
    for (const o of orders) {
      const val = FIELD_MAP[dataField]?.(o) || 'Unknown'
      g[val] = (g[val] || 0) + 1
    }
    return Object.entries(g)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [orders, dataField])

  if (!orders.length) {
    return (
       <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-400">
         <div className="text-3xl mb-2">🥧</div>
         <p className="text-xs font-semibold uppercase tracking-wider">{title}</p>
         <p className="text-sm mt-1">No data available for chart</p>
       </div>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, payload: dataPayload } = payload[0]
      const total = grouped.reduce((sum, item) => sum + item.value, 0)
      const percent = ((value / total) * 100).toFixed(1)
      
      return (
        <div className="bg-white dark:bg-dark-800 p-3 rounded-lg shadow-card border border-gray-100 dark:border-gray-700 text-xs text-center border-t-4" style={{borderTopColor: dataPayload.fill}}>
          <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">{name}</p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {value} entries
          </p>
          <p className="text-yellow-600 dark:text-yellow-400 font-bold mt-1 text-sm bg-yellow-50 px-2 py-1 rounded inline-block">
            {percent}%
          </p>
        </div>
      )
    }
    return null
  }


  return (
    <div className="card h-full flex flex-col p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Distribution by {dataField}</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[180px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={grouped}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={2}
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
              className="dark:stroke-slate-800"
            >
              {grouped.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: '#1e293b', fontWeight: 600 }}
              labelStyle={{ color: '#64748b' }}
            />
            {showLegend && (
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className="text-[10px] font-semibold text-slate-500 ml-1">{value}</span>}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-10px] pb-8">
          <span className="text-xl font-bold text-slate-800 dark:text-white leading-none">
            {grouped.reduce((a, b) => a + b.value, 0)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-1">Total</span>
        </div>
      </div>
    </div>
  )
}
