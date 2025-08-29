'use client'

import { useRouter } from 'next/navigation'

export default function SimpleNavigationTest() {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    console.log('SimpleNavigationTest: Navigating to', path)
    router.push(path)
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'yellow',
      padding: '10px',
      zIndex: 10000,
      border: '2px solid black',
      maxWidth: '200px'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Simple Nav Test</div>
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <button 
          onClick={() => handleNavigation('/')}
          style={{ padding: '5px 10px', background: 'blue', color: 'white', border: 'none' }}
        >
          Home
        </button>
        <button 
          onClick={() => handleNavigation('/cities')}
          style={{ padding: '5px 10px', background: 'green', color: 'white', border: 'none' }}
        >
          Cities
        </button>
        <button 
          onClick={() => handleNavigation('/visa-guide')}
          style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none' }}
        >
          Visa Guide
        </button>
        <button 
          onClick={() => handleNavigation('/dashboard')}
          style={{ padding: '5px 10px', background: 'purple', color: 'white', border: 'none' }}
        >
          Dashboard
        </button>
        <button 
          onClick={() => handleNavigation('/debug')}
          style={{ padding: '5px 10px', background: 'lime', color: 'black', border: 'none' }}
        >
          Debug Page
        </button>
      </div>
    </div>
  )
}
