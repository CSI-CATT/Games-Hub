import React, { useState, useEffect, useRef } from 'react';
import './TicTacToe.css';

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function calculateWinner(board) {
  for (const [a,b,c] of WIN_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true); // X is always the human when vs bot
  const [isBotMode, setIsBotMode] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const [scores, setScores] = useState({ player: 0, bot: 0, draws: 0 });

  const botThinkingRef = useRef(false);

  // load scores from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ttt_scores');
      if (raw) setScores(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load scores', e);
    }
  }, []);

  // persist scores when changed
  useEffect(() => {
    try {
      localStorage.setItem('ttt_scores', JSON.stringify(scores));
    } catch (e) {
      console.error('Failed to save scores', e);
    }
  }, [scores]);

  // whenever board changes, recompute winner/draw
  useEffect(() => {
    const w = calculateWinner(board);
    setWinner(w);
    const draw = !w && board.every(cell => cell !== null);
    setIsDraw(draw);
  }, [board]);

  // bot move effect: when bot mode is on and it's O's turn and no winner
  useEffect(() => {
    if (!isBotMode) return;
    // bot plays O (human is X)
    if (!isXTurn && !winner && !isDraw) {
      // avoid overlapping bot moves
      if (botThinkingRef.current) return;
      botThinkingRef.current = true;
      const timer = setTimeout(() => {
        const emptyIndices = board.map((v,i) => v === null ? i : null).filter(v => v !== null);
        if (emptyIndices.length === 0) {
          botThinkingRef.current = false;
          return;
        }
        const choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        makeMove(choice, 'O');
        botThinkingRef.current = false;
      }, 450 + Math.random() * 700); // simulate thinking

      return () => clearTimeout(timer);
    }
  }, [isBotMode, isXTurn, board, winner, isDraw]);

  // apply scoring when winner or draw happens
  useEffect(() => {
    if (!isBotMode) return; // scoring only meaningful vs bot
    if (winner) {
      if (winner === 'X') {
        setScores(s => ({ ...s, player: s.player + 1 }));
      } else if (winner === 'O') {
        setScores(s => ({ ...s, bot: s.bot + 1 }));
      }
    } else if (isDraw) {
      setScores(s => ({ ...s, draws: s.draws + 1 }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, isDraw]);

  function makeMove(index, mark) {
    setBoard(prev => {
      if (prev[index] || calculateWinner(prev)) return prev;
      const nb = [...prev];
      nb[index] = mark;
      return nb;
    });
    setIsXTurn(prev => (mark === 'X' ? false : true));
  }

  function handleClick(index) {
    if (board[index] || winner) return;
    // if bot mode and it's currently bot's turn, ignore clicks
    if (isBotMode && !isXTurn) return;

    // human is X
    makeMove(index, 'X');
  }

  function newRound() {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
    setIsDraw(false);
  }

  // RESET button: clears board and clears scores from localStorage
  function resetAll() {
    newRound();
    setScores({ player: 0, bot: 0, draws: 0 });
    try { localStorage.removeItem('ttt_scores'); } catch(e) {}
  }

  const statusText = winner
    ? `Winner: ${winner}!`
    : isDraw
    ? "It's a draw!"
    : `Next: ${isXTurn ? 'X (You)' : isBotMode ? 'O (Bot)' : 'O'}`;

  return (
    <div className="container">

      <div className="hero">
        <h1>Tic Tac Toe</h1>
        <p>Click a cell to make your move. First to 3 in a row wins!</p>
      </div>

      <div className="scoreboard">
        <label className="mode-toggle">
          <input type="checkbox" checked={isBotMode} onChange={e => setIsBotMode(e.target.checked)} />
          Play vs Bot
        </label>
        <div className="scores">
          <div className="score">You: <strong>{scores.player}</strong></div>
          <div className="score">Bot: <strong>{scores.bot}</strong></div>
          <div className="score">Draws: <strong>{scores.draws}</strong></div>
        </div>
      </div>

      <div className="board">
        {board.map((value, index) => (
          <button
            key={index}
            className="cell"
            onClick={() => handleClick(index)}
            aria-label={`cell-${index}`}
            style={{ color: value === 'X' ? '#ff6b6b' : value === 'O' ? '#38bdf8' : '' }}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="status">{statusText}</div>

      <div className="btn-wrapper">
        <button className="btn" onClick={newRound}>New Round</button>
        <button className="btn reset" onClick={resetAll}>RESET</button>
      </div>
    </div>
  );
}
