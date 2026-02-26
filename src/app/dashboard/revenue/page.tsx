'use client'

import { useState } from 'react'

const weeklyData = [
    { day: 'Mon', revenue: 7200, patients: 16 },
    { day: 'Tue', revenue: 9600, patients: 22 },
    { day: 'Wed', revenue: 6800, patients: 14 },
    { day: 'Thu', revenue: 11200, patients: 28 },
    { day: 'Fri', revenue: 8400, patients: 18 },
    { day: 'Sat', revenue: 14800, patients: 35 },
    { day: 'Sun', revenue: 5600, patients: 12 },
]

const monthlyData = [
    { month: 'Sep', revenue: 142000 },
    { month: 'Oct', revenue: 158000 },
    { month: 'Nov', revenue: 134500 },
    { month: 'Dec', revenue: 167000 },
    { month: 'Jan', revenue: 155500 },
    { month: 'Feb', revenue: 178500 },
]

const paymentBreakdown = [
    { mode: 'UPI', amount: 89000, count: 178, color: '#10b981' },
    { mode: 'Cash', amount: 56000, count: 120, color: '#0d9488' },
    { mode: 'Card', amount: 23000, count: 46, color: '#06b6d4' },
    { mode: 'Insurance', amount: 10500, count: 21, color: '#8b5cf6' },
]

const recentPayments = [
    { id: 'P001', patient: 'Rahul Verma', amount: 500, mode: 'UPI', service: 'Consultation', date: '2026-02-26' },
    { id: 'P002', patient: 'Priya Shah', amount: 800, mode: 'Cash', service: 'Consultation + ECG', date: '2026-02-26' },
    { id: 'P003', patient: 'Amit Kumar', amount: 500, mode: 'UPI', service: 'Follow-up', date: '2026-02-25' },
    { id: 'P004', patient: 'Sunita Rani', amount: 1200, mode: 'Card', service: 'Consultation + Lab', date: '2026-02-25' },
    { id: 'P005', patient: 'Vikram Patel', amount: 500, mode: 'Cash', service: 'Consultation', date: '2026-02-24' },
]

const expenses = [
    { category: 'Staff Salary', amount: 45000, month: 'Feb 2026' },
    { category: 'Rent', amount: 25000, month: 'Feb 2026' },
    { category: 'Medical Supplies', amount: 12000, month: 'Feb 2026' },
    { category: 'Equipment', amount: 8500, month: 'Feb 2026' },
    { category: 'Utilities', amount: 4500, month: 'Feb 2026' },
]

const paymentModeColors: Record<string, string> = {
    UPI: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    Cash: 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400',
    Card: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
    Insurance: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400',
}

export default function RevenuePage() {
    const [period, setPeriod] = useState<'week' | 'month'>('week')
    const [tab, setTab] = useState<'overview' | 'payments' | 'expenses'>('overview')

    const data = period === 'week' ? weeklyData : monthlyData
    const maxRevenue = Math.max(...data.map(d => d.revenue))
    const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
    const totalPayments = paymentBreakdown.reduce((s, p) => s + p.amount, 0)

    return (
        <div className="p-4 sm:p-6 pb-24 lg:pb-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { label: 'This Month', value: `₹${(178500 / 1000).toFixed(0)}K`, sub: '↑ 15% vs last month', icon: '💰', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
                    { label: 'Total Expenses', value: `₹${(totalExpenses / 1000).toFixed(0)}K`, sub: 'This month', icon: '💸', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' },
                    { label: 'Net Profit', value: `₹${((178500 - totalExpenses) / 1000).toFixed(0)}K`, sub: '48% margin', icon: '📈', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20' },
                    { label: 'Outstanding', value: '₹3,200', sub: '8 patients', icon: '⏳', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' },
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${stat.bg}`}>
                        <div className="text-xl mb-2">{stat.icon}</div>
                        <div className={`text-xl sm:text-2xl font-black ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-xl p-1 mb-5">
                {[
                    { id: 'overview', label: '📊 Overview' },
                    { id: 'payments', label: '💳 Payments' },
                    { id: 'expenses', label: '💸 Expenses' },
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id as any)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white dark:bg-teal-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* OVERVIEW TAB */}
            {tab === 'overview' && (
                <div className="space-y-5">
                    {/* Revenue Chart */}
                    <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Revenue Trend</h3>
                                <div className="text-xl font-black gradient-text">₹{totalRevenue.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-lg p-1">
                                <button onClick={() => setPeriod('week')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${period === 'week' ? 'bg-white dark:bg-teal-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                                    Week
                                </button>
                                <button onClick={() => setPeriod('month')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${period === 'month' ? 'bg-white dark:bg-teal-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                                    6 Months
                                </button>
                            </div>
                        </div>
                        <div className="flex items-end gap-3 h-36">
                            {data.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400" style={{ fontSize: '9px' }}>
                                        ₹{(d.revenue / 1000).toFixed(0)}K
                                    </div>
                                    <div className="w-full relative flex flex-col justify-end" style={{ height: '100px' }}>
                                        <div
                                            className={`w-full rounded-t-lg transition-all duration-500 ${i === data.length - 1 ? 'bg-gradient-to-t from-teal-600 to-teal-400' : 'bg-gradient-to-t from-slate-200 to-slate-100 dark:from-white/10 dark:to-white/5'
                                                }`}
                                            style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-slate-400">{period === 'week' ? (d as any).day : (d as any).month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Breakdown */}
                    <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">💳 Payment Mode Breakdown</h3>
                        <div className="space-y-3">
                            {paymentBreakdown.map((p, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">{p.mode}</span>
                                            <span className="text-slate-400 text-xs">{p.count} transactions</span>
                                        </div>
                                        <span className="font-bold text-slate-800 dark:text-white">₹{p.amount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${(p.amount / totalPayments) * 100}%`, backgroundColor: p.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Comparison */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3">🤖 AI Revenue Forecast</h3>
                            <div className="text-3xl font-black gradient-text mb-1">₹2.1L</div>
                            <div className="text-xs text-slate-400 mb-3">Predicted next month revenue</div>
                            <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" style={{ width: '78%' }} />
                            </div>
                            <div className="text-xs text-slate-400 mt-1">78% confidence based on trends</div>
                        </div>
                        <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3">📊 Service Revenue</h3>
                            {[
                                { service: 'Consultation', revenue: 125000, pct: 70 },
                                { service: 'Lab Commission', revenue: 32500, pct: 18 },
                                { service: 'Procedures', revenue: 21000, pct: 12 },
                            ].map((s, i) => (
                                <div key={i} className="mb-3">
                                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                                        <span>{s.service}</span>
                                        <span className="font-bold text-slate-800 dark:text-white">₹{(s.revenue / 1000).toFixed(0)}K</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${s.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* PAYMENTS TAB */}
            {tab === 'payments' && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">Recent Payments</h2>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10">
                                📊 Export CSV
                            </button>
                            <button id="record-payment-btn" className="btn-primary px-4 py-1.5 rounded-lg text-sm font-semibold">
                                + Record Payment
                            </button>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                                    <tr>
                                        {['Receipt', 'Patient', 'Service', 'Mode', 'Amount', 'Date'].map(h => (
                                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {recentPayments.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                                            <td className="px-4 py-3 text-xs font-mono text-teal-600 dark:text-teal-400">{p.id}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-white">{p.patient}</td>
                                            <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{p.service}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${paymentModeColors[p.mode] || ''}`}>{p.mode}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-bold text-slate-800 dark:text-white">₹{p.amount}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400">
                                                {new Date(p.date).toLocaleDateString('en-IN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* EXPENSES TAB */}
            {tab === 'expenses' && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">Monthly Expenses</h2>
                            <div className="text-lg font-black text-red-500">₹{totalExpenses.toLocaleString('en-IN')} total</div>
                        </div>
                        <button id="add-expense-btn" className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold">
                            + Add Expense
                        </button>
                    </div>
                    <div className="space-y-3">
                        {expenses.map((exp, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5">
                                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-lg">💸</div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm text-slate-800 dark:text-white">{exp.category}</div>
                                    <div className="text-xs text-slate-400">{exp.month}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-red-600 dark:text-red-400">₹{exp.amount.toLocaleString('en-IN')}</div>
                                    <div className="text-xs text-slate-400">{((exp.amount / totalExpenses) * 100).toFixed(0)}% of total</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
