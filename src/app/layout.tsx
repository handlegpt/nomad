import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'NOMAD.NOW - 数字游民工具平台',
    template: '%s | NOMAD.NOW'
  },
  description: '为数字游民提供最实用的工具和信息，包括实时时间、天气、签证倒计时、城市推荐等功能。帮助你找到下一个理想的目的地。',
  keywords: [
    '数字游民',
    '远程工作',
    '签证指南',
    '城市推荐',
    '生活成本',
    'WiFi速度',
    '旅游签证',
    '数字游民签证',
    '全球旅行',
    '工作旅行'
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
      'zh': '/zh',
      'es': '/es',
      'ja': '/ja',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://nomad.now',
    title: 'NOMAD.NOW - 数字游民工具平台',
    description: '为数字游民提供最实用的工具和信息，包括实时时间、天气、签证倒计时、城市推荐等功能。',
    siteName: 'NOMAD.NOW',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NOMAD.NOW - 数字游民工具平台',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOMAD.NOW - 数字游民工具平台',
    description: '为数字游民提供最实用的工具和信息，包括实时时间、天气、签证倒计时、城市推荐等功能。',
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
    <html lang="zh-CN">
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
              "description": "为数字游民提供最实用的工具和信息",
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