import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      // Vercel Blob (imágenes subidas en producción)
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      // Devicons (íconos de tecnologías)
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      // Simple Icons CDN
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
    ],
    // Para imágenes locales NO necesitas configuración extra
    unoptimized: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;