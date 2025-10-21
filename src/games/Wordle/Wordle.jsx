import React, { useEffect, useState } from 'react';
import './wordle.css';

const WORD_LENGTH = 5;
const MAX_ROWS = 6;

// Pick a random 5-letter word
function pickSolution() {
  return fetch('https://random-word-api.herokuapp.com/word?length=5&lang=en')
    .then(res => res.json())
    .then(words => words[0]?.toUpperCase() || 'APPLE');
}

// Evaluate a guess against the solution
function evaluateGuess(guess, solution) {
  guess = guess.toUpperCase();
  solution = solution.toUpperCase();
  const result = Array(WORD_LENGTH).fill('absent');
  const solCounts = {};

  for (let i = 0; i < WORD_LENGTH; i++) {
    solCounts[solution[i]] = (solCounts[solution[i]] || 0) + 1;
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === solution[i]) {
      result[i] = 'correct';
      solCounts[guess[i]] -= 1;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === 'correct') continue;
    if (solCounts[guess[i]] && solCounts[guess[i]] > 0) {
      result[i] = 'present';
      solCounts[guess[i]] -= 1;
    }
  }

  return result;
}

export default function Wordle() {
  const [solution, setSolution] = useState('');
  const [grid, setGrid] = useState(Array(MAX_ROWS).fill('').map(() => Array(WORD_LENGTH).fill('')));
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [statuses, setStatuses] = useState(Array(MAX_ROWS).fill(null));
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});

  useEffect(() => {
    pickSolution().then(setSolution);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (gameOver) return;
      const k = e.key;
      if (k === 'Enter') return handleEnter();
      if (k === 'Backspace') return handleBackspace();
      if (/^[a-zA-Z]$/.test(k)) handleChar(k.toUpperCase());
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [col, row, grid, gameOver]);

  function handleChar(letter) {
    if (col >= WORD_LENGTH) return;
    setGrid(prev => {
      const copy = prev.map(r => r.slice());
      copy[row][col] = letter;
      return copy;
    });
    setCol(c => c + 1);
  }

  function handleBackspace() {
    if (col <= 0) return;
    setGrid(prev => {
      const copy = prev.map(r => r.slice());
      copy[row][col - 1] = '';
      return copy;
    });
    setCol(c => c - 1);
  }

  function handleEnter() {
    if (col !== WORD_LENGTH) {
      setMessage('Not enough letters');
      setTimeout(() => setMessage(''), 1500);
      return;
    }
    const guess = grid[row].join('');
    // Validate guess with Dictionary API
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${guess.toLowerCase()}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          setMessage('Not a valid word');
          setTimeout(() => setMessage(''), 1500);
          return;
        }
        // Valid word, proceed
        const ev = evaluateGuess(guess, solution);
        setStatuses(prev => {
          const copy = [...prev];
          copy[row] = ev;
          return copy;
        });

        setUsedKeys(prev => {
          const copy = { ...prev };
          for (let i = 0; i < WORD_LENGTH; i++) {
            const letter = guess[i];
            const st = ev[i];
            const rank = s => (s === 'correct' ? 3 : s === 'present' ? 2 : 1);
            if (!copy[letter] || rank(st) > rank(copy[letter])) copy[letter] = st;
          }
          return copy;
        });

        if (ev.every(s => s === 'correct')) {
          setMessage('You Win!');
          setGameOver(true);
          return;
        }

        if (row + 1 >= MAX_ROWS) {
          setMessage(`Game Over — solution was ${solution}`);
          setGameOver(true);
          return;
        }

        setRow(r => r + 1);
        setCol(0);
      })
      .catch(() => {
        setMessage('Error validating word');
        setTimeout(() => setMessage(''), 1500);
      });
  }

  function restart() {
    pickSolution().then(newWord => setSolution(newWord));
    setGrid(Array(MAX_ROWS).fill('').map(() => Array(WORD_LENGTH).fill('')));
    setRow(0);
    setCol(0);
    setStatuses(Array(MAX_ROWS).fill(null));
    setMessage('');
    setGameOver(false);
    setUsedKeys({});
  }

  const keyboardRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

  return (
    <div className="wordle-root">
      <h1>Wordle — React (Dictionary API)</h1>
      <div className="board" role="grid" aria-label="Wordle board">
        {grid[0].map((_, ci) => (
          <div key={ci} className="row" role="row">
            {grid.map((r, ri) => {
              const stat = statuses[ri] ? statuses[ri][ci] : null;
              return (
                <div
                  key={ri}
                  className={`cell ${stat ? stat : ''}`}
                  role="gridcell"
                  aria-selected={stat || false}
                >
                  {r[ci]}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="message">{message}</div>

      <div className="keyboard">
        {keyboardRows.map((rowKeys, idx) => (
          <div key={idx} className="kb-row">
            {idx === 2 && <button className="key wide" onClick={handleEnter}>Enter</button>}
            {rowKeys.split('').map(k => (
              <button
                key={k}
                className={`key ${usedKeys[k] || ''}`}
                onClick={() => { if (k === 'Enter') return handleEnter(); handleChar(k); }}
              >
                {k}
              </button>
            ))}
            {idx === 2 && <button className="key wide" onClick={handleBackspace}>Del</button>}
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={restart}>Restart</button>
        <div className="hint">Solution (for dev): {gameOver ? solution : '?????'}</div>
      </div>

      <div className="attribution">Keys: physical keyboard supported. Words validated via Dictionary API.</div>
    </div>
  );
}
