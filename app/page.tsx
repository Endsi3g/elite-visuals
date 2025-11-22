import dynamic from 'next/dynamic'
import { Header } from "@/components/landing/Header"
import { Hero } from "@/components/landing/Hero"

// Lazy load des composants non-critiques (below the fold)
const Features = dynamic(() => import("@/components/landing/Features").then(mod => ({ default: mod.Features })), {
  loading: () => <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>,
  ssr: false // Désactiver SSR pour performance
})

const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks").then(mod => ({ default: mod.HowItWorks })), {
  loading: () => <div className="h-96"></div>,
  ssr: false
})

const UseCases = dynamic(() => import("@/components/landing/UseCases").then(mod => ({ default: mod.UseCases })), {
  loading: () => <div className="h-96"></div>,
  ssr: false
})

const Testimonials = dynamic(() => import("@/components/landing/Testimonials").then(mod => ({ default: mod.Testimonials })), {
  loading: () => <div className="h-96"></div>,
  ssr: false
})

const Pricing = dynamic(() => import("@/components/landing/Pricing").then(mod => ({ default: mod.Pricing })), {
  loading: () => <div className="h-96"></div>,
  ssr: false
})

const FAQ = dynamic(() => import("@/components/landing/FAQ").then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="h-96"></div>,
  ssr: false
})

const CTA = dynamic(() => import("@/components/landing/CTA").then(mod => ({ default: mod.CTA })), {
  loading: () => <div className="h-64"></div>,
  ssr: false
})

const Footer = dynamic(() => import("@/components/landing/Footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-64"></div>,
  ssr: false
})

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Composants critiques chargés immédiatement */}
      <Header />
      <Hero />
      
      {/* Composants non-critiques chargés en lazy */}
      <Features />
      <HowItWorks />
      <UseCases />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
