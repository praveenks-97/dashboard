import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './layout/Sidebar'
import Navbar  from './layout/Navbar'
import Orders         from './pages/Orders'
import Dashboard      from './pages/Dashboard'
import DashboardConfig from './pages/DashboardConfig'
import Login          from './pages/Login'
import Register       from './pages/Register'
import { useState }   from 'react'

function AppLayout({ dark, setDark }) {
  const loc = useLocation()
  const isAuth = loc.pathname === '/login' || loc.pathname === '/register'

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
        {!isAuth && <Sidebar />}
        <div className="flex flex-col flex-1 overflow-hidden">
          {!isAuth && <Navbar dark={dark} setDark={setDark} />}
          <main className={isAuth ? 'flex-1 overflow-y-auto' : 'flex-1 overflow-y-auto p-6'}>
            <Routes>
              <Route path="/"                  element={<Navigate to="/login" replace />} />
              <Route path="/login"             element={<Login />} />
              <Route path="/register"          element={<Register />} />
              <Route path="/dashboard"         element={<Dashboard />} />
              <Route path="/dashboard/config"  element={<DashboardConfig />} />
              <Route path="/orders"            element={<Orders />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [dark, setDark] = useState(false)

  return (
    <BrowserRouter>
      <AppLayout dark={dark} setDark={setDark} />
    </BrowserRouter>
  )
}
