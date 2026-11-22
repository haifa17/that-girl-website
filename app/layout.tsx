import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'THAT GIRL — Active · Lifestyle',
  description: 'Shop THAT GIRL activewear, Everyday Totes, and satin pillowcases for a softer-feeling bedtime routine.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-15%20at%204.05.32%20PM-6p0cwdAHO2tN3uFeZPzSv2aaZT3kiu.jpeg',
        type: 'image/jpeg',
      },
    ],
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-15%20at%204.05.32%20PM-6p0cwdAHO2tN3uFeZPzSv2aaZT3kiu.jpeg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fffaf7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
