'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠', id: 'nav-dashboard' },
  { href: '/dashboard/patients', label: 'Patients', icon: '👥', id: 'nav-patients' },
  { href: '/dashboard/appointments', label: 'Appointments', icon: '📅', id: 'nav-appointments' },
  { href: '/dashboard/queue', label: 'Live Queue', icon: '🏥', id: 'nav-queue', badge: '' },
  { href: '/dashboard/prescription', label: 'VoiceRx', icon: '💊', id: 'nav-rx' },
  { href: '/dashboard/labs', label: 'Lab Referrals', icon: '🧪', id: 'nav-labs' },
  { href: '/dashboard/revenue', label: 'Revenue', icon: '💰', id: 'nav-revenue' },
  { href: '/dashboard/followups', label: 'Follow-ups', icon: '🔔', id: 'nav-followups' },
  { href: '/dashboard/staff', label: 'Staff', icon: '👤', id: 'nav-staff' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️', id: 'nav-settings' },
]

const bottomNavItems = [
  { href: '/dashboard', label: 'Home', icon: '🏠', id: 'bottom-home' },
  { href: '/dashboard/patients', label: 'Patients', icon: '👥', id: 'bottom-patients' },
  { href: '/dashboard/queue', label: 'Queue', icon: '🏥', id: 'bottom-queue' },
  { href: '/dashboard/prescription', label: 'VoiceRx', icon: '💊', id: 'bottom-rx' },
  { href: '/dashboard/revenue', label: 'Revenue', icon: '💰', id: 'bottom-revenue' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(stored))

    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const pageTitle = navItems.find(n => n.href === pathname)?.label || 'Dashboard'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050f0d] flex">
      {/* ── Sidebar (Desktop) ── */}
      <aside className="hidden lg:flex w-60 flex-col fixed inset-y-0 left-0 z-40 bg-white dark:bg-[#070d0b] border-r border-slate-200 dark:border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 h-16 border-b border-slate-200 dark:border-white/5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #10b981)' }}>
            <span className="text-white font-black text-sm">D</span>
          </div>
          <div>
            <div className="text-sm font-black text-slate-800 dark:text-white">
              <span className="gradient-text">Docter</span>z
            </div>
            <div className="text-xs text-slate-400" style={{ fontSize: '9px' }}>CLINIC AUTOMATION</div>
          </div>
        </div>

        {/* Clinic info */}
        {user && (
          <div className="px-3 py-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-white/5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-sm font-bold text-teal-600 dark:text-teal-400 flex-shrink-0">
                {user.name?.[0] || 'D'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800 dark:text-white truncate">{user.name}</div>
                <div className="text-xs text-slate-400 truncate">{user.role === 'CLINIC_ADMIN' ? 'Clinic Admin' : user.role === 'STAFF' ? 'Staff' : user.role}</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                id={item.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                    ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-teal-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>
                )}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 py-3 border-t border-slate-100 dark:border-white/5 space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
          >
            <span>{theme === 'dark' ? '☀️' : '🌜'}</span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 bg-white dark:bg-[#070d0b] border-r border-slate-200 dark:border-white/5 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #10b981)' }}>
                  <span className="text-white font-black text-sm">D</span>
                </div>
                <span className="text-sm font-black text-slate-800 dark:text-white">
                  <span className="gradient-text">Docter</span>z
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <nav className="flex-1 px-3 py-3 space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                        ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="px-3 py-3 border-t border-slate-100 dark:border-white/5">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#050f0d]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 h-16 flex items-center px-4 sm:px-6 gap-4">
          {/* Mobile menu btn */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page Title */}
          <div className="flex-1">
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">{pageTitle}</h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Subscription badge - shows user's actual plan */}
            {user && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                <span className="text-xs font-medium text-teal-700 dark:text-teal-400">
                  {user.subscription?.status === 'TRIAL'
                    ? `${user.subscription?.planDisplayName || user.plan || 'Basic'} Trial`
                    : `${user.subscription?.planDisplayName || user.plan || 'Basic'} Plan`}
                </span>
              </div>
            )}

            {/* Notifications */}
            <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              {user?.name?.[0] || 'D'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>

      {/* ── Bottom Nav (Mobile) ── */}
      <div className="bottom-nav lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                id={item.id}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px] ${isActive
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
