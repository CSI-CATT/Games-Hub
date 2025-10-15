// import React, { useState, useRef, useEffect } from "react";
// import "./TypingSpeedGame.css";

// const PARAGRAPH = `React is a JavaScript library for building user interfaces. It allows developers to create large web applications that can update and render efficiently without reloading the page. The main concept of React is the component, which can be reused and combined to build complex user interfaces. Components manage their own state and can receive data through props.`;

// const TypingSpeedGame = () => {
//   const [text] = useState(PARAGRAPH.split(" "));
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [inputValue, setInputValue] = useState("");
//   const [isRunning, setIsRunning] = useState(false);
//   const [correctWords, setCorrectWords] = useState(0);
//   const [wrongWords, setWrongWords] = useState(0);
//   const [isCompleted, setIsCompleted] = useState(false);
//   const [typedWords, setTypedWords] = useState([]);
//   const [elapsedTime, setElapsedTime] = useState(0); // NEW: track time in seconds
//   const inputRef = useRef();
//   const timerRef = useRef(null);

//   // Start timer when game starts
//   useEffect(() => {
//     if (!isRunning) return;
//     timerRef.current = setInterval(() => {
//       setElapsedTime((prev) => prev + 1);
//     }, 1000);

//     return () => clearInterval(timerRef.current);
//   }, [isRunning]);

  




//   const handleInput = (e) => {
//     const value = e.target.value;

//     if (value.endsWith(" ")) {
//       const typedWord = value.trim();
//       const isCorrect = typedWord === text[currentWordIndex];

//       setTypedWords((prev) => [
//         ...prev,
//         { word: text[currentWordIndex], correct: isCorrect },
//       ]);

//       if (isCorrect) setCorrectWords((prev) => prev + 1);
//       else setWrongWords((prev) => prev + 1);

//       if (currentWordIndex + 1 === text.length) {
//         setIsRunning(false);
//         setIsCompleted(true);
//         clearInterval(timerRef.current);
//       }

//       setCurrentWordIndex((prev) => prev + 1);
//       setInputValue("");
//     } else {
//       setInputValue(value);
//     }
//   };

//   const startGame = () => {
//     setIsRunning(true);
//     setIsCompleted(false);
//     setCorrectWords(0);
//     setWrongWords(0);
//     setTypedWords([]);
//     setCurrentWordIndex(0);
//     setInputValue("");
//     setElapsedTime(0); // reset time
//     inputRef.current.focus();
//   };

//   const toggleGame = () => {
//   if (isRunning) {
//     // Stop the game
//     setIsRunning(false);
//     clearInterval(timerRef.current);
//   } else {
//     // Start the game
//     setIsRunning(true);
//     setIsCompleted(false);
//     setCorrectWords(0);
//     setWrongWords(0);
//     setTypedWords([]);
//     setCurrentWordIndex(0);
//     setInputValue("");
//     setElapsedTime(0);
//     inputRef.current.focus();
//   }
// };


//   const totalTyped = correctWords + wrongWords;
//   const accuracy = totalTyped > 0 ? ((correctWords / totalTyped) * 100).toFixed(2) : 0;

//   // Calculate WPM properly based on elapsed time
//   const wpm = elapsedTime > 0 ? ((correctWords / elapsedTime) * 60).toFixed(2) : 0;

//   return (
//     <div className="game-container">
//       <h1 className="game-title">Typing Speed Game</h1>

//       {!isCompleted ? (
//         <>
//           <div className="text-box">
//             {text.map((word, index) => {
//               const typed = typedWords[index];
//               let className = "";
//               if (index === currentWordIndex) className = "current-word";
//               else if (typed && typed.correct) className = "correct-word";
//               else if (typed && !typed.correct) className = "wrong-word";

//               return (
//                 <span key={index} className={className}>
//                   {word}
//                 </span>
//               );
//             })}
//           </div>

//           <input
//             ref={inputRef}
//             className="input-box"
//             type="text"
//             value={inputValue}
//             onChange={handleInput}
//             disabled={!isRunning}
//             placeholder={
//               isRunning
//                 ? "Type the highlighted word..."
//                 : "Click Start to begin typing..."
//             }
//           />

//           <div className="footer">
//             <div className="stat-card wpm">
//               <i className="fa-solid fa-keyboard"></i> WPM : {wpm} 
//             </div>
//             <div className="stat-card accuracy">
//               <i className="fa-solid fa-check"></i> Accuracy : {accuracy}%
//             </div>
//             <div className="stat-card time">
//               <i className="fa-solid fa-clock"></i> Time : {elapsedTime}s
//             </div>
//             <button className="start-btn" onClick={toggleGame}>
//               {isRunning ? "Stop" : "Start"}
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="completed-msg">
//           <div className="emoji">🎉</div>
//           <div>You completed the paragraph!</div>
//           <div>
//             <span className="wpm">{wpm} WPM</span> | <span className="accuracy">{accuracy}% Accuracy</span>
//           </div>
//           <div>Time taken: {elapsedTime}s</div>
//           <button 
//             className={`start-btn ${!isRunning ? "attention" : ""}`} 
//             onClick={startGame}
//           >
//             <i className="fa-solid fa-play"> &nbsp; </i>
//             {isRunning ? "Start" : "Restart"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TypingSpeedGame;


// import React, { useState, useRef, useEffect } from "react";
// import "./TypingSpeedGame.css";

// const PARAGRAPHS = [
//   `React is a JavaScript library for building user interfaces. It allows developers to create large web applications that can update and render efficiently without reloading the page. The main concept of React is the component, which can be reused and combined to build complex user interfaces. Components manage their own state and can receive data through props. React also provides hooks, like useState and useEffect, to manage state and side effects in functional components.`,

//   `JavaScript is single-threaded, but asynchronous code can be executed using callbacks, promises, or async/await. It is widely used for client-side web development, allowing developers to create interactive and dynamic web pages. JavaScript also supports event-driven programming and has a rich ecosystem of libraries and frameworks like React, Angular, and Vue. Understanding closures, the event loop, and prototypal inheritance is essential for mastering JavaScript.`,

//   `Node.js allows server-side execution of JavaScript, enabling full-stack development with a single language. It uses a non-blocking, event-driven architecture that makes it efficient for building scalable network applications. Node.js has a large ecosystem of modules available through npm, allowing developers to extend functionality easily. Common use cases include building APIs, real-time chat applications, and server-side rendered websites.`,

//   `CSS Grid allows building flexible and responsive layouts easily. By defining rows, columns, and gaps, developers can create complex designs without relying heavily on floats or positioning. CSS Grid works well with media queries, making it simple to adapt layouts to different screen sizes. It can be combined with Flexbox for more detailed alignment and spacing control. Mastering CSS Grid improves workflow efficiency and enables more creative and structured designs.`
// ];


// // Function to pick a random paragraph
// const getRandomParagraph = () => PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)];

// const TypingSpeedGame = () => {
//   const [text, setText] = useState([]);
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [inputValue, setInputValue] = useState("");
//   const [isRunning, setIsRunning] = useState(false);
//   const [correctWords, setCorrectWords] = useState(0);
//   const [wrongWords, setWrongWords] = useState(0);
//   const [isCompleted, setIsCompleted] = useState(false);
//   const [typedWords, setTypedWords] = useState([]);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const inputRef = useRef();
//   const timerRef = useRef(null);

//   // Timer effect
//   useEffect(() => {
//     if (!isRunning) return;
//     timerRef.current = setInterval(() => {
//       setElapsedTime((prev) => prev + 1);
//     }, 1000);

//     return () => clearInterval(timerRef.current);
//   }, [isRunning]);

//   // Handle input
//   const handleInput = (e) => {
//     const value = e.target.value;

//     if (value.endsWith(" ")) {
//       const typedWord = value.trim();
//       const isCorrect = typedWord === text[currentWordIndex];

//       setTypedWords((prev) => [
//         ...prev,
//         { word: text[currentWordIndex], correct: isCorrect },
//       ]);

//       if (isCorrect) setCorrectWords((prev) => prev + 1);
//       else setWrongWords((prev) => prev + 1);

//       if (currentWordIndex + 1 === text.length) {
//         setIsRunning(false);
//         setIsCompleted(true);
//         clearInterval(timerRef.current);
//       }

//       setCurrentWordIndex((prev) => prev + 1);
//       setInputValue("");
//     } else {
//       setInputValue(value);
//     }
//   };

//   // Start game with random paragraph
//   const startGame = () => {
//     const paragraph = getRandomParagraph();
//     setText(paragraph.split(" "));

//     setIsRunning(true);
//     setIsCompleted(false);
//     setCorrectWords(0);
//     setWrongWords(0);
//     setTypedWords([]);
//     setCurrentWordIndex(0);
//     setInputValue("");
//     setElapsedTime(0);
//     inputRef.current.focus();
//   };

//   // Start/Stop toggle
//   const toggleGame = () => {
//     if (isRunning) {
//       setIsRunning(false);
//       clearInterval(timerRef.current);
//     } else {
//       startGame();
//     }
//   };

//   const totalTyped = correctWords + wrongWords;
//   const accuracy =
//     totalTyped > 0 ? ((correctWords / totalTyped) * 100).toFixed(2) : 0;
//   const wpm = elapsedTime > 0 ? ((correctWords / elapsedTime) * 60).toFixed(2) : 0;

//   return (
//     <div className="game-container">
//       <h1 className="game-title">Typing Speed Game</h1>

//       {!isCompleted ? (
//         <>
//           <div className="text-box">
//             {text.map((word, index) => {
//               const typed = typedWords[index];
//               let className = "";
//               if (index === currentWordIndex) className = "current-word";
//               else if (typed && typed.correct) className = "correct-word";
//               else if (typed && !typed.correct) className = "wrong-word";

//               return (
//                 <span key={index} className={className}>
//                   {word}
//                 </span>
//               );
//             })}
//           </div>

//           <input
//             ref={inputRef}
//             className="input-box"
//             type="text"
//             value={inputValue}
//             onChange={handleInput}
//             disabled={!isRunning}
//             placeholder={
//               isRunning
//                 ? "Type the highlighted word..."
//                 : "Click Start to begin typing..."
//             }
//           />

//           <div className="footer">
//             <div className="stat-card wpm">
//               <i className="fa-solid fa-keyboard"></i> WPM : {wpm} 
//             </div>
//             <div className="stat-card accuracy">
//               <i className="fa-solid fa-check"></i> Accuracy : {accuracy}%
//             </div>
//             <div className="stat-card time">
//               <i className="fa-solid fa-clock"></i> Time : {elapsedTime}s
//             </div>
//             <button className="start-btn" onClick={toggleGame}>
//               {isRunning ? "Stop" : "Start"}
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="completed-msg">
//           <div className="emoji">🎉</div>
//           <div>You completed the paragraph!</div>
//           <div>
//             <span className="wpm">{wpm} WPM</span> |{" "}
//             <span className="accuracy">{accuracy}% Accuracy</span>
//           </div>
//           <div>Time taken: {elapsedTime}s</div>
//           <button className="start-btn" onClick={startGame}>
//             Restart
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TypingSpeedGame;


import React, { useState, useRef, useEffect } from "react";
import "./TypingSpeedGame.css";

const PARAGRAPHS = [
  `React is a JavaScript library for building user interfaces. Components manage their own state, can receive data through props, and can be composed together to create complex UI structures. React also provides hooks like useState, useEffect, and useContext to manage state and side effects in functional components.`,

  `JavaScript is single-threaded, but asynchronous code can be executed using callbacks, promises, or async/await. It is widely used for interactive web pages, and developers use it to manipulate the DOM, handle events, and communicate with APIs. Understanding closures, the event loop, and prototypes is important for writing efficient JavaScript.`,

  `Node.js allows server-side execution of JavaScript, enabling full-stack development with a single language. It uses a non-blocking, event-driven architecture, making it highly efficient for building scalable network applications like APIs, chat apps, and real-time dashboards. Node.js has a large ecosystem of modules available through npm.`,

  `CSS Grid allows building flexible and responsive layouts easily. By defining rows, columns, and gaps, developers can create complex designs without relying heavily on floats or absolute positioning. It works well with media queries and can be combined with Flexbox for precise alignment and spacing, enabling efficient and creative designs.`
];

// Function to pick a random paragraph
const getRandomParagraph = () =>
  PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)];

const TypingSpeedGame = () => {
  const [text, setText] = useState(getRandomParagraph().split(" "));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [wrongWords, setWrongWords] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [typedWords, setTypedWords] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const inputRef = useRef();
  const timerRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Handle input
  const handleInput = (e) => {
    const value = e.target.value;

    if (value.endsWith(" ")) {
      const typedWord = value.trim();
      const isCorrect = typedWord === text[currentWordIndex];

      setTypedWords((prev) => [
        ...prev,
        { word: text[currentWordIndex], correct: isCorrect },
      ]);

      if (isCorrect) setCorrectWords((prev) => prev + 1);
      else setWrongWords((prev) => prev + 1);

      if (currentWordIndex + 1 === text.length) {
        setIsRunning(false);
        setIsCompleted(true);
        clearInterval(timerRef.current);
      }

      setCurrentWordIndex((prev) => prev + 1);
      setInputValue("");
    } else {
      setInputValue(value);
    }
  };

  // Start game with random paragraph
  const startGame = () => {
    const paragraph = getRandomParagraph();
    setText(paragraph.split(" "));

    setIsRunning(true);
    setIsCompleted(false);
    setCorrectWords(0);
    setWrongWords(0);
    setTypedWords([]);
    setCurrentWordIndex(0);
    setInputValue("");
    setElapsedTime(0);
    inputRef.current.focus();
  };

  // Start/Stop toggle
  const toggleGame = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(timerRef.current);
    } else {
      startGame();
    }
  };

  const totalTyped = correctWords + wrongWords;
  const accuracy =
    totalTyped > 0 ? ((correctWords / totalTyped) * 100).toFixed(2) : 0;
  const wpm = elapsedTime > 0 ? ((correctWords / elapsedTime) * 60).toFixed(2) : 0;

  return (
    <div className="game-container">
      <h1 className="game-title">Typing Speed Game</h1>

      {!isCompleted ? (
        <>
          <div className="text-box">
            {text.map((word, index) => {
              const typed = typedWords[index];
              let className = "";
              if (index === currentWordIndex) className = "current-word";
              else if (typed && typed.correct) className = "correct-word";
              else if (typed && !typed.correct) className = "wrong-word";

              return (
                <span key={index} className={className}>
                  {word}
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            className="input-box"
            type="text"
            value={inputValue}
            onChange={handleInput}
            disabled={!isRunning}
            placeholder={
              isRunning
                ? "Type the highlighted word..."
                : "Click Start to begin typing..."
            }
          />

          <div className="footer">
            <div className="stat-card wpm">
              <i className="fa-solid fa-keyboard"></i> WPM : {wpm} 
            </div>
            <div className="stat-card accuracy">
              <i className="fa-solid fa-check"></i> Accuracy : {accuracy}%
            </div>
            <div className="stat-card time">
              <i className="fa-solid fa-clock"></i> Time : {elapsedTime}s
            </div>
            <button className="start-btn" onClick={toggleGame}>
              {isRunning ? "Stop" : "Start"}
            </button>
          </div>
        </>
      ) : (
        <div className="completed-msg">
          <div className="emoji">🎉</div>
          <div>You completed the paragraph!</div>
          <div>
            <span className="wpm">{wpm} WPM</span> |{" "}
            <span className="accuracy">{accuracy}% Accuracy</span>
          </div>
          <div>Time taken: {elapsedTime}s</div>
          <button className="start-btn" onClick={startGame}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default TypingSpeedGame;
