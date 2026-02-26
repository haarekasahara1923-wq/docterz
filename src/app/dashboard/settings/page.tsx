'use client'

import { useState } from 'react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function SettingsPage() {
    const [tab, setTab] = useState<'clinic' | 'notifications' | 'subscription' | 'security'>('clinic')
    const [clinicForm, setClinicForm] = useState({
        clinicName: "Dr. Sharma's Clinic",
        doctorName: 'Dr. Rajesh Sharma',
        specialty: 'General Physician',
        phone: '9876543210',
        email: 'sharma@clinic.com',
        address: '123 MG Road, Jaipur',
        city: 'Jaipur',
        state: 'Rajasthan',
        gstin: '',
        consultationFee: 500,
        themeColor: '#0d9488',
    })
    const [opd, setOpd] = useState({
        Monday: { open: '09:00', close: '18:00', active: true },
        Tuesday: { open: '09:00', close: '18:00', active: true },
        Wednesday: { open: '09:00', close: '18:00', active: true },
        Thursday: { open: '09:00', close: '18:00', active: true },
        Friday: { open: '09:00', close: '18:00', active: true },
        Saturday: { open: '09:00', close: '14:00', active: true },
        Sunday: { open: '10:00', close: '12:00', active: false },
    } as any)
    const [saved, setSaved] = useState(false)

    const handleSave = async () => {
        setSaved(true)
        await new Promise(r => setTimeout(r, 1000))
        setSaved(false)
    }

    return (
        <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-3xl">
            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-xl p-1 mb-6 overflow-x-auto no-scrollbar">
                {[
                    { id: 'clinic', label: '🏥 Clinic Profile' },
                    { id: 'notifications', label: '🔔 Notifications' },
                    { id: 'subscription', label: '💎 Subscription' },
                    { id: 'security', label: '🔒 Security' },
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id as any)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-white dark:bg-teal-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* CLINIC PROFILE */}
            {tab === 'clinic' && (
                <div className="space-y-5">
                    <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { key: 'clinicName', label: 'Clinic Name' },
                                { key: 'doctorName', label: 'Doctor Name' },
                                { key: 'specialty', label: 'Specialty' },
                                { key: 'phone', label: 'Phone' },
                                { key: 'email', label: 'Email', type: 'email' },
                                { key: 'consultationFee', label: 'Consultation Fee (₹)', type: 'number' },
                                { key: 'gstin', label: 'GSTIN (optional)' },
                            ].map(f => (
                                <div key={f.key} className={f.key === 'clinicName' ? 'sm:col-span-2' : ''}>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">{f.label}</label>
                                    <input type={f.type || 'text'} value={(clinicForm as any)[f.key]}
                                        onChange={e => setClinicForm({ ...clinicForm, [f.key]: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                                </div>
                            ))}
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Address</label>
                                <input type="text" value={clinicForm.address}
                                    onChange={e => setClinicForm({ ...clinicForm, address: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Theme Color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={clinicForm.themeColor}
                                        onChange={e => setClinicForm({ ...clinicForm, themeColor: e.target.value })}
                                        className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 cursor-pointer" />
                                    <div className="flex gap-2">
                                        {['#0d9488', '#2563eb', '#7c3aed', '#db2777', '#d97706'].map(c => (
                                            <button key={c} onClick={() => setClinicForm({ ...clinicForm, themeColor: c })}
                                                className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-700 shadow-sm hover:scale-110 transition-transform"
                                                style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OPD Timings */}
                    <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">📅 OPD Timings</h3>
                        <div className="space-y-3">
                            {days.map(day => (
                                <div key={day} className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 w-28 cursor-pointer">
                                        <div
                                            onClick={() => setOpd((prev: any) => ({ ...prev, [day]: { ...prev[day], active: !prev[day].active } }))}
                                            className={`w-9 h-5 rounded-full transition-all cursor-pointer ${opd[day].active ? 'bg-teal-500' : 'bg-slate-200 dark:bg-white/10'}`}>
                                            <div className={`w-4 h-4 mt-0.5 ml-0.5 rounded-full bg-white shadow transition-all ${opd[day].active ? 'translate-x-4' : ''}`} />
                                        </div>
                                        <span className={`text-sm font-medium ${opd[day].active ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                                            {day.slice(0, 3)}
                                        </span>
                                    </label>
                                    {opd[day].active && (
                                        <div className="flex items-center gap-2">
                                            <input type="time" value={opd[day].open}
                                                onChange={e => setOpd((prev: any) => ({ ...prev, [day]: { ...prev[day], open: e.target.value } }))}
                                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                                            <span className="text-slate-400 text-sm">to</span>
                                            <input type="time" value={opd[day].close}
                                                onChange={e => setOpd((prev: any) => ({ ...prev, [day]: { ...prev[day], close: e.target.value } }))}
                                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                                        </div>
                                    )}
                                    {!opd[day].active && (
                                        <span className="text-xs text-slate-400 italic">Closed</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleSave} className="w-full btn-primary py-3 rounded-xl text-sm font-semibold">
                        {saved ? '✓ Saved!' : '💾 Save Changes'}
                    </button>
                </div>
            )}

            {/* NOTIFICATIONS */}
            {tab === 'notifications' && (
                <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5 space-y-5">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">Notification Settings</h3>
                    {[
                        { label: 'Appointment Confirmations', sub: 'Send WhatsApp when appointment is booked', enabled: true },
                        { label: 'Queue Updates', sub: 'Notify patients when their turn is near', enabled: true },
                        { label: 'Follow-up Reminders', sub: 'Auto-send follow-up messages', enabled: true },
                        { label: 'Lab Referral Emails', sub: 'Auto-email labs when referral is created', enabled: true },
                        { label: 'Payment Receipts', sub: 'SMS receipt after payment', enabled: false },
                        { label: 'No-show Alerts', sub: 'AI detects potential no-shows early', enabled: true },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                            <div>
                                <div className="text-sm font-medium text-slate-800 dark:text-white">{item.label}</div>
                                <div className="text-xs text-slate-400">{item.sub}</div>
                            </div>
                            <div className={`w-10 h-6 rounded-full cursor-pointer transition-all ${item.enabled ? 'bg-teal-500' : 'bg-slate-200 dark:bg-white/10'}`}>
                                <div className={`w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white shadow transition-all ${item.enabled ? 'translate-x-4' : ''}`} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* SUBSCRIPTION */}
            {tab === 'subscription' && (
                <div className="space-y-4">
                    <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-teal-200 dark:border-teal-500/30 p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 text-sm font-bold mb-2">
                                    💎 Pro Plan
                                </div>
                                <div className="text-2xl font-black text-slate-800 dark:text-white">₹2,499 <span className="text-sm font-normal text-slate-400">/month</span></div>
                                <div className="text-xs text-slate-400 mt-1">Renews on March 26, 2026</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-400 mb-1">Days remaining</div>
                                <div className="text-2xl font-black text-teal-600 dark:text-teal-400">28</div>
                            </div>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: '93%' }} />
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold">
                                🔄 Renew Plan
                            </button>
                            <button className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-white/5">
                                📊 Usage
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Current Plan Features</h3>
                        <div className="space-y-2">
                            {[
                                '✓ Unlimited patients',
                                '✓ AI VoiceRx',
                                '✓ Lab referral + commissions',
                                '✓ WhatsApp integration',
                                '✓ Revenue analytics',
                                '✓ Follow-up automation',
                                '✓ Priority support',
                            ].map((f, i) => (
                                <div key={i} className="text-sm text-slate-700 dark:text-slate-300">{f}</div>
                            ))}
                        </div>
                        <button className="mt-4 w-full py-2.5 rounded-xl border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-400 text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-all">
                            ⬆️ Upgrade to Enterprise
                        </button>
                    </div>
                </div>
            )}

            {/* SECURITY */}
            {tab === 'security' && (
                <div className="space-y-4">
                    <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Change Password</h3>
                        <div className="space-y-3">
                            {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => (
                                <div key={i}>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                                    <input type="password" placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                                </div>
                            ))}
                            <button className="w-full btn-primary py-3 rounded-xl text-sm font-semibold">
                                🔐 Update Password
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Security Settings</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Two-Factor Authentication', sub: 'Extra security for your account', badge: 'Off' },
                                { label: 'Session Timeout', sub: 'Auto logout after 8 hours of inactivity', badge: 'On' },
                                { label: 'Audit Logs', sub: 'Track all actions in your clinic', badge: 'Active' },
                                { label: 'Data Backup', sub: 'Automatic daily backup to cloud', badge: 'Daily' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                                    <div>
                                        <div className="text-sm font-medium text-slate-800 dark:text-white">{item.label}</div>
                                        <div className="text-xs text-slate-400">{item.sub}</div>
                                    </div>
                                    <span className="badge-primary">{item.badge}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
