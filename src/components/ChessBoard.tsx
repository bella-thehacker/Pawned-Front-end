// components/ChessBoard.tsx
"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";

export type ChessBoardProps = {
  theme: "classic" | "vintage" | "minimal";
  playerColor: "white" | "black";
  onMove?: (fen: string, move: { from: string; to: string }) => void;
  highlightMove?: { from: string; to: string } | null;
  checkSquare?: string | null;
  legalMoves?: string[];
  onSelectSquare?: (square: string) => void;
   boardOrientation?: "white" | "black";
  animationDuration?: number;
  spinOnMove?: boolean; 
};

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
};

const ChessBoard = forwardRef(function ChessBoard(
  { theme, playerColor, onMove, highlightMove, checkSquare, legalMoves = [], onSelectSquare }: ChessBoardProps,
  ref
) {
  const [game] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());

  const colors = themeColors[theme];

  const makeMove = (from: string, to: string) => {
    const move = game.move({ from, to, promotion: "q" });
    if (move) {
      setPosition(game.fen());
      onMove?.(game.fen(), { from, to });
      return true;
    }
    return false;
  };

 useImperativeHandle(ref, () => ({
  movePiece: (from: string, to: string) => makeMove(from, to),
  undoMove: () => {
    game.undo();
    setPosition(game.fen());
  },
  getFEN: () => game.fen(),
  getMoveHistory: () => game.history(),
  getLegalMoves: (square: string) =>
  game.moves({ square: square as Square, verbose: true }).map((m) => m.to),

  getGameInfo: () => {
    const turn = game.turn() === "w" ? "white" : "black";
    const inCheck = game.inCheck();
    let kingSquare: string | null = null;

    game.board().forEach((row, rIdx) => {
      row.forEach((piece, cIdx) => {
        if (piece?.type === "k" && piece.color === game.turn()) {
          const file = "abcdefgh"[cIdx];
          const rank = 8 - rIdx;
          kingSquare = `${file}${rank}`;
        }
      });
    });

    return { inCheck, kingSquare, turn };
  },
}));


  const getSquareStyles = () => {
    const styles: Record<string, React.CSSProperties> = {};
    if (highlightMove) {
      styles[highlightMove.from] = { backgroundColor: "#f5a623" };
      styles[highlightMove.to] = { backgroundColor: "#f8e71c" };
    }
    legalMoves.forEach((sq) => {
      styles[sq] = { backgroundColor: "#add8e6" };
    });
    if (checkSquare) {
      styles[checkSquare] = { backgroundColor: "#ff4d4d" };
    }
    return styles;
  };

  return (
    <div className="border-4 border-vintage-sepia p-2 rounded-lg shadow-md">
      <Chessboard
        position={position}
        onPieceDrop={(from, to) => makeMove(from, to)}
        onSquareClick={(square) => onSelectSquare?.(square)}
        boardOrientation={playerColor}
        arePiecesDraggable={true}
        customBoardStyle={{
          borderRadius: "0.5rem",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
        customSquareStyles={getSquareStyles()}
        customDarkSquareStyle={{ backgroundColor: colors.dark }}
        customLightSquareStyle={{ backgroundColor: colors.light }}
        boardWidth={500}
      />
    </div>
  );
});

export default ChessBoard;
