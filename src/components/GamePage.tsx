"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "react-router-dom"
import { TopNav } from "@/components/TopNav"
import { CustomButton } from "@/components/CustomButton"
import { VinylLoader } from "@/components/VinylLoader"
import { RotateCcw, Home, Flag } from "lucide-react"
import ChessBoard from "@/components/ChessBoard"

function GameContent() {
  const [searchParams] = useSearchParams()
  const timeControl = searchParams.get("time") || "600+0"

  const [initialTime, increment] = timeControl.split("+").map((val) => {
    const num = parseInt(val, 10)
    return isNaN(num) ? 0 : num
  })

  const mode = searchParams.get("mode")
  const difficulty = searchParams.get("difficulty")
  const room = searchParams.get("room")
  const playerColor = (searchParams.get("color") || "white") as "white" | "black"
  const boardStyle = (searchParams.get("theme") || "classic") as "classic" | "vintage" | "minimal"

  const [gameTime, setGameTime] = useState({ white: initialTime, black: initialTime })
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [gameStatus, setGameStatus] = useState<"playing" | "checkmate" | "draw" | "resigned">("playing")

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (initialTime === 0 || gameStatus !== "playing") return

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setGameTime((prev) => {
        const updated = { ...prev }
        updated[currentPlayer] = Math.max(0, prev[currentPlayer] - 1)
        return updated
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentPlayer, gameStatus])

 const handleMove = (fen: string, move: { from: string; to: string }) => {
  setMoveHistory((prev) => [...prev, `${move.from}-${move.to}`]);

  // Add increment time to the current player's clock
  setGameTime((prev) => {
    const updated = { ...prev };
    updated[currentPlayer] = Math.max(0, prev[currentPlayer] + increment); // Add increment time
    return updated;
  });

  // Switch to the other player
  setCurrentPlayer((prev) => (prev === "white" ? "black" : "white"));
};


  const formatTime = (seconds: number) => {
    if (typeof seconds !== "number" || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getGameTitle = () => {
    if (mode === "robot") {
      return `vs ${difficulty?.charAt(0).toUpperCase()}${difficulty?.slice(1)} AI`
    } else if (mode === "online") {
      return `Online Match (${room})`
    } else {
      return "Local Match"
    }
  }

  return (
    <div className="min-h-screen bg-vintage-off-white">
      <TopNav showBack title={getGameTitle()} />

      <main className="container mx-auto py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Game Board */}
            <div className="lg:col-span-2">
              <div className="flex justify-center mb-4">
                <ChessBoard
                  theme={boardStyle}
                  playerColor={playerColor}
                  onMove={handleMove}
                />
              </div>

              {/* Game Controls */}
              <div className="flex justify-center gap-4">
                <CustomButton size="sm" variant="secondary">
                  <RotateCcw size={16} className="mr-2" />
                  Undo
                </CustomButton>
                <CustomButton size="sm" variant="accent">
                  <Flag size={16} className="mr-2" />
                  Resign
                </CustomButton>
                <CustomButton size="sm">
                  <Home size={16} className="mr-2" />
                  Menu
                </CustomButton>
              </div>
            </div>

            {/* Game Info Panel */}
            <div className="space-y-6">
              {/* Player Clocks */}
              <div className="retro-card">
                <h3 className="text-lg font-serif font-semibold text-vintage-sepia mb-4">Game Clock</h3>
                <div className="space-y-3">
                  <div className={`p-3 border-2 ${currentPlayer === "black" ? "border-vintage-brown bg-vintage-mustard/20" : "border-vintage-sepia"}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold">Black</span>
                      <span className="font-mono text-xl">{formatTime(gameTime.black)}</span>
                    </div>
                  </div>
                  <div className={`p-3 border-2 ${currentPlayer === "white" ? "border-vintage-brown bg-vintage-mustard/20" : "border-vintage-sepia"}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold">White</span>
                      <span className="font-mono text-xl">{formatTime(gameTime.white)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Move History */}
              <div className="retro-card">
                <h3 className="text-lg font-serif font-semibold text-vintage-sepia mb-4">Move History</h3>
                <div className="bg-vintage-sepia text-vintage-off-white p-4 font-mono text-sm max-h-64 overflow-y-auto">
                  {moveHistory.length === 0 ? (
                    <div className="text-center text-vintage-mustard">{">"} Game started_</div>
                  ) : (
                    moveHistory.map((move, index) => (
                      <div key={index} className="mb-1">
                        {Math.floor(index / 2) + 1}. {move}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Game Status */}
              <div className="retro-card">
                <h3 className="text-lg font-serif font-semibold text-vintage-sepia mb-4">Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-mono text-sm">Turn:</span>
                    <span className="font-mono font-semibold capitalize">{currentPlayer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm">Mode:</span>
                    <span className="font-mono font-semibold capitalize">{mode}</span>
                  </div>
                  {difficulty && (
                    <div className="flex justify-between">
                      <span className="font-mono text-sm">AI Level:</span>
                      <span className="font-mono font-semibold capitalize">{difficulty}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function GamePage() {
  return (
    <Suspense fallback={<VinylLoader />}>
      <GameContent />
    </Suspense>
  )
}
