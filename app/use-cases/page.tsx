import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { UseCases } from "@/components/landing/UseCases"
import { CTA } from "@/components/landing/CTA"

export default function UseCasesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="bg-gray-50 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ils utilisent Elite Visuals
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Des créateurs indépendants aux grandes agences, découvrez comment chaque profil tire parti de notre plateforme.
          </p>
        </div>
        <UseCases />
        <CTA />
      </div>
      <Footer />
    </main>
  )
}
