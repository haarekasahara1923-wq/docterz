import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Docterz — AI Clinic Automation for India',
    template: '%s | Docterz'
  },
  description: 'India\'s most advanced AI-powered clinic management SaaS. Automate appointments, prescriptions, lab referrals, billing and patient records — all in one beautiful platform.',
  keywords: ['clinic management', 'doctor software', 'patient management', 'medical saas', 'india', 'prescription', 'appointment booking', 'lab referral'],
  authors: [{ name: 'Docterz' }],
  creator: 'Docterz',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://docterz.in',
    title: 'Docterz — AI Clinic Automation for India',
    description: 'The smartest clinic management platform for Indian doctors.',
    siteName: 'Docterz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Docterz — AI Clinic Automation for India',
    description: 'The smartest clinic management platform for Indian doctors.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0d9488' },
    { media: '(prefers-color-scheme: dark)', color: '#134e4a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
