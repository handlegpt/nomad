'use client'

import Link from 'next/link'

export default function DirectLinkTest() {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      background: 'orange', 
      padding: '20px', 
      zIndex: 9999,
      border: '2px solid black'
    }}>
      <div style={{ marginBottom: '10px', color: 'white' }}>Direct Link Test</div>
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <Link 
          href="/"
          style={{ 
            background: 'blue', 
            color: 'white', 
            padding: '10px', 
            textDecoration: 'none',
            border: '1px solid white'
          }}
          onClick={(e) => {
            console.log('Link clicked: /')
            e.preventDefault()
            window.location.href = '/'
          }}
        >
          Home (with onClick)
        </Link>
        <Link 
          href="/cities"
          style={{ 
            background: 'green', 
            color: 'white', 
            padding: '10px', 
            textDecoration: 'none',
            border: '1px solid white'
          }}
        >
          Cities (pure Link)
        </Link>
        <a 
          href="/visa-guide"
          style={{ 
            background: 'red', 
            color: 'white', 
            padding: '10px', 
            textDecoration: 'none',
            border: '1px solid white'
          }}
        >
          Visa (a tag)
        </a>
      </div>
    </div>
  )
}
