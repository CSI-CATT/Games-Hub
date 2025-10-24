import React, { useEffect, useState } from "react";

const GRID = 15;
const START = [{ x: 7, y: 7 }];

function randPos() {
  return {
    x: Math.floor(Math.random() * GRID),
    y: Math.floor(Math.random() * GRID),
  };
}

export default function SnakeGame() {
  const [snake, setSnake] = useState(START);
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState(randPos);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // 🎮 Handle key controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp" && dir.y !== 1) setDir({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && dir.y !== -1) setDir({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && dir.x !== 1) setDir({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && dir.x !== -1) setDir({ x: 1, y: 0 });
      if (e.key === " ") setRunning((r) => !r);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dir]);

  // 🧠 Main game loop
  useEffect(() => {
    if (!running || gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = {
          x: (prev[0].x + dir.x + GRID) % GRID,
          y: (prev[0].y + dir.y + GRID) % GRID,
        };

        // Collision with self
        if (prev.some((p) => p.x === head.x && p.y === head.y)) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setFood(randPos());
          setScore((s) => s + 1);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [dir, food, running, gameOver]);

  function resetGame() {
    setSnake(START);
    setDir({ x: 1, y: 0 });
    setFood(randPos());
    setScore(0);
    setGameOver(false);
    setRunning(true);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-4">
      <h1 className="text-4xl font-extrabold text-yellow-300 mb-4 drop-shadow-md">
        🐍 Snake Game
      </h1>

      {/* Score & Status */}
      <div className="flex gap-8 mb-4 text-lg font-semibold">
        <p>
          Score: <span className="text-yellow-300">{score}</span>
        </p>
        <p>
          {running ? "🟢 Running" : gameOver ? "💀 Game Over" : "⏸️ Paused"}
        </p>
      </div>

      {/* Snake Grid */}
      <div
        className="relative bg-gray-800 border-4 border-gray-700 rounded-2xl shadow-2xl grid gap-[2px] overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${GRID}, 1fr)`,
          width: "min(90vw, 480px)",
          aspectRatio: "1 / 1",
        }}
      >
        {Array.from({ length: GRID * GRID }).map((_, i) => {
          const x = i % GRID;
          const y = Math.floor(i / GRID);
          const index = snake.findIndex((s) => s.x === x && s.y === y);
          const isHead = index === 0;
          const isBody = index > 0;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full rounded-[3px] transition-all duration-100 
                ${isFood ? "bg-red-500 shadow-[0_0_10px_#ef4444]" : ""}
                ${isHead ? "bg-green-400 shadow-[0_0_12px_#22c55e]" : ""}
                ${isBody ? "bg-green-600 shadow-[0_0_5px_#16a34a]" : ""}
                ${!isFood && !isHead && !isBody ? "bg-gray-700" : ""}
              `}
            ></div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center mt-6 gap-3">
        {gameOver ? (
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all shadow-md"
          >
            🔄 Restart Game
          </button>
        ) : (
          <button
            onClick={() => setRunning((r) => !r)}
            className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all shadow-md"
          >
            {running ? "⏸️ Pause Game" : "▶️ Start Game"}
          </button>
        )}

        {/* Instructions */}
        <div className="mt-4 text-sm text-gray-300 max-w-md leading-relaxed text-center">
          <p className="text-yellow-300 font-semibold mb-2">🎯 Instructions:</p>
          <ul className="list-disc list-inside text-left space-y-1">
            <li>
              Use <b>Arrow Keys</b> to move the snake
            </li>
            <li>
              Press <b>Space</b> or click “Pause Game” to pause/resume
            </li>
            <li>
              Eat <span className="text-red-400 font-semibold">red dots</span>{" "}
              to grow
            </li>
            <li>Avoid colliding with yourself</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
