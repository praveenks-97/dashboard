import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Filter } from 'lucide-react'

const ALL_COLS = {
  id:           { label:'Customer ID' },
  customerName: { label:'Customer name' },
  email:        { label:'Email id' },
  phoneNumber:  { label:'Phone number' },
  address:      { label:'Address' },
  orderId:      { label:'Order ID' },
  createdAt:    { label:'Order date' },
  product:      { label:'Product' },
  quantity:     { label:'Quantity' },
  unitPrice:    { label:'Unit price' },
  totalAmount:  { label:'Total amount' },
  status:       { label:'Status' },
  createdBy:    { label:'Created by' },
}

const STATUS_COLORS = { 'Pending':'bg-yellow-100 text-yellow-800', 'In Progress':'bg-blue-100 text-blue-800', 'Completed':'bg-green-100 text-green-800' }

export default function TableWidget({ settings = {}, orders = [], title = 'Untitled' }) {
  const {
    columns:  selectedCols = ['id','customerName','email','product','totalAmount','status'],
    pageSize: ps = 5,
    sortBy = 'Ascending',
    applyFilter = false,
    filters = []
  } = settings

  const visibleCols = selectedCols.map(c => ({ key: c, label: ALL_COLS[c]?.label || c }))

  const defaultSortField = sortBy === 'Order date' ? 'createdAt' : 'id'
  const defaultSortDir = sortBy === 'Descending' ? 'desc' : 'asc'

  const [page, setPage]     = useState(1)
  const [sort, setSort]     = useState({ field: defaultSortField, dir: defaultSortDir })

  const getVal = (o, key) => {
    switch(key) {
      case 'orderId': return o.id;
      case 'customerName': return `${o.firstName} ${o.lastName}`;
      case 'address': return `${o.streetAddress}, ${o.city}, ${o.state}, ${o.country}`;
      case 'createdAt': return new Date(o.createdAt).toLocaleDateString()
      default: return o[key];
    }
  }

  const sorted = useMemo(() => {
    let result = [...orders]
    if (applyFilter && filters.length > 0) {
      result = result.filter(o => filters.every(f => {
        if (!f.value) return true
        const v = String(getVal(o, f.field) || '').toLowerCase()
        const q = f.value.toLowerCase()
        if (f.operator === 'contains') return v.includes(q)
        if (f.operator === 'equals')   return v === q
        if (f.operator === 'greater_than') return parseFloat(v) > parseFloat(q)
        if (f.operator === 'less_than')    return parseFloat(v) < parseFloat(q)
        return true
      }))
    }
    result.sort((a, b) => {
      const va = getVal(a, sort.field) ?? ''; const vb = getVal(b, sort.field) ?? ''
      return sort.dir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })
    return result
  }, [orders, sort, applyFilter, filters])

  const totalPages = Math.max(1, Math.ceil(sorted.length / ps))
  const paginated  = sorted.slice((page - 1) * ps, page * ps)
  if (page > totalPages && totalPages > 0) setPage(totalPages)

  const toggleSort = (field) =>
    setSort(s => s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'asc' })

  const fmt = (o, key) => {
    const v = getVal(o, key)
    if (v == null || v === '') return '—'
    if (key === 'totalAmount' || key === 'unitPrice') return `$${parseFloat(v).toFixed(2)}`
    if (key === 'status') return <span className={`badge ${STATUS_COLORS[v] ?? 'bg-gray-100 text-gray-700'}`}>{v}</span>
    return String(v)
  }

  return (
    <div className="card h-full flex flex-col p-0 overflow-hidden !bg-[#030712]/50 border-white/5">
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]/50">
        <div>
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{title}</h4>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Order Protocol Registry</p>
        </div>
        <div className="flex items-center gap-2">
          {applyFilter && filters.some(f => f.value) && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/10 text-yellow-500">
              <Filter size={10} />
              <span className="text-[10px] font-black uppercase tracking-widest">Filtered</span>
            </div>
          )}
          <span className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-500/10">
            {sorted.length} Records
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#050505]">
              {visibleCols.map(col => (
                <th key={col.key}
                  className="table-th whitespace-nowrap !bg-transparent !border-white/5 !text-slate-500 !text-[9px] !font-black !tracking-[0.2em] cursor-pointer select-none py-3 px-4"
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="flex items-center gap-2">
                    {col.label}
                    {sort.field === col.key && (
                      <span className="text-yellow-500">
                        {sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length} className="text-center py-20">
                  <p className="text-xs font-black text-slate-600 uppercase tracking-[0.3em]">No data matching parameters</p>
                </td>
              </tr>
            ) : paginated.map((o, i) => (
              <tr key={o.id ?? i} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                {visibleCols.map(col => (
                  <td key={col.key} className="table-td whitespace-nowrap !border-none !px-4 !py-3 !text-[11px] font-bold !text-slate-500 group-hover:!text-slate-300">
                    {col.key === 'status' ? (
                      <span className={`badge ${
                         getVal(o, 'status') === 'Completed' ? 'badge-completed' :
                         getVal(o, 'status') === 'Pending'   ? 'badge-pending'   :
                         'badge-progress'
                      }`}>
                        {getVal(o, 'status')}
                      </span>
                    ) : col.key === 'totalAmount' || col.key === 'unitPrice' ? (
                      <span className="tabular-nums font-black text-slate-400 group-hover:text-yellow-500 transition-colors">
                        ${parseFloat(getVal(o, col.key)).toLocaleString()}
                      </span>
                    ) : getVal(o, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-white/5 bg-[#050505] flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Entry {((page-1)*ps)+1} — {Math.min(page*ps, sorted.length)} of {sorted.length}
        </span>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] text-slate-500 hover:text-yellow-500 disabled:opacity-20 transition-all active:scale-90"
            disabled={page <= 1} 
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronUp size={14} className="-rotate-90" />
          </button>
          <span className="text-[10px] font-black text-slate-400 mx-2">{page} / {totalPages}</span>
          <button 
            className="p-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] text-slate-500 hover:text-yellow-500 disabled:opacity-20 transition-all active:scale-90"
            disabled={page >= totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronUp size={14} className="rotate-90" />
          </button>
        </div>
      </div>
    </div>
  )
}
