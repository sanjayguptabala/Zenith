import React from 'react';
import { Link } from 'react-router-dom';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.243 2 7 4.243 7 7c0 1.44.586 2.746 1.526 3.682-1.805.565-3.21 1.97-3.66 3.818H4v2h2.134c.148 1.474.8 2.793 1.764 3.824-1.294.942-2.222 2.39-2.222 4.176h12.648c0-1.786-.928-3.234-2.222-4.176.963-1.031 1.616-2.35 1.764-3.824H20v-2h-.866c-.45-1.848-1.855-3.253-3.66-3.818C16.414 9.746 17 8.44 17 7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"/>
    </svg>
);

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black text-center flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <BrainIcon className="h-24 w-24 text-primary mb-4" />
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-gray-100">
                Welcome to <span className="text-primary">Zenith</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Your personal space for mental wellness. Understand your stress, find balance, and build resilience throughout your student journey.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                    to="/login"
                    className="px-8 py-4 bg-primary text-white font-bold rounded-full text-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 duration-300"
                >
                    Get Started
                </Link>
            </div>
            <div className="absolute bottom-10 text-gray-500 dark:text-gray-400">
                <p>An initiative to support student well-being</p>
            </div>
        </div>
    );
};

export default Home;