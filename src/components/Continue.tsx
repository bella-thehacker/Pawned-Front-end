"use client"

import  {TopNav}  from "@/components/TopNav";
import  {GameCard } from "@/components/GameCard";
import {CustomButton} from "@/components/CustomButton";

import {  useNavigate } from "react-router-dom"

import { Bot, Users, Clock, Calendar } from "lucide-react"

const savedGames = [
  {
    id: "1",
    opponent: "Sharp AI",
    type: "robot",
    lastMove: "Qxf7+",
    timeLeft: "8:45",
    date: "2024-01-15",
    status: "Your turn",
  },
  {
    id: "2",
    opponent: "Friend",
    type: "local",
    lastMove: "Nf6",
    timeLeft: "12:30",
    date: "2024-01-14",
    status: "Opponent's turn",
  },
  {
    id: "3",
    opponent: "Player_2847",
    type: "online",
    lastMove: "O-O",
    timeLeft: "5:22",
    date: "2024-01-13",
    status: "Your turn",
  },
]

export default function Continue() {
  const navigate = useNavigate()

  const handleContinueGame = (gameId: string) => {
    navigate(`/game?continue=${gameId}`)
  }

  const getGameIcon = (type: string) => {
    switch (type) {
      case "robot":
        return Bot
      case "online":
        return Users
      default:
        return Users
    }
  }

  return (
    <div className="min-h-screen bg-vintage-off-white">
      <TopNav showBack title="Continue Game" />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-semibold text-vintage-sepia mb-8 text-center">Saved Games</h2>

          {savedGames.length === 0 ? (
            <div className="retro-card text-center">
              <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-4">No Saved Games</h3>
              <p className="font-mono text-vintage-sepia/80 mb-6">Start a new game to see it appear here.</p>
              <CustomButton onClick={() => navigate("/")}>Back to Menu</CustomButton>
            </div>
          ) : (
            <div className="space-y-6">
              {savedGames.map((game) => {
                const Icon = getGameIcon(game.type)
                return (
                  <GameCard
                    key={game.id}
                    title={`vs ${game.opponent}`}
                    onClick={() => handleContinueGame(game.id)}
                    className="hover:shadow-[12px_12px_0px_0px_rgba(139,69,19,0.4)]"
                  >
                    <div className="grid md:grid-cols-4 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <Icon size={24} className="text-vintage-brown" />
                        <div>
                          <div className="font-mono text-sm text-vintage-sepia">
                            {game.type === "robot" ? "AI Match" : game.type === "online" ? "Online" : "Local"}
                          </div>
                          <div className="font-mono text-xs text-vintage-sepia/60">Last move: {game.lastMove}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-vintage-dusty-blue" />
                        <span className="font-mono text-sm">{game.timeLeft}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-vintage-olive" />
                        <span className="font-mono text-sm">{game.date}</span>
                      </div>

                      <div className="text-right">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-xs font-mono ${
                            game.status === "Your turn"
                              ? "bg-vintage-mustard text-vintage-sepia"
                              : "bg-vintage-dusty-blue text-vintage-off-white"
                          }`}
                        >
                          {game.status}
                        </div>
                      </div>
                    </div>
                  </GameCard>
                )
              })}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 retro-card">
            <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <CustomButton onClick={() => navigate("/PlayRobot")} className="w-full">
                New AI Game
              </CustomButton>
              <CustomButton variant="secondary" onClick={() => navigate("/PlayHuman")} className="w-full">
                New Human Game
              </CustomButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
