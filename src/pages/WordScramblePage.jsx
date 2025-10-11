import React from 'react';
import WordScramble from '../games/wordscramble/WordScramble';

export default function WordScramblePage() {
  return (
    <div className="page-container">
      {/* The h2 from the game component is used as the title */}
      <WordScramble />
    </div>
  )
}