'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TestNavigation() {
  const pathname = usePathname()

  const testLinks = [
    { name: 'Home', href: '/' },
    { name: 'Cities', href: '/cities' },
    { name: 'Visa Guide', href: '/visa-guide' },
    { name: 'Dashboard', href: '/dashboard' }
  ]

  return (
    <div className="fixed top-0 left-0 bg-red-500 text-white p-2 z-50">
      <div>Current path: {pathname}</div>
      <div className="flex gap-2">
        {testLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="bg-blue-500 px-2 py-1 rounded text-sm"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
