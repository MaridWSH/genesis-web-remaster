
import React from 'react';
import Header from '@/components/Header';
import TeamManagement from '@/components/TeamManagement';

const TeamsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Teams</h1>
        <TeamManagement />
      </div>
    </div>
  );
};

export default TeamsPage;
