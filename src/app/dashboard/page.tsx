'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DashboardStats {
  todayPatients: number
  todayRevenue: number
  queueActive: number
  pendingFollowups: number
  totalPatients: number
  monthRevenue: number
  weekAppointments: number
  labCommissions: number
}

const mockStats: DashboardStats = {
  todayPatients: 24,
  todayRevenue: 8400,
  queueActive: 12,
  pendingFollowups: 7,
  totalPatients: 1243,
  monthRevenue: 178500,
  weekAppointments: 87,
  labCommissions: 12400,
}

const mockQueue = [
  { id: 1, name: 'Rahul Verma', token: 10, age: 32, time: '10:00 AM', status: 'In Consultation' },
  { id: 2, name: 'Priya Shah', token: 11, age: 28, time: '10:15 AM', status: 'Waiting' },
  { id: 3, name: 'Amit Kumar', token: 12, age: 45, time: '10:30 AM', status: 'Waiting' },
  { id: 4, name: 'Sunita Rani', token: 13, age: 55, time: '10:45 AM', status: 'Waiting' },
]

const mockAppointments = [
  { id: 1, name: 'Vikram Patel', time: '11:00 AM', type: 'OPD', status: 'SCHEDULED' },
  { id: 2, name: 'Meera Iyer', time: '11:30 AM', type: 'Follow-up', status: 'SCHEDULED' },
  { id: 3, name: 'Suresh Nair', time: '12:00 PM', type: 'OPD', status: 'SCHEDULED' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [greeting, setGreeting] = useState('')
  const [userName, setUserName] = useState('Doctor')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [revenueData] = useState([
    { day: 'Mon', amount: 7200 },
    { day: 'Tue', amount: 9600 },
    { day: 'Wed', amount: 6800 },
    { day: 'Thu', amount: 11200 },
    { day: 'Fri', amount: 8400 },
    { day: 'Sat', amount: 14800 },
    { day: 'Sun', amount: 5600 },
  ])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    const stored = localStorage.getItem('user')
    if (stored) {
      const user = JSON.parse(stored)
      setUserName(user.name || 'Doctor')
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const maxRevenue = Math.max(...revenueData.map(d => d.amount))

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6">
      {/* ── Welcome Banner ── */}
      <div className="mb-6 rounded-2xl p-5 sm:p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d9488 0%, #059669 50%, #0891b2 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white, transparent 60%)' }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-white/80 text-sm font-medium mb-1">
              {greeting}, <span className="text-white font-bold">{userName}</span> 👋
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mb-1">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div className="text-white/70 text-sm">
              {currentTime.toLocaleTimeString('en-IN')} · OPD Active
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/appointments?new=1"
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl transition-all border border-white/20">
              + New Appointment
            </Link>
            <Link href="/dashboard/queue"
              className="flex items-center gap-2 px-4 py-2 bg-white text-teal-700 text-sm font-bold rounded-xl hover:bg-white/90 transition-all">
              🏥 Live Queue
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          {
            label: "Today's Patients",
            value: stats.todayPatients,
            sub: '+3 vs yesterday',
            icon: '👥',
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 dark:bg-blue-500/10 border-blue-500/20',
            link: '/dashboard/patients',
          },
          {
            label: "Today's Revenue",
            value: `₹${stats.todayRevenue.toLocaleString('en-IN')}`,
            sub: '↑ 12% vs yesterday',
            icon: '💰',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            link: '/dashboard/revenue',
          },
          {
            label: 'Active Queue',
            value: `#${stats.queueActive}`,
            sub: '~15 min wait',
            icon: '🏥',
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20',
            link: '/dashboard/queue',
          },
          {
            label: 'Follow-ups Due',
            value: stats.pendingFollowups,
            sub: 'Due today',
            icon: '🔔',
            color: 'text-rose-400',
            bg: 'bg-rose-500/10 border-rose-500/20',
            link: '/dashboard/followups',
          },
        ].map((stat, i) => (
          <Link key={i} href={stat.link}
            className={`p-4 rounded-2xl border ${stat.bg} transition-all hover:scale-[1.02] cursor-pointer`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-black ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
            <div className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">{stat.sub}</div>
          </Link>
        ))}
      </div>

      {/* ── Secondary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Patients', value: stats.totalPatients.toLocaleString('en-IN'), icon: '📋', color: 'text-slate-600 dark:text-slate-400' },
          { label: 'Month Revenue', value: `₹${(stats.monthRevenue / 1000).toFixed(0)}K`, icon: '📈', color: 'text-teal-600 dark:text-teal-400' },
          { label: 'Week Appointments', value: stats.weekAppointments, icon: '📅', color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Lab Commissions', value: `₹${stats.labCommissions.toLocaleString('en-IN')}`, icon: '🧪', color: 'text-orange-600 dark:text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs font-medium">{stat.label}</span>
              <span>{stat.icon}</span>
            </div>
            <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── Grid: Queue + Revenue ── */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Live Queue */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">🏥 Live Queue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Today's OPD</p>
            </div>
            <Link href="/dashboard/queue"
              className="text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline">
              View full queue →
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {mockQueue.map((patient, i) => (
              <div key={patient.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                <div className={`w-9 h-9 rounded-xl text-sm font-bold flex items-center justify-center flex-shrink-0 ${
                  i === 0 ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                }`}>
                  {patient.token}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 dark:text-white truncate">{patient.name}</div>
                  <div className="text-xs text-slate-400">{patient.age}y · {patient.time}</div>
                </div>
                <div className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                  i === 0
                    ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                }`}>
                  {patient.status}
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-100 dark:border-white/5">
            <Link href="/dashboard/queue"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 text-sm font-semibold hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-all">
              + Add Walk-in Patient
            </Link>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">💰 Weekly Revenue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
            </div>
            <Link href="/dashboard/revenue" className="text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline">
              Full report →
            </Link>
          </div>
          <div className="p-5">
            {/* Mini bar chart */}
            <div className="flex items-end gap-2 h-28 mb-3">
              {revenueData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      i === revenueData.length - 3 ? 'bg-teal-500' : 'bg-slate-100 dark:bg-white/5'
                    }`}
                    style={{ height: `${(d.amount / maxRevenue) * 100}%` }}
                  />
                  <span className="text-xs text-slate-400">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-white/5">
              <div>
                <div className="text-xs text-slate-400 mb-1">Total This Week</div>
                <div className="text-xl font-black text-slate-800 dark:text-white">
                  ₹{revenueData.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Best Day</div>
                <div className="text-xl font-black text-teal-600 dark:text-teal-400">
                  ₹{Math.max(...revenueData.map(d => d.amount)).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Appointments + Quick Actions ── */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Today's Upcoming */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">📅 Upcoming Appointments</h3>
              <p className="text-xs text-slate-400 mt-0.5">Next scheduled visits</p>
            </div>
            <Link href="/dashboard/appointments" className="text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline">
              All appointments →
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {mockAppointments.map((appt) => (
              <div key={appt.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 leading-none">{appt.time.split(':')[0]}</span>
                  <span className="text-xs text-indigo-400 leading-none">{appt.time.includes('AM') ? 'AM' : 'PM'}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{appt.name}</div>
                  <div className="text-xs text-slate-400">{appt.type}</div>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 font-medium hover:bg-teal-100 dark:hover:bg-teal-500/20">
                  Check In
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">⚡ Quick Actions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Common tasks at your fingertips</p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { icon: '👥', label: 'New Patient', desc: 'Register patient', href: '/dashboard/patients?new=1', color: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400' },
              { icon: '💊', label: 'Write Rx', desc: 'VoiceRx / Manual', href: '/dashboard/prescription?new=1', color: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
              { icon: '🧪', label: 'Lab Refer', desc: 'Refer to lab', href: '/dashboard/labs?new=1', color: 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400' },
              { icon: '💳', label: 'Collect Fee', desc: 'Record payment', href: '/dashboard/revenue?payment=1', color: 'bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-500/20 text-violet-600 dark:text-violet-400' },
              { icon: '📱', label: 'WhatsApp', desc: 'Send message', href: '/dashboard/followups?whatsapp=1', color: 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20 text-green-600 dark:text-green-400' },
              { icon: '📊', label: 'Reports', desc: 'View analytics', href: '/dashboard/revenue', color: 'bg-teal-50 dark:bg-teal-500/10 border-teal-100 dark:border-teal-500/20 text-teal-600 dark:text-teal-400' },
            ].map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className={`flex flex-col gap-1.5 p-3.5 rounded-xl border ${action.color} hover:scale-[1.02] transition-all cursor-pointer`}
              >
                <span className="text-xl">{action.icon}</span>
                <div className="font-semibold text-sm">{action.label}</div>
                <div className="text-xs opacity-70">{action.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
