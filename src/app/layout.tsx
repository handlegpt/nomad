import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'NOMAD.NOW - Digital Nomad Tools',
    template: '%s | NOMAD.NOW'
  },
  description: 'Essential tools and information for digital nomads, including real-time time, weather, visa countdown, city recommendations, and more. Help you find your next ideal destination.',
  keywords: [
    'digital nomad',
    'remote work',
    'visa guide',
    'city recommendations',
    'cost of living',
    'WiFi speed',
    'travel visa',
    'digital nomad visa',
    'global travel',
    'work travel'
  ],
  authors: [{ name: 'NOMAD.NOW Team' }],
  creator: 'NOMAD.NOW',
  publisher: 'NOMAD.NOW',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nomad.now'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'zh': '/zh',
      'es': '/es',
      'ja': '/ja',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nomad.now',
    title: 'NOMAD.NOW - Digital Nomad Tools',
    description: 'Essential tools and information for digital nomads, including real-time time, weather, visa countdown, city recommendations, and more.',
    siteName: 'NOMAD.NOW',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NOMAD.NOW - Digital Nomad Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOMAD.NOW - Digital Nomad Tools',
    description: 'Essential tools and information for digital nomads, including real-time time, weather, visa countdown, city recommendations, and more.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "NOMAD.NOW",
              "description": "Essential tools and information for digital nomads",
              "url": "https://nomad.now",
              "applicationCategory": "TravelApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "NOMAD.NOW"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 