"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { CustomButton } from "@/components/CustomButton"
import { GameCard } from "@/components/GameCard"
import {  useNavigate } from "react-router-dom"

import { Wifi, WifiOff, Copy, Check } from "lucide-react"

export default function PlayHuman() {
  const [gameMode, setGameMode] = useState<"local" | "online" | null>(null)
  const [roomCode, setRoomCode] = useState("")
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(code)
    setIsCreatingRoom(true)
  }

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStartGame = () => {
    if (gameMode === "local") {
      navigate("/game?mode=local")
    } else if (gameMode === "online" && roomCode) {
      navigate(`/game?mode=online&room=${roomCode}`)
    }
  }

  return (
    <div className="min-h-screen bg-vintage-off-white">
      <TopNav showBack title="Play with Friend" />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Game Mode Selection */}
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-semibold text-vintage-sepia mb-6 text-center">Choose Game Mode</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <GameCard
                title="Pass & Play"
                description="Play locally on the same device"
                className={gameMode === "local" ? "ring-4 ring-vintage-brown" : ""}
                onClick={() => setGameMode("local")}
              >
                <div className="flex items-center justify-between">
                  <WifiOff size={32} className="text-vintage-olive" />
                  <div className="text-right">
                    <div className="font-mono text-sm text-vintage-sepia">Local</div>
                    <div className="font-mono text-xs text-vintage-sepia/60">Same Device</div>
                  </div>
                </div>
              </GameCard>

              <GameCard
                title="Online Match"
                description="Create or join a room to play online"
                className={gameMode === "online" ? "ring-4 ring-vintage-brown" : ""}
                onClick={() => setGameMode("online")}
              >
                <div className="flex items-center justify-between">
                  <Wifi size={32} className="text-vintage-dusty-blue" />
                  <div className="text-right">
                    <div className="font-mono text-sm text-vintage-sepia">Online</div>
                    <div className="font-mono text-xs text-vintage-sepia/60">Remote Play</div>
                  </div>
                </div>
              </GameCard>
            </div>
          </div>

          {/* Online Game Setup */}
          {gameMode === "online" && (
            <div className="retro-card mb-8">
              <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-4">Online Game Setup</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-mono font-semibold text-vintage-sepia mb-3">Create Room</h4>
                  <CustomButton onClick={generateRoomCode} className="w-full mb-3" disabled={isCreatingRoom}>
                    Generate Room Code
                  </CustomButton>

                  {roomCode && (
                    <div className="bg-vintage-mustard/20 border-2 border-vintage-mustard p-4 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-mono text-sm text-vintage-sepia">Room Code:</div>
                          <div className="font-mono text-2xl font-bold text-vintage-brown">{roomCode}</div>
                        </div>
                        <button
                          onClick={copyRoomCode}
                          className="p-2 hover:bg-vintage-mustard/30 rounded transition-colors"
                        >
                          {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-mono font-semibold text-vintage-sepia mb-3">Join Room</h4>
                  <input
                    type="text"
                    placeholder="Enter room code..."
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="w-full p-3 border-2 border-vintage-sepia bg-vintage-parchment font-mono text-center text-lg tracking-wider"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Game Settings */}
          {gameMode && (
            <div className="retro-card">
              <h3 className="text-xl font-serif font-semibold text-vintage-sepia mb-4">Game Settings</h3>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block font-mono text-sm text-vintage-sepia mb-2">Time Control</label>
                  <select className="w-full p-2 border-2 border-vintage-sepia bg-vintage-parchment font-mono">
                    <option>10 + 0</option>
                    <option>15 + 10</option>
                    <option>30 + 0</option>
                    <option>No Limit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-sm text-vintage-sepia mb-2">Board Style</label>
                  <select className="w-full p-2 border-2 border-vintage-sepia bg-vintage-parchment font-mono">
                    <option>Classic</option>
                    <option>Vintage</option>
                    <option>Minimal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-sm text-vintage-sepia mb-2">Sound Effects</label>
                  <select className="w-full p-2 border-2 border-vintage-sepia bg-vintage-parchment font-mono">
                    <option>On</option>
                    <option>Off</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <CustomButton
                  size="lg"
                  onClick={handleStartGame}
                  disabled={gameMode === "online" && !roomCode}
                  className="px-12"
                >
                  Start Game
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
