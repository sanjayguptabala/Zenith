import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card dark:bg-gray-800 shadow-inner mt-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center space-x-6 mb-2">
            <Link to="/dashboard" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">Dashboard</Link>
            <Link to="/resources" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">Resources</Link>
            <Link to="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:underline">Contact Us</Link>
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Zenith Mental Health Platform. All rights reserved.
        </p>
         <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-1">
          This platform is for informational purposes only and does not provide medical advice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;