import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.243 2 7 4.243 7 7c0 1.44.586 2.746 1.526 3.682-1.805.565-3.21 1.97-3.66 3.818H4v2h2.134c.148 1.474.8 2.793 1.764 3.824-1.294.942-2.222 2.39-2.222 4.176h12.648c0-1.786-.928-3.234-2.222-4.176.963-1.031 1.616-2.35 1.764-3.824H20v-2h-.866c-.45-1.848-1.855-3.253-3.66-3.818C16.414 9.746 17 8.44 17 7c0-2.757-2.243-5-5-5z"/>
    </svg>
);

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.319-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.651 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For email/password login
  const { login, loginWithGoogle, isGoogleLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state so the message doesn't reappear on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    const result = await login({ email, password });
    if (!result.success) {
      setError(result.message);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccessMessage('');
    // Loading state is handled by isGoogleLoading from context
    await loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Link to="/" className="inline-block">
                <BrainIcon className="h-16 w-16 text-primary mx-auto" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">Welcome Back to Zenith</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to continue your wellness journey.</p>
        </div>

        <div className="bg-card dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
          <form onSubmit={handleSubmit}>
            {error && <p className="bg-danger/20 text-danger text-center p-3 rounded-lg mb-4">{error}</p>}
            {successMessage && <p className="bg-secondary/20 text-secondary text-center p-3 rounded-lg mb-4">{successMessage}</p>}
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
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between mb-6">
               <p className="text-sm text-gray-600 dark:text-gray-400">
                No account?{' '}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            <button
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              type="submit"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>
        
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <GoogleIcon />
            {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="text-center mt-6">
            <Link to="/admin/login" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
              Are you an administrator?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;