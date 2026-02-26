'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const mockPatient = {
    id: '1', patientCode: 'P-001', fullName: 'Rahul Verma',
    phone: '9876543210', email: 'rahul@example.com',
    age: 32, gender: 'MALE', bloodGroup: 'B_POS',
    address: '123, MG Road, Jaipur, Rajasthan',
    chronicDiseases: ['Hypertension'], allergies: ['Penicillin'],
    emergencyContact: { name: 'Seema Verma', phone: '9876543299', relation: 'Wife' },
    notes: 'Patient regularly comes for BP checkup. Stress level is high due to work.',
    totalVisits: 12, createdAt: '2025-06-10',
}

const mockTimeline = [
    {
        id: 't1', type: 'prescription', date: '2026-02-20', title: 'Prescription',
        detail: 'Tab Amlodipine 5mg OD, Tab Atenolol 50mg BD',
        icon: '💊', color: 'bg-emerald-500',
    },
    {
        id: 't2', type: 'payment', date: '2026-02-20', title: 'Payment Collected',
        detail: '₹500 - Consultation · UPI',
        icon: '💳', color: 'bg-blue-500',
    },
    {
        id: 't3', type: 'lab', date: '2026-01-15', title: 'Lab Referral',
        detail: 'Lipid Profile, HbA1c - LifeCare Labs',
        icon: '🧪', color: 'bg-orange-500',
    },
    {
        id: 't4', type: 'prescription', date: '2026-01-15', title: 'Prescription',
        detail: 'Tab Metformin 500mg BD, Tab Amlodipine 5mg OD',
        icon: '💊', color: 'bg-emerald-500',
    },
    {
        id: 't5', type: 'payment', date: '2025-12-10', title: 'Payment Collected',
        detail: '₹500 - Consultation · Cash',
        icon: '💳', color: 'bg-blue-500',
    },
]

const bloodGroupLabels: Record<string, string> = {
    A_POS: 'A+', A_NEG: 'A-', B_POS: 'B+', B_NEG: 'B-',
    AB_POS: 'AB+', AB_NEG: 'AB-', O_POS: 'O+', O_NEG: 'O-',
}

export default function PatientProfilePage() {
    const params = useParams()
    const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'prescriptions' | 'payments'>('overview')
    const [shareLoading, setShareLoading] = useState(false)
    const [shareLink, setShareLink] = useState('')
    const patient = mockPatient

    const handleShare = async () => {
        setShareLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        setShareLink(`https://docterz.in/share/p/${Math.random().toString(36).substr(2, 12)}`)
        setShareLoading(false)
    }

    const handleWhatsApp = () => {
        const msg = `Hello ${patient.fullName}, here is your profile link: ${shareLink || 'https://docterz.in/share/demo'}`
        window.open(`https://wa.me/91${patient.phone}?text=${encodeURIComponent(msg)}`)
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '👤' },
        { id: 'timeline', label: 'Timeline', icon: '📊' },
        { id: 'prescriptions', label: 'Prescriptions', icon: '💊' },
        { id: 'payments', label: 'Payments', icon: '💳' },
    ]

    return (
        <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-4xl">
            {/* Back + Header */}
            <div className="mb-5">
                <Link href="/dashboard/patients" className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 mb-4">
                    ← Back to Patients
                </Link>

                <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
                            {patient.fullName[0]}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-start gap-3 mb-2">
                                <div>
                                    <h1 className="text-xl font-black text-slate-800 dark:text-white">{patient.fullName}</h1>
                                    <div className="text-sm text-slate-400">{patient.patientCode} · Registered {new Date(patient.createdAt).toLocaleDateString('en-IN')}</div>
                                </div>
                                {patient.chronicDiseases.length > 0 && (
                                    <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-500/20">
                                        🫀 Chronic Patient
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                {[
                                    { label: 'Age', value: `${patient.age}y` },
                                    { label: 'Gender', value: patient.gender === 'MALE' ? 'Male' : patient.gender === 'FEMALE' ? 'Female' : 'Other' },
                                    { label: 'Blood', value: bloodGroupLabels[patient.bloodGroup] || '—' },
                                    { label: 'Visits', value: patient.totalVisits },
                                ].map(info => (
                                    <div key={info.label} className="bg-slate-50 dark:bg-white/5 rounded-xl p-2.5 text-center">
                                        <div className="text-base font-bold text-slate-800 dark:text-white">{info.value}</div>
                                        <div className="text-xs text-slate-400">{info.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                        <Link href={`/dashboard/prescription?patient=${patient.id}`}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 text-sm font-medium hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-all">
                            💊 Write Rx
                        </Link>
                        <Link href={`/dashboard/appointments?patient=${patient.id}&new=1`}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all">
                            📅 Schedule
                        </Link>
                        <Link href={`/dashboard/labs?patient=${patient.id}&new=1`}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-all">
                            🧪 Lab Refer
                        </Link>
                        <button onClick={handleShare}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-sm font-medium hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-all">
                            {shareLoading ? '⏳ Generating...' : '🔗 Share Profile'}
                        </button>
                        <button onClick={handleWhatsApp}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-medium hover:bg-green-100 dark:hover:bg-green-500/20 transition-all">
                            📱 WhatsApp
                        </button>
                        <button
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-400 text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                            📄 Download PDF
                        </button>
                    </div>

                    {shareLink && (
                        <div className="mt-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20">
                            <div className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">🔗 Share Link (expires in 48 hours)</div>
                            <div className="flex items-center gap-2">
                                <input readOnly value={shareLink}
                                    className="flex-1 text-xs bg-transparent text-slate-700 dark:text-slate-300 border-none outline-none truncate" />
                                <button onClick={() => navigator.clipboard.writeText(shareLink)}
                                    className="text-xs px-2 py-1 rounded-lg bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400">
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-xl p-1 mb-5 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${activeTab === tab.id
                                ? 'bg-white dark:bg-teal-600 text-slate-800 dark:text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        {
                            title: '📋 Contact Info',
                            rows: [
                                { label: 'Phone', value: patient.phone },
                                { label: 'Email', value: patient.email || '—' },
                                { label: 'Address', value: patient.address || '—' },
                            ],
                        },
                        {
                            title: '🫀 Medical Info',
                            rows: [
                                { label: 'Chronic Diseases', value: patient.chronicDiseases.join(', ') || 'None' },
                                { label: 'Allergies', value: patient.allergies.join(', ') || 'None' },
                                { label: 'Blood Group', value: bloodGroupLabels[patient.bloodGroup] || 'Unknown' },
                            ],
                        },
                        {
                            title: '🆘 Emergency Contact',
                            rows: patient.emergencyContact ? [
                                { label: 'Name', value: patient.emergencyContact.name },
                                { label: 'Phone', value: patient.emergencyContact.phone },
                                { label: 'Relation', value: patient.emergencyContact.relation },
                            ] : [{ label: 'Status', value: 'Not provided' }],
                        },
                        {
                            title: '📝 Notes',
                            rows: [{ label: '', value: patient.notes || 'No notes added.' }],
                        },
                    ].map((section, i) => (
                        <div key={i} className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">{section.title}</h3>
                            <div className="space-y-3">
                                {section.rows.map((row, j) => (
                                    <div key={j}>
                                        {row.label && <div className="text-xs text-slate-400 mb-0.5">{row.label}</div>}
                                        <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">{row.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
                <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-5">Patient Visit History</h3>
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-white/5" />
                        <div className="space-y-4">
                            {mockTimeline.map((item, i) => (
                                <div key={item.id} className="relative pl-12">
                                    {/* Dot */}
                                    <div className={`absolute left-2 top-1 w-5 h-5 rounded-full ${item.color} flex items-center justify-center text-white text-xs z-10`}>
                                        {item.icon}
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div className="font-semibold text-sm text-slate-800 dark:text-white">{item.title}</div>
                                            <div className="text-xs text-slate-400 flex-shrink-0">
                                                {new Date(item.date).toLocaleDateString('en-IN')}
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
                <div className="space-y-4">
                    {mockTimeline.filter(t => t.type === 'prescription').map(rx => (
                        <div key={rx.id} className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <div className="font-bold text-slate-800 dark:text-white text-sm">Prescription</div>
                                    <div className="text-xs text-slate-400">{new Date(rx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                </div>
                                <button className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 transition-all">
                                    📄 PDF
                                </button>
                            </div>
                            <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-white/5 rounded-lg p-3 font-mono">
                                {rx.detail}
                            </div>
                        </div>
                    ))}
                    <Link href={`/dashboard/prescription?patient=${patient.id}&new=1`}
                        className="block w-full text-center py-3 rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-500/30 text-teal-600 dark:text-teal-400 text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-all">
                        + Write New Prescription
                    </Link>
                </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
                <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {mockTimeline.filter(t => t.type === 'payment').map(p => (
                            <div key={p.id} className="flex items-center gap-3 px-5 py-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-lg">💳</div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-800 dark:text-white">{p.detail.split(' · ')[0]}</div>
                                    <div className="text-xs text-slate-400">{p.detail.split(' · ')[1]} · {new Date(p.date).toLocaleDateString('en-IN')}</div>
                                </div>
                                <span className="badge-success">Paid</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
