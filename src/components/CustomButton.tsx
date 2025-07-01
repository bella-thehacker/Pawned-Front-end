"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CustomButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "accent"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
}

export function CustomButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
}: CustomButtonProps) {
  const baseClasses =
    "font-mono font-semibold border-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"

  const variantClasses = {
    primary:
      "bg-vintage-brown text-vintage-off-white border-vintage-sepia shadow-[4px_4px_0px_0px_rgba(70,66,20,1)] hover:shadow-[2px_2px_0px_0px_rgba(70,66,20,1)]",
    secondary:
      "bg-vintage-olive text-vintage-off-white border-vintage-sepia shadow-[4px_4px_0px_0px_rgba(70,66,20,1)] hover:shadow-[2px_2px_0px_0px_rgba(70,66,20,1)]",
    accent:
      "bg-vintage-dusty-blue text-vintage-off-white border-vintage-sepia shadow-[4px_4px_0px_0px_rgba(70,66,20,1)] hover:shadow-[2px_2px_0px_0px_rgba(70,66,20,1)]",
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const hoverClasses = !disabled
    ? "hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
    : ""

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], hoverClasses, className)}
    >
      {children}
    </button>
  )
}
