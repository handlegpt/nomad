import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { GlobalStateProvider } from '@/contexts/GlobalStateContext'
import { UserProvider } from '@/hooks/useUser'
import GlobalLoading from '@/components/GlobalLoading'
import GlobalNotifications from '@/components/GlobalNotifications'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nomad Now - Digital Nomad Information Hub',
  description: 'Comprehensive digital nomad guide with visa information, tax guidance, and essential tools for global nomads.',
  keywords: 'digital nomad, visa, tax, remote work, travel, nomad lifestyle',
  authors: [{ name: 'Nomad Now Team' }],
  creator: 'Nomad Now',
  publisher: 'Nomad Now',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nomadnow.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nomad Now - Digital Nomad Information Hub',
    description: 'Comprehensive digital nomad guide with visa information, tax guidance, and essential tools for global nomads.',
    url: 'https://nomadnow.app',
    siteName: 'Nomad Now',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nomad Now - Digital Nomad Information Hub',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nomad Now - Digital Nomad Information Hub',
    description: 'Comprehensive digital nomad guide with visa information, tax guidance, and essential tools for global nomads.',
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
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nomad Now" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://xdpjstyoeqgvaacduzdw.supabase.co" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Nomad Now",
              "description": "Comprehensive digital nomad guide with visa information, tax guidance, and essential tools for global nomads.",
              "url": "https://nomadnow.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://nomadnow.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <ErrorBoundary>
          <GlobalStateProvider>
            <UserProvider>
              {children}
              <GlobalLoading />
              <GlobalNotifications />
            </UserProvider>
          </GlobalStateProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 