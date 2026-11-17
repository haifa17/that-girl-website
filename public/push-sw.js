self.addEventListener('push', (event) => {
  let notice = {}
  try {
    notice = event.data ? event.data.json() : {}
  } catch {
    notice = { title: 'THAT GIRL order alert', body: 'A new order request has arrived.' }
  }

  event.waitUntil(self.registration.showNotification(notice.title || 'THAT GIRL order alert', {
    body: notice.body || 'A new order request has arrived.',
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-15%20at%204.05.32%20PM-6p0cwdAHO2tN3uFeZPzSv2aaZT3kiu.jpeg',
    badge: '/icon-light-32x32.png',
    data: { url: notice.url || '/' },
  }))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = new URL(event.notification.data?.url || '/', self.location.origin).href

  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((client) => client.url === targetUrl)
    if (existing) return existing.focus()
    return self.clients.openWindow(targetUrl)
  }))
})
