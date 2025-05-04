
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamManagement from '@/components/TeamManagement';
import Achievements from '@/components/Achievements';
import CalendarIntegration from '@/components/CalendarIntegration';

interface FeaturesProps {
  defaultTab?: string;
}

const Features: React.FC<FeaturesProps> = ({ defaultTab }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(defaultTab || "teams");
  
  // Handle tab changes from URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['teams', 'achievements', 'calendar'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [location.search, defaultTab]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="teams" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="teams" className="mt-6">
            <TeamManagement />
          </TabsContent>
          <TabsContent value="achievements" className="mt-6">
            <Achievements />
          </TabsContent>
          <TabsContent value="calendar" className="mt-6">
            <CalendarIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Features;
