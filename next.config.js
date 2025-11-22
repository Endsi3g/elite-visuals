  /** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Optimisation pour le déploiement
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  
  // Optimisations de performance
  reactStrictMode: true,
  
  // Optimisation des bundles
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Configuration Turbopack
  transpilePackages: ['konva', 'react-konva'],
  
  // Variables d'environnement requises pour le build
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Exclure les modules canvas/konva du bundle serveur
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'konva', 'react-konva']
    }
    return config
  },
}

module.exports = nextConfig
