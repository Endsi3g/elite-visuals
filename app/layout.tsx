import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { LoadingProvider } from "@/components/LoadingProvider"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Elite Visuals - IA de Création Visuelle & Collaboration",
  description: "Board visuel infini avec IA multi-modale, génération vidéo/image, et collaboration temps réel",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E85535",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <LoadingProvider>
          {children}
        </LoadingProvider>
        <Toaster />
      </body>
    </html>
  )
}
