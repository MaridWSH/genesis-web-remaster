
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/tasks" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold">Your Profile</h1>
        </div>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-medium mb-2">Profile Information</h2>
          <p className="text-gray-500 text-sm mb-4">Update your account details</p>
          
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Member Since</label>
            <p>{user ? formatDate(user.memberSince) : 'N/A'}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-medium mb-2">Preferences</h2>
          <p className="text-gray-500 text-sm mb-4">Manage your app settings</p>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-gray-500 text-sm">Receive task reminders via email</p>
            </div>
            <Switch 
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              className="bg-primary data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
