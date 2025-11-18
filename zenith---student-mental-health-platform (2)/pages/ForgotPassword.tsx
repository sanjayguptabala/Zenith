import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import { sendPasswordResetEmail } from '../services/mockDb';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.243 2 7 4.243 7 7c0 1.44.586 2.746 1.526 3.682-1.805.565-3.21 1.97-3.66 3.818H4v2h2.134c.148 1.474.8 2.793 1.764 3.824-1.294.942-2.222 2.39-2.222 4.176h12.648c0-1.786-.928-3.234-2.222-4.176.963-1.031 1.616-2.35 1.764-3.824H20v-2h-.866c-.45-1.848-1.855-3.253-3.66-3.818C16.414 9.746 17 8.44 17 7c0-2.757-2.243-5-5-5z"/>
    </svg>
);

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);
        
        try {
            // Always show a generic success message to prevent user enumeration
            const result = await sendPasswordResetEmail(email);
            setMessage(result.message);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            addNotification(errorMessage, 'error');
            // We can still show a generic message in the UI for security
            setMessage('If an account with that email exists, a password reset link has been sent.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <BrainIcon className="h-16 w-16 text-primary mx-auto" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">Reset Your Password</h1>
                    <p className="text-gray-500 dark:text-gray-400">Enter your email to receive a reset link.</p>
                </div>

                <div className="bg-card dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
                    {message ? (
                        <div className="text-center">
                            <p className="bg-secondary/20 text-secondary p-3 rounded-lg mb-4">{message}</p>
                            <Link to="/login" className="font-medium text-primary hover:underline">
                                &larr; Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                    id="email"
                                    type="email"
                                    placeholder="student@example.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <button
                                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                     {!message && (
                        <div className="text-center mt-6">
                            <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                                Remembered your password? Sign in
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;