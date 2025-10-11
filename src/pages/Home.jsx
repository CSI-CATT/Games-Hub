import React from 'react'
import GameCard from '../components/GameCard'

export default function Home() {
  return (
    <div>
      <header className="hero">
        <h1>Welcome to Fun Games Hub 🎉</h1>
        <p>A hub of fun games made for Hacktoberfest contributions!</p>
      </header>

      <section className="games-grid">
        <GameCard title="Tic Tac Toe" desc="Classic 3x3 game" to="/tictactoe" />
        <GameCard title="Memory Match" desc="Flip and match pairs" to="/memory" />
        <GameCard title="Snake" desc="Classic snake game" to="/snake" />
        <GameCard title="Rock Paper Scissors" desc="Classic Rock Paper Scissors game" to="/RockPaperScissors" />
        <GameCard title="Word Scramble" desc="Unscramble letters to find the hidden word" to="/word-scramble" />

        {/* 🆕 Added Hack the Vault game card */}
        <GameCard 
          title="Hack the Vault 🔐"
          desc="Generate strong passwords to unlock the vault!"
          to="/hackthevault"
        />
      </section>
    </div>
  )
}
