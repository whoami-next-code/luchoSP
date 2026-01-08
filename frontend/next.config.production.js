/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de rendimiento
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // Optimizaciones de compilación
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'react-hook-form',
      '@headlessui/react',
      'recharts',
    ],
    scrollRestoration: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
    forceSwcTransforms: true,
    swcTraceProfiling: false,
    workerThreads: true,
    pageDataCollectionTimeout: 3000,
  },

  // Optimización de bundle
  webpack: (config, { isServer }) => {
    // Optimizar chunks
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            reuseExistingChunk: true,
          },
          styles: {
            name: 'styles',
            test: /\.(css|scss|sass)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      };

      // Minimización avanzada
      config.optimization.minimizer = [
        new (require('terser-webpack-plugin'))({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.warn'],
              passes: 2,
            },
            format: {
              comments: false,
            },
            mangle: {
              safari10: true,
            },
          },
          extractComments: false,
        }),
      ];
    }

    // Optimizar imports dinámicos
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;

    return config;
  },

  // Headers de seguridad y rendimiento
  async headers() {
    return [
      {
        source: '/catalogo/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          // Seguridad
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Rendimiento
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'ETag',
            value: 'W/"1"',
          },
          // Compresión
          {
            key: 'Accept-Encoding',
            value: 'gzip, deflate, br',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, immutable',
          },
        ],
      },
    ];
  },

  // Redirecciones para SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/inicio',
        destination: '/',
        permanent: true,
      },
      {
        source: '/servicios',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/productos',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/contacto',
        destination: '/contact',
        permanent: true,
      },
    ];
  },

  // Reescrituras
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      {
        source: '/manifest.json',
        destination: '/api/manifest',
      },
      {
        source: '/catalogo/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.industria-sp.com'}/api/:path*`,
      },
    ];
  },

  // Variables de entorno
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://industria-sp.com',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.industria-sp.com',
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || '',
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || '',
  },

  // Configuración base
  basePath: '',
  trailingSlash: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  // Configuración de i18n
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    localeDetection: true,
  },

  // Configuración de compilación
  distDir: '.next',
  cleanDistDir: true,
  generateBuildId: async () => {
    return new Date().getTime().toString();
  },

  // Deshabilitar source maps en producción
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },

  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: 'tsconfig.json',
  },

  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'lib', 'utils'],
  },
};

module.exports = nextConfig;
