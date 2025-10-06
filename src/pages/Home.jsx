// In src/pages/Home.jsx...
import React from 'react'
import { Link } from 'react-router-dom'
// Assume GameCard component exists
// import GameCard from '../components/GameCard'

export default function Home() {
  const games = [
    {
      title: 'Tic Tac Toe',
      description: 'The classic game of Xs and Os.',
      link: '/tictactoe'
    },
    {
      title: 'Memory Match',
      description: 'Test your memory by finding matching cards.',
      link: '/memory'
    },
    {
      title: 'Snake',
      description: 'Guide the snake to eat and grow.',
      link: '/snake'
    },
    // --- ADD YOUR NEW GAME OBJECT HERE ---
    {
      title: 'Word Scramble',
      description: 'Unscramble the letters to find the hidden word.',
      link: '/word-scramble'
    }
  ];

  return (
    <div>
      <h1>Fun Games Hub</h1>
      <div className="game-list">
        {/* Assume the code maps over `games` to render GameCards */}
        {games.map(game => (
          // <GameCard key={game.title} {...game} />
          <Link to={game.link} key={game.title} className="game-card">
            <h3>{game.title}</h3>
            <p>{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}