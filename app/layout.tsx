import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "Elite Visuals - IA de Création Visuelle & Collaboration",
  description: "Board visuel infini avec IA multi-modale, génération vidéo/image, et collaboration temps réel",
  keywords: ["IA", "création visuelle", "collaboration", "board infini", "génération vidéo"],
  authors: [{ name: "Elite Visuals Team" }],
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#E85535',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
