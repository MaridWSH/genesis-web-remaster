
import React from 'react';
import ProfilePage from '@/components/ProfilePage';
import Header from '@/components/Header';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfilePage />
      </div>
    </div>
  );
};

export default Profile;
