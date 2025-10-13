import React from 'react'
import GameCard from '../components/GameCard'

export default function Home() {
  return (
    <div>
      <header className="hero">
        <h1 className="animated-heading">Welcome to Fun Games Hub 🎉</h1>
      </header>

      <section className="games-grid">
        <GameCard title="Tic Tac Toe" desc="Classic 3x3 game" to="/tictactoe" />
        <GameCard title="Memory Match" desc="Flip and match pairs" to="/memory" />
        <GameCard title="Snake" desc="Classic snake game" to="/snake" />
        <GameCard title="Typing Speed Game" desc= "Play and test your typing speed" to="/typing-speed" />
        
        {/* --- ADD THIS LINE FOR YOUR NEW GAME --- */}
        <GameCard 
          title="Word Scramble" 
          desc="Unscramble letters to find the hidden word" 
          to="/word-scramble" 
        />
        
        <GameCard title="Rock Paper Scissors" desc="Classic Rock Paper Scissors game" to="/RockPaperScissors" />
      </section>
    </div>
  )
}