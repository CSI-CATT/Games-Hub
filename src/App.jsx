import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import TicTacToePage from './pages/TicTacToePage'
import MemoryPage from './pages/MemoryPage'
import SnakePage from './pages/SnakePage'
import WordScramblePage from './pages/WordScramblePage' // 1. IMPORT YOUR NEW PAGE

export default function App() {
  return (
    <div>
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tictactoe" element={<TicTacToePage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/snake" element={<SnakePage />} />
          {/* 2. ADD THE ROUTE FOR YOUR GAME */}
          <Route path="/word-scramble" element={<WordScramblePage />} /> 
        </Routes>
      </main>
    </div>
  )
}