import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Calendar, RefreshCw, ChevronUp } from 'lucide-react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { getOrders, getDashboard } from '../services/api'
import KPIWidget    from '../components/KPIWidget'
import ChartWidget  from '../components/ChartWidget'
import PieWidget    from '../components/PieWidget'
import TableWidget  from '../components/TableWidget'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const DATE_OPTIONS = [
  { label: 'All Time',    value: 'all' },
  { label: 'Today',       value: 'today' },
  { label: 'Last 7 Days', value: 'last7days' },
  { label: 'Last 30 Days',value: 'last30days' },
  { label: 'Last 90 Days',value: 'last90days' },
]

function renderWidget(widget, orders) {
  const settings = widget.settings ? (typeof widget.settings === 'string' ? JSON.parse(widget.settings) : widget.settings) : {}
  switch (widget.widgetType) {
    case 'kpi':     return <KPIWidget   settings={settings} orders={orders} title={widget.title} />
    case 'bar':
    case 'line':
    case 'area':
    case 'scatter': return <ChartWidget settings={{ ...settings, chartType: widget.widgetType }} orders={orders} title={widget.title} />
    case 'pie':     return <PieWidget   settings={settings} orders={orders} title={widget.title} />
    case 'table':   return <TableWidget settings={settings} orders={orders} title={widget.title} />
    default:        return <div className="p-4 text-sm text-gray-400">Unknown widget</div>
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [orders,  setOrders]  = useState([])
  const [widgets, setWidgets] = useState([])
  const [date,    setDate]    = useState('all')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [ordRes, dashRes] = await Promise.all([getOrders(date), getDashboard()])
      setOrders(ordRes.data?.data ?? [])
      const w = dashRes.data?.data?.widgets ?? []
      
      // Calculate layout for 3 widgets per row (4 columns each in a 12-col grid)
      let currentX = 0;
      let currentY = 0;
      let rowMaxH = 0;

      const mappedWidgets = w.map((wid, idx) => {
        const itemW = wid.width || 4;
        const itemH = wid.height || 4;

        // Auto-wrap logic for 3 per row if position is not explicitly set
        if (currentX + itemW > 12) {
          currentX = 0;
          currentY += rowMaxH;
          rowMaxH = 0;
        }

        const layout = { 
          i: String(wid.id), 
          x: (wid.xPosition !== undefined && wid.xPosition !== null) ? wid.xPosition : currentX, 
          y: (wid.yPosition !== undefined && wid.yPosition !== null) ? wid.yPosition : currentY, 
          w: itemW, 
          h: itemH 
        };

        // Advance counters
        currentX += itemW;
        rowMaxH = Math.max(rowMaxH, itemH);

        return { ...wid, ...layout, settings: wid.settingsJson ? JSON.parse(wid.settingsJson) : {} };
      });

      setWidgets(mappedWidgets);
    } catch { setOrders([]); setWidgets([]) }
    finally { setLoading(false) }
  }, [date])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
        <div>
          <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-600/5 to-transparent pointer-events-none -z-10" />
          <div className="fixed -top-64 -right-64 w-[40rem] h-[40rem] bg-yellow-600/5 rounded-full blur-[150px] pointer-events-none -z-10" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-glow" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Analytics Infrastructure Health</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Date filter */}
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              className="input-field !h-9 pl-9 !pr-8 !w-40 appearance-none bg-white dark:bg-slate-800 text-[11px] font-semibold uppercase tracking-tight cursor-pointer hover:border-slate-400 transition-colors"
              value={date}
              onChange={e => setDate(e.target.value)}
            >
              {DATE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          
          <button onClick={load} className="h-9 px-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-yellow-600 hover:border-yellow-600 transition-colors" title="Sync">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button onClick={() => navigate('/dashboard/config')} className="btn-primary !h-9 !px-4 flex items-center gap-2">
            <Settings size={14} /> 
            <span className="text-xs">Configure</span>
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!loading && widgets.length === 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center py-24 text-center rounded-lg shadow-sm">
          <div className="w-16 h-16 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6">
            <Settings size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Widgets Configured</h3>
          <p className="text-sm text-slate-500 mb-8 max-w-xs">
            Start by adding analytical modules to your workspace.
          </p>
          <button onClick={() => navigate('/dashboard/config')} className="btn-primary !h-10 !px-6">
            Add First Widget
          </button>
        </div>
      )}

      {/* Widget Grid */}
      {widgets.length > 0 && (
        <ResponsiveGridLayout
          className="layout -mx-2"
          layouts={{ lg: widgets, md: widgets.map(l => ({ ...l, w: Math.min(l.w, 8) })), sm: widgets.map(l => ({ ...l, w: 4 })) }}
          breakpoints={{ lg: 1200, md: 768, sm: 0 }}
          cols={{ lg: 12, md: 8, sm: 4 }}
          rowHeight={100}
          isDraggable={false}
          isResizable={false}
          margin={[16, 16]}
          useCSSTransforms={true}
        >
          {widgets.map(widget => (
            <div key={widget.i} className="bg-transparent rounded-lg flex flex-col overflow-hidden">
              <div className="flex-1 w-full h-full">
                {renderWidget(widget, orders)}
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  )
}
