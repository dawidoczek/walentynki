import type { Metadata, Viewport } from 'next'
import { Quicksand, Dancing_Script } from 'next/font/google'

import './globals.css'

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
})

export const metadata: Metadata = {
  title: 'For Janek',
  description: 'A special Valentine\'s Day surprise for Janek',
}

export const viewport: Viewport = {
  themeColor: '#0c1629',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${dancingScript.variable} font-sans antialiased overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
