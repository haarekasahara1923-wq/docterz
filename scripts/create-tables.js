const { Pool } = require('@neondatabase/serverless')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    'postgresql://neondb_owner:npg_DV0hinro1Bat@ep-wandering-river-aizd890c.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
})

const sql = `
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUMS ──────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'CLINIC_ADMIN', 'STAFF');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'IN_QUEUE', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'UPI', 'CARD', 'ONLINE', 'INSURANCE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'REFUNDED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "SubscriptionPlan" AS ENUM ('TRIAL', 'BASIC', 'PRO', 'ENTERPRISE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'SENT', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "FollowupStatus" AS ENUM ('PENDING', 'SENT', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 'EXPORT', 'SHARE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── TABLES ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tenants (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "clinicName"    TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  logo            TEXT,
  "doctorName"    TEXT NOT NULL,
  "doctorSignature" TEXT,
  "themeColor"    TEXT DEFAULT '#0d9488',
  "opdTimings"    JSONB,
  "consultationFee" NUMERIC(10,2) DEFAULT 0,
  address         TEXT,
  city            TEXT,
  state           TEXT,
  pincode         TEXT,
  phone           TEXT,
  email           TEXT,
  website         TEXT,
  gstin           TEXT,
  "isActive"      BOOLEAN DEFAULT true,
  "createdAt"     TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS tenants_slug_idx ON tenants(slug);

CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"      TEXT REFERENCES tenants(id) ON DELETE SET NULL,
  email           TEXT UNIQUE NOT NULL,
  phone           TEXT,
  "passwordHash"  TEXT NOT NULL DEFAULT '',
  name            TEXT NOT NULL,
  role            "UserRole" DEFAULT 'STAFF',
  avatar          TEXT,
  "isActive"      BOOLEAN DEFAULT true,
  "lastLoginAt"   TIMESTAMPTZ,
  "otpHash"       TEXT,
  "otpExpiresAt"  TIMESTAMPTZ,
  "refreshToken"  TEXT,
  "createdAt"     TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS users_tenant_idx ON users("tenantId");
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

CREATE TABLE IF NOT EXISTS patients (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"       TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "patientCode"    TEXT NOT NULL,
  "fullName"       TEXT NOT NULL,
  phone            TEXT NOT NULL,
  email            TEXT,
  age              INT,
  "dateOfBirth"    TIMESTAMPTZ,
  gender           "Gender",
  address          TEXT,
  city             TEXT,
  "bloodGroup"     "BloodGroup",
  allergies        TEXT[] DEFAULT '{}',
  "chronicDiseases" TEXT[] DEFAULT '{}',
  "emergencyContact" JSONB,
  notes            TEXT,
  "isActive"       BOOLEAN DEFAULT true,
  "createdAt"      TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE ("tenantId", "patientCode")
);
CREATE INDEX IF NOT EXISTS patients_tenant_idx ON patients("tenantId");
CREATE INDEX IF NOT EXISTS patients_name_idx ON patients("tenantId", "fullName");
CREATE INDEX IF NOT EXISTS patients_phone_idx ON patients("tenantId", phone);

CREATE TABLE IF NOT EXISTS patient_audit_logs (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"  TEXT NOT NULL,
  "patientId" TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  "userId"    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action      "AuditAction" NOT NULL,
  field       TEXT,
  "oldValue"  TEXT,
  "newValue"  TEXT,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS pal_tenant_idx ON patient_audit_logs("tenantId");
CREATE INDEX IF NOT EXISTS pal_patient_idx ON patient_audit_logs("patientId");

CREATE TABLE IF NOT EXISTS appointments (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"       TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "patientId"      TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  "appointmentDate" TIMESTAMPTZ NOT NULL,
  "slotTime"       TEXT,
  status           "AppointmentStatus" DEFAULT 'SCHEDULED',
  type             TEXT DEFAULT 'OPD',
  reason           TEXT,
  notes            TEXT,
  fee              NUMERIC(10,2),
  "noShowRisk"     FLOAT,
  "whatsappSent"   BOOLEAN DEFAULT false,
  "smsSent"        BOOLEAN DEFAULT false,
  "createdAt"      TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS appts_tenant_idx ON appointments("tenantId");
CREATE INDEX IF NOT EXISTS appts_date_idx ON appointments("tenantId", "appointmentDate");
CREATE INDEX IF NOT EXISTS appts_patient_idx ON appointments("patientId");

CREATE TABLE IF NOT EXISTS queue_tokens (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"      TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "appointmentId" TEXT UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  "tokenNumber"   INT NOT NULL,
  "queueDate"     TIMESTAMPTZ NOT NULL,
  "estimatedTime" TIMESTAMPTZ,
  "calledAt"      TIMESTAMPTZ,
  "completedAt"   TIMESTAMPTZ,
  "createdAt"     TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS qt_tenant_date_idx ON queue_tokens("tenantId", "queueDate");

CREATE TABLE IF NOT EXISTS prescriptions (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"      TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "patientId"     TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  "appointmentId" TEXT UNIQUE REFERENCES appointments(id) ON DELETE SET NULL,
  "doctorId"      TEXT NOT NULL REFERENCES users(id),
  diagnosis       TEXT,
  symptoms        TEXT[] DEFAULT '{}',
  medicines       JSONB NOT NULL DEFAULT '[]',
  "labTests"      TEXT[] DEFAULT '{}',
  advice          TEXT,
  "followUpDate"  TIMESTAMPTZ,
  "digitalSig"    TEXT,
  "pdfUrl"        TEXT,
  "isVoiceRx"     BOOLEAN DEFAULT false,
  "voiceNotes"    TEXT,
  "createdAt"     TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS rx_tenant_idx ON prescriptions("tenantId");
CREATE INDEX IF NOT EXISTS rx_patient_idx ON prescriptions("patientId");

CREATE TABLE IF NOT EXISTS visit_notes (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"  TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "patientId" TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  note        TEXT NOT NULL,
  type        TEXT DEFAULT 'GENERAL',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"      TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "patientId"     TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  "appointmentId" TEXT UNIQUE REFERENCES appointments(id) ON DELETE SET NULL,
  amount          NUMERIC(10,2) NOT NULL,
  "paymentMode"   "PaymentMode" DEFAULT 'CASH',
  status          "PaymentStatus" DEFAULT 'PENDING',
  service         TEXT DEFAULT 'CONSULTATION',
  "receiptNumber" TEXT,
  discount        NUMERIC(10,2),
  notes           TEXT,
  "paidAt"        TIMESTAMPTZ,
  "createdAt"     TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS payments_tenant_idx ON payments("tenantId");
CREATE INDEX IF NOT EXISTS payments_date_idx ON payments("tenantId", "paidAt");

CREATE TABLE IF NOT EXISTS expenses (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"  TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category    TEXT NOT NULL,
  description TEXT NOT NULL,
  amount      NUMERIC(10,2) NOT NULL,
  date        TIMESTAMPTZ NOT NULL,
  receipt     TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS expenses_tenant_idx ON expenses("tenantId");

CREATE TABLE IF NOT EXISTS employees (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"  TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  salary      NUMERIC(10,2),
  "joinDate"  TIMESTAMPTZ,
  "isActive"  BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS employees_tenant_idx ON employees("tenantId");

CREATE TABLE IF NOT EXISTS laboratories (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"       TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "labName"        TEXT NOT NULL,
  "contactPerson"  TEXT,
  email            TEXT,
  phone            TEXT NOT NULL,
  address          TEXT,
  city             TEXT,
  "commissionPct"  NUMERIC(5,2) DEFAULT 0,
  notes            TEXT,
  "isActive"       BOOLEAN DEFAULT true,
  "totalReferrals" INT DEFAULT 0,
  "totalCommission" NUMERIC(10,2) DEFAULT 0,
  "createdAt"      TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS labs_tenant_idx ON laboratories("tenantId");

CREATE TABLE IF NOT EXISTS lab_referrals (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"     TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "patientId"    TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  "laboratoryId" TEXT NOT NULL REFERENCES laboratories(id) ON DELETE CASCADE,
  "referralId"   TEXT UNIQUE NOT NULL,
  tests          TEXT[] DEFAULT '{}',
  notes          TEXT,
  status         "ReferralStatus" DEFAULT 'PENDING',
  "emailSent"    BOOLEAN DEFAULT false,
  "emailSentAt"  TIMESTAMPTZ,
  "completedAt"  TIMESTAMPTZ,
  "reportUrl"    TEXT,
  "createdAt"    TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS lr_tenant_idx ON lab_referrals("tenantId");
CREATE INDEX IF NOT EXISTS lr_patient_idx ON lab_referrals("patientId");
CREATE INDEX IF NOT EXISTS lr_lab_idx ON lab_referrals("laboratoryId");

CREATE TABLE IF NOT EXISTS lab_commission_records (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"     TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "laboratoryId" TEXT NOT NULL REFERENCES laboratories(id) ON DELETE CASCADE,
  "referralId"   TEXT UNIQUE NOT NULL REFERENCES lab_referrals(id) ON DELETE CASCADE,
  amount         NUMERIC(10,2) NOT NULL,
  percentage     NUMERIC(5,2) NOT NULL,
  status         "CommissionStatus" DEFAULT 'PENDING',
  "paidAt"       TIMESTAMPTZ,
  notes          TEXT,
  "createdAt"    TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"       TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan             "SubscriptionPlan" DEFAULT 'TRIAL',
  status           "SubscriptionStatus" DEFAULT 'TRIAL',
  "startDate"      TIMESTAMPTZ DEFAULT NOW(),
  "endDate"        TIMESTAMPTZ NOT NULL,
  "trialEndsAt"    TIMESTAMPTZ,
  "razorpaySubId"  TEXT,
  "razorpayOrderId" TEXT,
  amount           NUMERIC(10,2) NOT NULL,
  "isYearly"       BOOLEAN DEFAULT false,
  "gracePeriodEnd" TIMESTAMPTZ,
  "createdAt"      TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS subs_tenant_idx ON subscriptions("tenantId");

CREATE TABLE IF NOT EXISTS plan_features (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  plan          "SubscriptionPlan" NOT NULL,
  "featureName" TEXT NOT NULL,
  "featureKey"  TEXT NOT NULL,
  "isEnabled"   BOOLEAN DEFAULT true,
  "limit"       INT,
  "createdAt"   TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (plan, "featureKey")
);

CREATE TABLE IF NOT EXISTS followups (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"      TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "patientId"     TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  "appointmentId" TEXT REFERENCES appointments(id) ON DELETE SET NULL,
  "scheduledFor"  TIMESTAMPTZ NOT NULL,
  message         TEXT,
  type            TEXT DEFAULT 'SMS',
  status          "FollowupStatus" DEFAULT 'PENDING',
  "sentAt"        TIMESTAMPTZ,
  "aiGenerated"   BOOLEAN DEFAULT false,
  "createdAt"     TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS followup_tenant_idx ON followups("tenantId");
CREATE INDEX IF NOT EXISTS followup_date_idx ON followups("scheduledFor");

CREATE TABLE IF NOT EXISTS chat_messages (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"  TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "from"      TEXT NOT NULL,
  "to"        TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        TEXT DEFAULT 'INBOUND',
  channel     TEXT DEFAULT 'WHATSAPP',
  intent      TEXT,
  status      TEXT DEFAULT 'SENT',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS chat_tenant_idx ON chat_messages("tenantId");

CREATE TABLE IF NOT EXISTS share_links (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"   TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "patientId"  TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  token        TEXT UNIQUE NOT NULL,
  "expiresAt"  TIMESTAMPTZ NOT NULL,
  "accessedAt" TIMESTAMPTZ,
  "isRevoked"  BOOLEAN DEFAULT false,
  type         TEXT DEFAULT 'PROFILE',
  "createdAt"  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS sl_token_idx ON share_links(token);

CREATE TABLE IF NOT EXISTS audit_logs (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId"   TEXT REFERENCES tenants(id) ON DELETE SET NULL,
  "userId"     TEXT REFERENCES users(id) ON DELETE SET NULL,
  action       "AuditAction" NOT NULL,
  resource     TEXT NOT NULL,
  "resourceId" TEXT,
  metadata     JSONB,
  "ipAddress"  TEXT,
  "userAgent"  TEXT,
  "createdAt"  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS al_tenant_idx ON audit_logs("tenantId");
CREATE INDEX IF NOT EXISTS al_user_idx ON audit_logs("userId");
CREATE INDEX IF NOT EXISTS al_date_idx ON audit_logs("createdAt");
`;

async function createTables() {
  const client = await pool.connect()
  try {
    console.log('🔗 Connected to Neon PostgreSQL...')
    console.log('⏳ Creating all tables...')
    await client.query(sql)
    console.log('✅ All 20 tables created successfully!')

    // Verify
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    console.log('\n📋 Tables in database:')
    result.rows.forEach(r => console.log('  ✓', r.table_name))
    console.log('\n🎉 Database setup complete!')
  } catch (err) {
    console.error('❌ Error:', err.message)
    if (err.detail) console.error('Detail:', err.detail)
  } finally {
    client.release()
    await pool.end()
  }
}

createTables()
