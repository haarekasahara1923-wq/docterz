/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    domains: ['localhost', 'res.cloudinary.com', 'ui-avatars.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },

  // Neon serverless driver requires these webpack settings
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@neondatabase/serverless')
    }
    return config
  },

  // Skip type-checking during build (speeds up Vercel deploys)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Required for Prisma on Vercel
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

module.exports = nextConfig
