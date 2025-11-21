"use client"

import * as React from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export function Pricing() {
  const [isAnnual, setIsAnnual] = React.useState(true)

  const plans = [
    {
      name: "Starter",
      price: isAnnual ? 0 : 0,
      description: "Pour découvrir la puissance de la création IA.",
      features: [
        "1 Board infini",
        "IA Générative (50 crédits/mois)",
        "Export HD (720p)",
        "Collaboration (max 2 membres)",
      ],
      cta: "Commencer gratuitement",
      popular: false,
    },
    {
      name: "Pro",
      price: isAnnual ? 29 : 39,
      description: "Pour les créateurs et freelances ambitieux.",
      features: [
        "Boards illimités",
        "IA Générative illimitée (Llama 3 & Mistral)",
        "Export 4K & Vectoriel",
        "Collaboration illimitée",
        "Support prioritaire",
      ],
      cta: "Passer en Pro",
      popular: true,
    },
    {
      name: "Agency",
      price: isAnnual ? 99 : 119,
      description: "Pour les équipes qui ont besoin de contrôle.",
      features: [
        "Tout du plan Pro",
        "Espace de travail dédié par client",
        "SSO & Sécurité avancée",
        "API Access",
        "Manager de compte dédié",
      ],
      cta: "Contacter les ventes",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tarifs transparents, sans surprise
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Commencez gratuitement, upgradez quand vous décollez.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}>
              Mensuel
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label={isAnnual ? "Switch to monthly billing" : "Switch to annual billing"}
              className="relative w-14 h-8 bg-gray-200 rounded-full p-1 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-sm"
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-gray-900" : "text-gray-500"}`}>
              Annuel <span className="text-primary text-xs ml-1 font-bold">-20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border flex flex-col ${
                plan.popular
                  ? "border-primary shadow-2xl shadow-primary/10 scale-105 z-10 bg-white"
                  : "border-gray-200 bg-gray-50/50 hover:border-primary/30 transition-colors"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary hover:bg-primary px-4 py-1 text-sm">
                    Le plus populaire
                  </Badge>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}€
                  </span>
                  <span className="text-gray-500">/mois</span>
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-green-100 p-1 text-green-600">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                    : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
