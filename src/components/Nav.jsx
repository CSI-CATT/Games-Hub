import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const location = useLocation()
  return (
    <nav className="w-full sticky top-0 z-50 h-16 flex justify-center md:justify-between items-center bg-gray-800 px-12 border-b-gray-50">
      <Link to="/" className="text-white text-xl flex-shrink-0 font-extrabold tracking-tight">🎮 Fun Games Hub</Link>
      <div className="hidden md:flex space-x-8 font-semibold">
          <a href="#games">Games</a>
          <a href="https://github.com/CSI-CATT/Games-Hub">Contributions</a>
      </div>
    </nav>
  )
}
