import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url || typeof url !== 'string') {
    return new NextResponse('Missing url param', { status: 400 })
  }

  const allowedHosts = ['upload.wikimedia.org']
  try {
    const parsed = new URL(url)
    if (!allowedHosts.some(h => parsed.hostname.endsWith(h))) {
      return new NextResponse('Host not allowed', { status: 403 })
    }
  } catch {
    return new NextResponse('Invalid url', { status: 400 })
  }

  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; KarnatakaWeatherBot/1.0)',
    },
  })

  if (!resp.ok) {
    return new NextResponse('Upstream fetch failed', { status: resp.status })
  }

  const blob = await resp.arrayBuffer()
  const contentType = resp.headers.get('content-type') || 'image/jpeg'

  return new NextResponse(blob, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
