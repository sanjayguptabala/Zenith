import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardStats } from '../services/mockDb';
import type { DashboardStats } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNotification } from '../contexts/NotificationContext';

const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const PencilAltIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const PuzzleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>;
const ChatAlt2Icon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const FeatherIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><path d="M16 8L2 22"/><path d="M17.5 15H9"/></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const TrendingDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-1 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-warning mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;


const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && 'id' in user) {
            const fetchStats = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await getDashboardStats(user.id);
                    setStats(data);
                } catch (err) {
                    const message = err instanceof Error ? err.message : "An unknown error occurred";
                    console.error("Failed to fetch dashboard stats", err);
                    addNotification(message, 'error');
                    setError("Could not load your dashboard data. Please try refreshing the page.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchStats();
        } else {
            setIsLoading(false);
        }
    }, [user, addNotification]);

    const userName = (user && 'name' in user) ? user.name : "Student";

    const getScoreColor = (score: number | null) => {
        if (score === null) return 'text-gray-500';
        if (score <= 25) return 'text-secondary';
        if (score <= 50) return 'text-yellow-500';
        if (score <= 75) return 'text-warning';
        return 'text-danger';
    };
    
    if (isLoading) {
        return <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[50vh]"><LoadingSpinner /></div>;
    }

    if (error) {
         return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-card dark:bg-gray-800 p-12 rounded-xl shadow-lg max-w-lg mx-auto">
                    <AlertTriangleIcon />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">Oops! Something went wrong.</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Welcome back, {userName}!</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Here's your mental wellness overview.</p>
            </header>

            <section className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transition-colors duration-300">
                    <h3 className="text-gray-500 dark:text-gray-400 text-lg">Today's Stress Score</h3>
                    <p className={`text-6xl font-bold ${getScoreColor(stats?.todayStressScore ?? null)}`}>{stats?.todayStressScore ?? 'N/A'}</p>
                    <p className="text-gray-600 dark:text-gray-300">{stats?.todayCategory ?? 'Take survey to see score'}</p>
                </div>
                <div className="bg-card dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transition-colors duration-300">
                    <h3 className="text-gray-500 dark:text-gray-400 text-lg">Total Surveys</h3>
                    <p className="text-6xl font-bold text-primary">{stats?.totalSurveys ?? 0}</p>
                    <p className="text-gray-600 dark:text-gray-300">Well done on consistency!</p>
                </div>
                <div className="bg-card dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transition-colors duration-300">
                    <h3 className="text-gray-500 dark:text-gray-400 text-lg">Overall Average</h3>
                    <p className={`text-6xl font-bold ${getScoreColor(stats?.averageScore ?? null)}`}>{stats?.averageScore ?? 0}</p>
                     <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center">
                        {stats && stats.trend < 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        {Math.abs(stats?.trend ?? 0)}% {stats && stats.trend < 0 ? 'Improvement' : 'Increase'} vs last week
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Explore Features</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DashboardCard 
                        to="/survey"
                        icon={<PencilAltIcon />}
                        title="Take Daily Survey"
                        description="Check in with yourself and log your feelings for the day."
                    />
                     <DashboardCard 
                        to="/visualization"
                        icon={<BarChartIcon />}
                        title="View Analytics"
                        description="Visualize your stress trends and gain insights over time."
                    />
                     <DashboardCard 
                        to="/resources"
                        icon={<BookOpenIcon />}
                        title="Resource Library"
                        description="Find articles, tools, and support to help you."
                    />
                    <DashboardCard 
                        to="/calm-corner"
                        icon={<FeatherIcon />}
                        title="Calm Corner"
                        description="Practice guided exercises to find your center and relax."
                    />
                     <DashboardCard 
                        to="/games"
                        icon={<PuzzleIcon />}
                        title="Play Mini-Games"
                        description="Relax and unwind with our collection of calming games."
                    />
                     <DashboardCard 
                        to="/chatbot"
                        icon={<ChatAlt2Icon />}
                        title="AI Chatbot"
                        description="Talk to our supportive AI for guidance and resources."
                    />
                </div>
            </section>
        </div>
    );
};

export default Dashboard;