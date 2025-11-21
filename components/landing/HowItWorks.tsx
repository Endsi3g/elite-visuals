"use client"

import { motion } from "framer-motion"
import { Upload, Users, Sparkles, Share2 } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Importez vos ressources",
    description: "Glissez-déposez vos vidéos, images, sons et documents directement sur le board. Tout est centralisé.",
    icon: Upload,
  },
  {
    id: 2,
    title: "Collaborez en live",
    description: "Invitez votre équipe et vos clients. Échangez, commentez et itérez en temps réel sur le même espace.",
    icon: Users,
  },
  {
    id: 3,
    title: "Générez avec l'IA",
    description: "Bloqué ? Demandez à nos agents IA de générer des scripts, des variantes visuelles ou des analyses.",
    icon: Sparkles,
  },
  {
    id: 4,
    title: "Exportez & Partagez",
    description: "Validez le projet et exportez les livrables finaux ou partagez un lien de présentation client.",
    icon: Share2,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Du chaos à la clarté en 4 étapes
          </h2>
          <p className="text-xl text-gray-600">
            Un workflow optimisé pour ne plus jamais perdre de temps sur la logistique.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative z-10 h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-50 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform border-4 border-white shadow-sm">
                    <step.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Step Number Background */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    {step.id}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
