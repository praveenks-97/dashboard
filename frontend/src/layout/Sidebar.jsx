import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Settings, LogOut } from 'lucide-react'

const links = [
  { to: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/orders',           icon: ShoppingCart,    label: 'Orders' },
  { to: '/dashboard/config', icon: Settings,        label: 'Configure' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-[#030712] text-slate-300 flex flex-col justify-between border-r border-white/5 shadow-2xl overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0a0a0a]/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,204,0,0.2)]">
              <span className="text-black font-black text-xl">H</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white leading-none">Halleyx</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-yellow-500 font-black mt-1">Core Engine</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-4 space-y-2">
          <div className="px-4 py-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Integrated Modules</div>
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all group
                 ${isActive
                   ? 'bg-yellow-600/10 text-yellow-500 border border-yellow-600/20'
                   : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`
              }
            >
              <Icon size={16} className="shrink-0 group-hover:scale-110 transition-transform" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-white/5 space-y-4 bg-[#0a0a0a]/30">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all group"
        >
          <LogOut size={16} />
          <span>Protocol Termination</span>
        </NavLink>
        
        <div className="p-4 rounded-[2rem] bg-yellow-600/5 border border-yellow-600/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-600/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="flex justify-between items-center opacity-60 text-[9px] font-black tracking-[0.3em] uppercase mb-3 text-slate-500">
            <span>System Node</span>
            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(255,204,0,0.5)] animate-pulse" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">v1.2.0-OSS</span>
            <span className="text-[10px] text-yellow-600 font-black uppercase tracking-[0.2em]">Stable</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
