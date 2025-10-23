import React, { useState, useEffect, useCallback } from 'react';
import './WordScramble.css'; // We will create this CSS file next

// A small, expandable list of words for the game
const wordList = [
  'react', 'vite', 'javascript', 'tailwind', 'github', 'component',
  'developer', 'keyboard', 'monitor', 'internet', 'network', 'contribution'
];

// Helper function to scramble a word using the Fisher-Yates shuffle algorithm
function scrambleWord(word) {
  const a = word.split('');
  const n = a.length;

  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]; // Swap elements
  }

  // Ensure the scrambled word is not the same as the original
  const scrambled = a.join('');
  return scrambled === word ? scrambleWord(word) : scrambled;
}

export default function WordScramble() {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);

  // Function to set up a new round
  const setupNewRound = useCallback(() => {
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(newWord);
    setScrambledWord(scrambleWord(newWord));
    setUserInput('');
    setMessage('');
    setIsCorrect(null);
  }, []);

  // Initialize the game on the first render
  useEffect(() => {
    setupNewRound();
  }, [setupNewRound]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    // Clear message when user starts typing
    if (message) {
      setMessage('');
      setIsCorrect(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

   if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      setScore(prevScore => prevScore + 10);
      setMessage('Correct! Well done!');
      setIsCorrect(true);
      // Clear message and start new round
      setTimeout(() => {
        setupNewRound();
      }, 1500);
    } else {
      setMessage('Incorrect. Try again!');
      setIsCorrect(false);
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setIsCorrect(null);
      }, 3000);
    }
  };

  const handleSkip = () => {
    // Optionally penalize for skipping
    // setScore(prevScore => prevScore > 0 ? prevScore - 1 : 0);
    setMessage('Skipped! Here is a new word.');
    setIsCorrect(null);
    setupNewRound();
  };

  return (
    <div className="word-scramble-game">
      <div className="game-header">
        <p className='unscrambleTitle'>Unscramble the Word!</p>
        <div className="score">Score: {score}</div>
      </div>
      
      <div className="scrambled-word-container">
        <p className="scrambled-word">{scrambledWord}</p>
      </div>

      {message && (
        <p className={`message ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
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
          disabled={isCorrect === true} // Disable input after correct guess
        />
        <button type="submit" className="btn submit-btn" disabled={isCorrect === true}>
          Guess
        </button>
      </form>

      <button onClick={handleSkip} className="btn skip-btn" disabled={isCorrect === true}>
        Skip Word
      </button>
    </div>
  );
}