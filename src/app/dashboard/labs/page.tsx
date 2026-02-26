'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Lab {
    id: string
    labName: string
    contactPerson?: string
    phone: string
    email?: string
    address?: string
    city?: string
    commissionPct: number
    totalReferrals: number
    totalCommission: number
    isActive: boolean
}

interface LabReferral {
    id: string
    referralId: string
    patientName: string
    patientPhone: string
    labName: string
    tests: string[]
    status: 'PENDING' | 'SENT' | 'COMPLETED' | 'CANCELLED'
    createdAt: string
    commission?: number
}

const mockLabs: Lab[] = [
    { id: '1', labName: 'LifeCare Diagnostics', contactPerson: 'Suresh Kumar', phone: '9876543300', email: 'info@lifecare.in', address: 'MG Road', city: 'Jaipur', commissionPct: 15, totalReferrals: 45, totalCommission: 18750, isActive: true },
    { id: '2', labName: 'PathLab Plus', phone: '9876543301', email: 'pathlab@labs.in', city: 'Jaipur', commissionPct: 12, totalReferrals: 28, totalCommission: 9800, isActive: true },
    { id: '3', labName: 'BioTest Labs', contactPerson: 'Priya Singh', phone: '9876543302', city: 'Jaipur', commissionPct: 10, totalReferrals: 17, totalCommission: 4200, isActive: true },
]

const mockReferrals: LabReferral[] = [
    { id: '1', referralId: 'REF-2026-001', patientName: 'Rahul Verma', patientPhone: '9876543210', labName: 'LifeCare Diagnostics', tests: ['CBC', 'HbA1c', 'Lipid Profile'], status: 'COMPLETED', createdAt: '2026-02-20', commission: 420 },
    { id: '2', referralId: 'REF-2026-002', patientName: 'Priya Shah', patientPhone: '9876543211', labName: 'PathLab Plus', tests: ['TSH', 'T3', 'T4'], status: 'SENT', createdAt: '2026-02-22' },
    { id: '3', referralId: 'REF-2026-003', patientName: 'Amit Kumar', patientPhone: '9876543212', labName: 'LifeCare Diagnostics', tests: ['Urine R/M', 'KFT'], status: 'PENDING', createdAt: '2026-02-25' },
    { id: '4', referralId: 'REF-2026-004', patientName: 'Sunita Rani', patientPhone: '9876543213', labName: 'BioTest Labs', tests: ['LFT', 'USG Abdomen'], status: 'COMPLETED', createdAt: '2026-02-15', commission: 280 },
]

const commonTests = [
    'CBC', 'HbA1c', 'Fasting Blood Sugar', 'PP Blood Sugar',
    'Lipid Profile', 'LFT', 'KFT', 'TSH', 'T3', 'T4',
    'Urine R/M', 'USG Abdomen', 'ECHO', 'ECG',
    'Vitamin D', 'Vitamin B12', 'Serum Calcium',
    'ESR', 'CRP', 'RA Factor', 'ASO Titre',
]

const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    SENT: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    COMPLETED: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    CANCELLED: 'bg-slate-50 dark:bg-slate-500/10 text-slate-500 border-slate-200 dark:border-slate-500/20',
}

function LabsPageContent() {
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState<'referrals' | 'labs' | 'commissions'>('referrals')
    const [showAddLab, setShowAddLab] = useState(false)
    const [showAddReferral, setShowAddReferral] = useState(searchParams.get('new') === '1')
    const [labs, setLabs] = useState<Lab[]>(mockLabs)
    const [referrals, setReferrals] = useState<LabReferral[]>(mockReferrals)
    const [search, setSearch] = useState('')

    const [labForm, setLabForm] = useState({ labName: '', contactPerson: '', phone: '', email: '', address: '', city: '', commissionPct: 10 })
    const [referralForm, setReferralForm] = useState({ patientName: '', patientPhone: '', labId: '', selectedTests: [] as string[], notes: '' })

    const totalCommission = labs.reduce((s, l) => s + l.totalCommission, 0)
    const pendingCommission = referrals.filter(r => r.status === 'COMPLETED' && !r.commission).length * 500
    const totalReferrals = labs.reduce((s, l) => s + l.totalReferrals, 0)

    const handleAddLab = () => {
        if (!labForm.labName || !labForm.phone) return
        const newLab: Lab = { ...labForm, id: Date.now().toString(), totalReferrals: 0, totalCommission: 0, isActive: true }
        setLabs(prev => [...prev, newLab])
        setLabForm({ labName: '', contactPerson: '', phone: '', email: '', address: '', city: '', commissionPct: 10 })
        setShowAddLab(false)
    }

    const handleAddReferral = () => {
        if (!referralForm.patientName || !referralForm.labId || referralForm.selectedTests.length === 0) return
        const lab = labs.find(l => l.id === referralForm.labId)
        if (!lab) return
        const newRef: LabReferral = {
            id: Date.now().toString(),
            referralId: `REF-2026-${String(referrals.length + 1).padStart(3, '0')}`,
            patientName: referralForm.patientName,
            patientPhone: referralForm.patientPhone,
            labName: lab.labName,
            tests: referralForm.selectedTests,
            status: 'PENDING',
            createdAt: new Date().toISOString().split('T')[0],
        }
        setReferrals(prev => [newRef, ...prev])
        setReferralForm({ patientName: '', patientPhone: '', labId: '', selectedTests: [], notes: '' })
        setShowAddReferral(false)
    }

    const toggleTest = (test: string) => {
        setReferralForm(prev => ({
            ...prev,
            selectedTests: prev.selectedTests.includes(test)
                ? prev.selectedTests.filter(t => t !== test)
                : [...prev.selectedTests, test]
        }))
    }

    return (
        <div className="p-4 sm:p-6 pb-24 lg:pb-6">
            {/* Commission Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total Referrals', value: totalReferrals, icon: '🧪', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' },
                    { label: 'Commission Earned', value: `₹${totalCommission.toLocaleString('en-IN')}`, icon: '💰', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
                    { label: 'Pending Commission', value: `₹${pendingCommission.toLocaleString('en-IN')}`, icon: '⏳', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' },
                    { label: 'Active Labs', value: labs.filter(l => l.isActive).length, icon: '🏥', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20' },
                ].map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${s.bg}`}>
                        <div className="text-xl mb-2">{s.icon}</div>
                        <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-xl p-1 mb-5 overflow-x-auto no-scrollbar">
                {[
                    { id: 'referrals', label: '🧪 Referrals' },
                    { id: 'labs', label: '🏥 Laboratories' },
                    { id: 'commissions', label: '💰 Commissions' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-white dark:bg-teal-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* REFERRALS TAB */}
            {activeTab === 'referrals' && (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">Lab Referrals</h2>
                        <button onClick={() => setShowAddReferral(true)} id="add-referral-btn"
                            className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold">
                            + New Referral
                        </button>
                    </div>

                    {showAddReferral && (
                        <div className="mb-5 p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-teal-200 dark:border-teal-500/30">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">🧪 New Lab Referral</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Patient Name *</label>
                                    <input type="text" value={referralForm.patientName}
                                        onChange={e => setReferralForm({ ...referralForm, patientName: e.target.value })}
                                        placeholder="Patient name"
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Patient Phone</label>
                                    <input type="tel" value={referralForm.patientPhone}
                                        onChange={e => setReferralForm({ ...referralForm, patientPhone: e.target.value })}
                                        placeholder="9876543210"
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Laboratory *</label>
                                    <select value={referralForm.labId}
                                        onChange={e => setReferralForm({ ...referralForm, labId: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1a15] text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500">
                                        <option value="">Select lab...</option>
                                        {labs.filter(l => l.isActive).map(l => (
                                            <option key={l.id} value={l.id}>{l.labName} ({l.commissionPct}% commission)</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-slate-400 mb-2">Test Required *</label>
                                <div className="flex flex-wrap gap-2">
                                    {commonTests.map(test => (
                                        <button key={test}
                                            onClick={() => toggleTest(test)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${referralForm.selectedTests.includes(test)
                                                    ? 'bg-teal-500 text-white border-teal-500'
                                                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-teal-300 dark:hover:border-teal-500/30'
                                                }`}>
                                            {test}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowAddReferral(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm">
                                    Cancel
                                </button>
                                <button onClick={handleAddReferral}
                                    disabled={!referralForm.patientName || !referralForm.labId || referralForm.selectedTests.length === 0}
                                    className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
                                    ✉️ Create Referral & Send Email
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {referrals.map(ref => (
                            <div key={ref.id} className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-4">
                                <div className="flex flex-wrap items-start gap-3 justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2 py-0.5 rounded-lg">{ref.referralId}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[ref.status]}`}>{ref.status}</span>
                                        </div>
                                        <div className="font-semibold text-sm text-slate-800 dark:text-white">{ref.patientName}</div>
                                        <div className="text-xs text-slate-400 mb-2">{ref.patientPhone}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">🏥 {ref.labName}</div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {ref.tests.map(t => (
                                                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400 mb-1">{new Date(ref.createdAt).toLocaleDateString('en-IN')}</div>
                                        {ref.commission && (
                                            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                ₹{ref.commission} commission
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* LABS TAB */}
            {activeTab === 'labs' && (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">Registered Laboratories</h2>
                        <button onClick={() => setShowAddLab(!showAddLab)} id="add-lab-btn"
                            className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold">
                            + Add Lab
                        </button>
                    </div>

                    {showAddLab && (
                        <div className="mb-5 p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-teal-200 dark:border-teal-500/30">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">🏥 Add New Laboratory</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { key: 'labName', label: 'Lab Name *', placeholder: 'LifeCare Diagnostics' },
                                    { key: 'contactPerson', label: 'Contact Person', placeholder: 'Suresh Kumar' },
                                    { key: 'phone', label: 'Phone *', placeholder: '9876543300' },
                                    { key: 'email', label: 'Email', placeholder: 'lab@example.com' },
                                    { key: 'address', label: 'Address', placeholder: 'MG Road' },
                                    { key: 'city', label: 'City', placeholder: 'Jaipur' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5">{f.label}</label>
                                        <input type="text" value={(labForm as any)[f.key]}
                                            onChange={e => setLabForm({ ...labForm, [f.key]: e.target.value })}
                                            placeholder={f.placeholder}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500" />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Commission % *</label>
                                    <input type="number" min="0" max="50" value={labForm.commissionPct}
                                        onChange={e => setLabForm({ ...labForm, commissionPct: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500" />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button onClick={() => setShowAddLab(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm">
                                    Cancel
                                </button>
                                <button onClick={handleAddLab}
                                    disabled={!labForm.labName || !labForm.phone}
                                    className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
                                    ✓ Save Laboratory
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4">
                        {labs.map(lab => (
                            <div key={lab.id} className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                                <div className="flex flex-wrap items-start gap-4 justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-slate-800 dark:text-white">{lab.labName}</h3>
                                            {lab.isActive && <span className="badge-success">Active</span>}
                                        </div>
                                        {lab.contactPerson && <div className="text-sm text-slate-500">{lab.contactPerson}</div>}
                                        <div className="text-sm text-slate-400">{lab.phone}</div>
                                        {lab.email && <div className="text-sm text-slate-400">{lab.email}</div>}
                                        {lab.city && <div className="text-sm text-slate-400">📍 {lab.city}</div>}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-teal-600 dark:text-teal-400">{lab.commissionPct}%</div>
                                        <div className="text-xs text-slate-400">Commission Rate</div>
                                        <div className="mt-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            ₹{lab.totalCommission.toLocaleString('en-IN')}
                                        </div>
                                        <div className="text-xs text-slate-400">{lab.totalReferrals} referrals</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* COMMISSIONS TAB */}
            {activeTab === 'commissions' && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">Commission Dashboard</h2>
                        <button className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                            📊 Export CSV
                        </button>
                    </div>

                    <div className="space-y-4">
                        {labs.map(lab => (
                            <div key={lab.id} className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white">{lab.labName}</h3>
                                        <div className="text-xs text-slate-400">{lab.commissionPct}% commission rate</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                            ₹{lab.totalCommission.toLocaleString('en-IN')}
                                        </div>
                                        <div className="text-xs text-slate-400">Total earned</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center">
                                        <div className="text-lg font-bold text-slate-700 dark:text-slate-200">{lab.totalReferrals}</div>
                                        <div className="text-xs text-slate-400">Referrals</div>
                                    </div>
                                    <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3 text-center">
                                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                            ₹{lab.totalCommission.toLocaleString('en-IN')}
                                        </div>
                                        <div className="text-xs text-slate-400">Received</div>
                                    </div>
                                    <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3 text-center">
                                        <div className="text-lg font-bold text-amber-600 dark:text-amber-400">₹0</div>
                                        <div className="text-xs text-slate-400">Pending</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function LabsPage() {
    return (
        <Suspense fallback={<div className="p-6 text-slate-400">Loading...</div>}>
            <LabsPageContent />
        </Suspense>
    )
}
