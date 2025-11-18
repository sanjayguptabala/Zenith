import React, { useState } from 'react';
import CrashTheBall from '../games/CrashTheBall';
import BreakTheBlocks from '../games/BreakTheBlocks';
import DodgeTheBlocks from '../games/DodgeTheBlocks';

type Game = 'crash' | 'break' | 'dodge' | null;

const Games: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<Game>(null);

    const renderGame = () => {
        switch (selectedGame) {
            case 'crash':
                return <CrashTheBall />;
            case 'break':
                return <BreakTheBlocks />;
            case 'dodge':
                return <DodgeTheBlocks />;
            default:
                return (
                    <div className="text-left">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Choose a Game to Relax</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Take a short break and refresh your mind.</p>
                        <div className="flex flex-col md:flex-row justify-start gap-8">
                            <button onClick={() => setSelectedGame('crash')} className="px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105">
                                Play Crash The Ball
                            </button>
                            <button onClick={() => setSelectedGame('break')} className="px-8 py-4 bg-secondary text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition-all transform hover:scale-105">
                                Play Break The Blocks
                            </button>
                            <button onClick={() => setSelectedGame('dodge')} className="px-8 py-4 bg-warning text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition-all transform hover:scale-105">
                                Play Dodge The Blocks
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col">
            <header className="mb-8 text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Calming Mini-Games</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Take a short break to relax, unwind, and refresh your mind.</p>
            </header>
            {selectedGame && (
                 <button onClick={() => setSelectedGame(null)} className="mb-8 px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors self-start">
                    Back to Game Selection
                </button>
            )}
            <div className="w-full max-w-4xl bg-card dark:bg-gray-800 p-4 rounded-xl shadow-2xl transition-colors duration-300 self-start">
                {renderGame()}
            </div>
        </div>
    );
};

export default Games;