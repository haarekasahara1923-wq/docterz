'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

const steps = ['Choose Plan', 'Clinic Info', 'Doctor Info', 'Account Setup']

const PLANS = [
  {
    key: 'BASIC',
    name: 'Basic',
    price: '₹999',
    period: '/month',
    desc: 'Perfect for solo practitioners',
    emoji: '🏥',
    color: 'border-slate-500/40 bg-slate-500/5',
    activeColor: 'border-teal-500 bg-teal-500/10',
    badge: null,
    features: [
      'Up to 100 patients/month',
      'Appointment scheduling',
      'Basic prescriptions',
      'Payment tracking',
      'Email support',
    ],
  },
  {
    key: 'PRO',
    name: 'Pro',
    price: '₹2,499',
    period: '/month',
    desc: 'For growing clinics',
    emoji: '🚀',
    color: 'border-teal-500/40 bg-teal-500/5',
    activeColor: 'border-teal-400 bg-teal-500/15',
    badge: 'MOST POPULAR',
    features: [
      'Unlimited patients',
      'AI VoiceRx',
      'Lab referral + commissions',
      'WhatsApp integration',
      'Revenue analytics',
      'Follow-up automation',
      'Priority support',
    ],
  },
  {
    key: 'ENTERPRISE',
    name: 'Enterprise',
    price: '₹5,999',
    period: '/month',
    desc: 'Multi-doctor clinics & hospitals',
    emoji: '🏢',
    color: 'border-violet-500/40 bg-violet-500/5',
    activeColor: 'border-violet-400 bg-violet-500/15',
    badge: 'BEST VALUE',
    features: [
      'Everything in Pro',
      'Multi-doctor support',
      'Custom branding',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
]

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('PRO') // default Pro
  const [form, setForm] = useState({
    clinicName: '',
    city: '',
    state: '',
    phone: '',
    doctorName: '',
    specialty: '',
    licenseNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  // Read plan from URL query param (e.g., ?plan=PRO)
  useEffect(() => {
    const planFromUrl = searchParams.get('plan')?.toUpperCase()
    if (planFromUrl && PLANS.find(p => p.key === planFromUrl)) {
      setSelectedPlan(planFromUrl)
    }
  }, [searchParams])

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh',
  ]

  const handleNext = () => {
    if (step === 1 && (!form.clinicName || !form.city || !form.phone)) {
      setError('Please fill all required fields')
      return
    }
    if (step === 2 && (!form.doctorName || !form.specialty)) {
      setError('Please fill all required fields')
      return
    }
    setError('')
    setStep(step + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!form.agreeTerms) {
      setError('Please accept the terms of service')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, selectedPlan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard?welcome=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const currentPlanInfo = PLANS.find(p => p.key === selectedPlan) || PLANS[1]

  return (
    <div className="min-h-screen bg-[#030d0b] flex items-center justify-center p-4 py-10">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0d9488 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #10b981)' }}>
              <span className="text-white font-black text-xl">D</span>
            </div>
            <span className="text-2xl font-black text-white">
              <span className="gradient-text">Docter</span>z
            </span>
          </Link>
          <p className="text-slate-400 mt-2 text-sm">Start your 7-day free trial today 🚀</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex flex-col items-center`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? 'bg-teal-500 text-white' :
                    i === step ? 'bg-teal-600 text-white ring-2 ring-teal-400 ring-offset-2 ring-offset-[#030d0b]' :
                      'bg-white/10 text-slate-500'
                  }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs mt-1 hidden sm:block ${i === step ? 'text-teal-400' : 'text-slate-600'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 sm:w-16 h-0.5 mx-2 ${i < step ? 'bg-teal-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-white/10 p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Step 0: Plan Selection */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Choose Your Plan</h2>
                <p className="text-slate-400 text-sm mb-5">All plans include a 7-day free trial. No credit card required.</p>
              </div>

              <div className="space-y-3">
                {PLANS.map((plan) => (
                  <div
                    key={plan.key}
                    onClick={() => setSelectedPlan(plan.key)}
                    className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 ${selectedPlan === plan.key ? plan.activeColor + ' ring-1 ring-inset ring-teal-500/50' : plan.color + ' hover:bg-white/5'
                      }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                    <div className="flex items-center gap-4">
                      {/* Radio */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPlan === plan.key ? 'border-teal-400' : 'border-slate-600'
                        }`}>
                        {selectedPlan === plan.key && (
                          <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                        )}
                      </div>
                      {/* Emoji */}
                      <span className="text-2xl">{plan.emoji}</span>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{plan.name}</span>
                          <span className="text-teal-300 font-bold text-sm">{plan.price}<span className="text-slate-500 font-normal text-xs">{plan.period}</span></span>
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5">{plan.desc}</p>
                        {selectedPlan === plan.key && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {plan.features.slice(0, 3).map((f, i) => (
                              <span key={i} className="text-[10px] bg-white/5 text-slate-300 px-2 py-0.5 rounded-full border border-white/10">✓ {f}</span>
                            ))}
                            {plan.features.length > 3 && (
                              <span className="text-[10px] bg-white/5 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20">+{plan.features.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl px-4 py-3 text-xs text-teal-300">
                🎁 You selected <strong>{currentPlanInfo.name} Plan</strong> — 7-day free trial with full {currentPlanInfo.name} features. No credit card required.
              </div>

              <button onClick={() => setStep(1)} className="w-full btn-primary py-3 rounded-xl text-sm font-semibold mt-2">
                Continue with {currentPlanInfo.name} Plan →
              </button>
            </div>
          )}

          {/* Step 1: Clinic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-white">Clinic Information</h2>
                <span className="text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded-full">
                  {currentPlanInfo.emoji} {currentPlanInfo.name} Trial
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-4">Tell us about your clinic</p>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Clinic Name *</label>
                <input type="text" required value={form.clinicName}
                  onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                  placeholder="Dr. Sharma's Clinic"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">City *</label>
                  <input type="text" required value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Mumbai"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">State *</label>
                  <select value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0a1a14] text-white focus:outline-none focus:border-teal-500/50 transition-all text-sm">
                    <option value="">Select State</option>
                    {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Clinic Phone *</label>
                <div className="flex gap-2">
                  <span className="px-3 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-400 text-sm flex items-center">+91</span>
                  <input type="tel" required maxLength={10} value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all text-sm" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm font-medium transition-colors">
                  ← Back
                </button>
                <button onClick={handleNext} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold">
                  Next: Doctor Info →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Doctor Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-1">Doctor Information</h2>
              <p className="text-slate-400 text-sm mb-4">Tell us about yourself</p>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name *</label>
                <input type="text" required value={form.doctorName}
                  onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                  placeholder="Dr. Rajesh Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Specialty *</label>
                <select value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0a1a14] text-white focus:outline-none focus:border-teal-500/50 transition-all text-sm">
                  <option value="">Select Specialty</option>
                  {['General Physician', 'Pediatrician', 'Gynecologist', 'Cardiologist', 'Dermatologist', 'Orthopedic', 'ENT', 'Ophthalmologist', 'Psychiatrist', 'Neurologist', 'Other'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Medical License Number (optional)</label>
                <input type="text" value={form.licenseNumber}
                  onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                  placeholder="MCI-12345678"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all text-sm" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm font-medium transition-colors">
                  ← Back
                </button>
                <button onClick={handleNext} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold">
                  Next: Account →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Account Setup */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-1">Create Your Account</h2>
              <p className="text-slate-400 text-sm mb-4">Set your login credentials</p>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address *</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="doctor@clinic.com"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Password *</label>
                <input type="password" required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm Password *</label>
                <input type="password" required value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all text-sm" />
              </div>

              {/* Summary before submit */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs space-y-1.5">
                <p className="text-slate-300 font-semibold mb-2">📋 Registration Summary</p>
                <p className="text-slate-400">🏥 <span className="text-white">{form.clinicName || '—'}</span></p>
                <p className="text-slate-400">👨‍⚕️ <span className="text-white">Dr. {form.doctorName || '—'}</span> · {form.specialty || '—'}</p>
                <p className="text-slate-400">📧 <span className="text-white">{form.email || '—'}</span></p>
                <p className="text-slate-400">
                  💎 Plan: <span className="text-teal-400 font-semibold">{currentPlanInfo.emoji} {currentPlanInfo.name}</span>
                  <span className="text-slate-500"> — 7-day free trial</span>
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.agreeTerms}
                  onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                  className="mt-0.5 accent-teal-500" />
                <span className="text-xs text-slate-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-teal-400 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-teal-400 hover:underline">Privacy Policy</Link>
                </span>
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm font-medium transition-colors">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-50">
                  {loading ? 'Setting up...' : `🚀 Start ${currentPlanInfo.name} Trial`}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-teal-400 hover:text-teal-300 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          ✅ 7-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030d0b] flex items-center justify-center">
        <div className="text-teal-400 animate-pulse">Loading...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
