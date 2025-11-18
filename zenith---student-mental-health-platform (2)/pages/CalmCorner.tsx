import React from 'react';
import BreathingExercise from '../components/BreathingExercise';

const CalmCorner: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Calm Corner</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Find your center with guided exercises to reset and recharge.
                </p>
            </header>
            <main>
                <BreathingExercise />
            </main>
        </div>
    );
};

export default CalmCorner;