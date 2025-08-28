'use client'

import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface FixedLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function FixedLink({ href, children, className = '', onClick }: FixedLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Call custom onClick if provided
    if (onClick) {
      onClick()
    }
    
    // Navigate using router
    console.log('FixedLink navigating to:', href)
    router.push(href)
  }

  return (
    <a 
      href={href} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
