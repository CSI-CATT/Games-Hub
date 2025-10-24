import React from "react";
import GameCard from "../components/GameCard";
import TicTacToeIcon from "../assets/tic-tac-toe.svg";
import MemoryMatchIcon from "../assets/card-pickup.svg";
import SnakeIcon from "../assets/snake.svg";
import TypingIcon from "../assets/keyboard.svg";
import WordScrambleIcon from "../assets/notebook.svg";
import RPSIcon from "../assets/scissors.svg";
import WordleIcon from "../assets/wordle.svg";

export default function Home() {
  return (
    <div className="max-w-8xl mx-auto min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Header Section */}
      <header className="flex flex-col justify-center items-center text-center gap-6 py-20 px-6 bg-gradient-to-br from-pink-500/80 to-blue-500/80 shadow-2xl rounded-b-3xl backdrop-blur-md">
        <h1 className="text-5xl sm:text-7xl font-extrabold drop-shadow-lg">
          Welcome to <span className="text-yellow-300">Fun Games Hub 🎉</span>
        </h1>
        <p className="text-lg sm:text-2xl max-w-3xl leading-relaxed text-gray-100">
          A hub of exciting mini games built for{" "}
          <span className="font-semibold text-yellow-300">Hacktoberfest</span>{" "}
          contributions!
        </p>
        <a
          href="#games"
          className="mt-4 px-6 py-3 bg-yellow-400 text-black rounded-xl font-bold shadow-lg hover:scale-105 hover:bg-yellow-300 transition-transform duration-300"
        >
          🎮 Explore Games
        </a>
      </header>

      {/* Games Section */}
      <section id="games" className="py-16 px-6">
        <h3 className="text-4xl font-semibold text-center mb-12">
          Explore <span className="text-yellow-300">Featured Games</span>
        </h3>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <GameCard
            title="Tic Tac Toe"
            desc="Classic 3x3 game"
            to="/tictactoe"
            imageUrl={TicTacToeIcon}
          />
          <GameCard
            title="Memory Match"
            desc="Flip and match pairs"
            to="/memory"
            imageUrl={MemoryMatchIcon}
          />
          <GameCard
            title="Snake"
            desc="Classic snake game"
            to="/snake"
            imageUrl={SnakeIcon}
          />
          <GameCard
            title="Typing Speed Game"
            desc="Play and test your typing speed"
            to="/typing-speed"
            imageUrl={TypingIcon}
          />
          <GameCard
            title="Word Scramble"
            desc="Unscramble letters to find the hidden word"
            to="/word-scramble"
            imageUrl={WordScrambleIcon}
          />
          <GameCard
            title="Rock Paper Scissors"
            desc="Classic RPS game"
            to="/RockPaperScissors"
            imageUrl={RPSIcon}
          />
          <GameCard
            title="Wordle Game"
            desc="Guess the hidden word"
            to="/Wordle"
            imageUrl={WordleIcon}
          />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 py-6 mt-10 text-center text-gray-400 border-t border-gray-700">
        <p className="text-sm tracking-wide">
          © 2025{" "}
          <span className="text-white font-semibold">CSI-CATT DMCE</span> —
          Built with ❤️ for gamers.
        </p>
      </footer>
    </div>
  );
}
