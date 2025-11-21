"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const Icon = item.icon

          return (
            <li key={index} className="flex items-center gap-2">
              {/* Séparateur */}
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
              )}

              {/* Item */}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={`flex items-center gap-1.5 ${
                    isLast
                      ? "font-semibold text-gray-900"
                      : "text-gray-600"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
