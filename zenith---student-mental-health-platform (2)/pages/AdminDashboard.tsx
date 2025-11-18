import React, { useEffect, useState } from 'react';
import { getPlatformStats, getAllUsers } from '../services/mockDb';
import type { User } from '../types';

interface PlatformStats {
  totalUsers: number;
  surveysCompleted: number;
  averageScore: number;
  activeToday: number;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-card dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-colors duration-300">
        <div className="bg-primary/10 text-primary p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;


const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const platformStats = await getPlatformStats();
            const allUsers = await getAllUsers();
            setStats(platformStats);
            setUsers(allUsers);
        };
        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">Admin Dashboard</h1>

            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value={stats?.totalUsers ?? '...'} icon={<UsersIcon />} />
                <StatCard title="Surveys Completed" value={stats?.surveysCompleted ?? '...'} icon={<ClipboardListIcon />} />
                <StatCard title="Average Stress Score" value={stats?.averageScore ?? '...'} icon={<ChartBarIcon />} />
                <StatCard title="Active Users Today" value={stats?.activeToday ?? '...'} icon={<UserCircleIcon />} />
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">User Management</h2>
                <div className="bg-card dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Student ID</th>
                                    <th scope="col" className="px-6 py-3">Join Date</th>
                                    <th scope="col" className="px-6 py-3">Surveys Taken</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</th>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.studentId}</td>
                                        <td className="px-6 py-4">{user.joinDate}</td>
                                        <td className="px-6 py-4 text-center">{user.totalSurveys}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;