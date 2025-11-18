import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Survey from './pages/Survey';
import Visualization from './pages/Visualization';
import Games from './pages/Games';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import CalmCorner from './pages/CalmCorner';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import ToastContainer from './components/ToastContainer';


const AppContent: React.FC = () => {
  const location = useLocation();
  const noNavFooterPaths = ['/', '/login', '/register', '/admin/login', '/forgot-password'];
  const showNavAndFooter = !noNavFooterPaths.includes(location.pathname) && !location.pathname.startsWith('/reset-password');

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <ToastContainer />
      {showNavAndFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* User Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/survey" element={<ProtectedRoute><Survey /></ProtectedRoute>} />
          <Route path="/visualization" element={<ProtectedRoute><Visualization /></ProtectedRoute>} />
          <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/calm-corner" element={<ProtectedRoute><CalmCorner /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />


          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      {showNavAndFooter && <Footer />}
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;