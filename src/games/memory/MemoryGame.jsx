import React, { useState, useEffect } from 'react'

const icons = ['🍎','🍌','🍇','🍒','🥝','🍍']

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5)
}

export default function MemoryGame() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    setCards(shuffle([...icons, ...icons]))
  }, [])

  function flipCard(i) {
    if (flipped.includes(i) || matched.includes(i)) return

    const newFlipped = [...flipped, i]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped
      if (cards[a] === cards[b]) {
        setMatched([...matched, a, b])
        setScore(prev => prev + 10) // +10 points for a match
      } else {
        setScore(prev => Math.max(prev - 2, 0)) // -2 points for wrong guess (score can't go below 0)
      }
      setTimeout(() => setFlipped([]), 800)
    }
  }

  function reset() {
    setCards(shuffle([...icons, ...icons]))
    setFlipped([])
    setMatched([])
    setScore(0)
  }

  return (
    <div className="memory">
      {/* Game Description */}
      <div className="memory-description">
        <h3>Try to match all the cards!</h3>
        <p>
          <strong>Scoring System:</strong> 
          <ul>
            <li>✅ Each correct match gives you +10 points</li>
            <li>❌ Each wrong guess deducts 2 points (score cannot go below 0)</li>
          </ul>
          Click on the cards to reveal them and find matching pairs. Good luck!
        </p>
      </div>

      {/* Current Score */}
      <h3>Score: {score}</h3>

      {/* Game Grid */}
      <div className="memory-grid">
        {cards.map((card, i) => {
          const isShown = flipped.includes(i) || matched.includes(i)
          return (
            <button key={i} className="memory-card" onClick={() => flipCard(i)}>
              {isShown ? card : "❓"}
            </button>
          )
        })}
      </div>

      {/* Reset Button */}
      <button onClick={reset} className="btn">Reset</button>
    </div>
  )
}
