import type { Metadata } from 'next'
import './globals.css'
import LenisProvider from '@/components/layout/LenisProvider'

export const metadata: Metadata = {
  title: 'Karnataka Weather',
  description: 'Cinematic atmospheric weather experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}