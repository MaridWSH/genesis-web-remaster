
import React from 'react';
import Header from '@/components/Header';
import Achievements from '@/components/Achievements';

const AchievementsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Achievements</h1>
        <Achievements />
      </div>
    </div>
  );
};

export default AchievementsPage;
