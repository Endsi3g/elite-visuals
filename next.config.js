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
  },
  // Optimisation pour le déploiement
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
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
    // Alias pour forcer l'utilisation de la version browser de Konva
    config.resolve.alias = {
      ...config.resolve.alias,
      'konva': 'konva/lib/index-browser.js',
    }
    return config
  },
  experimental: {
    // Supprimer l'option serverActions obsolète
    optimizePackageImports: ['react-konva', 'konva'],
  },
}

module.exports = nextConfig
