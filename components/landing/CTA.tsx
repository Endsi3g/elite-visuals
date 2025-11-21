"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          {/* Abstract shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Prêt à transformer votre processus créatif ?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Rejoignez l'élite des créateurs et commencez à produire du contenu viral dès aujourd'hui.
              Aucune carte bancaire requise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/login">
                  <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto bg-primary hover:bg-primary/90 border-0">
                  Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
               </Link>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              Déjà utilisé par +2000 créatifs et agences.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
