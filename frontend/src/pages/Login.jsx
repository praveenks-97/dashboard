import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    localStorage.setItem('helleyx_user', email)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#030712]">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-600/10 to-transparent -z-10" />
      <div className="absolute -top-64 -left-64 w-[40rem] h-[40rem] bg-yellow-600/5 rounded-full blur-[150px] animate-pulse -z-10" />
      <div className="absolute -bottom-64 -right-64 w-[40rem] h-[40rem] bg-yellow-600/5 rounded-full blur-[150px] -z-10" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-yellow-600 rounded-[2rem] shadow-[0_0_40px_rgba(255,204,0,0.2)] flex items-center justify-center mb-6 transition-transform duration-700 hover:rotate-12">
            <span className="text-black font-black text-4xl font-display">H</span>
          </div>
          <h1 className="text-4xl font-display font-black text-white tracking-tighter mb-2">Halleyx Core</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-glow" />
            <p className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-500">Autonomous Dashboard OS</p>
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border border-white/5 shadow-premium backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-4">Access Identifier</label>
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
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-4">Security Key</label>
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
              <span className="font-black uppercase tracking-[0.2em] text-[11px]">Authorize System</span>
            </button>
          </form>

          <div className="mt-10 text-center relative z-10">
            <p className="text-xs text-slate-500 font-bold">
              sing up ?
              <Link to="/register" className="ml-2 text-yellow-400 hover:text-yellow-300 transition-colors uppercase tracking-widest font-black text-[10px]">
                Register
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
          Quantum Encryption SEC_LEVEL_4 Active
        </p>
      </div>
    </div>
  )
}
