
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/tasks" className="flex-shrink-0 flex items-center">
              <span className="text-primary text-xl font-medium">TaskMaster</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
