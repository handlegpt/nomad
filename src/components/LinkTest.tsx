'use client'

import Link from 'next/link'

export default function LinkTest() {
  return (
    <div className="fixed bottom-0 left-0 bg-purple-500 text-white p-2 z-50">
      <div className="text-xs mb-2">Link Test</div>
      <div className="flex gap-2">
        <Link 
          href="/"
          className="bg-blue-500 px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Home
        </Link>
        <Link 
          href="/cities"
          className="bg-blue-500 px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Cities
        </Link>
        <Link 
          href="/visa-guide"
          className="bg-blue-500 px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Visa
        </Link>
        <a 
          href="/cities"
          className="bg-green-500 px-2 py-1 rounded text-xs hover:bg-green-600"
        >
          Cities (a tag)
        </a>
      </div>
    </div>
  )
}
