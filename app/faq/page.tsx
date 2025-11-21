import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { FAQ } from "@/components/landing/FAQ"
import { CTA } from "@/components/landing/CTA"

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="bg-gray-50 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Centre d'aide & FAQ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Trouvez des réponses à vos questions sur Elite Visuals, la facturation et les fonctionnalités.
          </p>
        </div>
        <FAQ />
        <CTA />
      </div>
      <Footer />
    </main>
  )
}
