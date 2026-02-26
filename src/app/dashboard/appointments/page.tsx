'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const mockAppointments = [
    { id: '1', patient: 'Rahul Verma', phone: '9876543210', date: '2026-02-26', time: '10:00 AM', type: 'OPD', status: 'SCHEDULED', fee: 500 },
    { id: '2', patient: 'Priya Shah', phone: '9876543211', date: '2026-02-26', time: '10:30 AM', type: 'FOLLOW_UP', status: 'SCHEDULED', fee: 300 },
    { id: '3', patient: 'Amit Kumar', phone: '9876543212', date: '2026-02-26', time: '11:00 AM', type: 'OPD', status: 'IN_QUEUE', fee: 500 },
    { id: '4', patient: 'Sunita Rani', phone: '9876543213', date: '2026-02-25', time: '09:00 AM', type: 'OPD', status: 'COMPLETED', fee: 500 },
    { id: '5', patient: 'Vikram Patel', phone: '9876543214', date: '2026-02-25', time: '09:30 AM', type: 'OPD', status: 'NO_SHOW', fee: 500 },
]

const timeSlots = [
    '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM',
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
    '12:00 PM', '04:00 PM', '04:30 PM', '05:00 PM',
    '05:30 PM', '06:00 PM', '06:30 PM',
]

const statusColors: Record<string, string> = {
    SCHEDULED: 'badge-info',
    IN_QUEUE: 'badge-warning',
    COMPLETED: 'badge-success',
    CANCELLED: 'bg-slate-100 dark:bg-slate-500/10 text-slate-500',
    NO_SHOW: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20',
}

function AppointmentsPageContent() {
    const searchParams = useSearchParams()
    const [appointments, setAppointments] = useState(mockAppointments)
    const [showForm, setShowForm] = useState(searchParams.get('new') === '1')
    const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0])
    const [filter, setFilter] = useState('all')
    const [form, setForm] = useState({ patient: '', phone: '', date: viewDate, time: '', type: 'OPD', notes: '' })

    const filtered = appointments.filter(a => {
        if (filter === 'today') return a.date === viewDate
        if (filter === 'scheduled') return a.status === 'SCHEDULED'
        if (filter === 'completed') return a.status === 'COMPLETED'
        return true
    })

    const todayCount = appointments.filter(a => a.date === viewDate).length
    const scheduledCount = appointments.filter(a => a.status === 'SCHEDULED').length
    const completedToday = appointments.filter(a => a.date === viewDate && a.status === 'COMPLETED').length
    const noShowCount = appointments.filter(a => a.status === 'NO_SHOW').length

    return (
        <>
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative w-full sm:max-w-lg bg-white dark:bg-[#0a1410] rounded-t-3xl sm:rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">New Appointment</h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400">✕</button>
                        </div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Patient Name *</label>
                                    <input type="text" value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })}
                                        placeholder="Patient name"
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                        placeholder="9876543210"
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Type</label>
                                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1a15] text-slate-800 dark:text-white text-sm focus:outline-none">
                                        <option value="OPD">OPD</option>
                                        <option value="FOLLOW_UP">Follow-up</option>
                                        <option value="EMERGENCY">Emergency</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Date *</label>
                                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d1a15] text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Time Slot</label>
                                    <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1a15] text-slate-800 dark:text-white text-sm focus:outline-none">
                                        <option value="">Select time</option>
                                        {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowForm(false)}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm">
                                    Cancel
                                </button>
                                <button onClick={() => {
                                    if (!form.patient || !form.date) return
                                    setAppointments(prev => [{
                                        id: Date.now().toString(),
                                        patient: form.patient, phone: form.phone,
                                        date: form.date, time: form.time || '10:00 AM',
                                        type: form.type, status: 'SCHEDULED', fee: 500,
                                    }, ...prev])
                                    setShowForm(false)
                                }}
                                    disabled={!form.patient || !form.date}
                                    className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-50">
                                    ✓ Book Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 sm:p-6 pb-24 lg:pb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                        { label: "Today's Appts", value: todayCount, icon: '📅', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' },
                        { label: 'Scheduled', value: scheduledCount, icon: '⏰', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20' },
                        { label: 'Completed', value: completedToday, icon: '✅', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
                        { label: 'No Shows', value: noShowCount, icon: '🚫', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' },
                    ].map((stat, i) => (
                        <div key={i} className={`p-4 rounded-2xl border ${stat.bg}`}>
                            <div className="text-xl mb-1">{stat.icon}</div>
                            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <input type="date" value={viewDate} onChange={e => setViewDate(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                    <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-xl p-1 overflow-x-auto">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'today', label: 'Today' },
                            { id: 'scheduled', label: 'Scheduled' },
                            { id: 'completed', label: 'Completed' },
                        ].map(f => (
                            <button key={f.id} onClick={() => setFilter(f.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filter === f.id ? 'bg-white dark:bg-teal-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
                                    }`}>{f.label}</button>
                        ))}
                    </div>
                    <div className="flex-1" />
                    <button onClick={() => setShowForm(true)} id="new-appointment-btn"
                        className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold">
                        + New Appointment
                    </button>
                </div>

                <div className="space-y-2">
                    {filtered.map(appt => (
                        <div key={appt.id} className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-teal-300 dark:hover:border-teal-500/30 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex flex-col items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 leading-none">{appt.time.split(':')[0]}</span>
                                <span className="text-xs text-indigo-400 leading-none">{appt.time.includes('AM') ? 'AM' : 'PM'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-slate-800 dark:text-white">{appt.patient}</div>
                                <div className="text-xs text-slate-400">{appt.phone} · {appt.date} · {appt.type}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[appt.status]}`}>{appt.status}</span>
                                <span className="text-sm font-bold text-teal-600 dark:text-teal-400">₹{appt.fee}</span>
                                {appt.status === 'SCHEDULED' && (
                                    <button
                                        onClick={() => setAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, status: 'IN_QUEUE' } : a))}
                                        className="text-xs px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-500/20 font-medium">
                                        Check In
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default function AppointmentsPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading...</div>}>
            <AppointmentsPageContent />
        </Suspense>
    )
}
