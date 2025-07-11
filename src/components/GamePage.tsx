"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import { CustomButton } from "@/components/CustomButton";
import { VinylLoader } from "@/components/VinylLoader";
import { RotateCcw, Home, Flag } from "lucide-react";
import ChessBoard from "@/components/ChessBoard";

function GameContent() {
  const boardRef = useRef<any>(null);
  const [botThinking, setBotThinking] = useState(false);
  const [highlightedMove, setHighlightedMove] = useState<{ from: string; to: string } | null>(null);
  const [checkSquare, setCheckSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [showResignConfirm, setShowResignConfirm] = useState(false);

  const [searchParams] = useSearchParams();
  const allowUndo = searchParams.get("undo") === "true";

  const timeControl = searchParams.get("time") || "600+0";
  const [initialTime, increment] = timeControl.split("+").map((val) => parseInt(val, 10) || 0);

  const mode = searchParams.get("mode");
  const difficulty = searchParams.get("difficulty");
  const room = searchParams.get("room");
  const playerColor = (searchParams.get("color") || "white") as "white" | "black";
  const boardStyle = (searchParams.get("theme") || "classic") as "classic" | "vintage" | "minimal";

  const [gameTime, setGameTime] = useState({ white: initialTime, black: initialTime });
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<"playing" | "checkmate" | "draw" | "resigned">("playing");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getDifficultySettings = (level: string | null) => {
    switch (level) {
      case "beginner":
        return { skillLevel: 1, depth: 2, delay: 1000 };
      case "casual":
        return { skillLevel: 5, depth: 4, delay: 600 };
      case "sharp":
        return { skillLevel: 12, depth: 8, delay: 300 };
      case "grandmaster":
        return { skillLevel: 20, depth: 15, delay: 100 };
      default:
        return { skillLevel: 5, depth: 4, delay: 500 };
    }
  };

  const fetchBotMove = async (fen: string) => {
    try {
      const { skillLevel, depth } = getDifficultySettings(difficulty);
      const res = await fetch("http://localhost:3001/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fen, difficulty, skillLevel, depth }),
      });
      const data = await res.json();
      return data.bestMove;
    } catch (err) {
      console.error("Bot move error:", err);
      return null;
    }
  };

  const fetchBotMoveAndPlay = async () => {
    setBotThinking(true);
    const bestMove = await fetchBotMove(boardRef.current?.getFEN?.());
    const { delay } = getDifficultySettings(difficulty);
    setTimeout(() => setBotThinking(false), delay);

    if (bestMove && boardRef.current) {
      const from = bestMove.slice(0, 2);
      const to = bestMove.slice(2, 4);
      boardRef.current.movePiece(from, to);
      setHighlightedMove({ from, to });

      const gameInfo = boardRef.current?.getGameInfo?.();
      if (gameInfo?.inCheck) setCheckSquare(gameInfo.kingSquare);
    }
  };

  useEffect(() => {
    if (initialTime === 0 || gameStatus !== "playing") return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setGameTime((prev) => {
        const updated = { ...prev };
        updated[currentPlayer] = Math.max(0, prev[currentPlayer] - 1);
        return updated;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentPlayer, gameStatus]);

  useEffect(() => {
    if (mode === "robot" && playerColor === "black" && currentPlayer !== playerColor) {
      fetchBotMoveAndPlay();
    }
  }, [mode, playerColor, currentPlayer]);

  const handleMove = async (fen: string, move: { from: string; to: string }) => {
    if (gameStatus !== "playing") return;
    setMoveHistory((prev) => [...prev, `${move.from}-${move.to}`]);

    setGameTime((prev) => {
      const updated = { ...prev };
      updated[currentPlayer] = Math.max(0, prev[currentPlayer] + increment);
      return updated;
    });

    const nextPlayer = currentPlayer === "white" ? "black" : "white";
    setCurrentPlayer(nextPlayer);
    setCheckSquare(null);

    const gameInfo = boardRef.current?.getGameInfo?.();
    if (gameInfo?.inCheck) setCheckSquare(gameInfo.kingSquare);

    if (mode === "robot" && nextPlayer !== playerColor) {
      fetchBotMoveAndPlay();
    }
  };

  const handlePieceSelect = (square: string) => {
    const moves = boardRef.current?.getLegalMoves?.(square);
    setLegalMoves(moves || []);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getGameTitle = () => {
    if (mode === "robot") {
      return `vs ${difficulty?.charAt(0).toUpperCase()}${difficulty?.slice(1)} AI`;
    } else if (mode === "online") {
      return `Online Match (${room})`;
    } else {
      return "Local Match";
    }
  };

  return (
    <div className="min-h-screen bg-vintage-off-white">
      <TopNav showBack title={getGameTitle()} />
      <main className="container mx-auto py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex justify-center mb-4">
                <ChessBoard
                  ref={boardRef}
                  theme={boardStyle}
                  playerColor={playerColor}
                  onMove={handleMove}
                  highlightMove={highlightedMove}
                  checkSquare={checkSquare}
                  legalMoves={legalMoves}
                  onSelectSquare={handlePieceSelect}
                />
              </div>
              <div className="flex justify-center gap-4">
                <CustomButton
                  size="sm"
                  variant="secondary"
                  disabled={!allowUndo || moveHistory.length < 2 || gameStatus !== "playing"}
                  onClick={() => {
                    boardRef.current?.undoMove?.(); // bot
                    boardRef.current?.undoMove?.(); // player
                    const fen = boardRef.current?.getFEN?.();
                    setMoveHistory(boardRef.current?.getMoveHistory?.() || []);
                    setCheckSquare(null);
                    setCurrentPlayer(fen?.includes(" w ") ? "white" : "black");
                  }}
                >
                  <RotateCcw size={16} className="mr-2" /> Undo
                </CustomButton>
                <CustomButton size="sm" variant="accent" onClick={() => setShowResignConfirm(true)}>
                  <Flag size={16} className="mr-2" /> Resign
                </CustomButton>
                <CustomButton size="sm">
                  <Home size={16} className="mr-2" /> Menu
                </CustomButton>
              </div>
            </div>

            <div className="space-y-6">
              <div className="retro-card">
                <h3 className="text-lg font-serif font-semibold text-vintage-sepia mb-4">Game Clock</h3>
                <div className="space-y-3">
                  {["black", "white"].map((color) => (
                    <div
                      key={color}
                      className={`p-3 border-2 ${
                        currentPlayer === color ? "border-vintage-brown bg-vintage-mustard/20" : "border-vintage-sepia"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold capitalize">{color}</span>
                        <span className="font-mono text-xl">{formatTime(gameTime[color as "white" | "black"])}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="retro-card">
                <h3 className="text-lg font-serif font-semibold text-vintage-sepia mb-4">Move History</h3>
                <div className="bg-vintage-sepia text-vintage-off-white p-4 font-mono text-sm max-h-64 overflow-y-auto">
                  {moveHistory.length === 0 ? (
                    <div className="text-center text-vintage-mustard">{">"} Game started_</div>
                  ) : (
                    moveHistory.reduce((acc: string[][], move, idx) => {
                      const pairIndex = Math.floor(idx / 2);
                      if (!acc[pairIndex]) acc[pairIndex] = [];
                      acc[pairIndex].push(move);
                      return acc;
                    }, []).map((pair, idx) => (
                      <div key={idx} className="mb-1">
                        {idx + 1}. {pair.join("   ")}
                      </div>
                    ))
                  )}
                </div>
              </div>

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
                  {mode === "robot" && (
                    <div className="flex justify-between">
                      <span className="font-mono text-sm">Bot Status:</span>
                      <span className={`font-mono font-semibold capitalize ${botThinking ? "animate-pulse" : ""}`}>
                        {botThinking ? "Thinking..." : "Waiting"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {gameStatus !== "playing" && (
            <div className="mt-6 bg-red-100 border-2 border-red-400 text-red-800 text-center font-serif p-4 rounded shadow">
              Game Over: {gameStatus === "resigned" ? "You resigned." : "Checkmate!"}
            </div>
          )}
        </div>

        {showResignConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-vintage-parchment border-4 border-vintage-brown p-6 rounded-lg max-w-sm text-center shadow-xl">
              <h2 className="text-xl font-serif text-vintage-sepia mb-4">Resign Game?</h2>
              <p className="text-vintage-sepia font-mono mb-6">Are you sure you want to resign? You’ll lose the game.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowResignConfirm(false);
                    setGameStatus("resigned");
                    setTimeout(() => (window.location.href = "/PlayRobot"), 2000);
                  }}
                  className="bg-red-600 text-white font-mono px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Yes, Resign
                </button>
                <button
                  onClick={() => setShowResignConfirm(false)}
                  className="bg-vintage-sepia text-vintage-off-white font-mono px-4 py-2 rounded hover:opacity-80 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<VinylLoader />}>
      <GameContent />
    </Suspense>
  );
}
