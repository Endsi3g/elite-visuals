import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { CTA } from "@/components/landing/CTA"

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="bg-gray-50 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Un workflow fluide et intuitif
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
            De l'idée brute au résultat final, découvrez comment Elite Visuals accélère chaque étape de votre production.
          </p>
        </div>
        <HowItWorks />
        <CTA />
      </div>
      <Footer />
    </main>
  )
}
