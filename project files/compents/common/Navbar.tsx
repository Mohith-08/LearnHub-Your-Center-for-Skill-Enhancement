
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-brand-primary">
          Study App
        </Link>
        <div className="flex items-center space-x-4">
          <Link to={user ? "/dashboard" : "/"} className="text-gray-600 hover:text-brand-primary transition duration-300">Home</Link>
          {user && user.role === UserRole.TEACHER && (
             <Link to="/add-course" className="text-gray-600 hover:text-brand-primary transition duration-300">Add Course</Link>
          )}
          {user ? (
            <>
              <span className="text-gray-800">Hi {user.fullName.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 text-sm"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-brand-primary transition duration-300">Login</Link>
              <Link to="/register" className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition duration-300 text-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
