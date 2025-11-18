import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { resetPasswordWithToken } from '../services/mockDb';
import { useNotification } from '../contexts/NotificationContext';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.243 2 7 4.243 7 7c0 1.44.586 2.746 1.526 3.682-1.805.565-3.21 1.97-3.66 3.818H4v2h2.134c.148 1.474.8 2.793 1.764 3.824-1.294.942-2.222 2.39-2.222 4.176h12.648c0-1.786-.928-3.234-2.222-4.176.963-1.031 1.616-2.35 1.764-3.824H20v-2h-.866c-.45-1.848-1.855-3.253-3.66-3.818C16.414 9.746 17 8.44 17 7c0-2.757-2.243-5-5-5z"/>
    </svg>
);

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setIsLoading(true);

        try {
            const result = await resetPasswordWithToken(token || '', password);

            if (!result.success) {
                throw new Error(result.message);
            }
            
            setSuccessMessage(result.message);
            setTimeout(() => {
                navigate('/login', { state: { message: 'Password reset successfully! Please log in with your new password.' } });
            }, 3000);

        } catch (err) {
             const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            if (message.includes('token')) {
                // Show specific errors about token inline
                setError(message);
            } else {
                // Show generic errors as toasts
                addNotification(message, 'error');
            }
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
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">Set a New Password</h1>
                    <p className="text-gray-500 dark:text-gray-400">Please enter and confirm your new password below.</p>
                </div>

                <div className="bg-card dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
                     {successMessage ? (
                        <div className="text-center">
                            <p className="bg-secondary/20 text-secondary p-3 rounded-lg mb-4">{successMessage}</p>
                            <p className="text-gray-600 dark:text-gray-300">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && <p className="bg-danger/20 text-danger text-center p-3 rounded-lg mb-4">{error}</p>}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="password">
                                    New Password
                                </label>
                                <input
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="confirmPassword">
                                    Confirm New Password
                                </label>
                                <input
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <button
                                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;