"use client"

import { motion } from "framer-motion"
import { ArrowRight, Youtube, Briefcase, Clapperboard, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

const useCases = [
  {
    title: "Créateurs YouTube",
    description: "Gérez vos scripts, thumbnails et calendriers de publication au même endroit. Utilisez l'IA pour générer des idées de vidéos virales.",
    icon: Youtube,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "Agences Marketing",
    description: "Centralisez les feedbacks clients et les assets de campagne. Réduisez les allers-retours par email de 70%.",
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Producteurs Vidéo",
    description: "Créez des storyboards et des shotlists collaboratifs. L'IA vous aide à visualiser les scènes avant le tournage.",
    icon: Clapperboard,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Startups Créatives",
    description: "Itérez rapidement sur votre identité visuelle et vos produits. Un espace de travail flexible qui évolue avec vous.",
    icon: Rocket,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
]

export function UseCases() {
  return (
    <section id="use-cases" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Conçu pour tous les créatifs
            </h2>
            <p className="text-xl text-gray-600">
              Que vous soyez solopreneur ou une agence de 50 personnes, Elite Visuals s'adapte à votre flux de travail.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            Voir tous les cas d'usage <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-xl ${useCase.bg} ${useCase.color}`}>
                  <useCase.icon size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {useCase.description}
                  </p>
                  <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-2 transition-transform cursor-pointer">
                    Lire l'étude de cas <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 md:hidden">
           <Button variant="outline" className="w-full">
            Voir tous les cas d'usage <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
