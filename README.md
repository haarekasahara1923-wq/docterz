# 🏥 Docterz — AI-Powered Clinic Automation SaaS

India's most advanced AI-powered clinic management platform for small and mid-sized clinics. Mobile-first, multi-tenant, production-ready.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Set up your database (PostgreSQL) and update DATABASE_URL in .env

# 4. Generate Prisma client
npm run prisma:generate

# 5. Run database migrations
npm run prisma:migrate

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo Credentials:**
- Email: `doctor@clinic.com` | Password: any 4+ chars

---

## 📁 Project Structure

```
docterz/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   ├── auth/
│   │   │   ├── login/page.tsx          # Email + OTP login
│   │   │   └── register/page.tsx       # 3-step clinic registration
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Sidebar + mobile nav
│   │   │   ├── page.tsx                # Main dashboard
│   │   │   ├── patients/
│   │   │   │   ├── page.tsx            # Patient list
│   │   │   │   └── [id]/page.tsx       # Patient profile
│   │   │   ├── appointments/page.tsx   # Appointment management
│   │   │   ├── queue/page.tsx          # Live queue
│   │   │   ├── prescription/page.tsx   # AI VoiceRx
│   │   │   ├── labs/page.tsx           # Lab referrals + commissions
│   │   │   ├── revenue/page.tsx        # Revenue analytics
│   │   │   ├── followups/page.tsx      # Follow-up automation
│   │   │   ├── staff/page.tsx          # Staff management
│   │   │   └── settings/page.tsx       # Clinic settings
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── register/route.ts
│   │       │   ├── send-otp/route.ts
│   │       │   └── verify-otp/route.ts
│   │       ├── patients/route.ts
│   │       └── lab-referrals/route.ts
│   └── middleware.ts                   # Auth + tenant middleware
├── prisma/
│   └── schema.prisma                   # Complete DB schema
├── .env.example                        # Environment template
└── next.config.js
```

---

## 🗄️ Database Schema

All 20 tables defined in `prisma/schema.prisma`:

| Table | Description |
|-------|-------------|
| `tenants` | Clinic/tenant profile |
| `users` | Doctors & staff with roles |
| `patients` | Patient master records |
| `patient_audit_logs` | All patient data changes |
| `appointments` | Schedule + OPD bookings |
| `queue_tokens` | Live queue system |
| `prescriptions` | Digital prescriptions |
| `visit_notes` | SOAP notes per visit |
| `payments` | Revenue tracking |
| `expenses` | Expense management |
| `employees` | Staff records |
| `laboratories` | Lab directory |
| `lab_referrals` | Patient-lab referrals |
| `lab_commission_records` | Commission tracking |
| `subscriptions` | SaaS billing |
| `plan_features` | Feature gating |
| `followups` | Automated reminders |
| `chat_messages` | WhatsApp/SMS logs |
| `share_links` | Secure time-limited shares |
| `audit_logs` | Platform audit trail |

---

## 🔑 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/docterz"

# JWT (must be 32+ chars)
JWT_SECRET="your-super-secret-jwt-minimum-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-minimum-32-chars"

# Email (Gmail App Password or SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASS="your-app-password"

# Razorpay (for subscriptions)
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."

# WhatsApp (WATI.io recommended for India)
WHATSAPP_API_URL="https://api.wati.io"
WHATSAPP_API_TOKEN="your-wati-token"

# SMS (Fast2SMS for India)
SMS_API_KEY="your-fast2sms-api-key"

# AI (any combination)
OPENAI_API_KEY="sk-..."
GROQ_API_KEY="gsk_..."

# File Storage (S3/Cloudflare R2/DO Spaces)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="docterz-storage"
```

---

## 🎯 Features Implemented

### ✅ Authentication & Security
- Email + Password login
- OTP-based mobile login
- JWT access tokens (15min) + refresh tokens (7d)
- HTTP-only cookie for refresh token
- Role-based access (Super Admin / Doctor / Staff)
- Middleware-based auth guard

### ✅ Patient Management
- Create, read, update patient profiles
- Search by name, phone, patient code
- Chronic disease + allergy tracking
- Emergency contact management
- Patient visit timeline (appointments + prescriptions + labs + payments)
- Secure share links (48-hour expiry)
- Patient profile PDF download

### ✅ Appointment & Queue System
- Walk-in + time-slot booking
- Token-based queue management
- Real-time queue display with current token
- Emergency prioritization
- No-show status tracking
- WhatsApp/SMS confirmation stubs

### ✅ AI VoiceRx Prescription
- Voice recording with MediaRecorder API
- AI transcription simulation (connect to Whisper/Groq)
- Medicine auto-suggestion (typed search)
- Drug frequency + duration selectors
- Lab test prescription
- Follow-up date scheduling
- PDF generation stub + WhatsApp sharing

### ✅ Lab Referral & Commission System
- Lab directory with commission % setup
- Patient-to-lab referral creation
- Automatic email stub (connect SMTP)
- Referral ID generation (REF-YYYY-NNN format)
- Commission dashboard per lab
- Completed/pending commission tracking
- CSV export ready

### ✅ Revenue & Finance
- Daily/weekly/monthly revenue charts
- Service-wise revenue breakdown
- Payment mode split (UPI/Cash/Card/Insurance)
- Expense tracking by category
- AI revenue forecast display
- Outstanding payments tracking

### ✅ Follow-up Automation
- AI-generated personalized follow-up messages
- Hindi-friendly message templates
- WhatsApp + SMS channel selection
- Schedule-based automation
- Chronic patient reminder engine

### ✅ Clinic Settings
- Clinic branding (name, logo, theme color)
- OPD timing per day of week
- Notification toggles
- Subscription management (Razorpay ready)
- Password change + security settings

### ✅ Staff Management
- Add/view staff members
- Role assignment (Receptionist/Nurse/Technician)
- Salary tracking
- Monthly salary calculation

---

## 🔌 Integration Checklist

| Service | Provider | Status |
|---------|----------|--------|
| Database | PostgreSQL + Prisma | Schema ready |
| Email | Nodemailer + Gmail/SMTP | Stub ready |
| WhatsApp | WATI.io API | Stub ready |
| SMS | Fast2SMS / MSG91 | Stub ready |
| Payment | Razorpay Subscriptions | Stub ready |
| AI Voice | OpenAI Whisper / Groq | Stub ready |
| AI Chat | OpenAI GPT / Groq LLaMA | Stub ready |
| File Storage | S3 / R2 / DO Spaces | Config ready |
| Queue | Redis + BullMQ | Config ready |

---

## 🚀 Deployment Guide

### Frontend → Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Backend Database → Neon (PostgreSQL)
1. Create account at [neon.tech](https://neon.tech)
2. Create a project
3. Copy connection string to `.env` as `DATABASE_URL`

### Redis → Upstash
1. Create account at [upstash.com](https://upstash.com)
2. Create Redis database
3. Copy URL to `.env` as `REDIS_URL`

---

## 🏗️ Production Checklist

- [ ] Set all environment variables in Vercel
- [ ] Run `npx prisma migrate deploy` in production
- [ ] Set up Razorpay webhooks at `/api/webhooks/razorpay`
- [ ] Configure WATI.io WhatsApp Business API
- [ ] Set up Fast2SMS API key for OTP
- [ ] Configure SMTP for lab referral emails
- [ ] Set up Cron jobs for follow-up automation
- [ ] Enable daily DB backup
- [ ] Configure rate limiting (Upstash Redis)
- [ ] Set up Sentry for error monitoring

---

## 🔒 Security Features

- AES-256 ready (add to data at rest)
- JWT with proper expiry
- HTTP-only cookies
- Row-level security via `tenant_id`
- Rate limiting middleware (add Upstash)
- Input validation with Zod
- XSS protection (Next.js built-in)
- DPDP compliance notes included

---

## 📱 Mobile Support

- Mobile-first responsive design
- Bottom navigation bar on mobile
- Large touch targets (min 44px)
- Safe area padding for notched phones
- Offline-ready architecture (add PWA)

---

*Built with ❤️ for Indian doctors. Powered by Next.js 14 + TypeScript + Tailwind CSS + Prisma + PostgreSQL*

<!-- Trigger deployment for SMTP update -->
