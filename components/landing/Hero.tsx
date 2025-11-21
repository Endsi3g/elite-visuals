"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Play, Users, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-[-1]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Nouveau: Intégration Luma AI pour la vidéo
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6 max-w-5xl mx-auto leading-[1.1]"
        >
          Créez du contenu viral avec <br className="hidden md:block" />
          vos équipes, <span className="text-primary relative whitespace-nowrap">
            en temps réel
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          L'OS créatif tout-en-un pour les agences modernes. <br />
          Idéation sur whiteboard infini, gestion de projet Kanban, et production assistée par IA.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 h-auto shadow-xl shadow-orange-200/50 hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300">
              Démarrer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#demo" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 h-auto border-gray-200 hover:bg-gray-50 hover:text-gray-900">
              <Play className="mr-2 h-5 w-5 fill-current" />
              Voir la démo
            </Button>
          </Link>
        </motion.div>

        {/* Mockup / Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mx-auto max-w-6xl"
        >
          <div className="relative rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm shadow-2xl shadow-gray-200/50 overflow-hidden aspect-[16/9] md:aspect-[21/9]">
            {/* Abstract UI Representation */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
              {/* Header Mockup */}
              <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/20"></div>
                </div>
                <div className="h-6 w-32 bg-gray-100 rounded-md"></div>
                <div className="ml-auto flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-xs font-bold text-orange-700">
                      U{i}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Content Mockup */}
              <div className="p-8 grid grid-cols-12 gap-6 h-full">
                {/* Sidebar */}
                <div className="hidden md:block col-span-2 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-full bg-gray-100/50 rounded-lg animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                  ))}
                </div>
                
                {/* Main Board */}
                <div className="col-span-12 md:col-span-10 relative">
                  {/* Floating Cards */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 left-10 w-48 h-32 bg-white rounded-xl shadow-lg border border-gray-100 p-4 rotate-[-2deg]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-blue-100 rounded-md text-blue-600"><Sparkles size={14} /></div>
                      <div className="text-xs font-semibold text-gray-700">Script IA</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-gray-100 rounded"></div>
                      <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                      <div className="h-2 w-5/6 bg-gray-100 rounded"></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-20 right-20 w-56 h-40 bg-white rounded-xl shadow-lg border border-orange-100 p-0 overflow-hidden rotate-[3deg]"
                  >
                     <div className="h-full w-full bg-gray-100 relative group">
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Play className="w-12 h-12 text-white opacity-50" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent text-white text-xs font-medium">
                           Video_Viral_V3.mp4
                        </div>
                     </div>
                  </motion.div>

                  {/* Cursors */}
                  <motion.div 
                     animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                     transition={{ duration: 8, repeat: Infinity }}
                     className="absolute top-1/2 left-1/3 z-20"
                  >
                     <div className="relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500 fill-orange-500">
                           <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="absolute left-4 top-4 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
                           Sarah (Designer)
                        </div>
                     </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -z-10"></div>
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10"></div>
        </motion.div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Trust Logos */}
          {["Airbnb", "Spotify", "Netflix", "Linear", "Raycast"].map((brand) => (
            <span key={brand} className="text-xl font-bold text-gray-400">{brand}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
