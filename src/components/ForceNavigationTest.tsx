'use client'

export default function ForceNavigationTest() {
  const handleNavigation = (path: string) => {
    console.log('ForceNavigationTest: Navigating to', path)
    window.location.href = path
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'orange',
      padding: '10px',
      zIndex: 10000,
      border: '2px solid black'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Force Nav Test</div>
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
          onClick={() => handleNavigation('/debug')}
          style={{ padding: '5px 10px', background: 'lime', color: 'black', border: 'none' }}
        >
          Debug Page
        </button>
      </div>
    </div>
  )
}
