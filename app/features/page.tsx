import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { Features } from "@/components/landing/Features"
import { CTA } from "@/components/landing/CTA"

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="bg-gray-50 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tout ce dont vous avez besoin pour créer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Découvrez l'ensemble des outils qui font d'Elite Visuals la plateforme préférée des créatifs.
          </p>
        </div>
        <Features />
        <CTA />
      </div>
      <Footer />
    </main>
  )
}
