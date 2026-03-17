import { useState, useEffect, useCallback } from 'react'
import { useNavigate }  from 'react-router-dom'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { Plus, Save, Trash2, Settings, ArrowLeft, GripHorizontal } from 'lucide-react'
import { getDashboard, saveDashboard, deleteWidget } from '../services/api'
import { getOrders } from '../services/api'
import WidgetConfigModal from '../components/WidgetConfigModal'
import KPIWidget    from '../components/KPIWidget'
import ChartWidget  from '../components/ChartWidget'
import PieWidget    from '../components/PieWidget'
import TableWidget  from '../components/TableWidget'
import { WIDGET_TYPES, getInitWidgetSettings as getInit } from '../constants'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

function renderPreview(widget, orders) {
  const s = widget.settings || {}
  switch (widget.widgetType) {
    case 'kpi':     return <div className="h-full w-full pointer-events-none p-2"><KPIWidget   settings={s} orders={orders} title={widget.title} /></div>
    case 'bar': case 'line': case 'area': case 'scatter':
      return <div className="h-full w-full pointer-events-none p-2"><ChartWidget settings={{ ...s, chartType: widget.widgetType }} orders={orders} title={widget.title} /></div>
    case 'pie':     return <div className="h-full w-full pointer-events-none p-2"><PieWidget   settings={s} orders={orders} title={widget.title} /></div>
    case 'table':   return <div className="h-full w-full pointer-events-none p-2"><TableWidget settings={s} orders={orders} title={widget.title} /></div>
    default:        return <div className="p-8 text-slate-500 text-xs font-black uppercase tracking-widest text-center">Unrecognized Pattern</div>
  }
}

export default function DashboardConfig() {
  const navigate = useNavigate()
  const [widgets, setWidgets]   = useState([])
  const [layout,  setLayout]    = useState([])
  const [orders,  setOrders]    = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editWidget, setEditWidget] = useState(null)
  const [saving, setSaving]     = useState(false)

  const load = useCallback(async () => {
    try {
      const [dashRes, ordRes] = await Promise.all([getDashboard(), getOrders()])
      const w = dashRes.data?.data?.widgets ?? []
      const parsed = w.map((wid, index) => ({
        ...wid,
        settings: wid.settingsJson ? JSON.parse(wid.settingsJson) : {}
      }))
      setWidgets(parsed)
      
      // Map layout explicitly, letting it auto-fill rows based on grid rules (X increments)
      let currentX = 0;
      let currentY = 0;
      let rowMaxH = 0;
      
      const newLayout = parsed.map(wid => {
        const itemW = wid.width ?? 4;
        const itemH = wid.height ?? 3;
        
        // Wrap to next line if it exceeds 12 cols
        if (currentX + itemW > 12) {
          currentX = 0;
          currentY += rowMaxH;
          rowMaxH = 0;
        }
        
        const finalX = (wid.xPosition !== null && wid.xPosition !== undefined) ? wid.xPosition : currentX;
        const finalY = (wid.yPosition !== null && wid.yPosition !== undefined) ? wid.yPosition : currentY;
        
        currentX += itemW;
        rowMaxH = Math.max(rowMaxH, itemH);
        
        return {
          i: String(wid.id ?? wid._tempId),
          x: finalX,
          y: finalY,
          w: itemW,
          h: itemH,
          minW: 2, minH: 2
        }
      });
      
      setLayout(newLayout);
      setOrders(ordRes.data?.data ?? [])
    } catch {}
  }, [])

  useEffect(() => { load() }, [load])

  const handleAddWidget = (widgetConfig) => {
    if (editWidget !== null) {
      setWidgets(prev => prev.map((w, i) => i === editWidget ? { ...w, ...widgetConfig } : w))
      setLayout(prev => prev.map(l => {
        const w = widgets[editWidget]
        const key = String(w.id ?? w._tempId)
        return l.i === key ? { ...l, w: widgetConfig.width ?? l.w, h: widgetConfig.height ?? l.h } : l
      }))
    } else {
      const tempId = `temp_${Date.now()}`
      const newWidget = {
        ...widgetConfig,
        _tempId: tempId,
        xPosition: 0, yPosition: 0,
        width: widgetConfig.width ?? 4,
        height: widgetConfig.height ?? 2,
      }
      setWidgets(prev => [...prev, newWidget])
      setLayout(prev => [...prev, {
        i: tempId,
        x: 0, y: Infinity,
        w: newWidget.width, h: newWidget.height,
        minW: 2, minH: 2
      }])
    }
    setShowModal(false)
    setEditWidget(null)
  }

  const handleDelete = (index) => {
    const w = widgets[index]
    const key = String(w.id ?? w._tempId)
    setWidgets(prev => prev.filter((_, i) => i !== index))
    setLayout(prev => prev.filter(l => l.i !== key))
  }

  const handleEdit = (index) => {
    setEditWidget(index)
    setShowModal(true)
  }

  const handleLayoutChange = (newLayout) => setLayout(newLayout)

  const onDrop = (layout, layoutItem, event) => {
    const widgetType = event.dataTransfer.getData('text/plain')
    const config = getInit(widgetType)
    const tempId = `temp_${Date.now()}`
    
    const newWidget = {
      ...config,
      _tempId: tempId,
      xPosition: layoutItem.x,
      yPosition: layoutItem.y,
      width: config.width || 4,
      height: config.height || 2,
      settings: config // assuming getInit returns the full config including defaults
    }

    setWidgets(prev => [...prev, newWidget])
    setLayout(prev => [...prev, {
      ...layoutItem,
      i: tempId,
      w: newWidget.width,
      h: newWidget.height
    }])
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updatedWidgets = widgets.map((w, idx) => {
        const layoutItem = layout.find(l => l.i === String(w.id ?? w._tempId))
        return {
          id: w.id ?? null,
          widgetType: w.widgetType,
          title: w.title,
          description: w.description ?? '',
          settingsJson: JSON.stringify(w.settings ?? {}),
          width:     layoutItem?.w ?? w.width ?? 4,
          height:    layoutItem?.h ?? w.height ?? 2,
          xPosition: layoutItem?.x ?? w.xPosition ?? 0,
          yPosition: layoutItem?.y ?? w.yPosition ?? 0,
        }
      })
      await saveDashboard({ layoutJson: JSON.stringify(layout), widgets: updatedWidgets })
      await load()
      alert('Dashboard saved successfully!')
    } catch { alert('Failed to save dashboard.') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-8 animate-slide-up relative pb-12">
      {/* Background Decorative Glows */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-600/5 to-transparent pointer-events-none -z-10" />
      <div className="fixed -top-64 -right-64 w-[40rem] h-[40rem] bg-yellow-600/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-6 px-4 relative z-10">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-slate-400 hover:text-yellow-500 transition-all hover:-translate-x-1 active:scale-90 shadow-premium">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-display font-black text-slate-800 dark:text-white tracking-tight">Layout Architect</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-glow" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Spatial Configuration Protocol</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { setEditWidget(null); setShowModal(true) }} className="w-48 h-14 rounded-2xl glass flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-[11px] text-slate-400 hover:text-yellow-500 hover:bg-white/10 transition-all active:scale-95 shadow-premium">
            <Plus size={18} /> Add Component
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary !h-14 !px-10 !rounded-2xl shadow-glow active:scale-95 transition-all flex items-center justify-center gap-3">
            <Save size={18} /> 
            <span className="font-black uppercase tracking-[0.2em] text-[11px]">{saving ? 'Committing…' : 'Finalize Layout'}</span>
          </button>
        </div>
      </div>
      
      <div className="flex gap-8 relative z-10">
        {/* Widget Library Sidebar */}
        <div className="w-80 shrink-0 space-y-6">
          <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-8 sticky top-8">
            <div>
              <h3 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em]">Component Library</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Drag and drop to deploy</p>
            </div>
            
            <div className="space-y-3">
              {WIDGET_TYPES.map(t => (
                <div 
                  key={t.value}
                  draggable={true}
                  unselectable="on"
                  onDragStart={e => e.dataTransfer.setData('text/plain', t.value)}
                  className="glass group/item flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:border-yellow-500/30 cursor-grab active:cursor-grabbing transition-all hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl group-hover/item:scale-110 transition-transform">{t.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/item:text-slate-200">{t.label}</span>
                  </div>
                  <GripHorizontal size={14} className="text-slate-700 group-hover/item:text-yellow-500 transition-colors" />
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
               <p className="text-[9px] font-medium leading-relaxed text-slate-500 text-center italic">
                 "Components dragged onto the canvas will initialize with protocol default parameters."
               </p>
            </div>
          </div>
        </div>

        {/* Grid Layout Canvas */}
        <div className="flex-1 overflow-visible relative">
          <div className="glass bg-white/5 dark:bg-slate-900/20 rounded-[3rem] border border-white/5 shadow-premium min-h-[650px] relative overflow-hidden transition-all group/canvas">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            {widgets.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 animate-pulse">
                <div className="w-24 h-24 rounded-[2rem] glass flex items-center justify-center mb-8 border-white/10">
                  <Plus size={40} className="text-slate-600" />
                </div>
                <p className="font-black uppercase tracking-[0.3em] text-[11px]">Architectural Void Detected</p>
                <p className="text-[10px] uppercase tracking-[0.2em] mt-3 opacity-60">Initialize components to proceed</p>
              </div>
            ) : (
              <ResponsiveGridLayout
                className="layout p-6"
                layouts={{ lg: layout, md: layout.map(l => ({ ...l, w: Math.min(l.w, 8) })), sm: layout.map(l => ({ ...l, w: 4 })) }}
                breakpoints={{ lg: 1200, md: 768, sm: 0 }}
                cols={{ lg: 12, md: 8, sm: 4 }}
                rowHeight={100}
                margin={[24, 24]}
                onLayoutChange={handleLayoutChange}
                onDrop={onDrop}
                isDroppable={true}
                droppingItem={{ i: 'dropping', w: 2, h: 2 }}
                draggableHandle=".drag-handle"
                resizeHandles={['se']}
                compactType="vertical"
                preventCollision={false}
                useCSSTransforms={true}
              >
                {widgets.map((widget, idx) => {
                  const key = String(widget.id ?? widget._tempId)
                  return (
                    <div key={key} className="glass !p-0 !rounded-[2.5rem] border border-white/10 shadow-premium flex flex-col overflow-hidden group hover:border-yellow-500/30 transition-all duration-500 relative">
                      
                      {/* Premium Drag Handle Area */}
                      <div className="drag-handle absolute top-0 left-0 right-0 h-10 cursor-move z-20 group-hover:bg-white/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-500">
                        <div className="w-12 h-1 bg-white/10 rounded-full group-hover:bg-yellow-500/50 transition-colors" />
                      </div>

                      {/* Hover Controls */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-30 flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(idx) }} 
                          className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all shadow-premium active:scale-90" title="Modify Specs">
                          <Settings size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(idx) }} 
                          className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-premium active:scale-90" title="Decommission">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Content Wrapper */}
                      <div className="flex-1 w-full h-full relative z-10 p-2">
                        {renderPreview(widget, orders)}
                      </div>
                      
                      {/* Resize Visual Hint (Bottom Right) */}
                      <div className="absolute bottom-2 right-2 opacity-10 group-hover:opacity-100 transition-opacity pointer-events-none">
                         <div className="w-4 h-4 border-r-2 border-b-2 border-slate-500 rounded-br-sm" />
                      </div>
                    </div>
                  )
                })}
              </ResponsiveGridLayout>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <WidgetConfigModal
          initialData={editWidget !== null ? widgets[editWidget] : null}
          onClose={() => { setShowModal(false); setEditWidget(null) }}
          onSave={handleAddWidget}
        />
      )}
    </div>
  )
}
