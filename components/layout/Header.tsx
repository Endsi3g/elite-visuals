"use client"

import { Sparkles, Users, Download, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center glow-orange">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Elite Visuals</h1>
          <p className="text-xs text-gray-500">IA Création & Collaboration</p>
        </div>
      </div>

      {/* Center - Active Users */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 border-2 border-white flex items-center justify-center text-white text-xs font-semibold active-user-indicator"
            >
              U{i}
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          Inviter
        </Button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
