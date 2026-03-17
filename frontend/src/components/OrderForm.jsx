import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createOrder, updateOrder } from '../services/api'

const COUNTRIES = ['United States','Canada','Australia','Singapore','Hong Kong']
const PRODUCTS  = ['Fiber Internet 300 Mbps','5GUnlimited Mobile Plan','Fiber Internet 1 Gbps','Business Internet 500 Mbps','VoIP Corporate Package']
const STATUSES  = ['Pending','In Progress','Completed']
const AGENTS    = ['Mr. Michael Harris','Mr. Ryan Cooper','Ms. Olivia Carter','Mr. Lucas Martin']

const INIT = { firstName:'',lastName:'',email:'',phoneNumber:'',streetAddress:'',city:'',state:'',postalCode:'',country:'United States',product:'Fiber Internet 300 Mbps',quantity:1,unitPrice:'',status:'Pending',createdBy:'Mr. Michael Harris' }

// Moved outside to prevent focus loss during React re-renders
const InputField = ({ label, name, type='text', value, onChange, error, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3">{label}</label>
    <input
      className={`input-field !h-12 !rounded-xl !bg-white/5 !border-white/10 !text-white focus:!border-yellow-500/50 focus:!ring-yellow-500/10 transition-all placeholder:text-slate-600 font-bold text-sm ${error ? '!border-rose-500/50' : ''}`}
      type={type}
      value={value ?? ''}
      onChange={e => onChange(name, e.target.value)}
      {...props}
    />
    {error && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-3">{error}</p>}
  </div>
)

const SelectField = ({ label, name, options, value, onChange, error }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3">{label}</label>
    <div className="relative">
      <select 
        className={`input-field !h-12 !rounded-xl !bg-white/5 !border-white/10 !text-white focus:!border-yellow-500/50 focus:!ring-yellow-500/10 transition-all appearance-none cursor-pointer font-bold text-sm ${error ? '!border-rose-500/50' : ''}`} 
        value={value ?? ''} 
        onChange={e => onChange(name, e.target.value)}
      >
        {options.map(o => <option key={o} className="bg-slate-900 text-white font-bold">{o}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
    </div>
    {error && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-3">{error}</p>}
  </div>
)

export default function OrderForm({ order, onClose, onSaved }) {
  const [form, setForm]     = useState(INIT)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (order) setForm({ ...order, unitPrice: order.unitPrice?.toString() ?? '' })
    else setForm(INIT)
    setErrors({})
  }, [order])

  const total = (parseFloat(form.unitPrice || 0) * parseInt(form.quantity || 0)).toFixed(2)

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    const req = ['firstName','lastName','email','phoneNumber','streetAddress','city','state','postalCode','country','product','status','createdBy']
    req.forEach(k => { if (!form[k]?.toString().trim()) e[k] = 'Please fill the field' })
    if (!form.unitPrice || parseFloat(form.unitPrice) <= 0) e.unitPrice = 'Please fill the field'
    if (!form.quantity  || parseInt(form.quantity)   < 1)  e.quantity  = 'Quantity must be ≥ 1'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { ...form, quantity: parseInt(form.quantity), unitPrice: parseFloat(form.unitPrice) }
      if (order?.id) await updateOrder(order.id, payload)
      else           await createOrder(payload)
      onSaved()
    } catch (err) {
      const data = err.response?.data?.data
      if (data && typeof data === 'object') setErrors(data)
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-6">
      <div className="glass bg-white/5 dark:bg-slate-900/40 border border-white/10 rounded-[3rem] shadow-premium w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slide-up flex flex-col relative">
        {/* Background Glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 relative z-10 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-2xl font-display font-black text-white tracking-tight">
              {order ? 'Adjust Manifest' : 'Initiate Dispatch'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-glow" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Secure Protocol Interface</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 shadow-premium">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-10 scrollbar-hide relative z-10">
          {/* Customer Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em]">Entity Credentials</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <InputField label="First Name" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} error={errors.firstName} />
              <InputField label="Last Name"  name="lastName"  placeholder="Doe" value={form.lastName} onChange={handleChange} error={errors.lastName} />
              <InputField label="Network ID"   name="email"     type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} error={errors.email} />
              <InputField label="Comms Handle" name="phoneNumber" placeholder="555-0100" value={form.phoneNumber} onChange={handleChange} error={errors.phoneNumber} />
              <div className="col-span-2">
                <InputField label="Deployment Address" name="streetAddress" placeholder="123 Main Street" value={form.streetAddress} onChange={handleChange} error={errors.streetAddress} />
              </div>
              <InputField label="Zone/City"        name="city"       placeholder="New York" value={form.city} onChange={handleChange} error={errors.city} />
              <InputField label="State Code"       name="state"      placeholder="NY" value={form.state} onChange={handleChange} error={errors.state} />
              <InputField label="Vector/Postal" name="postalCode" placeholder="10001" value={form.postalCode} onChange={handleChange} error={errors.postalCode} />
              <SelectField label="Geopolitical Region"     name="country"    options={COUNTRIES} value={form.country} onChange={handleChange} error={errors.country} />
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em]">Payload Specifications</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/30 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <SelectField label="Core Payload" name="product" options={PRODUCTS} value={form.product} onChange={handleChange} error={errors.product} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-3">Unit Volume</label>
                <input
                  type="number" min="1"
                  className={`input-field !h-12 !rounded-xl !bg-white/5 !border-white/10 !text-white focus:!border-yellow-500/50 focus:!ring-yellow-500/10 transition-all font-bold text-sm ${errors.quantity ? '!border-rose-500/50' : ''}`}
                  value={form.quantity}
                  onChange={e => handleChange('quantity', e.target.value)}
                />
                {errors.quantity && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-3 mt-1.5">{errors.quantity}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-3">Asset Rate ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/60 text-sm font-black">$</span>
                  <input
                    type="number" min="0.01" step="0.01"
                    className={`input-field !h-12 pl-8 !rounded-xl !bg-white/5 !border-white/10 !text-white focus:!border-yellow-500/50 focus:!ring-yellow-500/10 transition-all font-bold text-sm ${errors.unitPrice ? '!border-rose-500/50' : ''}`}
                    value={form.unitPrice}
                    onChange={e => handleChange('unitPrice', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                {errors.unitPrice && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-3 mt-1.5">{errors.unitPrice}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-3">Gross Valuation</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 text-sm font-black">$</span>
                  <div className="input-field !h-12 pl-8 !rounded-xl !bg-yellow-500/5 !border-yellow-500/20 !text-yellow-500 flex items-center font-black text-sm shadow-glow-sm">
                    {parseFloat(total).toLocaleString()}
                  </div>
                </div>
              </div>
              <SelectField label="Logistic State"     name="status"    options={STATUSES} value={form.status} onChange={handleChange} error={errors.status} />
              <div className="col-span-2">
                <SelectField label="Authorized Dispatcher" name="createdBy" options={AGENTS} value={form.createdBy} onChange={handleChange} error={errors.createdBy} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-5 px-10 py-8 border-t border-white/5 bg-white/2 backdrop-blur-xl relative z-10 shrink-0">
          <button onClick={onClose} className="w-32 h-14 rounded-2xl glass flex items-center justify-center font-black uppercase tracking-[0.2em] text-[10px] text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-premium">
            Abort
          </button>
          <button onClick={submit} disabled={saving} className="btn-primary !h-14 !px-10 !rounded-2xl shadow-glow active:scale-95 transition-all flex items-center justify-center gap-3">
            <span className="font-black uppercase tracking-[0.2em] text-[11px]">
              {saving ? 'Processing…' : (order ? 'Commit Updates' : 'Execute Creation')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
