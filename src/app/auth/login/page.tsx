'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', phone: '', otp: '' })
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      // Store token and redirect
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      if (data.user.role === 'SUPER_ADMIN') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setOtpSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, otp: form.otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030d0b] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #0d9488 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="w-full max-w-md relative">
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
          <p className="text-slate-400 mt-2 text-sm">Welcome back, Doctor 👋</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-white/10 p-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {/* Tabs */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6">
            <button
              onClick={() => { setTab('email'); setError('') }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'email' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              📧 Email Login
            </button>
            <button
              onClick={() => { setTab('otp'); setError('') }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'otp' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              📱 OTP Login
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Email Login Form */}
          {tab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="doctor@clinic.com"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:bg-white/8 transition-all text-sm"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-400">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-teal-400 hover:text-teal-300">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In →'}
              </button>
            </form>
          )}

          {/* OTP Login Form */}
          {tab === 'otp' && (
            <form onSubmit={handleOtpLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="px-3 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-400 text-sm flex items-center">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || form.phone.length !== 10}
                  className="w-full btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP →'}
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Enter OTP</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={form.otp}
                      onChange={(e) => setForm({ ...form, otp: e.target.value })}
                      placeholder="6-digit OTP"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all text-sm text-center text-lg tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs text-teal-400 hover:text-teal-300 mt-1 ml-1"
                    >
                      Resend OTP
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || form.otp.length !== 6}
                    className="w-full btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Login →'}
                  </button>
                </>
              )}
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-teal-400 hover:text-teal-300 font-medium">
                Register your clinic
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          🔒 Secured with AES-256 encryption · DPDP Compliant
        </p>
      </div>
    </div>
  )
}
