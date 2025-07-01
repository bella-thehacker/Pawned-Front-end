"use client"

import { TopNav } from "@/components/TopNav"
import { CustomButton } from "@/components/CustomButton"
import { Target, Clock, Download, TrendingUp } from "lucide-react"

const stats = {
  totalGames: 23,
  wins: 12,
  losses: 8,
  draws: 3,
  winRate: 52.2,
  averageGameTime: "18:45",
  favoriteOpening: "Sicilian Defense",
  currentStreak: 3,
}

const recentGames = [
  { opponent: "Grandmaster AI", result: "Win", moves: 42, time: "25:30", date: "2024-01-15" },
  { opponent: "Sharp AI", result: "Loss", moves: 38, time: "22:15", date: "2024-01-14" },
  { opponent: "Player_1847", result: "Win", moves: 51, time: "31:20", date: "2024-01-13" },
  { opponent: "Casual AI", result: "Win", moves: 29, time: "15:45", date: "2024-01-12" },
  { opponent: "Friend", result: "Draw", moves: 67, time: "45:10", date: "2024-01-11" },
]

export default function ProfilePage() {
  const handleDownloadPGN = () => {
    // Mock PGN download
    const pgn = `[Event "Pawned Game"]
[Site "Pawned App"]
[Date "2024.01.15"]
[White "Player"]
[Black "Grandmaster AI"]
[Result "1-0"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 1-0`

    const blob = new Blob([pgn], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pawned-games.pgn"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-vintage-off-white">
      <TopNav showBack title="Player Profile" />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Player Stats Overview */}
          <div className="retro-card">
            <h2 className="text-2xl font-serif font-semibold text-vintage-sepia mb-6 text-center">Player Statistics</h2>

            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-vintage-brown mb-2">{stats.totalGames}</div>
                <div className="font-mono text-sm text-vintage-sepia">Total Games</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-green-600 mb-2">{stats.wins}</div>
                <div className="font-mono text-sm text-vintage-sepia">Wins</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-red-600 mb-2">{stats.losses}</div>
                <div className="font-mono text-sm text-vintage-sepia">Losses</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-vintage-dusty-blue mb-2">{stats.draws}</div>
                <div className="font-mono text-sm text-vintage-sepia">Draws</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-vintage-mustard/20 border-2 border-vintage-mustard p-4 rounded">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="text-vintage-brown" size={20} />
                  <span className="font-mono font-semibold">Win Rate</span>
                </div>
                <div className="text-2xl font-mono font-bold text-vintage-brown">{stats.winRate}%</div>
              </div>

              <div className="bg-vintage-dusty-blue/20 border-2 border-vintage-dusty-blue p-4 rounded">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-vintage-brown" size={20} />
                  <span className="font-mono font-semibold">Current Streak</span>
                </div>
                <div className="text-2xl font-mono font-bold text-vintage-brown">{stats.currentStreak} wins</div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="retro-card">
            <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-4">Game Details</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-mono text-sm text-vintage-sepia">Average Game Time:</span>
                  <span className="font-mono font-semibold">{stats.averageGameTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-sm text-vintage-sepia">Favorite Opening:</span>
                  <span className="font-mono font-semibold">{stats.favoriteOpening}</span>
                </div>
              </div>

              <div className="flex justify-center">
                <CustomButton onClick={handleDownloadPGN} className="flex items-center gap-2">
                  <Download size={16} />
                  Download PGN
                </CustomButton>
              </div>
            </div>
          </div>

          {/* Recent Games */}
          <div className="retro-card">
            <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-6">Recent Games</h3>

            <div className="space-y-3">
              {recentGames.map((game, index) => (
                <div key={index} className="bg-vintage-parchment border border-vintage-sepia p-4 rounded">
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div>
                      <div className="font-mono font-semibold text-vintage-sepia">vs {game.opponent}</div>
                      <div className="font-mono text-xs text-vintage-sepia/60">{game.date}</div>
                    </div>

                    <div className="text-center">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-mono ${
                          game.result === "Win"
                            ? "bg-green-200 text-green-800"
                            : game.result === "Loss"
                              ? "bg-red-200 text-red-800"
                              : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {game.result}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-mono text-sm">{game.moves} moves</div>
                    </div>

                    <div className="text-center">
                      <div className="font-mono text-sm flex items-center gap-1 justify-center">
                        <Clock size={14} />
                        {game.time}
                      </div>
                    </div>

                    <div className="text-center">
                      <CustomButton size="sm" variant="accent">
                        Review
                      </CustomButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
