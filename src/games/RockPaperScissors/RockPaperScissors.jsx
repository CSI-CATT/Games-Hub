import React, { useState, useMemo } from 'react';

const CHOICES = {
    rock: 'src/games/RockPaperScissors/images/rock.png',
    paper: 'src/games/RockPaperScissors/images/paper.png',
    scissors: 'src/games/RockPaperScissors/images/scissors.png',
};

const WIN_CONDITIONS = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
};

const choiceKeys = Object.keys(CHOICES);

export default function App() {

    const [playerChoice, setPlayerChoice] = useState(null);
    const [computerChoice, setComputerChoice] = useState(null);
    const [result, setResult] = useState(null); // 'win', 'lose', 'tie'
    const [score, setScore] = useState({ player: 0, computer: 0, tie: 0 });

    const handlePlayerChoice = (choice) => {
        setPlayerChoice(choice);
        const compChoice = choiceKeys[Math.floor(Math.random() * choiceKeys.length)];
        setComputerChoice(compChoice);

        if (choice === compChoice) {
            setResult('tie');
            setScore(s => ({ ...s, tie: s.tie + 1 }));
        } else if (WIN_CONDITIONS[choice] === compChoice) {
            setResult('win');
            setScore(s => ({ ...s, player: s.player + 1 }));
        } else {
            setResult('lose');
            setScore(s => ({ ...s, computer: s.computer + 1 }));
        }
    };

    const resetGame = () => {
        setScore({ player: 0, computer: 0, tie: 0 });
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
    };

    const resultMessage = useMemo(() => {
        if (result === 'win') return { text: 'You Win!', color: 'text-green-400' };
        if (result === 'lose') return { text: 'You Lose!', color: 'text-red-400' };
        if (result === 'tie') return { text: "It's a Tie!", color: 'text-yellow-400' };
        return { text: 'Make your move!', color: 'text-gray-200' };
    }, [result]);

    const ChoiceDisplay = ({ title, choice }) => (
        <div className="text-center">
            <p className="text-lg font-semibold mb-4 text-gray-300">{title}</p>
            <div className={`w-32 h-32 md:w-40 md:h-40 bg-gray-700 rounded-full flex items-center justify-center shadow-inner transition-opacity duration-300 ${choice ? 'opacity-100' : 'opacity-50'}`}>
                {choice ? (
                    <img src={CHOICES[choice]} alt={choice} className="w-20 h-20 md:w-24 md:h-24 object-contain" />
                ) : (
                    <span className="text-6xl">?</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans p-4 text-white">
            <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">

                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-100 mb-6 tracking-wider">
                    Rock, Paper, Scissors
                </h1>

                <div className="grid grid-cols-3 gap-4 text-center bg-gray-900/50 p-4 rounded-lg mb-8 shadow-inner">
                    <div>
                        <p className="text-lg font-semibold text-blue-400">Player</p>
                        <p className="text-3xl font-bold">{score.player}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-400">Ties</p>
                        <p className="text-3xl font-bold">{score.tie}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-red-400">Computer</p>
                        <p className="text-3xl font-bold">{score.computer}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-8">
                    <ChoiceDisplay title="Your Choice" choice={playerChoice} />
                    <div className="hidden sm:block text-4xl font-extrabold text-gray-500">VS</div>
                    <ChoiceDisplay title="Computer's Choice" choice={computerChoice} />
                </div>

                <div className="h-12 flex items-center justify-center">
                    <h2 className={`text-2xl md:text-3xl font-bold text-center transition-all duration-300 ${resultMessage.color}`}>
                        {resultMessage.text}
                    </h2>
                </div>

                <div className="flex justify-center gap-4 md:gap-6 my-8">
                    {choiceKeys.map((choice) => (
                        <button
                            key={choice}
                            onClick={() => handlePlayerChoice(choice)}
                            className="group relative w-24 h-24 md:w-28 md:h-28 bg-gray-700 border-4 border-gray-600 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:border-blue-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500 shadow-lg"
                            aria-label={`Choose ${choice}`}
                        >
                            <img src={CHOICES[choice]} alt={choice} className="w-16 h-16 md:w-18 md:h-18 object-contain transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
                            <span className="absolute -bottom-8 capitalize text-sm font-semibold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {choice}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={resetGame}
                        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-300"
                    >
                        Reset Game
                    </button>
                </div>
            </div>
        </div>
    );
}

