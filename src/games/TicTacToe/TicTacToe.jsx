import React, { useState, useEffect, useCallback } from 'react';

// Winning combinations, moved to a shared constant
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],          // diagonals
];

// Helper function to calculate the winner and the winning line
const calculateWinner = (squares) => {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: WINNING_LINES[i] }; // Return winner and line
    }
  }
  return { winner: null, line: null };
};

export default function TicTacToe() {
  // --- STATE MANAGEMENT ---
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true); // Player 'X' is always first
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });
  const [status, setStatus] = useState("Player X's Turn");
  const [gameActive, setGameActive] = useState(true);
  const [winningLine, setWinningLine] = useState(null);
  const [gameMode, setGameMode] = useState('vsComputer'); // 'vsComputer' or 'twoPlayer'


  // --- LOCAL STORAGE HOOKS ---
  // Load scores from local storage on initial render
  useEffect(() => {
    const savedScores = localStorage.getItem('ticTacToeScoresReact');
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  // Save scores to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('ticTacToeScoresReact', JSON.stringify(scores));
  }, [scores]);

  // Update status message based on game state
  useEffect(() => {
    if (!gameActive) return;

    if (gameMode === 'vsComputer') {
      setStatus(isXTurn ? "Your Turn" : "Computer's Turn...");
    } else {
      setStatus(`Player ${isXTurn ? 'X' : 'O'}'s Turn`);
    }
  }, [isXTurn, gameMode, gameActive]);


  // --- GAME LOGIC ---
  const handleGameResult = useCallback((currentBoard) => {
    const { winner, line } = calculateWinner(currentBoard);
    const isDraw = !winner && currentBoard.every(cell => cell !== null);

    if (winner) {
      setGameActive(false);
      setWinningLine(line);
      setScores(prevScores => ({
        ...prevScores,
        ...(winner === 'X' ? { x: prevScores.x + 1 } : { o: prevScores.o + 1 }),
      }));
      if (gameMode === 'vsComputer') {
        setStatus(winner === 'X' ? 'You Win!' : 'Computer Wins!');
      } else {
        setStatus(`Player ${winner} Wins!`);
      }
    } else if (isDraw) {
      setGameActive(false);
      setStatus("It's a Draw!");
      setScores(prevScores => ({ ...prevScores, draw: prevScores.draw + 1 }));
    }
  }, [gameMode]);


  // Player's move handler
  const handlePlayerClick = (index) => {
    // Prevent moves if game is over, cell is taken, or it's computer's turn in vsComputer mode
    if (!gameActive || board[index] || (gameMode === 'vsComputer' && !isXTurn)) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
    handleGameResult(newBoard);
  };

  // Computer's move logic (memoized with useCallback)
  const computerMove = useCallback(() => {
    const availableCells = board
      .map((cell, index) => (cell === null ? index : null))
      .filter(val => val !== null);

    if (availableCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      const cellIndex = availableCells[randomIndex];

      const newBoard = [...board];
      newBoard[cellIndex] = 'O';
      setBoard(newBoard);
      setIsXTurn(true);
      handleGameResult(newBoard);
    }
  }, [board, handleGameResult]);

  // Effect to trigger the computer's move
  useEffect(() => {
    // Only trigger computer move if in vsComputer mode and it's O's turn (not X's turn)
    if (gameMode === 'vsComputer' && !isXTurn && gameActive) {
      const timer = setTimeout(() => {
        computerMove();
      }, 500); // Adding a 500ms delay to the computer's move

      // Cleanup function to clear timeout if component unmounts or state changes
      return () => clearTimeout(timer);
    }
  }, [isXTurn, gameActive, computerMove, gameMode]);


  // --- CONTROL FUNCTIONS ---
  const restartGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setGameActive(true);
    setIsXTurn(true);
    setWinningLine(null);
  }, []);

  const resetScores = () => {
    setScores({ x: 0, o: 0, draw: 0 });
    restartGame();
  };

  const changeGameMode = (mode) => {
    setGameMode(mode);
    resetScores(); // Reset scores when changing mode
  };

  // Effect to automatically restart the game
  useEffect(() => {
    if (!gameActive) {
      const timer = setTimeout(() => {
        restartGame();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameActive, restartGame]);


  // --- RENDER ---
  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <main className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500 pb-2">
            Tic Tac Toe
          </h1>
        </div>

        {/* Game Mode Selector */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => changeGameMode('vsComputer')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 ${gameMode === 'vsComputer' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
            vs. Computer
          </button>
          <button
            onClick={() => changeGameMode('twoPlayer')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 ${gameMode === 'twoPlayer' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
            2 Players
          </button>
        </div>

        {/* Scoreboard */}
        <div className="flex justify-between items-center bg-slate-900/70 p-4 rounded-xl shadow-inner">
          <div className="text-center w-1/3">
            <p className="text-lg font-semibold text-blue-400">
              {gameMode === 'vsComputer' ? 'Player (X)' : 'Player 1 (X)'}
            </p>
            <p className="text-4xl font-bold">{scores.x}</p>
          </div>
          <div className="text-center w-1/3">
            <p className="text-lg font-semibold text-gray-400">Ties</p>
            <p className="text-4xl font-bold">{scores.draw}</p>
          </div>
          <div className="text-center w-1/3">
            <p className="text-lg font-semibold text-red-400">
              {gameMode === 'vsComputer' ? 'Computer (O)' : 'Player 2 (O)'}
            </p>
            <p className="text-4xl font-bold">{scores.o}</p>
          </div>
        </div>

        {/* Game Status */}
        <div className="h-12 flex items-center justify-center">
          <h2 className={`text-2xl md:text-3xl font-bold text-center transition-all duration-300 ${status.includes('Win') ? 'text-emerald-400' : // Changed to emerald-400 for status
            status.includes('Draw') ? 'text-yellow-400' :
              'text-slate-200'
            }`}>
            {status}
          </h2>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-3">
          {board.map((value, index) => (
            <button
              key={index}
              className={`
                group relative bg-slate-700 rounded-xl flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 ease-in-out aspect-square
                ${!value ? 'hover:bg-slate-600 hover:scale-105' : ''}
                ${winningLine && winningLine.includes(index) ? 'bg-emerald-500 scale-105' : ''} {/* Changed to emerald-500 for winning cells */}
              `}
              onClick={() => handlePlayerClick(index)}
              disabled={!gameActive || value !== null}
            >
              <span className={`transition-transform duration-300 ease-in-out text-6xl md:text-7xl font-bold ${value === 'X' ? 'text-blue-400' : 'text-red-400'}`}>
                {value}
              </span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={restartGame}
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-all duration-300 w-1/2"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7V9a1 1 0 01-2 0V3a1 1 0 011-1zm12 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13v2a1 1 0 01-1 1z" clipRule="evenodd"></path></svg>
            Restart
          </button>
          <button
            onClick={resetScores}
            className="flex items-center justify-center px-6 py-3 bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-600 transition-all duration-300 w-1/2"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
            Reset
          </button>
        </div>
      </main>
    </div>
  );
}

