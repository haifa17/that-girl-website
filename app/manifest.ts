import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'THAT GIRL — Active · Lifestyle',
    short_name: 'THAT GIRL',
    description: 'Everyday active lifestyle, elevated.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffaf7',
    theme_color: '#fffaf7',
    icons: [
      {
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-15%20at%204.05.32%20PM-6p0cwdAHO2tN3uFeZPzSv2aaZT3kiu.jpeg',
        sizes: 'any',
        type: 'image/jpeg',
        purpose: 'any',
      },
    ],
  }
}
