import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = (e) => {
    e.preventDefault()
    // Simulated registration redirection
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#030712]">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-600/10 to-transparent -z-10" />
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-yellow-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-yellow-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      <div className="absolute -top-64 -right-64 w-[40rem] h-[40rem] bg-yellow-600/5 rounded-full blur-[150px] animate-pulse -z-10" />
      <div className="absolute -bottom-64 -left-64 w-[40rem] h-[40rem] bg-yellow-600/5 rounded-full blur-[150px] -z-10" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-yellow-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,204,0,0.3)] group-hover:scale-110 transition-transform duration-500">
            <span className="text-black font-black text-2xl group-hover:rotate-12 transition-transform">H</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white leading-none">Halleyx</span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-yellow-500 font-black mt-1">Core Engine</span>
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border border-white/5 shadow-premium backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <form onSubmit={handleRegister} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-4">User Identity</label>
              <input 
                type="text" 
                className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white focus:!border-yellow-500/50 focus:!ring-yellow-500/20 transition-all placeholder:text-slate-600 font-bold" 
                placeholder="John Doe" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-4">Network ID</label>
              <input 
                type="email" 
                className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white focus:!border-yellow-500/50 focus:!ring-yellow-500/20 transition-all placeholder:text-slate-600 font-bold" 
                placeholder="admin@halleyx.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-4">Establish Pass-link</label>
              <input 
                type="password" 
                className="input-field !h-14 !rounded-2xl !bg-white/5 !border-white/10 !text-white focus:!border-yellow-500/50 focus:!ring-yellow-500/20 transition-all placeholder:text-slate-600 font-bold" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary !h-14 w-full !rounded-2xl shadow-glow active:scale-95 transition-all flex items-center justify-center gap-3">
              <span className="font-black uppercase tracking-[0.2em] text-[11px]">Deploy Identity</span>
            </button>
          </form>

          <div className="mt-10 text-center relative z-10">
            <p className="text-xs text-slate-500 font-bold">
              Existing node? 
              <Link to="/login" className="ml-2 text-yellow-400 hover:text-yellow-300 transition-colors uppercase tracking-widest font-black text-[10px]">
                Access System
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
          Node Sync Status: CLOUD_READY
        </p>
      </div>
    </div>
  )
}
