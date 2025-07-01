"use client"

import { Link } from "react-router-dom"

import {  useNavigate } from "react-router-dom"

import { ArrowLeft, Crown } from "lucide-react"

interface TopNavProps {
  showBack?: boolean
  title?: string
}

export function TopNav({ showBack = false, title }: TopNavProps) {
  const navigate = useNavigate()

  return (
    <nav className="bg-vintage-brown text-vintage-off-white p-4 border-b-4 border-vintage-sepia">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:text-vintage-mustard transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-mono">Back</span>
            </button>
          )}
          {title && <h1 className="text-xl font-serif font-semibold">{title}</h1>}
        </div>

        <Link to="/" className="flex items-center gap-2 hover:text-vintage-mustard transition-colors">
          <Crown size={24} />
          <span className="text-2xl font-serif font-bold">PAWNED</span>
        </Link>
      </div>
    </nav>
  )
}
