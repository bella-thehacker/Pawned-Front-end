"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { TopNav } from "@/components/TopNav";
import { CustomButton } from "@/components/CustomButton";
import { VinylLoader } from "@/components/VinylLoader";
import { RotateCcw, Home, Flag } from "lucide-react";
import ChessBoard from "@/components/ChessBoard";

const socket = io("http://localhost:3001");

function OnlineGameContent() {
  const boardRef = useRef<any>(null);
  const [searchParams] = useSearchParams();

  const room = searchParams.get("room") || "";
  const playerColor = (searchParams.get("color") || "white") as "white" | "black";
  const boardStyle = (searchParams.get("theme") || "classic") as "classic" | "vintage" | "minimal";
  const timeControl = searchParams.get("time") || "600+0";
  const [initialTime, increment] = timeControl.split("+").map((v) => parseInt(v) || 0);

  const [gameTime, setGameTime] = useState({ white: initialTime, black: initialTime });
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [highlightedMove, setHighlightedMove] = useState<{ from: string; to: string } | null>(null);
  const [checkSquare, setCheckSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [gameStatus, setGameStatus] = useState<"playing" | "checkmate" | "draw" | "resigned">("playing");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    socket.emit("join-room", room);

    socket.on("start-game", () => {
      console.log("🎮 Game Started!");
    });

    socket.on("opponent-move", (move) => {
      boardRef.current?.movePiece?.(move.from, move.to);
      setHighlightedMove(move);
      const info = boardRef.current?.getGameInfo?.();
      if (info?.inCheck) setCheckSquare(info.kingSquare);
      setMoveHistory((prev) => [...prev, `${move.from}-${move.to}`]);
      setCurrentPlayer(playerColor);
    });

    return () => {
      socket.disconnect();
    };
  }, [room, playerColor]);

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

  const handleMove = (fen: string, move: { from: string; to: string }) => {
    if (gameStatus !== "playing") return;
    socket.emit("move", { roomCode: room, move });
    setMoveHistory((prev) => [...prev, `${move.from}-${move.to}`]);
    setGameTime((prev) => {
      const updated = { ...prev };
      updated[currentPlayer] = Math.max(0, prev[currentPlayer] + increment);
      return updated;
    });
    const nextPlayer = currentPlayer === "white" ? "black" : "white";
    setCurrentPlayer(nextPlayer);
    setCheckSquare(null);
    const info = boardRef.current?.getGameInfo?.();
    if (info?.inCheck) setCheckSquare(info.kingSquare);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-vintage-off-white">
      <TopNav showBack title={`Online Match (${room})`} />
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
                  onSelectSquare={(sq) => {
                    const moves = boardRef.current?.getLegalMoves?.(sq);
                    setLegalMoves(moves || []);
                  }}
                />
              </div>
              <div className="flex justify-center gap-4">
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
                    <span className="font-mono font-semibold capitalize">Online</span>
                  </div>
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
                    setTimeout(() => (window.location.href = "/PlayHuman"), 2000);
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

export default function OnlineGame() {
  return (
    <Suspense fallback={<VinylLoader />}>
      <OnlineGameContent />
    </Suspense>
  );
}
