"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GameCardProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  onClick?: () => void
}

export function GameCard({ title, description, children, className, onClick }: GameCardProps) {
  return (
    <div
      className={cn(
        "retro-card cursor-pointer hover:shadow-[12px_12px_0px_0px_rgba(139,69,19,0.4)] transition-all duration-200",
        className,
      )}
      onClick={onClick}
    >
      <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-2">{title}</h3>
      {description && <p className="text-vintage-sepia/80 font-mono text-sm mb-4">{description}</p>}
      {children}
    </div>
  )
}
