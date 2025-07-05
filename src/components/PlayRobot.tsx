"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { CustomButton } from "@/components/CustomButton"
import { GameCard } from "@/components/GameCard"
import { useNavigate } from "react-router-dom"

import { Bot, Zap, Target, Crown } from "lucide-react"

const difficulties = [
  {
    id: "beginner",
    name: "Beginner",
    description: "Perfect for learning the ropes",
    icon: Bot,
    color: "text-green-600",
  },
  {
    id: "casual",
    name: "Casual",
    description: "A friendly challenge",
    icon: Target,
    color: "text-blue-600",
  },
  {
    id: "sharp",
    name: "Sharp",
    description: "Things get serious",
    icon: Zap,
    color: "text-orange-600",
  },
  {
    id: "grandmaster",
    name: "Grandmaster",
    description: "Only for the brave",
    icon: Crown,
    color: "text-red-600",
  },
]

export default function PlayRobot() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const navigate = useNavigate()
  const [selectedColor, setSelectedColor] = useState("white")
  const [selectedTheme, setSelectedTheme] = useState("classic")
  const [selectedTime, setSelectedTime] = useState("600+0")

  const handleStartGame = () => {
    if (selectedDifficulty) {
      navigate(
        `/game?mode=robot&difficulty=${selectedDifficulty}&color=${selectedColor}&theme=${selectedTheme}&time=${selectedTime}`
      )
    }
  }

  return (
    <div className="min-h-screen bg-vintage-off-white">
      <TopNav showBack title="Play vs Robot" />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Difficulty Selection */}
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-semibold text-vintage-sepia mb-6 text-center">
              Choose Your Opponent
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {difficulties.map((difficulty) => {
                const Icon = difficulty.icon
                return (
                  <GameCard
                    key={difficulty.id}
                    title={difficulty.name}
                    description={difficulty.description}
                    className={`${
                      selectedDifficulty === difficulty.id
                        ? "ring-4 ring-vintage-brown shadow-[16px_16px_0px_0px_rgba(139,69,19,0.5)]"
                        : ""
                    }`}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                  >
                    <div className="flex items-center justify-between">
                      <Icon size={32} className={difficulty.color} />
                      <div className="flex gap-1">
                        {Array.from({ length: difficulties.findIndex((d) => d.id === difficulty.id) + 1 }).map(
                          (_, i) => (
                            <div key={i} className="w-3 h-3 bg-vintage-brown rounded-full"></div>
                          ),
                        )}
                      </div>
                    </div>
                  </GameCard>
                )
              })}
            </div>
          </div>

          {/* Control Panel */}
          <div className="retro-card">
            <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-4">Game Settings</h3>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block font-mono text-sm text-vintage-sepia mb-2">Time Control</label>
                <select
                  className="w-full p-2 border-2 border-vintage-sepia bg-vintage-parchment font-mono"
                  onChange={(e) => setSelectedTime((e.target as HTMLSelectElement).value)}

                >
                  <option value="600+0">10 + 0</option>
                  <option value="900+10">15 + 10</option>
                  <option value="1800+0">30 + 0</option>
                  <option value="0+0">No Limit</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-sm text-vintage-sepia mb-2">Your Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor((e.target as HTMLSelectElement).value.toLowerCase())}

                  className="w-full p-2 border-2 border-vintage-sepia bg-vintage-parchment font-mono"
                >
                  <option value="white">White</option>
                  <option value="black">Black</option>
                  <option value="random">Random</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-sm text-vintage-sepia mb-2">Board Style</label>
                <select
                  onChange={(e) => setSelectedTheme((e.target as HTMLSelectElement).value.toLowerCase())}

                  className="w-full p-2 border-2 border-vintage-sepia bg-vintage-parchment font-mono"
                >
                  <option value="classic">Classic</option>
                  <option value="vintage">Vintage</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <CustomButton
                size="lg"
                onClick={handleStartGame}
                disabled={!selectedDifficulty}
                className="px-12"
              >
                Start Game
              </CustomButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
