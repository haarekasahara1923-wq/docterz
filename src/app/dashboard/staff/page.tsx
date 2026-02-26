'use client'

import { useState } from 'react'

const mockStaff = [
    { id: '1', name: 'Anjali Gupta', role: 'Receptionist', phone: '9876543300', email: 'anjali@clinic.com', salary: 18000, joinDate: '2024-01-15', isActive: true, initials: 'AG' },
    { id: '2', name: 'Ramesh Kumar', role: 'Nurse', phone: '9876543301', salary: 22000, joinDate: '2024-03-01', isActive: true, initials: 'RK' },
    { id: '3', name: 'Meena Sharma', role: 'Receptionist', phone: '9876543302', salary: 16000, joinDate: '2025-06-01', isActive: true, initials: 'MS' },
]

const roleColors: Record<string, string> = {
    Receptionist: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
    Nurse: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-500/20',
    Technician: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
}

export default function StaffPage() {
    const [staff, setStaff] = useState(mockStaff)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', role: 'Receptionist', phone: '', email: '', salary: '' })

    const totalSalary = staff.filter(s => s.isActive).reduce((a, b) => a + b.salary, 0)

    return (
        <div className="p-4 sm:p-6 pb-24 lg:pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total Staff', value: staff.filter(s => s.isActive).length, icon: '👤', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' },
                    { label: 'Monthly Salary', value: `₹${(totalSalary / 1000).toFixed(0)}K`, icon: '💰', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20' },
                    { label: 'Nurses', value: staff.filter(s => s.role === 'Nurse').length, icon: '🩺', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20' },
                    { label: 'Receptionists', value: staff.filter(s => s.role === 'Receptionist').length, icon: '💼', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
                ].map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${s.bg}`}>
                        <div className="text-xl mb-1">{s.icon}</div>
                        <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">Staff Members</h2>
                <button onClick={() => setShowForm(!showForm)} id="add-staff-btn"
                    className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold">
                    + Add Staff
                </button>
            </div>

            {showForm && (
                <div className="mb-5 p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-teal-200 dark:border-teal-500/30">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">👤 Add Staff Member</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { key: 'name', label: 'Full Name *', placeholder: 'Anjali Gupta' },
                            { key: 'phone', label: 'Phone *', placeholder: '9876543300' },
                            { key: 'email', label: 'Email', placeholder: 'staff@clinic.com' },
                            { key: 'salary', label: 'Monthly Salary', placeholder: '18000', type: 'number' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">{f.label}</label>
                                <input type={f.type || 'text'} value={(form as any)[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    placeholder={f.placeholder}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500" />
                            </div>
                        ))}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Role *</label>
                            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1a15] text-slate-800 dark:text-white text-sm focus:outline-none">
                                <option value="Receptionist">Receptionist</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Technician">Technician</option>
                                <option value="Lab Assistant">Lab Assistant</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={() => setShowForm(false)}
                            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm">Cancel</button>
                        <button onClick={() => {
                            if (!form.name || !form.phone) return
                            setStaff(prev => [{
                                id: Date.now().toString(),
                                name: form.name, role: form.role,
                                phone: form.phone, email: form.email,
                                salary: parseInt(form.salary) || 0,
                                joinDate: new Date().toISOString().split('T')[0],
                                isActive: true,
                                initials: form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                            }, ...prev])
                            setShowForm(false)
                        }}
                            className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold">
                            ✓ Add Staff
                        </button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {staff.map(member => (
                    <div key={member.id} className="flex flex-wrap items-center gap-4 p-5 bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {member.initials}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-slate-800 dark:text-white">{member.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${roleColors[member.role] || ''}`}>{member.role}</span>
                                {member.isActive && <span className="badge-success">Active</span>}
                            </div>
                            <div className="text-xs text-slate-400">{member.phone}</div>
                            {member.email && <div className="text-xs text-slate-400">{member.email}</div>}
                            <div className="text-xs text-slate-400">Joined {new Date(member.joinDate).toLocaleDateString('en-IN')}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black text-slate-800 dark:text-white">₹{member.salary.toLocaleString('en-IN')}</div>
                            <div className="text-xs text-slate-400">/month</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
