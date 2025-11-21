"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Est-ce que je peux essayer Elite Visuals gratuitement ?",
    answer:
      "Oui ! Le plan Starter est 100% gratuit à vie. Il inclut l'accès au board infini, 50 crédits IA par mois et la possibilité de collaborer avec une autre personne.",
  },
  {
    question: "Comment fonctionne l'IA générative ?",
    answer:
      "Nous intégrons les meilleurs modèles open-source (Llama 3, Mistral) et propriétaires (Luma AI) directement dans l'interface. Vous n'avez pas besoin de vos propres clés API, tout est géré par notre plateforme sauf si vous souhaitez utiliser vos propres clés.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Absolument. Nous utilisons Supabase pour l'authentification et le stockage, avec un chiffrement de bout en bout. Vos boards privés ne sont accessibles que par vous et vos invités.",
  },
  {
    question: "Puis-je exporter mes projets ?",
    answer:
      "Oui, vous pouvez exporter vos boards en PDF haute définition, en image (PNG/JPG) ou en format Markdown structuré pour intégrer vos notes ailleurs.",
  },
  {
    question: "Quels types de fichiers sont supportés ?",
    answer:
      "Presque tout ! Images, vidéos (MP4, MOV), Audio (MP3, WAV), PDF, et même des liens web interactifs (YouTube, Figma, Google Docs).",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-gray-600">
            Tout ce que vous devez savoir avant de commencer.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-semibold text-gray-900 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
