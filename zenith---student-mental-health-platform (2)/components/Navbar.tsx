import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.243 2 7 4.243 7 7c0 1.44.586 2.746 1.526 3.682-1.805.565-3.21 1.97-3.66 3.818H4v2h2.134c.148 1.474.8 2.793 1.764 3.824-1.294.942-2.222 2.39-2.222 4.176h12.648c0-1.786-.928-3.234-2.222-4.176.963-1.031 1.616-2.35 1.764-3.824H20v-2h-.866c-.45-1.848-1.855-3.253-3.66-3.818C16.414 9.746 17 8.44 17 7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"/>
    </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 mr-2" }) => (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.319-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.651 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);

const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const NavLinks = ({ closeMenu, isMobile = false }: { closeMenu: () => void, isMobile?: boolean }) => {
    const linkClass = "px-4 py-2 rounded-lg transition-colors duration-300 block";
    const activeLinkClass = "bg-primary/20 text-primary";
    const inactiveLinkClass = "hover:bg-gray-200 dark:hover:bg-gray-700";
    
    const getClass = ({ isActive }: { isActive: boolean }) => 
        `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass} ${isMobile ? 'text-left' : 'text-center md:inline-block'}`;
    
    const handleClick = () => {
        closeMenu();
    };

    return (
        <>
            <NavLink to="/dashboard" className={getClass} onClick={handleClick}>Dashboard</NavLink>
            <NavLink to="/survey" className={getClass} onClick={handleClick}>Survey</NavLink>
            <NavLink to="/visualization" className={getClass} onClick={handleClick}>Analytics</NavLink>
            <NavLink to="/resources" className={getClass} onClick={handleClick}>Resources</NavLink>
            <NavLink to="/calm-corner" className={getClass} onClick={handleClick}>Calm Corner</NavLink>
            <NavLink to="/games" className={getClass} onClick={handleClick}>Games</NavLink>
            <NavLink to="/chatbot" className={getClass} onClick={handleClick}>Chatbot</NavLink>
            <NavLink to="/contact" className={getClass} onClick={handleClick}>Contact</NavLink>
        </>
    );
};


const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, logout, isAdmin, loginWithGoogle, isGoogleLoading } = useAuth();

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="bg-card dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <NavLink to={isAdmin ? "/admin/dashboard" : (isAuthenticated ? "/dashboard" : "/")} className="flex items-center space-x-2 text-primary">
                             <BrainIcon className="h-8 w-8" />
                            <span className="font-bold text-xl text-gray-800 dark:text-gray-100">Zenith</span>
                        </NavLink>
                    </div>
                    <div className="hidden md:flex items-center">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {!isAdmin && isAuthenticated && <NavLinks closeMenu={closeMenu} />}
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
                                <span className="sr-only">Toggle theme</span>
                                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                            </button>
                            {isAuthenticated && !isAdmin && (
                                <NavLink to="/profile" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
                                    <span className="sr-only">Profile</span>
                                    <UserCircleIcon className="h-6 w-6" />
                                </NavLink>
                            )}
                            {isAuthenticated ? (
                                <button onClick={logout} className="p-2 rounded-full text-danger hover:bg-danger/10 transition-colors duration-300">
                                    <span className="sr-only">Logout</span>
                                    <LogoutIcon className="h-6 w-6" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={loginWithGoogle}
                                    disabled={isGoogleLoading}
                                    className="ml-2 flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <GoogleIcon />
                                    {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center md:hidden">
                         <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
                            <span className="sr-only">Toggle theme</span>
                           {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-white hover:bg-primary focus:outline-none transition-colors duration-300">
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-card dark:bg-gray-800 transition-colors duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {!isAdmin && isAuthenticated && <NavLinks closeMenu={closeMenu} isMobile />}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        
                        {isAuthenticated ? (
                             <>
                                {!isAdmin && (
                                     <NavLink to="/profile" onClick={closeMenu} className="w-full text-left mt-2 px-4 py-2 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center">
                                         <UserCircleIcon className="h-5 w-5 mr-3"/> Profile
                                    </NavLink>
                                )}
                                <button onClick={() => { logout(); closeMenu(); }} className="w-full text-left mt-1 px-4 py-2 text-danger font-medium rounded-lg hover:bg-danger/10 transition-colors flex items-center">
                                    <LogoutIcon className="h-5 w-5 mr-3"/> Logout
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => { loginWithGoogle(); closeMenu(); }}
                                disabled={isGoogleLoading}
                                className="w-full flex items-center justify-center mt-2 py-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <GoogleIcon />
                                {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;