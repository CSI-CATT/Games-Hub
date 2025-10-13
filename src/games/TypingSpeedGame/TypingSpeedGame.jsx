import React, { useState, useEffect, useRef } from "react";

const WORDS = [
  "react", "javascript", "tailwind", "programming", "developer",
  "function", "component", "state", "effect", "variable",
  "algorithm", "array", "object", "module", "hook"
];

const TypingSpeedGame = () => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    setWords(shuffled);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft === 0) {
      setIsRunning(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isRunning]);

  const handleInput = (e) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      if (value.trim() === words[currentWordIndex]) {
        setCorrectWords(correctWords + 1);
      }
      setCurrentWordIndex(currentWordIndex + 1);
      setInputValue("");
    } else {
      setInputValue(value);
    }
  };

  const startGame = () => {
    setIsRunning(true);
    setTimeLeft(60);
    setCorrectWords(0);
    setCurrentWordIndex(0);
    setInputValue("");
    inputRef.current.focus();
  };

  const wpm = correctWords;

  const styles = {
    container: {
      maxWidth: "500px",
      margin: "40px auto",
      padding: "20px",
      backgroundColor: "#1e293b",
      boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
      borderRadius: "10px",
      fontFamily: "Arial, sans-serif",
      color: "#f8fafc",
    },
    title: {
      textAlign: "center",
      fontSize: "24px",
      marginBottom: "20px",
      color: "#38bdf8"
    },
    timer: {
      textAlign: "center",
      marginBottom: "15px",
      fontWeight: "bold",
      color: "#f8fafc"
    },
    wordBox: {
      backgroundColor: "#0f172a",
      padding: "10px",
      borderRadius: "8px",
      minHeight: "80px",
      display: "flex",
      flexWrap: "wrap",
      gap: "5px",
      marginBottom: "15px"
    },
    wordCurrent: {
      backgroundColor: "#38bdf8",
      color: "#0f172a",
      padding: "2px 5px",
      borderRadius: "4px",
    },
    wordCorrect: {
      color: "#22c55e",
      textDecoration: "line-through"
    },
    inputBox: {
      width: "100%",
      padding: "8px",
      border: "1px solid #38bdf8",
      borderRadius: "6px",
      marginBottom: "15px",
      fontSize: "16px",
      backgroundColor: "#0f172a",
      color: "#f8fafc",
    },
    progressContainer: {
      height: "12px",
      backgroundColor: "#0f172a",
      borderRadius: "6px",
      marginBottom: "15px",
      border: "1px solid #38bdf8"
    },
    progressBar: {
      height: "12px",
      backgroundColor: "#38bdf8",
      borderRadius: "6px",
      width: `${((60 - timeLeft) / 60) * 100}%`,
      transition: "width 0.3s"
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "#38bdf8",
      color: "#0f172a",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Typing Speed Game</h1>

      <div style={styles.timer}>Time Left: {timeLeft}s</div>

      <div style={styles.wordBox}>
        {words.map((word, index) => (
          <span
            key={index}
            style={{
              ...(index === currentWordIndex ? styles.wordCurrent : {}),
              ...(index < currentWordIndex ? styles.wordCorrect : {})
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        style={styles.inputBox}
        type="text"
        value={inputValue}
        onChange={handleInput}
        disabled={!isRunning}
        placeholder={isRunning ? "Type the highlighted word..." : "Click Start"}
      />

      <div style={styles.progressContainer}>
        <div style={styles.progressBar}></div>
      </div>

      <div style={styles.footer}>
        <span>WPM: {wpm}</span>
        <button style={styles.button} onClick={startGame}>Start</button>
      </div>
    </div>
  );
};

export default TypingSpeedGame;
