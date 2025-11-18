import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getSurveyHistory } from '../services/mockDb';
import type { SurveySubmission } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

// Mock Data for charts that are not yet dynamic
const weeklyComparisonData = [
    { day: 'Mon', lastWeek: 60, thisWeek: 55 },
    { day: 'Tue', lastWeek: 65, thisWeek: 62 },
    { day: 'Wed', lastWeek: 70, thisWeek: 68 },
    { day: 'Thu', lastWeek: 75, thisWeek: 72 },
    { day: 'Fri', lastWeek: 80, thisWeek: 60 },
    { day: 'Sat', lastWeek: 40, thisWeek: 45 },
    { day: 'Sun', lastWeek: 35, thisWeek: 30 },
];

const radarChartData = [
  { category: 'Academic', score: 85, fullMark: 100 },
  { category: 'Emotional', score: 60, fullMark: 100 },
  { category: 'Physical', score: 70, fullMark: 100 },
  { category: 'Social', score: 55, fullMark: 100 },
  { category: 'Time Mngmt', score: 75, fullMark: 100 },
];

const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-warning mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;


const ChartTooltip = ({ theme }: { theme: 'light' | 'dark' }) => {
    const textColor = theme === 'dark' ? '#E5E7EB' : '#374151';
    const gridColor = theme === 'dark' ? '#4B5563' : '#D1D5DB';
    
    return <Tooltip 
      contentStyle={{ 
        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
        borderColor: gridColor,
        borderRadius: '0.75rem'
      }} 
      labelStyle={{ color: textColor }}
    />;
};

const StressTrendChart: React.FC<{ theme: 'light' | 'dark'; data: SurveySubmission[]}> = ({ theme, data }) => {
    const textColor = theme === 'dark' ? '#E5E7EB' : '#374151';
    const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB';
    
    const chartData = data
        .map(s => ({
            // Format date for display on the X-axis
            date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            stressScore: s.stressScore,
        }))
        // Sort ascending by date for the line chart
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        // Display the last 30 entries
        .slice(-30);

    return (
    <div className="bg-card dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Stress Trend (Last 30 Entries)</h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={{ fill: textColor }} />
                <YAxis domain={[0, 100]} tick={{ fill: textColor }} />
                <ChartTooltip theme={theme} />
                <Legend wrapperStyle={{ color: textColor }}/>
                <Line type="monotone" dataKey="stressScore" name="Stress Score" stroke="#4A90E2" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
)};

const WeeklyComparisonChart: React.FC<{ theme: 'light' | 'dark'}> = ({ theme }) => {
    const textColor = theme === 'dark' ? '#E5E7EB' : '#374151';
    const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB';

    return (
    <div className="bg-card dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Weekly Comparison (Mock)</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" tick={{ fill: textColor }} />
                <YAxis tick={{ fill: textColor }} />
                <ChartTooltip theme={theme} />
                <Legend wrapperStyle={{ color: textColor }}/>
                <Bar dataKey="lastWeek" fill="#a0aec0" name="Last Week" />
                <Bar dataKey="thisWeek" fill="#4A90E2" name="This Week" />
            </BarChart>
        </ResponsiveContainer>
    </div>
)};

const CategoryAnalysisChart: React.FC<{ theme: 'light' | 'dark'}> = ({ theme }) => {
    const textColor = theme === 'dark' ? '#E5E7EB' : '#374151';
    const gridColor = theme === 'dark' ? '#4B5563' : '#D1D5DB';

    return (
    <div className="bg-card dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Category Analysis (Mock)</h3>
        <ResponsiveContainer width="100%" height={300}>
             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                <PolarGrid stroke={gridColor}/>
                <PolarAngleAxis dataKey="category" tick={{ fill: textColor }}/>
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'transparent' }}/>
                <Radar name="Stress Score" dataKey="score" stroke="#4A90E2" fill="#4A90E2" fillOpacity={0.6}/>
                <Legend wrapperStyle={{ color: textColor }}/>
                <ChartTooltip theme={theme} />
             </RadarChart>
        </ResponsiveContainer>
    </div>
)};

const Visualization: React.FC = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const [surveyData, setSurveyData] = useState<SurveySubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && 'id' in user) {
            const fetchData = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const history = await getSurveyHistory(user.id);
                    setSurveyData(history);
                } catch (err) {
                    const message = err instanceof Error ? err.message : "An unknown error occurred";
                    console.error("Failed to fetch survey history", err);
                    addNotification(message, 'error');
                    setError("Could not load your analytics data. Please try refreshing the page.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } else {
             setIsLoading(false);
        }
    }, [user, addNotification]);

    if (isLoading) {
        return <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[50vh]"><LoadingSpinner /></div>;
    }

    const renderContent = () => {
        if (error) {
             return (
                <div className="text-center bg-card dark:bg-gray-800 p-12 rounded-xl shadow-lg">
                    <AlertTriangleIcon />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">Failed to Load Analytics</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
                </div>
            );
        }

        if (surveyData.length > 0) {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="lg:col-span-2">
                        <StressTrendChart theme={theme} data={surveyData} />
                    </div>
                    <WeeklyComparisonChart theme={theme} />
                    <CategoryAnalysisChart theme={theme} />
                </div>
            );
        }

        return (
            <div className="text-center bg-card dark:bg-gray-800 p-12 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">No Data to Display</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Start by taking your daily survey to see your wellness trends here.</p>
                <Link to="/survey" className="px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                    Take a Survey
                </Link>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Your Wellness Analytics</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Visualize your trends and gain insights into your mental health journey.</p>
            </header>
            
            {renderContent()}
        </div>
    );
};

export default Visualization;