import { useState, useRef, useEffect } from "react";
import { TopNav } from "@/components/TopNav";
import { CustomButton } from "@/components/CustomButton";
import ChessBoard from "@/components/ChessBoard";
import { Chess } from "chess.js";

export default function PlayLocal() {
  const boardRef = useRef<any>(null);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white");
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [checkSquare, setCheckSquare] = useState<string | null>(null);
  const [gameTime, setGameTime] = useState({ white: 600, black: 600 }); // 10+0 default
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clock management
  useEffect(() => {
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
  }, [currentPlayer]);

  const handleMove = (fen: string, move: { from: string; to: string }) => {
    setFen(fen);
    setMoveHistory((prev) => [...prev, `${move.from}-${move.to}`]);
    setCheckSquare(null);

    const nextPlayer = currentPlayer === "white" ? "black" : "white";
    setCurrentPlayer(nextPlayer);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-vintage-off-white">
      <TopNav showBack title="Local Match" />

      <main className="container mx-auto py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Board */}
            <div className="lg:col-span-2">
              <div className="flex justify-center mb-4">
                <ChessBoard
                  ref={boardRef}
                  onMove={handleMove}
                  highlightMove={null}
                  checkSquare={checkSquare}
                  theme="classic"
                  playerColor={currentPlayer}
                  legalMoves={[]}
                  onSelectSquare={() => {}}
                />
              </div>

              <div className="flex justify-center gap-4">
                <CustomButton
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    boardRef.current?.undoMove();
                    boardRef.current?.undoMove();
                    const newFen = boardRef.current?.getFEN?.();
                    setFen(newFen);
                    setMoveHistory(boardRef.current?.getMoveHistory?.() || []);
                    setCurrentPlayer(newFen?.includes(" w ") ? "white" : "black");
                  }}
                >
                  Undo
                </CustomButton>
                <CustomButton size="sm" variant="accent" onClick={() => setShowExitConfirm(true)}>
                  Exit
                </CustomButton>
              </div>
            </div>

            {/* Right: Game Info */}
            <div className="space-y-6">
              {/* Game Clock */}
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

              {/* Move History */}
              <div className="retro-card">
                <h3 className="text-lg font-serif font-semibold text-vintage-sepia mb-4">Move History</h3>
                <div className="bg-vintage-sepia text-vintage-off-white p-4 font-mono text-sm max-h-64 overflow-y-auto">
                  {moveHistory.length === 0 ? (
                    <div className="text-center text-vintage-mustard">{">"} Game started_</div>
                  ) : (
                    moveHistory
                      .reduce((acc: string[][], move, idx) => {
                        const pairIndex = Math.floor(idx / 2);
                        if (!acc[pairIndex]) acc[pairIndex] = [];
                        acc[pairIndex].push(move);
                        return acc;
                      }, [])
                      .map((pair, idx) => (
                        <div key={idx} className="mb-1">
                          {idx + 1}. {pair.join("   ")}
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="retro-card">
                <h3 className="text-lg font-serif font-semibold text-vintage-sepia mb-4">Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-mono text-sm">Current Turn:</span>
                    <span className="font-mono font-semibold capitalize">{currentPlayer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm">Mode:</span>
                    <span className="font-mono font-semibold">Local</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Exit Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-vintage-parchment border-4 border-vintage-brown p-6 rounded-lg max-w-sm text-center shadow-xl">
            <h2 className="text-xl font-serif text-vintage-sepia mb-4">Exit Game?</h2>
            <p className="text-vintage-sepia font-mono mb-6">Are you sure you want to exit this match?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-red-600 text-white font-mono px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Yes, Exit
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="bg-vintage-sepia text-vintage-off-white font-mono px-4 py-2 rounded hover:opacity-80 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
