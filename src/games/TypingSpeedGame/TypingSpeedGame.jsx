import React, { useState, useEffect, useRef } from "react";

const PARAGRAPH = `
In the bustling world of software development, speed and accuracy often determine a developer's productivity. Practicing typing using carefully crafted passages helps improve not only the raw words per minute but also comprehension and attention to detail. This paragraph is intentionally long so that players have a substantial amount of text to type, letting their pace settle and offering a proper test of their typing endurance and focus. Try to type each word correctly; when you finish the entire paragraph the game will end automatically and your speed will be highlighted.
`;

const TypingSpeedGame = () => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [finalWpm, setFinalWpm] = useState(null);
  const inputRef = useRef();
  const startTimeRef = useRef(null);

  useEffect(() => {
    // split paragraph into words on spaces; keep punctuation attached
    const ws = PARAGRAPH.trim().split(/\s+/);
    setWords(ws);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft === 0) {
      // finish the game due to timeout
      finishGame();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isRunning]);

  const handleInput = (e) => {
    const value = e.target.value;
    // if user typed a space, evaluate the current word
    if (value.endsWith(" ")) {
      const trimmed = value.trim();
      if (trimmed === words[currentWordIndex]) {
        setCorrectWords(c => c + 1);
      }
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setInputValue("");
      // if that was the last word, finish the game
      if (nextIndex >= words.length) {
        finishGame();
      }
    } else {
      setInputValue(value);
      // Special case: user types the final word without trailing space
      if (currentWordIndex === words.length - 1 && value.trim() === words[currentWordIndex]) {
        // treat as completed
        setCorrectWords(c => c + 1);
        setCurrentWordIndex(words.length);
        setInputValue("");
        finishGame();
      }
    }
  };

  const startGame = () => {
    setIsRunning(true);
    setTimeLeft(60);
    setCorrectWords(0);
    setCurrentWordIndex(0);
    setInputValue("");
    inputRef.current.focus();
    startTimeRef.current = Date.now();
    setFinalWpm(null);
  };

  const wpm = correctWords;

  function finishGame() {
    // stop the timer and compute wpm based on elapsed time
    setIsRunning(false);
    const end = Date.now();
    const start = startTimeRef.current || (end - (60 - timeLeft) * 1000);
    const elapsedSec = Math.max(1, (end - start) / 1000);
    const minutes = elapsedSec / 60;
    const computedWpm = Math.round(correctWords / minutes) || 0;
    setFinalWpm(computedWpm);
    // freeze timeLeft to actual elapsed
    setTimeLeft(prev => prev);
  }

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
                padding: '2px 6px',
                marginRight: 6,
                borderRadius: 4,
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
        <div style={{...styles.progressBar, width: `${(currentWordIndex / Math.max(1, words.length)) * 100}%`}}></div>
      </div>

      <div style={styles.footer}>
        <span>WPM: {wpm}</span>
        <div>
          <button style={{...styles.button, marginRight: 8}} onClick={startGame}>Start</button>
          <button style={styles.button} onClick={() => { setIsRunning(false); setInputValue(''); setCurrentWordIndex(0); setCorrectWords(0); setFinalWpm(null); }}>Reset</button>
        </div>
      </div>

      {finalWpm !== null && (
        <div style={{marginTop:16, textAlign:'center', background:'#052029', padding:12, borderRadius:8}}>
          <strong style={{fontSize:18, color:'#cfe8ff'}}>Finished! Your speed: {finalWpm} WPM</strong>
        </div>
      )}
    </div>
  );
};

export default TypingSpeedGame;
