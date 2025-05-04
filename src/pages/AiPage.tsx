
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AiTaskAutomation from '@/components/AiTaskAutomation';
import AiNotConfigured from '@/components/AiNotConfigured';

const AiPage = () => {
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  
  useEffect(() => {
    // Check if the API key is configured
    const apiKey = localStorage.getItem('admin-deepseek-api-key');
    setIsApiConfigured(!!apiKey);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isApiConfigured ? (
          <AiTaskAutomation />
        ) : (
          <AiNotConfigured />
        )}
      </div>
    </div>
  );
};

export default AiPage;
