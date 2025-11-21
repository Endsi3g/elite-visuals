"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Linkedin, Instagram, Youtube, Send } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-orange-500/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Elite<span className="text-primary">Visuals</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              L'OS créatif pour les équipes modernes. Idéation, Gestion et Production IA dans un seul outil.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Produit</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="#" className="hover:text-primary transition-colors">Fonctionnalités</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Tarifs</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Intégrations</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Mises à jour</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Ressources</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Communauté</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6">Restez informé</h4>
            <p className="text-gray-400 mb-4">
              Recevez nos derniers conseils pour booster votre créativité.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-primary focus:border-primary"
              />
              <Button size="icon" className="shrink-0 bg-primary hover:bg-primary/90 text-white">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 Elite Visuals. Tous droits réservés.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-white transition-colors">CGU</Link>
            <Link href="#" className="hover:text-white transition-colors">Mentions Légales</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
