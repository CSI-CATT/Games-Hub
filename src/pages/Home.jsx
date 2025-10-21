import React from 'react'
import GameCard from '../components/GameCard'
import TicTacToeIcon from '../assets/tic-tac-toe.svg';
import MemoryMatchIcon from '../assets/card-pickup.svg';
import SnakeIcon from '../assets/snake.svg';
import TypingIcon from '../assets/keyboard.svg';
import WordScrambleIcon from '../assets/notebook.svg';
import RPSIcon from '../assets/scissors.svg';
import WordleIcon from '../assets/wordle.svg'
// svg icons taken from the website https://game-icons.net/

export default function Home() {
  return (
    <div className='max-w-8xl mx-auto h-screen flex flex-col gap-16'>
      <header className="max-w-full min-h-[80vh] bg-gradient-to-br from-pink-500/70 to-blue-500/70 flex flex-col justify-center items-center gap-8">
        <h1 className='text-4xl text-center sm:text-7xl font-extrabold '>Welcome to Fun Games Hub 🎉</h1>
        <p className='text-xl sm:text-2xl text-center'>A hub of fun games made for Hacktoberfest contributions!</p>
      </header>

      <section id="games" className="games">
        <h3 className='text-3xl text-center font-semibold'>Explore Featured Games</h3>
        <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8 '>
        <GameCard title="Tic Tac Toe" desc="Classic 3x3 game" to="/tictactoe" className="aspect-square" imageUrl={TicTacToeIcon}/>
        <GameCard title="Memory Match" desc="Flip and match pairs" to="/memory" className="aspect-square" imageUrl={MemoryMatchIcon}/>
        <GameCard title="Snake" desc="Classic snake game" to="/snake" className="aspect-square" imageUrl={SnakeIcon} />
        <GameCard title="Typing Speed Game" desc= "Play and test your typing speed" to="/typing-speed" className="aspect-square" imageUrl={TypingIcon} />
        <GameCard 
          title="Word Scramble" 
          desc="Unscramble letters to find the hidden word" 
          to="/word-scramble" 
          className="aspect-square"
          imageUrl={WordScrambleIcon}
        />
        <GameCard title="Rock Paper Scissors" desc="Classic Rock Paper Scissors game" to="/RockPaperScissors" className="aspect-square"imageUrl={RPSIcon}/>
        <GameCard title="Wordle Game" desc="A word guessing game" to="/Wordle" className="aspect-square"imageUrl={WordleIcon}/>
        </div>
      </section>

      <footer className='text-center bg-gray-800'>
        CSI-CATT DMCE &copy; 2025
      </footer>
    </div>
  )
}