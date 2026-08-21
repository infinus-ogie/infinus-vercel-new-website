/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async redirects() {
    return [
      {
        // Legacy ProjectPulse brochure PDF (renamed in 7915bfa, later removed) -> current brochure page.
        // Source must be percent-encoded: Next matches the redirect regex against the
        // encoded request path, so spaces have to be written as %20 to match.
        source: '/Project%20Pulse/Project%20Pulse%20PDF/ProjectPulse%20brochure3.pdf',
        destination: 'https://www.infinus.co/projectpulse/brochure',
        permanent: true,
      },
      {
        source: '/cfo',
        destination: '/grow/cfo',
        permanent: true,
      },
      {
        // The Privacy Policy is now split by locale: /privacy is the real ENGLISH page and
        // /sr/politika-privatnosti the real Serbian one. This reverses the Phase C direction,
        // which sent /privacy to a single bilingual /politika-privatnosti.
        //
        // One direct hop: /politika-privatnosti no longer has a page component, so this is
        // the only thing serving that path, and /privacy is a real page so nothing sends it
        // back here. No chain, no loop.
        source: '/politika-privatnosti',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'infinus.co',
          },
        ],
        destination: 'https://www.infinus.co/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/llms.txt',
        destination: '/well-known/llms.txt',
      },
      {
        source: '/llms.txt',
        destination: '/llms.txt',
      },
    ];
  },
  async headers() {
    return [
      {
        // Third-party SAP / Oxford Economics partner PDF: keep it downloadable
        // but out of the index (no verified publisher canonical available).
        // Applies ONLY to this exact file path.
        source: '/growth-professional-services-materials/34388_Oxford_ProServPartner_91961.pdf',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
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
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
