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
      <h1 style={{margin: '0 0 12px', fontSize: '20px', textAlign: 'center'}}>
        Wordle — React (Dictionary API)
      </h1>

      <div style={{fontSize: '14px', color: '#e6eef8', marginBottom: '12px', textAlign: 'center'}}>
        <p style={{margin: 0}}>Guess the 5-letter word in {MAX_ROWS} tries. You can only try words that exist!</p>
        <p style={{margin: 0}}>🟢 Green = correct place, 🟡 Yellow = correct letter wrong place,</p>
        <p>⚪ Gray = not in word.</p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateRows: `repeat(${MAX_ROWS}, 1fr)`,
        gap: '5px',
        margin: '20px auto',
        width: 'fit-content'
      }}>
        {grid.map((rowData, ri) => (
          <div key={ri} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 62px)',
            gap: '5px'
          }}>
            {rowData.map((letter, ci) => {
              const stat = statuses[ri] ? statuses[ri][ci] : null;
              const bgColor = stat === 'correct' ? '#538d4e' : 
                            stat === 'present' ? '#b59f3b' : 
                            stat === 'absent' ? '#3a3a3c' : '#0f1724';
              return (
                <div
                  key={ci}
                  style={{
                    width: '62px',
                    height: '62px',
                    border: stat ? 'none' : '2px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '32px',
                    background: bgColor,
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    color: 'white',
                    transition: 'background 0.2s, transform 0.1s'
                  }}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{height: '22px', marginTop: '8px', color: '#ffd', textAlign: 'center'}}>
        {message}
      </div>

      <div style={{marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center'}}>
        {keyboardRows.map((rowKeys, idx) => (
          <div key={idx} style={{display: 'flex', gap: '6px'}}>
            {idx === 2 && (
              <button 
                onClick={handleEnter}
                style={{
                  padding: '10px 8px',
                  borderRadius: '6px',
                  border: 0,
                  background: 'rgba(255, 255, 255, 0.06)',
                  minWidth: '56px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#e6eef8',
                  cursor: 'pointer'
                }}
              >
                Enter
              </button>
            )}
            {rowKeys.split('').map(k => {
              const keyStatus = usedKeys[k];
            
              return (
                <button
                  key={k}
                  onClick={() => handleChar(k)}
                  className='cellWordle'
                >
                  {k}
                </button>
              );
            })}
            {idx === 2 && (
              <button 
                onClick={handleBackspace}
                className='delBtnWordle'
              >
                Del
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px'}}>
        <button 
          onClick={restart}
          className='restartButtonWordle'
        >
          Restart
        </button>
        <div style={{fontSize: '13px', opacity: 0.85}}>
          Solution (for dev): {gameOver ? solution : '?????'}
        </div>
      </div>

      <div style={{marginTop: '10px', fontSize: '12px', opacity: 0.7, textAlign: 'center'}}>
        Keys: physical keyboard supported. Words validated via Dictionary API.
      </div>
    </div>
  );
}