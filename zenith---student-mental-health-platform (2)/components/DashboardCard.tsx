import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ to, icon, title, description }) => {
  return (
    <Link 
      to={to} 
      className="bg-card dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group dark:hover:shadow-primary/20"
    >
      <div className="text-primary bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </Link>
  );
};

export default DashboardCard;