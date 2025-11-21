"use client"

import { motion } from "framer-motion"
import { Users, Bot, Layout, BarChart3, Zap, Globe, Lock, Layers } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Users,
    title: "Collaboration Temps Réel",
    description: "Travaillez simultanément avec votre équipe. Curseur live, commentaires et chat intégré pour une fluidité totale.",
  },
  {
    icon: Bot,
    title: "Copilotes IA Intégrés",
    description: "Générez des scripts, des storyboards et des idées virales en un clic grâce à nos modèles IA (Llama 3, Mistral).",
  },
  {
    icon: Layout,
    title: "Board Créatif Infini",
    description: "Un espace sans limite pour vos moodboards. Glissez-déposez images, vidéos, PDF et liens en toute liberté.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Suivi",
    description: "Suivez la progression de vos projets et la performance de vos équipes avec des tableaux de bord détaillés.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Pourquoi choisir Elite Visuals ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Une suite d'outils puissants conçus pour accélérer votre processus créatif.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-gray-100 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group bg-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
