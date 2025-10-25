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
  const [showRules, setShowRules] = useState(false);

  // 🎮 Handle key controls
  useEffect(() => {
    const handleKey = (e) => {
      // Prevent default behavior for arrow keys and space
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      
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
      <style>{`
        .rules-button {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #fbbf24;
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s;
          z-index: 1000;
        }
        
        .rules-button:hover {
          background-color: #fcd34d;
          transform: translateY(-2px);
        }
        
        .rules-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #1f2937;
          border: 3px solid #4b5563;
          border-radius: 16px;
          padding: 30px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          z-index: 1001;
        }
        
        .rules-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1000;
        }
        
        .rules-title {
          color: #fbbf24;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .rules-list {
          list-style: none;
          padding: 0;
          margin: 20px 0;
        }
        
        .rules-list li {
          margin: 12px 0;
          padding-left: 25px;
          position: relative;
          line-height: 1.6;
        }
        
        .rules-list li:before {
          content: "•";
          position: absolute;
          left: 8px;
          color: #fbbf24;
          font-size: 20px;
        }
        
        .close-button {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          margin-top: 20px;
          transition: all 0.2s;
        }
        
        .close-button:hover {
          background-color: #dc2626;
        }
      `}</style>
      
      <button className="rules-button" onClick={() => setShowRules(true)}>
        📖 Rules
      </button>
      
      {showRules && (
        <>
          <div className="rules-overlay" onClick={() => setShowRules(false)}></div>
          <div className="rules-modal">
            <h2 className="rules-title">🎯 How to Play</h2>
            <ul className="rules-list">
              <li>Use <strong>Arrow Keys</strong> to move the snake</li>
              <li>Press <strong>Space</strong> or click "Pause Game" to pause/resume</li>
              <li>Eat <strong style={{color: '#ef4444'}}>red dots</strong> to grow and score points</li>
              <li>Avoid colliding with yourself or the game ends</li>
              <li>The snake wraps around the edges of the grid</li>
            </ul>
            <button className="close-button" onClick={() => setShowRules(false)}>
              Close
            </button>
          </div>
        </>
      )}
      
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
      </div>
    </div>
  );
}