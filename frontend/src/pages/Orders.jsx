import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react'
import { getOrders, deleteOrder } from '../services/api'
import OrderForm from '../components/OrderForm'

const STATUS_BADGE = { 'Pending': 'badge-pending', 'In Progress': 'badge-progress', 'Completed': 'badge-completed' }

export default function Orders() {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showForm, setShowForm]   = useState(false)
  const [editOrder, setEditOrder] = useState(null)
  const [sortField, setSortField] = useState('id')
  const [sortDir, setSortDir]     = useState('asc')
  const [page, setPage]           = useState(1)
  const [pageSize]                = useState(10)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getOrders()
      setOrders(res.data?.data ?? [])
    } catch { setOrders([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    if (!confirm('Delete this order?')) return
    try { await deleteOrder(id); load() } catch {}
  }

  const handleEdit = (o) => { setEditOrder(o); setShowForm(true) }
  const handleAdd  = ()  => { setEditOrder(null); setShowForm(true) }

  const sort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    return `${o.firstName} ${o.lastName} ${o.email} ${o.product} ${o.status}`.toLowerCase().includes(q)
  }).sort((a, b) => {
    const va = a[sortField] ?? ''; const vb = b[sortField] ?? ''
    return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
  })

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filtered.length / pageSize)

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={14} className="opacity-20" />
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Order Management</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Logistics Operations Manifest</p>
          </div>
        </div>
        <button onClick={handleAdd} className="btn-primary !h-10 !px-6 flex items-center gap-2 group">
          <Plus size={16} /> 
          <span className="text-sm">Create New Order</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="card !p-3 flex items-center justify-between flex-wrap gap-4 relative z-10">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            className="input-field !h-9 pl-10 !bg-slate-50 dark:!bg-slate-900 !border-slate-200 dark:!border-slate-700 text-sm"
            placeholder="Search by name, email, or status..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{filtered.length} total active</p>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
          <button onClick={load} className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-yellow-600 transition-colors" title="Reload">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {[
                  ['id','ID'],['firstName','Customer'],['email','Contact'],
                  ['product','Product'],['quantity','QTY'],['unitPrice','Price'],
                  ['totalAmount','Total'],['status','Status'],['createdBy','Created By']
                ].map(([f, label]) => (
                  <th key={f} 
                    className="table-th py-3 px-4 cursor-pointer select-none"
                    onClick={() => sort(f)}
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      <SortIcon field={f} />
                    </span>
                  </th>
                ))}
                <th className="table-th py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={10} className="text-center py-20 text-slate-400 text-sm italic">Synchronizing orders...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-20 text-slate-400 text-sm">No records found matching your criteria</td></tr>
              ) : paginated.map(o => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="table-td py-3 px-4 text-[11px] font-mono text-slate-400">#{o.id}</td>
                  <td className="table-td py-3 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{o.firstName} {o.lastName}</span>
                  </td>
                  <td className="table-td py-3 px-4 text-xs text-slate-500">{o.email}</td>
                  <td className="table-td py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{o.product}</span>
                  </td>
                  <td className="table-td py-3 px-4 text-xs">{o.quantity}</td>
                  <td className="table-td py-3 px-4 text-xs">${parseFloat(o.unitPrice).toLocaleString()}</td>
                  <td className="table-td py-3 px-4 text-xs font-semibold text-yellow-600 dark:text-yellow-400">${parseFloat(o.totalAmount).toLocaleString()}</td>
                  <td className="table-td py-3 px-4">
                    <span className={`badge ${STATUS_BADGE[o.status] || 'badge-pending'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="table-td py-3 px-4 text-[10px] text-slate-400 uppercase font-medium">{o.createdBy}</td>
                  <td className="table-td py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(o)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-yellow-600 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(o.id)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-slate-500 uppercase">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button 
              className="h-8 px-4 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
              disabled={page <= 1} 
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <button 
              className="h-8 px-4 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
              disabled={page >= totalPages} 
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <OrderForm
          order={editOrder}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load() }}
        />
      )}
    </div>
  )
}
