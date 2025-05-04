
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  
  if (!isAuthenticated) return null;
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user || !user.name) return 'U';
    const names = user.name.split(' ');
    return names.map(name => name[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/tasks" className="flex-shrink-0 flex items-center">
              <span className="text-primary text-xl font-medium">TaskMaster</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link to="/profile" className="p-2 rounded-full hover:bg-accent">
              <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
