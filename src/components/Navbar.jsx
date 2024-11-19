import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Feather, BookOpen, PenTool, Users, Award, Share2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-gradient-to-r from-amber-900 to-amber-800 text-amber-50 shadow-lg border-b border-amber-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/stories" className="flex items-center space-x-2 text-xl font-serif">
            <Feather className="h-6 w-6 transform hover:rotate-12 transition-transform" />
            <span className="writing-animation">Tales & Trail</span>
          </NavLink>
          
          <div className="hidden md:flex items-center space-x-8">
            {[
              { to: '/stories', Icon: BookOpen, label: 'Stories' },
              { to: '/write', Icon: PenTool, label: 'Write' },
              { to: '/about', Icon: Users, label: 'About' },
              { to: '/leaderboard', Icon: Award, label: 'Leaderboard' },
              { to: '/social', Icon: Share2, label: 'Connect' },
            ].map(({ to, Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-1 hover:text-amber-200 transition-all duration-300 ${
                    isActive ? 'text-amber-200' : ''
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="hover:tracking-wider transition-all">{label}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-amber-200 transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
              <span className="hover:tracking-wider transition-all">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;