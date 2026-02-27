'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [currentStat, setCurrentStat] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const stats = [
    { value: '10,000+', label: 'Clinics Trust Us' },
    { value: '50L+', label: 'Patients Managed' },
    { value: '₹2Cr+', label: 'Revenue Tracked' },
    { value: '98%', label: 'Doctor Satisfaction' },
  ]

  const features = [
    {
      icon: '🤖',
      title: 'AI VoiceRx',
      desc: 'Speak your prescription in seconds. AI formats, checks interactions, and generates a signed PDF.',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: '📱',
      title: 'Smart Queue',
      desc: 'Walk-in tokens + time slots. Real-time WhatsApp updates so patients never wait in the dark.',
      color: 'from-teal-500 to-emerald-600',
    },
    {
      icon: '🧪',
      title: 'Lab Commission Tracker',
      desc: 'Refer patients to labs, auto-email referrals, and track commissions with one click.',
      color: 'from-orange-500 to-amber-600',
    },
    {
      icon: '💰',
      title: 'Revenue Analytics',
      desc: 'Daily, monthly, service-wise revenue with AI-powered forecasting. Know your numbers.',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: '📋',
      title: 'Patient Timeline',
      desc: 'Complete history — visits, prescriptions, labs, payments — in a beautiful timeline view.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: '🔔',
      title: 'Follow-up Autopilot',
      desc: 'AI writes personalized WhatsApp follow-ups. Chronic patients never miss their reminders.',
      color: 'from-indigo-500 to-blue-600',
    },
  ]

  const plans = [
    {
      name: 'Basic',
      planKey: 'BASIC',
      price: '₹999',
      period: '/month',
      desc: 'Perfect for solo practitioners',
      features: [
        'Up to 100 patients/month',
        'Appointment scheduling',
        'Basic prescriptions',
        'Payment tracking',
        'Email support',
      ],
      cta: 'Start Free Trial',
      ctaLink: '/auth/register?plan=BASIC',
      popular: false,
      color: 'from-slate-600 to-slate-700',
    },
    {
      name: 'Pro',
      planKey: 'PRO',
      price: '₹2,499',
      period: '/month',
      desc: 'For growing clinics',
      features: [
        'Unlimited patients',
        'AI VoiceRx',
        'Lab referral + commissions',
        'WhatsApp integration',
        'Revenue analytics',
        'Follow-up automation',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      ctaLink: '/auth/register?plan=PRO',
      popular: true,
      color: 'from-teal-500 to-emerald-600',
    },
    {
      name: 'Enterprise',
      planKey: 'ENTERPRISE',
      price: '₹5,999',
      period: '/month',
      desc: 'Multi-doctor clinics & hospitals',
      features: [
        'Everything in Pro',
        'Multi-doctor support',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      ctaLink: '/auth/register?plan=ENTERPRISE',
      popular: false,
      color: 'from-violet-600 to-purple-700',
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#030d0b] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #10b981)' }}>
                <span className="text-white font-black text-lg">D</span>
              </div>
              <span className="text-xl font-black tracking-tight">
                <span className="gradient-text">Docter</span>z
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">Pricing</a>
              <a href="#demo" className="text-sm text-slate-300 hover:text-white transition-colors">Demo</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="btn-primary text-sm px-5 py-2.5"
              >
                Start Free Trial →
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-black/90 backdrop-blur-xl px-4 py-4 space-y-3">
            <a href="#features" className="block text-slate-300 hover:text-white py-2">Features</a>
            <a href="#pricing" className="block text-slate-300 hover:text-white py-2">Pricing</a>
            <a href="#demo" className="block text-slate-300 hover:text-white py-2">Demo</a>
            <Link href="/auth/login" className="block text-slate-300 hover:text-white py-2">Sign In</Link>
            <Link href="/auth/register" className="btn-primary w-full text-center text-sm py-3 block">
              Start Free Trial →
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #0d9488 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Now serving 10,000+ clinics across India 🇮🇳
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            Run Your Clinic on{' '}
            <span className="gradient-text">Autopilot.</span>
            <br />
            <span className="text-slate-400 text-3xl sm:text-4xl md:text-5xl font-bold">
              Powered by AI. Built for India.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            From AI prescriptions to lab commission tracking — Docterz automates everything
            so you can focus on what matters most: <strong className="text-white">healing patients.</strong>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/register" className="w-full sm:w-auto btn-primary text-base px-8 py-4 rounded-2xl">
              🚀 Start 7-Day Free Trial
            </Link>
            <a href="#demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all text-base">
              ▶ Watch Demo
            </a>
          </div>

          {/* Live Stats Ticker */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className={`text-center transition-all duration-500 ${currentStat === i ? 'scale-110' : 'scale-100 opacity-60'}`}>
                <div className="text-2xl md:text-3xl font-black gradient-text">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Your Clinic Dashboard,{' '}
            <span className="gradient-text">Reimagined</span>
          </h2>
          <p className="text-slate-400 text-lg">Everything a modern Indian clinic needs in one place</p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1f1a 100%)' }}>
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            </div>
            <div className="flex-1 bg-white/5 rounded-md text-xs text-slate-500 py-1 px-3 text-center max-w-96 mx-auto">
              app.docterz.in/dashboard
            </div>
          </div>

          {/* Mock Dashboard UI */}
          <div className="flex min-h-[500px]">
            {/* Sidebar */}
            <div className="w-56 border-r border-white/5 bg-black/20 p-3 hidden md:block">
              <div className="flex items-center gap-2 mb-6 p-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #10b981)' }}>
                  <span className="text-white font-black text-sm">D</span>
                </div>
                <span className="text-sm font-bold text-white">Docterz</span>
              </div>
              {['Dashboard', 'Patients', 'Appointments', 'Queue', 'Prescription', 'Lab Referrals', 'Revenue', 'Follow-ups'].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-1 ${i === 0 ? 'bg-teal-500/20 text-teal-400' : 'text-slate-500 hover:bg-white/5'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-teal-400' : 'bg-slate-600'}`}></div>
                  {item}
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-5 overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-white font-bold text-sm">Good morning, Dr. Sharma 👋</div>
                  <div className="text-slate-500 text-xs">Thursday, 26 Feb 2026</div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-teal-500/20 text-teal-400 text-xs px-3 py-1.5 rounded-lg border border-teal-500/20">
                    🟢 Queue Active · Token 12
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Today's Patients", value: '24', change: '+3', icon: '👥', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                  { label: "Today's Revenue", value: '₹8,400', change: '+12%', icon: '💰', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { label: 'Queue Position', value: '#12', change: '~15 min', icon: '🏥', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { label: 'Pending Followups', value: '7', change: 'Due today', icon: '🔔', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                ].map((stat, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${stat.color}`}>
                    <div className="text-lg mb-1">{stat.icon}</div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-xs opacity-80">{stat.label}</div>
                    <div className="text-xs mt-1 text-slate-500">{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* Queue and appointments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Live Queue</div>
                  {[
                    { name: 'Rahul Verma', token: '10', wait: '2 min', status: 'In Consultation' },
                    { name: 'Priya Shah', token: '11', wait: '8 min', status: 'Waiting' },
                    { name: 'Amit Kumar', token: '12', wait: '15 min', status: 'Waiting' },
                  ].map((p, i) => (
                    <div key={i} className={`flex items-center gap-3 py-2 ${i < 2 ? 'border-b border-white/5' : ''}`}>
                      <div className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${i === 0 ? 'bg-teal-500/30 text-teal-400' : 'bg-white/5 text-slate-400'}`}>
                        {p.token}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-white font-medium">{p.name}</div>
                        <div className="text-xs text-slate-600">{p.wait} wait</div>
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 text-slate-400'}`}>
                        {p.status}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">AI VoiceRx</div>
                  <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                        🎤
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">Recording...</div>
                        <div className="text-xs text-slate-500">Speak your prescription</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 items-center h-6">
                      {Array(20).fill(0).map((_, i) => (
                        <div key={i} className="flex-1 bg-teal-400 rounded-full opacity-60"
                          style={{ height: `${Math.random() * 100}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 italic">"Tab Paracetamol 500mg, twice daily for 5 days..."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-sm font-medium mb-6">
            ✨ Everything Your Clinic Needs
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            One Platform.{' '}
            <span className="gradient-text">Infinite Possibilities.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Replace 5 different tools with one smart platform designed specifically for Indian clinics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Gradient orb */}
              <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${feature.color} blur-2xl`} />

              <div className={`inline-flex w-12 h-12 rounded-xl items-center justify-center text-2xl mb-4 bg-gradient-to-br ${feature.color} bg-opacity-10`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>

              <div className={`mt-4 text-xs font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent flex items-center gap-1 group-hover:gap-2 transition-all`}>
                Learn more →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INDIA SPECIFIC ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-white/5 p-8 md:p-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1f1c 0%, #0d1628 100%)' }}>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #0d9488, transparent 60%)`,
          }} />

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-4xl mb-4">🇮🇳</div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Built for <span className="gradient-text">Bharat.</span>
                <br />Works for Every Doctor.
              </h2>
              <p className="text-slate-400 mb-8">
                From a single-room clinic in Lucknow to a multi-specialty center in Mumbai —
                Docterz adapts to how Indian doctors actually work.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🗣️', text: 'Hindi + English UI' },
                  { icon: '💳', text: 'UPI, Cash, Insurance' },
                  { icon: '📱', text: 'WhatsApp Integrated' },
                  { icon: '🔒', text: 'DPDP Compliant' },
                  { icon: '☁️', text: 'Works Offline' },
                  { icon: '🧾', text: 'GST Receipt Ready' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { title: 'WhatsApp for Everything', desc: 'Patients book, cancel, and get updates via WhatsApp. No app download needed.', icon: '💬' },
                { title: 'No Internet? No Problem.', desc: 'Core features work offline. Syncs automatically when connection is restored.', icon: '📶' },
                { title: 'Data Stays in India', desc: 'Hosted on Indian servers. You own your data. DPDP compliant.', icon: '🛡️' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
                  <div className="text-2xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                    <div className="text-slate-400 text-xs">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Simple, <span className="gradient-text">Honest Pricing</span>
          </h2>
          <p className="text-slate-400 text-lg">Start free. No credit card required. Cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${plan.popular
                  ? 'border-teal-500/50 bg-gradient-to-b from-teal-900/30 to-emerald-900/20 scale-105'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-slate-400 text-sm">{plan.desc}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-slate-500 text-sm">{plan.period}</span>
                <div className="text-xs text-slate-500 mt-1">Save 20% with yearly billing</div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-teal-400 flex-shrink-0 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={(plan as any).ctaLink || '/auth/register'}
                className={`w-full block text-center py-3 rounded-xl font-semibold transition-all ${plan.popular
                    ? 'btn-primary'
                    : 'border border-white/20 text-white hover:bg-white/5'
                  }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">
          Loved by <span className="gradient-text">Doctors Across India</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Anita Sharma',
              specialty: 'General Physician, Jaipur',
              text: 'The VoiceRx feature alone saves me 2 hours every day. My patients love the WhatsApp updates!',
              stars: 5,
            },
            {
              name: 'Dr. Rajesh Patel',
              specialty: 'Pediatrician, Ahmedabad',
              text: 'Lab commission tracking is a game-changer. I never knew how much I was earning from referrals.',
              stars: 5,
            },
            {
              name: 'Dr. Kavya Nair',
              specialty: 'Gynecologist, Kochi',
              text: 'My receptionist was trained in 30 minutes. The interface is incredibly intuitive.',
              stars: 5,
            },
          ].map((t, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="flex gap-0.5 mb-3">
                {Array(t.stars).fill(0).map((_, j) => (
                  <span key={j} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">"{t.text}"</p>
              <div>
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-slate-500 text-xs">{t.specialty}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl p-10 md:p-16 relative overflow-hidden border border-teal-500/20"
            style={{ background: 'linear-gradient(135deg, #0a2722 0%, #0d1f38 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 50% 0%, #0d9488, transparent 60%)`,
            }} />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                Ready to Transform<br />
                <span className="gradient-text">Your Clinic?</span>
              </h2>
              <p className="text-slate-400 mb-8 text-lg">
                Join 10,000+ Indian doctors already running their clinics on autopilot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="btn-primary px-8 py-4 text-base rounded-2xl">
                  🚀 Start 7-Day Free Trial
                </Link>
                <a href="tel:+919999999999" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all text-base">
                  📞 Call Sales: +91-9999-999-999
                </a>
              </div>
              <p className="text-slate-600 text-xs mt-4">No credit card · Cancel anytime · Setup in 5 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #10b981)' }}>
                  <span className="text-white font-black text-lg">D</span>
                </div>
                <span className="text-xl font-black">
                  <span className="gradient-text">Docter</span>z
                </span>
              </div>
              <p className="text-slate-500 text-sm">AI-powered clinic automation for Indian healthcare providers.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Demo', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'DPDP Compliance', 'Cookie Policy'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-semibold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">© 2026 Docterz. All rights reserved. Made with ❤️ in India 🇮🇳</p>
            <div className="flex items-center gap-4 text-slate-600 text-sm">
              <span>🔒 DPDP Compliant</span>
              <span>🔐 AES-256 Encrypted</span>
              <span>🇮🇳 Indian Servers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
