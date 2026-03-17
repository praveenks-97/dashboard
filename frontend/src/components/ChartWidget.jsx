import { useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'
import { Activity } from 'lucide-react'

const fmt = v => typeof v === 'number' ? v.toLocaleString() : v

const FIELD_MAP = {
  id:          o => String(o.id),
  customerName:o => `${o.firstName} ${o.lastName}`,
  email:       o => o.email,
  address:     o => o.streetAddress,
  createdAt:   o => new Date(o.createdAt).toLocaleDateString(), // mapping duration/date
  product:     o => o.product,
  createdBy:   o => o.createdBy,
  status:      o => o.status,
  totalAmount: o => parseFloat(o.totalAmount ?? 0),
  unitPrice:   o => parseFloat(o.unitPrice   ?? 0),
  quantity:    o => parseInt(o.quantity       ?? 0),
}

export default function ChartWidget({ settings = {}, orders = [], title = 'Untitled' }) {
  const { widgetType = 'bar', xAxis = 'product', yAxis = 'totalAmount', color = '#FFCC00', showLabels = false } = settings

  const grouped = useMemo(() => {
    if (!orders.length) return []
    const g = {}
    for (const o of orders) {
      const x = FIELD_MAP[xAxis]?.(o) || 'Unknown'
      const y = FIELD_MAP[yAxis]?.(o) || 0
      
      if (!g[x]) g[x] = { name: x, value: 0, count: 0 }
      // If Y is numeric, sum it. Otherwise, count occurrences.
      if (typeof y === 'number') {
        g[x].value += y
      } else {
        g[x].value += 1 // Fallback to counting if non-numeric Y-Axis metric
      }
      g[x].count += 1
    }
    return Object.values(g).sort((a,b) => b.value - a.value)
  }, [orders, xAxis, yAxis])

  if (!orders.length) {
    return (
       <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-400">
         <div className="text-3xl mb-2">📉</div>
         <p className="text-xs font-semibold uppercase tracking-wider">{title}</p>
         <p className="text-sm mt-1">No data available for chart</p>
       </div>
    )
  }

  const colors = {
    bar: color || '#FFCC00',
    line: color || '#FFCC00',
    area: color || '#FFCC00',
    scatter: color || '#FFCC00',
  }

  const renderChart = () => {
    const defaultProps = {
      data: grouped,
      margin: { top: 10, right: 10, left: -20, bottom: 0 }
    }

    const commonAxes = (
      <>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" className="dark:stroke-slate-700/50" />
        <XAxis 
          dataKey="name" 
          tick={{fontSize: 10, fill: '#64748b'}} 
          tickLine={false} 
          axisLine={false} 
          dy={10}
        />
        <YAxis 
          tickFormatter={fmt} 
          tick={{fontSize: 10, fill: '#64748b'}} 
          tickLine={false} 
          axisLine={false} 
          width={60}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
          itemStyle={{ color: '#1e293b', fontWeight: 600 }}
          labelStyle={{ color: '#64748b', marginBottom: '4px' }}
        />
      </>
    )

    switch(widgetType) {
      case 'line':
        return (
          <LineChart {...defaultProps}>
            {commonAxes}
            <Line type="monotone" dataKey="value" name={yAxis} stroke={colors.line} strokeWidth={2} dot={{r:3}} activeDot={{r:5}} />
          </LineChart>
        )
      case 'area':
        return (
          <AreaChart {...defaultProps}>
            {commonAxes}
            <Area type="monotone" dataKey="value" name={yAxis} stroke={colors.area} fill={colors.area} fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        )
      case 'scatter':
        return (
          <ScatterChart {...defaultProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="name" name={xAxis} tick={{fontSize: 10, fill: '#64748b'}} />
            <YAxis dataKey="value" name={yAxis} tickFormatter={fmt} tick={{fontSize: 10, fill: '#64748b'}} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name={`${xAxis} vs ${yAxis}`} data={grouped} fill={colors.bar} />
          </ScatterChart>
        )
      case 'bar':
      default:
        return (
          <BarChart {...defaultProps}>
            {commonAxes}
            <Bar dataKey="value" name={yAxis} fill={colors.bar} radius={[2, 2, 0, 0]} barSize={24} />
          </BarChart>
        )
    }
  }

  return (
    <div className="card h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Analytics over {xAxis}</p>
        </div>
        <Activity size={14} className="text-slate-300" />
      </div>

      <div className="flex-1 w-full min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
