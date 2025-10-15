import React, { useState, useEffect, useCallback } from 'react';

// Icons for a 7x6 grid (21 pairs)
const icons = [
  '🍎', '🍌', '🍇', '🍒', '🥝', '🍍', '🍓', '🍑',
  '🍈', '🍉', '🍊', '🍋', '🥭', '🥥', '🥑', '🌶️',
  '🌽', '🥕', '🍄', '🥦', '🍆'
];

// Helper function to shuffle the cards array
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Component to inject custom CSS for 3D transforms not available in standard Tailwind
const GlobalStyles = () => (
  <style>{`
    .perspective-1200 {
      perspective: 1200px;
    }
    .transform-style-3d {
      transform-style: preserve-3d;
    }
    .rotate-y-180 {
      transform: rotateY(180deg);
    }
    .backface-hidden {
      backface-visibility: hidden;
    }
  `}</style>
);


export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => Number(localStorage.getItem('memoryGameHighScore')) || 0
  );
  const [turns, setTurns] = useState(0);

  // Sets up a new game or resets the current one
  const setupGame = useCallback(() => {
    setCards(shuffle([...icons, ...icons]));
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setTurns(0);
  }, []);

  // Initialize the game when the component mounts
  useEffect(() => {
    setupGame();
  }, [setupGame]);

  // Update high score whenever the current score surpasses it
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('memoryGameHighScore', score.toString());
    }
  }, [score, highScore]);

  // Handles the card flipping logic
  function flipCard(index) {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    setTurns(prev => prev + 1);
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (cards[a] === cards[b]) {
        // It's a match!
        setMatched(prev => [...prev, a, b]);
        setScore(prev => prev + 10);
      } else {
        // Not a match
        setScore(prev => Math.max(prev - 2, 0));
      }
      // Reset flipped cards after a delay
      setTimeout(() => setFlipped([]), 1000);
    }
  }

  // Restarts the game with the same settings
  function handleReplay() {
    setupGame();
  }

  // Resets the game and the high score
  function handleReset() {
    setupGame();
    setHighScore(0);
    localStorage.removeItem('memoryGameHighScore');
  }

  return (
    <>
      <GlobalStyles />
      <div className="flex items-center justify-center min-h-screen font-['Poppins',_sans-serif] bg-gray-900 text-gray-50 p-4 box-border">
        <div className="bg-gray-800 p-4 sm:p-6 md:p-10 rounded-3xl shadow-2xl text-center w-full max-w-4xl border border-white/10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">Memory Game</h2>
          
          {/* Game Instructions and Scoring Rules */}
          <div className="bg-gray-900/50 p-4 rounded-xl mb-6 text-left text-sm sm:text-base border border-white/10">
            <ul className="list-none space-y-1 text-gray-300">
              <li>✅ Each correct match gives you +10 points</li>
              <li>❌ Each wrong guess deducts 2 points (score cannot go below 0)</li>
            </ul>
            <p className="mt-3 text-gray-400">Click on the cards to reveal them and find matching pairs. Good luck!</p>
          </div>

          {/* Score, High Score, and Turns Display */}
          <div className="flex justify-around flex-wrap gap-4 bg-gray-900/80 p-4 rounded-2xl my-8 shadow-inner">
            <div>
              <p className="text-gray-400 text-sm sm:text-base font-semibold uppercase">Score</p>
              <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mt-2">{score}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm sm:text-base font-semibold uppercase">High Score</p>
              <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mt-2">{highScore}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm sm:text-base font-semibold uppercase">Turns</p>
              <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mt-2">{turns}</p>
            </div>
          </div>

          {/* Congratulatory message when all cards are matched */}
          {cards.length > 0 && matched.length === cards.length && (
            <h3 className="text-green-400 bg-green-500/10 p-4 rounded-xl my-6 text-lg sm:text-xl font-bold">
              Congratulations! You've matched them all!
            </h3>
          )}

          {/* The Grid of Cards */}
          <div className="grid grid-cols-7 gap-2 md:gap-4 my-8">
            {cards.map((card, i) => {
              const isFlipped = flipped.includes(i) || matched.includes(i);
              return (
                <div key={i} className="aspect-square cursor-pointer perspective-1200" onClick={() => flipCard(i)}>
                  <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d rounded-lg md:rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Front Face (Icon) */}
                    <div className="absolute w-full h-full backface-hidden flex justify-center items-center rounded-lg md:rounded-2xl text-2xl sm:text-3xl md:text-5xl shadow-lg bg-gray-600 text-white rotate-y-180">
                      {card}
                    </div>
                    {/* Back Face (Question Mark) */}
                    <div className="absolute w-full h-full backface-hidden flex justify-center items-center rounded-lg md:rounded-2xl text-2xl sm:text-3xl md:text-5xl shadow-lg bg-gray-700 border-2 border-gray-600 text-gray-400">
                      ❓
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Game Controls */}
          <div className="mt-8 flex justify-center gap-6">
            <button
              className="py-3 px-8 text-base font-bold cursor-pointer border-none rounded-lg text-white bg-indigo-600 shadow-md transition-all duration-200 ease-in-out hover:bg-indigo-700 hover:scale-105 active:scale-100"
              onClick={handleReplay}
            >
              REPLAY
            </button>
            <button
              className="py-3 px-8 text-base font-bold cursor-pointer border-none rounded-lg text-white bg-red-600 shadow-md transition-all duration-200 ease-in-out hover:bg-red-700 hover:scale-105 active:scale-100"
              onClick={handleReset}
            >
              RESET
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

