import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const location = useLocation()
  return (
    <nav className="nav">
      <Link to="/" className="logo">🎮 Fun Games Hub</Link>
      <div className="nav-links">
        <Link to="/tictactoe" className={location.pathname === "/tictactoe" ? "active" : ""}>Tic Tac Toe</Link>
        <Link to="/memory" className={location.pathname === "/memory" ? "active" : ""}>Memory</Link>
        <Link to="/snake" className={location.pathname === "/snake" ? "active" : ""}>Snake</Link>
        <Link to="/RockPaperScissors" className={location.pathname === "/RockPaperScissors" ? "active" : ""}>RockPaperScissors</Link>
      </div>
    </nav>
  )
}
