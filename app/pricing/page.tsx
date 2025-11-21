import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { Pricing } from "@/components/landing/Pricing"
import { FAQ } from "@/components/landing/FAQ"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="bg-gray-50 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Investissez dans votre créativité
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Des plans flexibles conçus pour grandir avec vous. Commencez gratuitement, sans engagement.
          </p>
        </div>
        <Pricing />
        <FAQ />
      </div>
      <Footer />
    </main>
  )
}
