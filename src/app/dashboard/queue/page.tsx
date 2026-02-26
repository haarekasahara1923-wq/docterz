'use client'

import { useState, useEffect } from 'react'

interface QueueToken {
    id: number
    tokenNumber: number
    patientName: string
    age: number
    phone: string
    type: 'OPD' | 'FOLLOW_UP' | 'EMERGENCY'
    status: 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'SKIPPED'
    waitTime: number
    registeredAt: string
}

const initialQueue: QueueToken[] = [
    { id: 1, tokenNumber: 10, patientName: 'Rahul Verma', age: 32, phone: '9876543210', type: 'OPD', status: 'IN_CONSULTATION', waitTime: 0, registeredAt: '09:00 AM' },
    { id: 2, tokenNumber: 11, patientName: 'Priya Shah', age: 28, phone: '9876543211', type: 'OPD', status: 'WAITING', waitTime: 8, registeredAt: '09:15 AM' },
    { id: 3, tokenNumber: 12, patientName: 'Amit Kumar', age: 45, phone: '9876543212', type: 'FOLLOW_UP', status: 'WAITING', waitTime: 18, registeredAt: '09:30 AM' },
    { id: 4, tokenNumber: 13, patientName: 'Sunita Rani', age: 55, phone: '9876543213', type: 'OPD', status: 'WAITING', waitTime: 28, registeredAt: '09:45 AM' },
    { id: 5, tokenNumber: 14, patientName: 'Vikram Patel', age: 38, phone: '9876543214', type: 'OPD', status: 'WAITING', waitTime: 38, registeredAt: '10:00 AM' },
]

let nextTokenNumber = 15

export default function QueuePage() {
    const [queue, setQueue] = useState<QueueToken[]>(initialQueue)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newPatient, setNewPatient] = useState({ name: '', phone: '', age: '', type: 'OPD' as 'OPD' | 'FOLLOW_UP' | 'EMERGENCY' })
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const activeCount = queue.filter(q => q.status !== 'COMPLETED').length
    const completedCount = queue.filter(q => q.status === 'COMPLETED').length
    const currentToken = queue.find(q => q.status === 'IN_CONSULTATION')
    const waitingCount = queue.filter(q => q.status === 'WAITING').length

    const callNext = () => {
        setQueue(prev => {
            const updated = [...prev]
            const currentIdx = updated.findIndex(q => q.status === 'IN_CONSULTATION')
            if (currentIdx !== -1) updated[currentIdx].status = 'COMPLETED'
            const nextIdx = updated.findIndex(q => q.status === 'WAITING')
            if (nextIdx !== -1) updated[nextIdx].status = 'IN_CONSULTATION'
            return updated
        })
    }

    const skipToken = (id: number) => {
        setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'SKIPPED' } : q))
    }

    const addWalkIn = () => {
        if (!newPatient.name || !newPatient.phone) return
        const token: QueueToken = {
            id: Date.now(),
            tokenNumber: nextTokenNumber++,
            patientName: newPatient.name,
            age: parseInt(newPatient.age) || 0,
            phone: newPatient.phone,
            type: newPatient.type,
            status: 'WAITING',
            waitTime: waitingCount * 10,
            registeredAt: currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        }
        setQueue(prev => [...prev, token])
        setNewPatient({ name: '', phone: '', age: '', type: 'OPD' })
        setShowAddForm(false)
    }

    const typeColors: Record<string, string> = {
        OPD: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
        FOLLOW_UP: 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-500/20',
        EMERGENCY: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20',
    }

    return (
        <div className="p-4 sm:p-6 pb-24 lg:pb-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'In Queue', value: waitingCount, icon: '⏳', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' },
                    { label: 'Now Serving', value: currentToken?.tokenNumber || '—', icon: '🟢', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20' },
                    { label: 'Completed', value: completedCount, icon: '✅', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
                    { label: 'Est. Wait', value: `${waitingCount * 10}m`, icon: '⏱️', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' },
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${stat.bg}`}>
                        <div className="text-xl mb-1">{stat.icon}</div>
                        <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Current Token Display */}
            {currentToken && (
                <div className="mb-6 p-5 rounded-2xl border-2 border-teal-300 dark:border-teal-500/50"
                    style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.1) 0%, rgba(16,185,129,0.05) 100%)' }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-shrink-0 text-center">
                            <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1">NOW CONSULTING</div>
                            <div className="text-7xl font-black gradient-text">{currentToken.tokenNumber}</div>
                        </div>
                        <div className="flex-1">
                            <div className="text-xl font-black text-slate-800 dark:text-white mb-1">{currentToken.patientName}</div>
                            <div className="text-sm text-slate-500">{currentToken.age > 0 ? `${currentToken.age}y` : ''} · {currentToken.phone}</div>
                            <div className="flex gap-2 mt-2">
                                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${typeColors[currentToken.type]}`}>
                                    {currentToken.type === 'FOLLOW_UP' ? 'Follow-up' : currentToken.type}
                                </span>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 font-medium">
                                    🟢 In Consultation
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                            <button onClick={callNext}
                                className="flex-1 sm:flex-none btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
                                ✓ Complete & Call Next
                            </button>
                            <button onClick={() => skipToken(currentToken.id)}
                                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Walk-in */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">Today's Queue</h2>
                <button onClick={() => setShowAddForm(!showAddForm)}
                    id="add-walkin-btn"
                    className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold">
                    + Walk-in
                </button>
            </div>

            {/* Add Walk-in Form */}
            {showAddForm && (
                <div className="mb-4 p-4 rounded-2xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <input type="text" placeholder="Patient Name *" value={newPatient.name}
                            onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                            className="sm:col-span-1 px-3 py-2.5 rounded-xl border border-teal-200 dark:border-teal-500/30 bg-white dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                        <input type="tel" placeholder="Phone *" value={newPatient.phone}
                            onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                            className="px-3 py-2.5 rounded-xl border border-teal-200 dark:border-teal-500/30 bg-white dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                        <select value={newPatient.type} onChange={e => setNewPatient({ ...newPatient, type: e.target.value as any })}
                            className="px-3 py-2.5 rounded-xl border border-teal-200 dark:border-teal-500/30 bg-white dark:bg-[#0d1a15] text-slate-800 dark:text-white text-sm focus:outline-none">
                            <option value="OPD">OPD</option>
                            <option value="FOLLOW_UP">Follow-up</option>
                            <option value="EMERGENCY">Emergency</option>
                        </select>
                        <button onClick={addWalkIn} disabled={!newPatient.name || !newPatient.phone}
                            className="btn-primary py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                            + Add to Queue
                        </button>
                    </div>
                </div>
            )}

            {/* Queue List */}
            <div className="space-y-2">
                {queue.map((token, i) => (
                    <div key={token.id}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${token.status === 'IN_CONSULTATION'
                                ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30'
                                : token.status === 'COMPLETED'
                                    ? 'bg-slate-50 dark:bg-white/[0.01] border-slate-100 dark:border-white/5 opacity-50'
                                    : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5'
                            }`}
                    >
                        {/* Token number */}
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 font-black ${token.status === 'IN_CONSULTATION'
                                ? 'bg-teal-500 text-white'
                                : token.status === 'COMPLETED'
                                    ? 'bg-slate-200 dark:bg-white/10 text-slate-400'
                                    : token.type === 'EMERGENCY'
                                        ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                            }`}>
                            <span className="text-lg leading-none">{token.tokenNumber}</span>
                            {token.type === 'EMERGENCY' && <span className="text-xs">🚨</span>}
                        </div>

                        {/* Patient info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <span className="font-semibold text-sm text-slate-800 dark:text-white">{token.patientName}</span>
                                {token.age > 0 && <span className="text-xs text-slate-400">{token.age}y</span>}
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[token.type]}`}>
                                    {token.type === 'FOLLOW_UP' ? 'F/U' : token.type}
                                </span>
                            </div>
                            <div className="text-xs text-slate-400">
                                {token.phone} · Arrived {token.registeredAt}
                                {token.status === 'WAITING' && ` · Est. ${token.waitTime}m wait`}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {token.status === 'IN_CONSULTATION' && (
                                <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 font-medium">
                                    🟢 Now
                                </span>
                            )}
                            {token.status === 'WAITING' && (
                                <>
                                    <button
                                        onClick={() => {
                                            // Complete current and call this
                                            setQueue(prev => {
                                                const updated = [...prev]
                                                updated.forEach(q => { if (q.status === 'IN_CONSULTATION') q.status = 'COMPLETED' })
                                                const idx = updated.findIndex(q => q.id === token.id)
                                                if (idx !== -1) updated[idx].status = 'IN_CONSULTATION'
                                                return updated
                                            })
                                        }}
                                        className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-500/20"
                                    >
                                        Call
                                    </button>
                                    <button onClick={() => skipToken(token.id)}
                                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400">
                                        Skip
                                    </button>
                                </>
                            )}
                            {token.status === 'COMPLETED' && (
                                <span className="text-xs text-slate-400">✓ Done</span>
                            )}
                            {token.status === 'SKIPPED' && (
                                <span className="text-xs text-slate-400">Skipped</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
