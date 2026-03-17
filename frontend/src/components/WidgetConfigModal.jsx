import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { WIDGET_TYPES, getInitWidgetSettings as getInit } from '../constants'

const KPI_METRICS = [
  { value: 'id', label: 'Customer ID' },
  { value: 'customerName', label: 'Customer name' },
  { value: 'email', label: 'Email id' },
  { value: 'address', label: 'Address' },
  { value: 'createdAt', label: 'Order date' },
  { value: 'product', label: 'Product' },
  { value: 'createdBy', label: 'Created by' },
  { value: 'status', label: 'Status' },
  { value: 'totalAmount', label: 'Total amount' },
  { value: 'unitPrice', label: 'Unit price' },
  { value: 'quantity', label: 'Quantity' }
]
const NUMERIC_METRICS = ['id', 'totalAmount', 'unitPrice', 'quantity']

const CHART_AXES = [
  { value: 'product', label: 'Product' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'unitPrice', label: 'Unit price' },
  { value: 'totalAmount', label: 'Total amount' },
  { value: 'status', label: 'Status' },
  { value: 'createdBy', label: 'Created by' },
  { value: 'createdAt', label: 'Duration' } 
]

const PIE_FIELDS = [
  { value: 'product', label: 'Product' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'unitPrice', label: 'Unit price' },
  { value: 'totalAmount', label: 'Total amount' },
  { value: 'status', label: 'Status' },
  { value: 'createdBy', label: 'Created by' }
]

const TABLE_COLS = [
  { value: 'id', label: 'Customer ID' },
  { value: 'customerName', label: 'Customer name' },
  { value: 'email', label: 'Email id' },
  { value: 'phoneNumber', label: 'Phone number' },
  { value: 'address', label: 'Address' }, 
  { value: 'orderId', label: 'Order ID' },
  { value: 'createdAt', label: 'Order date' },
  { value: 'product', label: 'Product' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'unitPrice', label: 'Unit price' },
  { value: 'totalAmount', label: 'Total amount' },
  { value: 'status', label: 'Status' },
  { value: 'createdBy', label: 'Created by' }
]

const FILTER_OPS = ['contains', 'equals', 'greater_than', 'less_than']

export default function WidgetConfigModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState(getInit('kpi'))
  const [valErr, setValErr] = useState('')

  useEffect(() => {
    if (initialData) {
      const s = initialData.settings || {}
      setForm({ ...getInit(initialData.widgetType), ...s, widgetType: initialData.widgetType ?? 'kpi', title: initialData.title ?? 'Untitled', description: initialData.description ?? '', width: initialData.width, height: initialData.height })
    }
  }, [initialData])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleTypeChange = (t) => {
    if (initialData) return // read-only when editing
    setForm(getInit(t))
  }

  const toggleCol = (col) => {
    const cols = form.columns
    set('columns', cols.includes(col) ? cols.filter(c => c !== col) : [...cols, col])
  }

  const handleSave = () => {
    if (!form.title.trim()) { setValErr('Please fill the field'); return }
    if (parseInt(form.width) < 1 || parseInt(form.height) < 1) { setValErr('Dimensions cannot be less than 1'); return }
    setValErr('')
    
    onSave({
      widgetType: form.widgetType,
      title: form.title,
      description: form.description,
      width: parseInt(form.width),
      height: parseInt(form.height),
      settings: {
        metric: form.metric, aggregation: form.aggregation, format: form.format, precision: parseInt(form.precision),
        xAxis: form.xAxis, yAxis: form.yAxis, color: form.color, showLabels: form.showLabels,
        dataField: form.dataField, showLegend: form.showLegend,
        columns: form.columns, sortBy: form.sortBy, pageSize: parseInt(form.pageSize), 
        applyFilter: form.applyFilter, filters: form.filters,
        fontSize: parseInt(form.fontSize), headerColor: form.headerColor,
      }
    })
  }

  const addFilter = () => set('filters', [...form.filters, { field: 'product', operator: 'contains', value: '' }])
  const updateFilter = (index, key, val) => {
    const fn = [...form.filters]; fn[index][key] = val; set('filters', fn)
  }
  const removeFilter = (index) => set('filters', form.filters.filter((_, i) => i !== index))

  const L = ({ children, label, req }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label} {req && '*'}</label>
      {children}
    </div>
  )

  const Sel = ({ label, value, onChange, options, req, disabled }) => (
    <L label={label} req={req}>
      <select className="input-field disabled:opacity-50" value={value} onChange={e => onChange(e.target.value)} disabled={disabled}>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </L>
  )

  const isChart = ['bar','line','area','scatter'].includes(form.widgetType)
  const disableAgg = form.widgetType === 'kpi' && !NUMERIC_METRICS.includes(form.metric)

  // Ensure aggregation defaults to Count if metric isn't numeric
  useEffect(() => {
    if (form.widgetType === 'kpi' && disableAgg && form.aggregation !== 'Count') {
      set('aggregation', 'Count')
    }
  }, [form.metric, form.widgetType, disableAgg])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-6">
      <div className="glass bg-white/5 dark:bg-slate-900/40 border border-white/10 rounded-[4rem] shadow-premium w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-up relative overflow-hidden group/modal">
        {/* Background Decorative Glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none group-hover/modal:bg-yellow-600/15 transition-all duration-1000" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-12 py-10 relative z-10 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-3xl font-display font-black text-white tracking-tight">
              {initialData ? 'Refine Component' : 'Initialize Component'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-glow" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Hardware Abstraction Spec</p>
            </div>
          </div>
          <button onClick={onClose} className="w-14 h-14 rounded-[1.5rem] glass flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 shadow-premium">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-12 pb-12 space-y-12 scrollbar-hide relative z-10">
          {valErr && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 animate-shake">
               <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
               {valErr}
            </div>
          )}

          {/* Widget Type Selection */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em]">Core Architecture</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
            </div>
            
            {!initialData ? (
              <div className="grid grid-cols-4 gap-4 mt-2">
                {WIDGET_TYPES.map(t => (
                  <button key={t.value} onClick={() => handleTypeChange(t.value)}
                    className={`flex flex-col items-center gap-4 p-6 rounded-[2rem] border transition-all duration-500 group/btn relative overflow-hidden ${
                      form.widgetType === t.value 
                      ? 'bg-yellow-600/10 border-yellow-500/50 shadow-glow' 
                      : 'glass border-white/5 hover:border-white/20 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span className={`text-3xl transition-transform duration-500 group-hover/btn:scale-125 ${form.widgetType === t.value ? 'animate-bounce-slow' : ''}`}>{t.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                    {form.widgetType === t.value && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="glass !h-16 px-8 !rounded-2xl border-white/5 flex items-center gap-4 opacity-50 grayscale">
                 <span className="text-2xl">{WIDGET_TYPES.find(w=>w.value === form.widgetType)?.icon}</span>
                 <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                   {WIDGET_TYPES.find(w=>w.value === form.widgetType)?.label || form.widgetType} Pattern (Immutable)
                 </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Manifest Label</label>
              <input 
                className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white focus:!border-yellow-500/50 focus:!ring-yellow-500/10 transition-all font-bold text-sm" 
                value={form.title} 
                onChange={e => set('title', e.target.value)} 
                placeholder="Ex: Revenue Overview"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Context / Description</label>
              <textarea 
                className="input-field !py-4 !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white focus:!border-yellow-500/50 focus:!ring-yellow-500/10 transition-all font-bold text-sm min-h-[56px] max-h-[56px] scrollbar-hide" 
                value={form.description} 
                onChange={e => set('description', e.target.value)} 
                placeholder="Optional spatial context..."
              />
            </div>
          </div>

          {/* Size Dimensioning */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em]">Spatial Dimensioning</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-1.5">
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Width (Grid Units)</label>
                 <input type="number" min="1" className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white" value={form.width} onChange={e => set('width', e.target.value)} />
               </div>
               <div className="space-y-1.5">
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Height (Grid Units)</label>
                 <input type="number" min="1" className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white" value={form.height} onChange={e => set('height', e.target.value)} />
               </div>
            </div>
          </div>

          {/* Specialized Settings */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em]">Data Logic & Aesthetics</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
            </div>

            {form.widgetType === 'kpi' && (
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="space-y-1.5">
                     <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Primary Metric</label>
                     <div className="relative">
                       <select className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white appearance-none cursor-pointer font-bold" value={form.metric} onChange={v => set('metric', v.target.value)}>
                         {KPI_METRICS.map(o => <option key={o.value} value={o.value} className="bg-slate-900 text-white">{o.label}</option>)}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                     </div>
                   </div>
                   <div className="space-y-1.5">
                     <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Aggregator</label>
                     <div className="relative">
                       <select className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white appearance-none cursor-pointer disabled:opacity-20 font-bold" value={form.aggregation} onChange={v => set('aggregation', v.target.value)} disabled={disableAgg}>
                         {['Sum','Average','Count'].map(o => <option key={o} value={o} className="bg-slate-900 text-white">{o}</option>)}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                     </div>
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="space-y-1.5">
                     <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Output Format</label>
                     <div className="relative">
                       <select className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white appearance-none cursor-pointer font-bold" value={form.format} onChange={v => set('format', v.target.value)}>
                         {['Number','Currency'].map(o => <option key={o} value={o} className="bg-slate-900 text-white">{o}</option>)}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                     </div>
                   </div>
                   <div className="space-y-1.5">
                     <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Precision (Decimals)</label>
                     <input type="number" min="0" className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white" value={form.precision} onChange={e => set('precision', e.target.value)} />
                   </div>
                </div>
              </div>
            )}

            {isChart && (
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="space-y-1.5">
                     <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Vector Axis (X)</label>
                     <div className="relative">
                       <select className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white appearance-none cursor-pointer font-bold" value={form.xAxis} onChange={v => set('xAxis', v.target.value)}>
                         {CHART_AXES.map(o => <option key={o.value} value={o.value} className="bg-slate-900 text-white">{o.label}</option>)}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                     </div>
                   </div>
                   <div className="space-y-1.5">
                     <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Value Axis (Y)</label>
                     <div className="relative">
                       <select className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white appearance-none cursor-pointer font-bold" value={form.yAxis} onChange={v => set('yAxis', v.target.value)}>
                         {CHART_AXES.map(o => <option key={o.value} value={o.value} className="bg-slate-900 text-white">{o.label}</option>)}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                     </div>
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="space-y-1.5">
                     <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Signature Tint</label>
                     <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-premium">
                           <input type="color" className="absolute inset-0 w-full h-full scale-[2] cursor-pointer" value={form.color} onChange={e => set('color', e.target.value)} />
                        </div>
                        <input className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white font-mono uppercase tracking-widest text-center" value={form.color} onChange={e => set('color', e.target.value)} />
                     </div>
                   </div>
                   <div className="h-14 flex items-center gap-4 ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={form.showLabels} onChange={e => set('showLabels', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                        <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-slate-300">Display Hologram Labels</span>
                      </label>
                   </div>
                </div>
              </div>
            )}

            {form.widgetType === 'pie' && (
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Neural Field data</label>
                  <div className="relative">
                    <select className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white appearance-none cursor-pointer font-bold" value={form.dataField} onChange={v => set('dataField', v.target.value)}>
                      {PIE_FIELDS.map(o => <option key={o.value} value={o.value} className="bg-slate-900 text-white">{o.label}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                  </div>
                </div>
                <div className="h-14 flex items-center gap-4 mt-4 ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={form.showLegend} onChange={e => set('showLegend', e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                    <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-slate-300">Show Legend Overlay</span>
                  </label>
                </div>
              </div>
            )}

            {form.widgetType === 'table' && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Active Matrix Columns</label>
                  <div className="grid grid-cols-4 gap-2.5 p-6 glass !rounded-[2rem] border border-white/5 max-h-48 overflow-y-auto scrollbar-hide">
                    {TABLE_COLS.map(col => (
                      <label key={col.value} className={`flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.1em] cursor-pointer p-3 rounded-xl border transition-all ${form.columns.includes(col.value) ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-white/2 border-white/5 text-slate-500 hover:text-slate-300'}`}>
                        <input type="checkbox" checked={form.columns.includes(col.value)} onChange={() => toggleCol(col.value)} className="hidden" />
                        <div className={`w-3 h-3 rounded-full border-2 border-current flex items-center justify-center p-0.5 ${form.columns.includes(col.value) ? 'bg-yellow-500 ring-2 ring-yellow-500/20' : ''}`}>
                          {form.columns.includes(col.value) && <div className="w-full h-full bg-white rounded-full" />}
                        </div>
                        {col.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Chronological Order</label>
                       <div className="relative">
                         <select className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white appearance-none cursor-pointer font-bold" value={form.sortBy} onChange={v => set('sortBy', v.target.value)}>
                           {['Ascending','Descending','Order date'].map(o => <option key={o} value={o} className="bg-slate-900 text-white">{o}</option>)}
                         </select>
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                       </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Neural Font Size</label>
                      <input type="number" min="12" max="18" className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white" value={form.fontSize} onChange={e => set('fontSize', +e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Records Per Flux</label>
                       <div className="relative">
                         <select className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white appearance-none cursor-pointer font-bold" value={String(form.pageSize)} onChange={v => set('pageSize', +v.target.value)}>
                           {['5','10','15'].map(o => <option key={o} value={o} className="bg-slate-900 text-white">{o}</option>)}
                         </select>
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                       </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Primary Matrix Glow</label>
                       <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-premium">
                             <input type="color" className="absolute inset-0 w-full h-full scale-[2] cursor-pointer" value={form.headerColor} onChange={e => set('headerColor', e.target.value)} />
                          </div>
                          <input className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white font-mono uppercase tracking-widest text-center" value={form.headerColor} onChange={e => set('headerColor', e.target.value)} />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Filter Matrix */}
                <div className="pt-4">
                  <label className="relative inline-flex items-center cursor-pointer mb-6 ml-4">
                    <input type="checkbox" checked={form.applyFilter} onChange={e => set('applyFilter', e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-slate-300">Engage Data Heuristics (Filter)</span>
                  </label>
                  
                  {form.applyFilter && (
                    <div className="glass bg-white/2 p-8 rounded-[3rem] border border-white/5 space-y-4 animate-slide-up">
                      {form.filters.map((f, i) => (
                        <div key={i} className="flex gap-4 items-center animate-slide-right group/filter">
                          <div className="relative flex-1">
                            <select className="input-field !h-12 !rounded-xl !bg-white/5 !border-white/10 !text-white appearance-none cursor-pointer font-bold text-[10px] uppercase tracking-widest px-6" value={f.field} onChange={e => updateFilter(i, 'field', e.target.value)}>
                              {TABLE_COLS.map(c => <option key={c.value} value={c.value} className="bg-slate-900 text-white">{c.label}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                          </div>
                          <div className="relative flex-1">
                            <select className="input-field !h-12 !rounded-xl !bg-white/5 !border-white/10 !text-white appearance-none cursor-pointer font-bold text-[10px] uppercase tracking-widest px-6" value={f.operator} onChange={e => updateFilter(i, 'operator', e.target.value)}>
                              {FILTER_OPS.map(op => <option key={op} value={op} className="bg-slate-900 text-white">{op.replace('_', ' ')}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                          </div>
                          <input className="input-field !h-12 !rounded-xl !bg-white/5 !border-white/10 !text-white flex-[1.5] px-6 text-xs font-bold" placeholder="Match valuation..." value={f.value} onChange={e => updateFilter(i, 'value', e.target.value)} />
                          <button onClick={() => removeFilter(i)} className="w-12 h-12 rounded-xl glass flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all transform hover:rotate-90 active:scale-95">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button onClick={addFilter} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-400 p-4 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 transition-all active:scale-95">
                        <Plus size={16} /> Inject New Heuristic
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-5 px-12 py-10 border-t border-white/5 bg-white/2 backdrop-blur-xl relative z-10 shrink-0">
          <button onClick={onClose} className="w-40 h-14 rounded-2xl glass flex items-center justify-center font-black uppercase tracking-[0.2em] text-[10px] text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-premium">
            Decline Changes
          </button>
          <button onClick={handleSave} className="btn-primary !h-14 !px-12 !rounded-2xl shadow-glow active:scale-95 transition-all flex items-center justify-center gap-3">
             <span className="font-black uppercase tracking-[0.2em] text-[11px]">
               {initialData ? 'Update configurations' : 'Add Widget'}
             </span>
          </button>
        </div>
      </div>
    </div>
  )
}
