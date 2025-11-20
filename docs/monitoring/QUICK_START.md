# 📊 Monitoring - Quick Start

## 🎯 Objectif
Visibilité complète sur la production

## 📊 État Actuel
- Analytics: ❌
- Error tracking: ❌
- Performance: ❌

## 🚀 Solution Rapide (1 semaine)

### Jour 1: Vercel Analytics (30 min)
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Jour 2: Sentry (1h)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

### Jour 3: Custom Analytics
```typescript
// lib/analytics/tracker.ts
export const trackEvent = (event, properties) => {
  window.gtag?.('event', event, properties)
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({ event, properties }),
  })
}

// Utilisation
trackEvent('board_created', { boardId, itemCount })
```

### Jour 4: Performance Monitoring
```typescript
// lib/monitoring/performance.ts
import { getCLS, getFID, getLCP } from 'web-vitals'

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getLCP(sendToAnalytics)
```

## 📈 Métriques Suivies
- Page views
- Erreurs
- Performance (FPS, Core Web Vitals)
- Uptime

## 📚 Documentation Complète
Voir `docs/monitoring/MONITORING_GUIDE.md`
