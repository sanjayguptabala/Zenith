import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';
import { sendDailyReminderEmail } from '../services/mockDb';
import { useNotification } from '../contexts/NotificationContext';

const Profile: React.FC = () => {
    const { user, updateUserProfile } = useAuth();
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({ name: '', email: '', studentId: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user && 'name' in user) {
            setFormData({
                name: user.name,
                email: user.email,
                studentId: user.studentId,
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            await updateUserProfile(formData as Partial<User>);
            setSuccessMessage('Profile updated successfully!');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendTestEmail = async () => {
        if (!user || !('name' in user)) return;

        setIsSendingEmail(true);
        try {
            const result = await sendDailyReminderEmail(user.name, user.email);
            if (result.success) {
                addNotification(result.message, 'success');
            } else {
                addNotification(result.message, 'error');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            addNotification(message, 'error');
        } finally {
            setIsSendingEmail(false);
        }
    };
    
    if (!user || !('name' in user)) {
        return <div>Loading profile...</div>; // Or a redirect
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <header className="mb-8 text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Your Profile</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Manage your personal information and account settings.</p>
            </header>
            <div className="bg-card dark:bg-gray-800 shadow-xl rounded-2xl p-8">
                <form onSubmit={handleSubmit}>
                    {error && <p className="bg-danger/20 text-danger text-center p-3 rounded-lg mb-4">{error}</p>}
                    {successMessage && <p className="bg-secondary/20 text-secondary text-center p-3 rounded-lg mb-4">{successMessage}</p>}
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="studentId">
                            Student ID
                        </label>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            id="studentId"
                            type="text"
                            value={formData.studentId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <button
                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        type="submit"
                        disabled={isLoading || isSendingEmail}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            <div className="bg-card dark:bg-gray-800 shadow-xl rounded-2xl p-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Account Actions</h2>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-300">Send a test daily reminder email to your inbox.</p>
                    <button
                        onClick={handleSendTestEmail}
                        disabled={isLoading || isSendingEmail}
                        className="px-6 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSendingEmail ? 'Sending...' : 'Send Test Email'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;