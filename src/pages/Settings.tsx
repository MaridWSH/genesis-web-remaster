
import React from 'react';
import Header from '@/components/Header';
import SecuritySettings from '@/components/SecuritySettings';

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SecuritySettings />
      </div>
    </div>
  );
};

export default Settings;
