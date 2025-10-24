import React, { useState, useEffect, useCallback } from "react";
import "./WordScramble.css";

const wordsWithHints = [
  { word: "react", hint: "A popular JavaScript library for building UIs" },
  { word: "vite", hint: "A fast frontend build tool and dev server" },
  { word: "javascript", hint: "The programming language of the web" },
  { word: "tailwind", hint: "A utility-first CSS framework" },
  { word: "github", hint: "A platform for hosting and sharing code" },
  { word: "component", hint: "A reusable piece of UI in React" },
  { word: "developer", hint: "Someone who writes and builds software" },
  { word: "keyboard", hint: "A device used to type text" },
  { word: "monitor", hint: "A screen used to display output" },
  { word: "internet", hint: "A global network connecting computers" },
  { word: "network", hint: "A group of connected systems or people" },
  { word: "contribution", hint: "An act of adding code or help to a project" },
];

function scrambleWord(word) {
  const a = word.split("");
  const n = a.length;

  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  const scrambled = a.join("");
  return scrambled === word ? scrambleWord(word) : scrambled;
}

export default function WordScramble() {
  const [currentWord, setCurrentWord] = useState("");
  const [currentHint, setCurrentHint] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);

  const setupNewRound = useCallback(() => {
    const randomItem =
      wordsWithHints[Math.floor(Math.random() * wordsWithHints.length)];
    setCurrentWord(randomItem.word);
    setCurrentHint(randomItem.hint);
    setScrambledWord(scrambleWord(randomItem.word));
    setUserInput("");
    setMessage("");
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    setupNewRound();
  }, [setupNewRound]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (message) {
      setMessage("");
      setIsCorrect(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      setScore((prev) => prev + 10);
      setMessage("✅ Correct! Great job!");
      setIsCorrect(true);
      setTimeout(setupNewRound, 1500);
    } else {
      setMessage("❌ Incorrect. Try again!");
      setIsCorrect(false);
    }
  };

  const handleSkip = () => {
    setMessage("⏩ Skipped! Here’s a new word.");
    setIsCorrect(null);
    setupNewRound();
  };

  return (
    <div className="word-scramble-game">
      <div className="game-header">
        <h2>🧩 Unscramble the Word!</h2>
        <div className="score">Score: {score}</div>
      </div>

      <div className="scrambled-word-container">
        <p className="scrambled-word">{scrambledWord}</p>
        <p className="hint">
          <strong>Hint:</strong> {currentHint}
        </p>
      </div>

      {message && (
        <p
          className={`message ${isCorrect ? "correct" : isCorrect === false ? "incorrect" : ""}`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Your guess..."
          className="guess-input"
          disabled={isCorrect === true}
        />
        <button
          type="submit"
          className="btn submit-btn"
          disabled={isCorrect === true}
        >
          Guess
        </button>
      </form>

      <button
        onClick={handleSkip}
        className="btn skip-btn"
        disabled={isCorrect === true}
      >
        Skip Word
      </button>
    </div>
  );
}
