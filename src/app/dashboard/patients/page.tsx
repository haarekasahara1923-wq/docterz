'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface Patient {
    id: string
    patientCode: string
    fullName: string
    phone: string
    email?: string
    age?: number
    gender?: string
    bloodGroup?: string
    chronicDiseases: string[]
    allergies: string[]
    lastVisit?: string
    totalVisits: number
    createdAt: string
}

const mockPatients: Patient[] = [
    {
        id: '1', patientCode: 'P-001', fullName: 'Rahul Verma', phone: '9876543210',
        email: 'rahul@example.com', age: 32, gender: 'MALE', bloodGroup: 'B_POS',
        chronicDiseases: ['Hypertension'], allergies: ['Penicillin'],
        lastVisit: '2026-02-20', totalVisits: 12, createdAt: '2025-06-10',
    },
    {
        id: '2', patientCode: 'P-002', fullName: 'Priya Shah', phone: '9876543211',
        email: 'priya@example.com', age: 28, gender: 'FEMALE', bloodGroup: 'A_POS',
        chronicDiseases: [], allergies: [],
        lastVisit: '2026-02-22', totalVisits: 5, createdAt: '2025-08-15',
    },
    {
        id: '3', patientCode: 'P-003', fullName: 'Amit Kumar', phone: '9876543212',
        age: 45, gender: 'MALE', bloodGroup: 'O_POS',
        chronicDiseases: ['Diabetes', 'Hypertension'], allergies: [],
        lastVisit: '2026-02-25', totalVisits: 28, createdAt: '2024-03-20',
    },
    {
        id: '4', patientCode: 'P-004', fullName: 'Sunita Rani', phone: '9876543213',
        age: 55, gender: 'FEMALE', bloodGroup: 'AB_POS',
        chronicDiseases: ['Thyroid'], allergies: ['Sulfa'],
        lastVisit: '2026-01-15', totalVisits: 8, createdAt: '2024-09-01',
    },
    {
        id: '5', patientCode: 'P-005', fullName: 'Vikram Patel', phone: '9876543214',
        email: 'vikram@example.com', age: 38, gender: 'MALE', bloodGroup: 'B_NEG',
        chronicDiseases: [], allergies: ['Aspirin'],
        lastVisit: '2026-02-18', totalVisits: 3, createdAt: '2025-12-01',
    },
]

const bloodGroupLabels: Record<string, string> = {
    A_POS: 'A+', A_NEG: 'A-', B_POS: 'B+', B_NEG: 'B-',
    AB_POS: 'AB+', AB_NEG: 'AB-', O_POS: 'O+', O_NEG: 'O-',
}

function PatientForm({ onClose, onSave }: { onClose: () => void; onSave: (p: any) => void }) {
    const [form, setForm] = useState({
        fullName: '', phone: '', email: '', age: '', gender: '',
        bloodGroup: '', address: '', allergies: '', chronicDiseases: '',
        emergencyName: '', emergencyPhone: '', notes: '',
    })
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        if (!form.fullName || !form.phone) return
        setLoading(true)
        // Simulate API call
        await new Promise(r => setTimeout(r, 800))
        onSave({ ...form, id: Date.now().toString(), patientCode: 'P-' + Date.now(), totalVisits: 0 })
        setLoading(false)
        onClose()
    }

    const fields = [
        { key: 'fullName', label: 'Full Name *', type: 'text', placeholder: 'Patient full name', col: 2 },
        { key: 'phone', label: 'Phone *', type: 'tel', placeholder: '9876543210', col: 1 },
        { key: 'email', label: 'Email', type: 'email', placeholder: 'patient@email.com', col: 1 },
        { key: 'age', label: 'Age', type: 'number', placeholder: '30', col: 1 },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full sm:max-w-2xl bg-white dark:bg-[#0a1410] rounded-t-3xl sm:rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-[#0a1410] px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">New Patient</h2>
                        <p className="text-xs text-slate-400">Register a new patient profile</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400">✕</button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Full Name *</label>
                            <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                                placeholder="Patient full name"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                        </div>
                        {[
                            { key: 'phone', label: 'Phone *', type: 'tel', placeholder: '9876543210' },
                            { key: 'email', label: 'Email', type: 'email', placeholder: 'patient@email.com' },
                            { key: 'age', label: 'Age', type: 'number', placeholder: '30' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{f.label}</label>
                                <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    placeholder={f.placeholder}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                            </div>
                        ))}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Gender</label>
                            <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d1a15] text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500">
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Blood Group</label>
                            <select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d1a15] text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500">
                                <option value="">Unknown</option>
                                {Object.entries(bloodGroupLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Address</label>
                            <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                                placeholder="Full address"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Allergies</label>
                            <input type="text" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })}
                                placeholder="Penicillin, Dust... (comma separated)"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Chronic Diseases</label>
                            <input type="text" value={form.chronicDiseases} onChange={e => setForm({ ...form, chronicDiseases: e.target.value })}
                                placeholder="Diabetes, Hypertension..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Emergency Contact Name</label>
                            <input type="text" value={form.emergencyName} onChange={e => setForm({ ...form, emergencyName: e.target.value })}
                                placeholder="Spouse / Parent name"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Emergency Contact Phone</label>
                            <input type="tel" value={form.emergencyPhone} onChange={e => setForm({ ...form, emergencyPhone: e.target.value })}
                                placeholder="9876543210"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Notes</label>
                            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                                placeholder="Any additional notes..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500 resize-none" />
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white dark:bg-[#0a1410] px-6 py-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={loading || !form.fullName || !form.phone}
                        className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-50">
                        {loading ? 'Saving...' : '✓ Save Patient'}
                    </button>
                </div>
            </div>
        </div>
    )
}

function PatientsPageContent() {
    const searchParams = useSearchParams()
    const [search, setSearch] = useState('')
    const [patients, setPatients] = useState<Patient[]>(mockPatients)
    const [showForm, setShowForm] = useState(searchParams.get('new') === '1')
    const [filter, setFilter] = useState<'all' | 'chronic' | 'recent'>('all')

    const filtered = patients.filter(p => {
        const q = search.toLowerCase()
        const matchesSearch = !q || p.fullName.toLowerCase().includes(q) || p.phone.includes(q) || p.patientCode.toLowerCase().includes(q)
        const matchesFilter = filter === 'all' || (filter === 'chronic' && p.chronicDiseases.length > 0)
        return matchesSearch && matchesFilter
    })

    return (
        <>
            {showForm && (
                <PatientForm
                    onClose={() => setShowForm(false)}
                    onSave={(p) => setPatients(prev => [p, ...prev])}
                />
            )}

            <div className="p-4 sm:p-6 pb-24 lg:pb-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-black text-slate-800 dark:text-white">Patient Records</h1>
                        <p className="text-sm text-slate-400">{patients.length} total patients registered</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        id="add-patient-btn"
                        className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap"
                    >
                        + New Patient
                    </button>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                        <input
                            type="search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name, phone, patient code..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'chronic', label: '🫀 Chronic' },
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id as any)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === f.id
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Patient Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((patient) => (
                        <Link
                            key={patient.id}
                            href={`/dashboard/patients/${patient.id}`}
                            className="group block bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-teal-300 dark:hover:border-teal-500/30 hover:shadow-lg dark:hover:shadow-teal-500/5 transition-all duration-200"
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                                        {patient.fullName[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-800 dark:text-white text-sm truncate group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                                            {patient.fullName}
                                        </div>
                                        <div className="text-xs text-slate-400">{patient.patientCode}</div>
                                        <div className="text-xs text-slate-400">{patient.phone}</div>
                                    </div>
                                    {patient.chronicDiseases.length > 0 && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 flex-shrink-0">
                                            🫀 Chronic
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 dark:border-white/5 pt-3">
                                    <div>
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{patient.age || '—'}</div>
                                        <div className="text-xs text-slate-400">Age</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                            {patient.bloodGroup ? bloodGroupLabels[patient.bloodGroup] : '—'}
                                        </div>
                                        <div className="text-xs text-slate-400">Blood</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{patient.totalVisits}</div>
                                        <div className="text-xs text-slate-400">Visits</div>
                                    </div>
                                </div>

                                {(patient.chronicDiseases.length > 0 || patient.allergies.length > 0) && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {patient.chronicDiseases.slice(0, 2).map(d => (
                                            <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                                {d}
                                            </span>
                                        ))}
                                        {patient.allergies.slice(0, 1).map(a => (
                                            <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400">
                                                ⚠️ {a}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {patient.lastVisit && (
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400">
                                        Last visit: {new Date(patient.lastVisit).toLocaleDateString('en-IN')}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-3">🔍</div>
                        <div className="text-slate-400 font-medium">No patients found</div>
                        <div className="text-slate-500 text-sm mt-1">Try a different search term</div>
                        <button onClick={() => setShowForm(true)} className="btn-primary mt-4 px-6 py-2.5 rounded-xl text-sm">
                            + Add First Patient
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default function PatientsPage() {
    return (
        <Suspense fallback={<div className="p-6 text-slate-400">Loading...</div>}>
            <PatientsPageContent />
        </Suspense>
    )
}
