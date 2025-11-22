"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + Math.random() * 10
      })
    }, 200)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      >
        {/* Logo animé */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative w-20 h-20 bg-gradient-to-br from-[#E85535] to-[#d64a2e] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#E85535]/30">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-white font-bold text-4xl"
            >
              E
            </motion.span>
          </div>
        </motion.div>

        {/* Texte */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Elite Visuals
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-8"
        >
          Chargement en cours...
        </motion.p>

        {/* Barre de progression */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-[#E85535] to-[#d64a2e] rounded-full"
          />
        </div>

        {/* Pourcentage */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-sm text-gray-500 font-medium"
        >
          {Math.round(progress)}%
        </motion.p>

        {/* Points animés */}
        <div className="flex gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-[#E85535] rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
