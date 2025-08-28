import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const timezone = searchParams.get('timezone')

  if (!timezone) {
    return NextResponse.json({ error: 'Missing timezone parameter' }, { status: 400 })
  }

  try {
    const response = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`)

    if (!response.ok) {
      throw new Error('Time API request failed')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Time API error:', error)
    return NextResponse.json({ error: 'Failed to fetch time data' }, { status: 500 })
  }
}
