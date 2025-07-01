"use client"

import { useNavigate } from "react-router-dom"

import { CustomButton } from "@/components/CustomButton"
import { Crown, Bot, Users, BarChart3 } from "lucide-react"

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-vintage-off-white">
      {/* Header */}
      <header className="bg-vintage-brown text-vintage-off-white py-8 border-b-4 border-vintage-sepia">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Crown size={48} className="text-vintage-mustard" />
            <h1 className="text-6xl font-serif font-bold">PAWNED</h1>
            <Crown size={48} className="text-vintage-mustard" />
          </div>
          <p className="text-xl font-mono text-vintage-mustard">"No time to lose."</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Main Menu */}
          <div className="grid gap-6 mb-12">
            <CustomButton
              size="lg"
              onClick={() => navigate("/PlayRobot")}
              className="w-full flex items-center justify-center gap-4 text-xl py-6"
            >
              <Bot size={28} />
              Play vs Robot
            </CustomButton>

            <CustomButton
              size="lg"
              variant="secondary"
              onClick={() => navigate("/PlayHuman")}
              className="w-full flex items-center justify-center gap-4 text-xl py-6"
            >
              <Users size={28} />
              Play with Friend
            </CustomButton>

            <CustomButton
              size="lg"
              variant="accent"
              onClick={() => navigate("/continue")}
              className="w-full flex items-center justify-center gap-4 text-xl py-6"
            >
              <BarChart3 size={28} />
              Continue Game
            </CustomButton>
          </div>

          {/* Quick Stats */}
          <div className="retro-card text-center">
            <h2 className="text-2xl font-serif font-semibold text-vintage-sepia mb-4">Welcome Back, Player</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-mono font-bold text-vintage-brown">12</div>
                <div className="text-sm font-mono text-vintage-sepia">Wins</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-vintage-brown">8</div>
                <div className="text-sm font-mono text-vintage-sepia">Losses</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-vintage-brown">3</div>
                <div className="text-sm font-mono text-vintage-sepia">Draws</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-vintage-sepia text-vintage-off-white py-8 mt-16">
        <div className="container mx-auto text-center">
          <div className="border-2 border-vintage-mustard p-4 inline-block">
            <p className="font-serif text-lg">CTRL CODE SOLUTIONS • EST. 2024</p>
            <p className="font-mono text-sm text-vintage-mustard">"Where every move matters"</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
