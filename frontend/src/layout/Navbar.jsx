import { Moon, Sun, Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'

const titles = {
  '/dashboard':        'Dashboard',
  '/dashboard/config': 'Configure Dashboard',
  '/orders':           'Customer Orders',
}

export default function Navbar({ dark, setDark }) {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'Halleyx'
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0 relative z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-base font-bold text-slate-800 dark:text-white">{title}</h1>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded text-[10px] font-medium text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          SYSTEM LIVE
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Actions bar */}
        <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-2">
          <button
            onClick={() => setDark(d => !d)}
            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500"
            title="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative text-slate-500"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-600 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                  <span className="font-semibold text-xs text-slate-600 dark:text-slate-300">Notifications</span>
                  <button className="text-[10px] text-yellow-600 font-bold hover:underline" onClick={() => setShowNotifications(false)}>Clear all</button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">New System Alert</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Order #1024 has been processed.</p>
                    <p className="text-[9px] text-slate-400 mt-2">Just now</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-bold text-slate-700 dark:text-white uppercase leading-none">Michael Harris</span>
            <span className="block text-[9px] text-slate-500 dark:text-slate-400 font-medium mt-1">Administrator</span>
          </div>
          <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  )
}
