"use client"

import { useState } from "react"
import { Layout, Plus, ListTodo, Search, Menu, Home } from "lucide-react"
import { motion } from "framer-motion"

interface NavItem {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  action: () => void
  badge?: number
}

interface MobileBottomBarProps {
  activeView: "board" | "kanban" | "search" | "menu"
  onNavigate: (view: "board" | "kanban" | "search" | "menu") => void
  onAddItem: () => void
  taskCount?: number
}

export default function MobileBottomBar({
  activeView,
  onNavigate,
  onAddItem,
  taskCount = 0
}: MobileBottomBarProps) {
  const navItems: NavItem[] = [
    {
      id: "board",
      icon: Layout,
      label: "Board",
      action: () => onNavigate("board")
    },
    {
      id: "search",
      icon: Search,
      label: "Recherche",
      action: () => onNavigate("search")
    },
    {
      id: "add",
      icon: Plus,
      label: "Ajouter",
      action: onAddItem
    },
    {
      id: "kanban",
      icon: ListTodo,
      label: "Kanban",
      action: () => onNavigate("kanban"),
      badge: taskCount
    },
    {
      id: "menu",
      icon: Menu,
      label: "Plus",
      action: () => onNavigate("menu")
    }
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg md:hidden"
      role="navigation"
      aria-label="Navigation mobile"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          const isAddButton = item.id === "add"

          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`
                relative flex flex-col items-center justify-center gap-1
                min-w-[60px] h-full
                transition-all duration-200
                ${isAddButton ? 'scale-110' : ''}
                ${isActive && !isAddButton ? 'text-primary' : 'text-gray-600'}
                hover:text-primary
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                rounded-lg
              `}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Badge pour notifications */}
              {item.badge && item.badge > 0 && (
                <span className="absolute top-1 right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}

              {/* Icône avec animation */}
              <div
                className={`
                  relative flex items-center justify-center
                  ${isAddButton 
                    ? 'w-12 h-12 bg-primary text-white rounded-full shadow-lg glow-orange' 
                    : 'w-6 h-6'
                  }
                `}
              >
                <Icon className={isAddButton ? "h-6 w-6" : "h-5 w-5"} />
                
                {/* Indicateur actif */}
                {isActive && !isAddButton && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>

              {/* Label */}
              {!isAddButton && (
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Safe area pour iPhone */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  )
}
