'use client'

import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface PageLayoutProps {
  children: ReactNode
  showNavigation?: boolean
  pageTitle?: string
  showPageTitle?: boolean
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  showFooter?: boolean
}

export default function PageLayout({
  children,
  showNavigation = true,
  pageTitle,
  showPageTitle = false,
  className = '',
  maxWidth = '7xl',
  padding = 'lg',
  showFooter = true
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl'
  }

  const paddingClasses = {
    none: '',
    sm: 'px-4 sm:px-6 lg:px-8 py-6',
    md: 'px-4 sm:px-6 lg:px-8 py-8',
    lg: 'px-4 sm:px-6 lg:px-8 py-12',
    xl: 'px-4 sm:px-6 lg:px-8 py-16'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        showNavigation={showNavigation}
        pageTitle={pageTitle}
        showPageTitle={showPageTitle}
      />

      {/* Main Content */}
      <main className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]} ${className}`}>
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  )
}
