
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamManagement from '@/components/TeamManagement';
import Achievements from '@/components/Achievements';
import SecuritySettings from '@/components/SecuritySettings';
import CalendarIntegration from '@/components/CalendarIntegration';

const Features = () => {
  const [activeTab, setActiveTab] = useState("teams");
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="teams" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
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
          <TabsContent value="security" className="mt-6">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Features;
