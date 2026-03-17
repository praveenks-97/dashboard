const FIELD_MAP = {
  id:          o => o.id,
  orderId:     o => o.id, // mapped
  customerName:o => `${o.firstName} ${o.lastName}`,
  email:       o => o.email,
  address:     o => `${o.streetAddress}, ${o.city}, ${o.state}, ${o.country}`,
  createdAt:   o => o.createdAt,
  product:     o => o.product,
  createdBy:   o => o.createdBy,
  status:      o => o.status,
  totalAmount: o => parseFloat(o.totalAmount ?? 0),
  unitPrice:   o => parseFloat(o.unitPrice   ?? 0),
  quantity:    o => parseInt(o.quantity       ?? 0),
}

const NUMERIC = new Set(['id', 'orderId', 'totalAmount', 'unitPrice', 'quantity'])

function aggregate(orders, metric, agg) {
  const vals = orders.map(o => FIELD_MAP[metric]?.(o)).filter(v => v != null)
  if (!vals.length) return 0
  if (!NUMERIC.has(metric) || agg === 'Count') return vals.length
  
  const nums = vals.map(Number).filter(n => !isNaN(n))
  if (!nums.length) return 0
  if (agg === 'Sum')     return nums.reduce((a, b) => a + b, 0)
  if (agg === 'Average') return nums.reduce((a, b) => a + b, 0) / nums.length
  return nums.length
}

export default function KPIWidget({ settings = {}, orders = [], title = 'Untitled' }) {
  const { metric = 'totalAmount', aggregation = 'Sum', format = 'Number', precision = 0 } = settings
  const raw   = aggregate(orders, metric, aggregation)
  const isCurrency = format === 'Currency'
  const formatted = raw.toLocaleString('en-US', { minimumFractionDigits: +precision, maximumFractionDigits: +precision })
  const value = isCurrency ? `$${formatted}` : formatted

  return (
    <div className="card h-full flex flex-col justify-between">
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-yellow-600/10 rounded-xl border border-yellow-600/20 shadow-[0_0_15px_rgba(255,204,0,0.1)]">
              <span className="text-[10px] font-black text-yellow-600">
                {orders.length}
              </span>
              <span className="text-[10px] text-yellow-500/50 font-black uppercase tracking-tighter">Samples</span>
            </div>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
          {metric} • {aggregation}
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-600/10 border border-yellow-600/10">
          <span className="text-[10px] font-black text-yellow-600">
            {orders.length}
          </span>
          <span className="text-[10px] text-yellow-500/50 font-black uppercase tracking-tighter">Samples</span>
        </div>
      </div>
    </div>
  )
}
