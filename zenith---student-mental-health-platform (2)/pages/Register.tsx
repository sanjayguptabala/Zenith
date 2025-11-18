import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.243 2 7 4.243 7 7c0 1.44.586 2.746 1.526 3.682-1.805.565-3.21 1.97-3.66 3.818H4v2h2.134c.148 1.474.8 2.793 1.764 3.824-1.294.942-2.222 2.39-2.222 4.176h12.648c0-1.786-.928-3.234-2.222-4.176.963-1.031 1.616-2.35 1.764-3.824H20v-2h-.866c-.45-1.848-1.855-3.253-3.66-3.818C16.414 9.746 17 8.44 17 7c0-2.757-2.243-5-5-5z"/>
    </svg>
);

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentId: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setIsLoading(true);
        const { success, message } = await register({
            name: formData.name,
            email: formData.email,
            studentId: formData.studentId,
            password: formData.password
        });
        
        if (success) {
            navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
        } else {
            setError(message);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <BrainIcon className="h-16 w-16 text-primary mx-auto" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">Create Your Zenith Account</h1>
                    <p className="text-gray-500 dark:text-gray-400">Join our community for a better mental well-being.</p>
                </div>

                <div className="bg-card dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
                    <form onSubmit={handleSubmit}>
                        {error && <p className="bg-danger/20 text-danger text-center p-3 rounded-lg mb-4">{error}</p>}
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="name">Full Name</label>
                            <input className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" id="name" type="text" placeholder="John Doe" onChange={handleChange} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="email">Email Address</label>
                            <input className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" id="email" type="email" placeholder="student@example.edu" onChange={handleChange} required />
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="studentId">Student ID</label>
                            <input className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" id="studentId" type="text" placeholder="12345678" onChange={handleChange} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="password">Password</label>
                            <input className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" id="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                        </div>
                         <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                            <input className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400" id="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} required />
                        </div>
                        
                        <button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50" type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                    <div className="text-center mt-6">
                         <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;