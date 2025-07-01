"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "react-router-dom"
import { TopNav } from "@/components/TopNav"
import { CustomButton } from "@/components/CustomButton"
import { VinylLoader } from "@/components/VinylLoader"
import { RotateCcw, Home, Flag } from "lucide-react"

// Mock chess board component since react-chessboard might not be available
function ChessBoard() {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

  const initialPosition: { [key: string]: string } = {
    a8: "♜",
    b8: "♞",
    c8: "♝",
    d8: "♛",
    e8: "♚",
    f8: "♝",
    g8: "♞",
    h8: "♜",
    a7: "♟",
    b7: "♟",
    c7: "♟",
    d7: "♟",
    e7: "♟",
    f7: "♟",
    g7: "♟",
    h7: "♟",
    a2: "♙",
    b2: "♙",
    c2: "♙",
    d2: "♙",
    e2: "♙",
    f2: "♙",
    g2: "♙",
    h2: "♙",
    a1: "♖",
    b1: "♘",
    c1: "♗",
    d1: "♕",
    e1: "♔",
    f1: "♗",
    g1: "♘",
    h1: "♖",
  }

  const [position, setPosition] = useState(initialPosition)

  return (
    <div className="inline-block border-4 border-vintage-sepia shadow-[8px_8px_0px_0px_rgba(139,69,19,0.3)]">
      {ranks.map((rank) => (
        <div key={rank} className="flex">
          {files.map((file) => {
            const square = file + rank
            const isLight = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0
            const isSelected = selectedSquare === square

            return (
              <div
                key={square}
                className={`
                  w-16 h-16 flex items-center justify-center text-3xl cursor-pointer
                  ${isLight ? "bg-vintage-cream" : "bg-vintage-brown"}
                  ${isSelected ? "ring-4 ring-vintage-mustard" : ""}
                  hover:opacity-80 transition-opacity
                `}
                onClick={() => setSelectedSquare(isSelected ? null : square)}
              >
                {position[square]}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function GameContent() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get("mode")
  const difficulty = searchParams.get("difficulty")
  const room = searchParams.get("room")

  const [gameTime, setGameTime] = useState({ white: 600, black: 600 }) // 10 minutes each
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [gameStatus, setGameStatus] = useState<"playing" | "checkmate" | "draw" | "resigned">("playing")

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameStatus === "playing") {
        setGameTime((prev) => ({
          ...prev,
          [currentPlayer]: Math.max(0, prev[currentPlayer] - 1),
        }))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [currentPlayer, gameStatus])

  const formatTime = (seconds: number) => {
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
                <ChessBoard />
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
                  <div
                    className={`p-3 border-2 ${currentPlayer === "black" ? "border-vintage-brown bg-vintage-mustard/20" : "border-vintage-sepia"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold">Black</span>
                      <span className="font-mono text-xl">{formatTime(gameTime.black)}</span>
                    </div>
                  </div>

                  <div
                    className={`p-3 border-2 ${currentPlayer === "white" ? "border-vintage-brown bg-vintage-mustard/20" : "border-vintage-sepia"}`}
                  >
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
