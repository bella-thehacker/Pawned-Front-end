// components/ChessBoard.tsx
import { useState } from "react"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"

export type ChessBoardProps = {
  theme: "classic" | "vintage" | "minimal"
  playerColor: "white" | "black"
  onMove?: (fen: string, move: { from: string; to: string }) => void
}

const themeColors: Record<ChessBoardProps["theme"], { light: string; dark: string }> = {
  classic: {
    light: "#eeeed2",
    dark: "#769656",
  },
  vintage: {
    light: "#f9e4b7",
    dark: "#b67f4c",
  },
  minimal: {
    light: "#f0f0f0",
    dark: "#333333",
  },
}

export default function ChessBoard({ theme, playerColor, onMove }: ChessBoardProps) {
  const [game] = useState(new Chess())
  const [position, setPosition] = useState(game.fen())

  const colors = themeColors[theme]

  const makeMove = (from: string, to: string) => {
    const move = game.move({ from, to, promotion: "q" })
    if (move) {
      setPosition(game.fen())
      onMove?.(game.fen(), { from, to })
      return true
    }
    return false
  }

  return (
    <div className="border-4 border-vintage-sepia p-2 rounded-lg shadow-md">
      <Chessboard
        position={position}
        onPieceDrop={(from, to) => makeMove(from, to)}
        boardOrientation={playerColor}
        arePiecesDraggable={true}
        customBoardStyle={{
          borderRadius: "0.5rem",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
        customDarkSquareStyle={{ backgroundColor: colors.dark }}
        customLightSquareStyle={{ backgroundColor: colors.light }}
        boardWidth={500}
      />
    </div>
  )
}
