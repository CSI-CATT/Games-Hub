import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const winner = combos.find(([a, b, c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  )?.[0] ? board[combos.find(([a, b, c]) => board[a] === board[b] && board[b] === board[c])[0]] : null;

  function handleClick(index) {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  }

  const statusText = winner
    ? `Winner: ${winner}!`
    : board.every(cell => cell !== null)
    ? "It's a draw!"
    : `Next: ${isXTurn ? 'X' : 'O'}`;

  return (
    <div className="container">
      <div className="nav">
        <a href="#" className="logo">Games Hub</a>
        <div className="nav-links">
          <a href="#" className="active">Tic Tac Toe</a>
        </div>
      </div>

      <div className="hero">
        <h1>Tic Tac Toe</h1>
        <p>Click a cell to make your move. First to 3 in a row wins!</p>
      </div>

      <div className="board">
        {board.map((value, index) => (
          <button
            key={index}
            className="cell"
            onClick={() => handleClick(index)}
            style={{ color: value === 'X' ? '#ff0000' : value === 'O' ? '#38bdf8' : '' }}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="status">{statusText}</div>

      <div className="btn-wrapper">
        <button className="btn" onClick={resetGame}>Reset</button>
      </div>
    </div>
  );
}
