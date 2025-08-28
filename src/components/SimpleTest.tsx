'use client'

import { useRouter } from 'next/navigation'

export default function SimpleTest() {
  const router = useRouter()

  const handleClick = (path: string) => {
    console.log('Navigating to:', path)
    router.push(path)
  }

  return (
    <div className="fixed top-0 right-0 bg-green-500 text-white p-2 z-50">
      <div className="text-xs mb-2">Simple Test</div>
      <div className="flex gap-1">
        <button 
          onClick={() => handleClick('/')}
          className="bg-blue-500 px-2 py-1 rounded text-xs"
        >
          Home
        </button>
        <button 
          onClick={() => handleClick('/cities')}
          className="bg-blue-500 px-2 py-1 rounded text-xs"
        >
          Cities
        </button>
        <button 
          onClick={() => handleClick('/visa-guide')}
          className="bg-blue-500 px-2 py-1 rounded text-xs"
        >
          Visa
        </button>
      </div>
    </div>
  )
}
