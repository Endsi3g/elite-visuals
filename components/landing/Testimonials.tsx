"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sophie Martin",
    role: "Directrice Artistique",
    company: "Studio Créa",
    content: "Elite Visuals a complètement transformé notre processus de validation client. On gagne environ 2 jours par projet grâce aux retours en direct sur le board.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
  },
  {
    name: "Thomas Dubreuil",
    role: "YouTuber (500k+)",
    company: "TechReview",
    content: "La génération de scripts IA m'aide à sortir du syndrome de la page blanche. C'est comme avoir un co-auteur disponible 24/7.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
  },
  {
    name: "Amélie Poulain",
    role: "Freelance Vidéaste",
    company: "Indépendant",
    content: "J'étais sceptique sur l'IA, mais la génération de storyboard m'a bluffée. Je peux vendre mes concepts beaucoup plus facilement à mes clients.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amelie",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ils adorent Elite Visuals
          </h2>
          <p className="text-xl text-gray-600">
            Rejoignez plus de 2,000 créatifs qui utilisent notre plateforme quotidiennement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
            >
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed italic">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                   <img src={t.avatar} alt={t.name} className="object-cover w-full h-full" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
