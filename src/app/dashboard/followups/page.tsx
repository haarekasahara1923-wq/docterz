'use client'

import { useState } from 'react'

const mockFollowups = [
    { id: '1', patient: 'Rahul Verma', phone: '9876543210', type: 'WhatsApp', scheduledFor: '2026-02-26', message: 'Dear Rahul ji, a gentle reminder for your blood pressure checkup. Please visit the clinic or call us. - Dr. Sharma Clinic', status: 'PENDING', aiGenerated: true, disease: 'Hypertension' },
    { id: '2', patient: 'Priya Shah', phone: '9876543211', type: 'SMS', scheduledFor: '2026-02-26', message: 'Dear Priya, please remember your follow-up appointment today. - Dr. Sharma', status: 'PENDING', aiGenerated: false, disease: 'Thyroid' },
    { id: '3', patient: 'Amit Kumar', phone: '9876543212', type: 'WhatsApp', scheduledFor: '2026-02-25', message: 'Amit ji, please get your HbA1c test done and share the report. Wishing you good health! - Dr. Sharma', status: 'SENT', aiGenerated: true, disease: 'Diabetes' },
    { id: '4', patient: 'Sunita Rani', phone: '9876543213', type: 'WhatsApp', scheduledFor: '2026-02-24', message: 'Dear Sunita ji, hope you are feeling better. Please continue your thyroid medicine. Come for checkup on scheduled date.', status: 'COMPLETED', aiGenerated: true, disease: 'Thyroid' },
]

const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    SENT: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    COMPLETED: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    CANCELLED: 'bg-slate-50 dark:bg-slate-500/10 text-slate-500 border-slate-200 dark:border-slate-500/20',
}

export default function FollowupsPage() {
    const [followups, setFollowups] = useState(mockFollowups)
    const [showCreate, setShowCreate] = useState(false)
    const [generatingAI, setGeneratingAI] = useState(false)
    const [form, setForm] = useState({ patient: '', phone: '', disease: '', type: 'WhatsApp', scheduledFor: '', message: '' })

    const pending = followups.filter(f => f.status === 'PENDING').length
    const sent = followups.filter(f => f.status === 'SENT').length
    const completed = followups.filter(f => f.status === 'COMPLETED').length

    const generateAIMessage = async () => {
        if (!form.patient || !form.disease) return
        setGeneratingAI(true)
        await new Promise(r => setTimeout(r, 1500))
        setForm(prev => ({
            ...prev,
            message: `Dear ${prev.patient} ji, 🙏 I hope you are doing well. As your doctor, I wanted to remind you about your ${prev.disease} management. Please continue your prescribed medicines and schedule your next visit. Your health is our top priority. For any concerns, please call us anytime. - Dr. Sharma Clinic`
        }))
        setGeneratingAI(false)
    }

    const sendFollowup = (id: string, type: string) => {
        setFollowups(prev => prev.map(f => f.id === id ? { ...f, status: 'SENT' } : f))
    }

    const markComplete = (id: string) => {
        setFollowups(prev => prev.map(f => f.id === id ? { ...f, status: 'COMPLETED' } : f))
    }

    return (
        <div className="p-4 sm:p-6 pb-24 lg:pb-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{pending}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Pending</div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{sent}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Sent Today</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{completed}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Completed</div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">Follow-up Messages</h2>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            // Auto-generate AI reminders for all chronic patients
                            setFollowups(prev => prev.map(f => f.status === 'PENDING' ? { ...f, aiGenerated: true } : f))
                        }}
                        className="px-3 py-2 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-400 text-xs font-medium hover:bg-violet-100 dark:hover:bg-violet-500/20">
                        🤖 AI Generate All
                    </button>
                    <button onClick={() => setShowCreate(!showCreate)} id="create-followup-btn"
                        className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold">
                        + New Follow-up
                    </button>
                </div>
            </div>

            {showCreate && (
                <div className="mb-5 p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-teal-200 dark:border-teal-500/30">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">🔔 Create Follow-up</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {[
                            { key: 'patient', label: 'Patient Name', placeholder: 'Patient name' },
                            { key: 'phone', label: 'Phone', placeholder: '9876543210' },
                            { key: 'disease', label: 'Condition/Disease', placeholder: 'Hypertension, Diabetes...' },
                            { key: 'scheduledFor', label: 'Schedule Date', type: 'date' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">{f.label}</label>
                                <input type={f.type || 'text'} value={(form as any)[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    placeholder={(f as any).placeholder}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500" />
                            </div>
                        ))}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1a15] text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500">
                                <option value="WhatsApp">📱 WhatsApp</option>
                                <option value="SMS">💬 SMS</option>
                                <option value="Email">📧 Email</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-medium text-slate-400">Message</label>
                            <button onClick={generateAIMessage} disabled={generatingAI}
                                className="text-xs px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20 font-medium disabled:opacity-50">
                                {generatingAI ? '🤖 Generating...' : '✨ AI Generate'}
                            </button>
                        </div>
                        <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                            rows={4} placeholder="Type your follow-up message or use AI to generate..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 resize-none" />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setShowCreate(false)}
                            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm">
                            Cancel
                        </button>
                        <button onClick={() => {
                            const newF = { ...form, id: Date.now().toString(), status: 'PENDING', aiGenerated: false }
                            setFollowups(prev => [newF as any, ...prev])
                            setForm({ patient: '', phone: '', disease: '', type: 'WhatsApp', scheduledFor: '', message: '' })
                            setShowCreate(false)
                        }}
                            className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold">
                            ✓ Schedule Follow-up
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {followups.map(f => (
                    <div key={f.id} className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-4">
                        <div className="flex flex-wrap items-start gap-3 justify-between mb-3">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-slate-800 dark:text-white">{f.patient}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[f.status]}`}>{f.status}</span>
                                    {f.aiGenerated && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-500/20">
                                            🤖 AI Written
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-slate-400">{f.phone} · {f.disease} · {f.type}</div>
                            </div>
                            <div className="text-xs text-slate-400">{f.scheduledFor}</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 mb-3">
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{f.message}</p>
                        </div>
                        {f.status === 'PENDING' && (
                            <div className="flex gap-2">
                                <button onClick={() => sendFollowup(f.id, f.type)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${f.type === 'WhatsApp'
                                            ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 border border-green-100 dark:border-green-500/20'
                                            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-100 dark:border-blue-500/20'
                                        }`}>
                                    {f.type === 'WhatsApp' ? '📱' : '💬'} Send via {f.type}
                                </button>
                                <button onClick={() => markComplete(f.id)}
                                    className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10">
                                    ✓ Mark Complete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
