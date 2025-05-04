
import React, { useState } from 'react';
import Header from '@/components/Header';
import TeamManagement from '@/components/TeamManagement';
import AiTaskAutomation from '@/components/AiTaskAutomation';
import AdvancedTeamCollaboration from '@/components/AdvancedTeamCollaboration';
import DeepAnalytics from '@/components/DeepAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TeamsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("team");
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Teams & Advanced Features</h1>
        
        <Tabs defaultValue="team" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="grid grid-cols-4 max-w-2xl">
            <TabsTrigger value="team">Team Management</TabsTrigger>
            <TabsTrigger value="ai">AI Automation</TabsTrigger>
            <TabsTrigger value="collab">Collaboration</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <TabsContent value="team" className="mt-0" hidden={activeTab !== "team"}>
          <TeamManagement />
        </TabsContent>
        
        <TabsContent value="ai" className="mt-0" hidden={activeTab !== "ai"}>
          <div className="max-w-4xl mx-auto">
            <AiTaskAutomation />
          </div>
        </TabsContent>
        
        <TabsContent value="collab" className="mt-0" hidden={activeTab !== "collab"}>
          <div className="max-w-4xl mx-auto">
            <AdvancedTeamCollaboration />
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-0" hidden={activeTab !== "analytics"}>
          <div className="max-w-4xl mx-auto">
            <DeepAnalytics />
          </div>
        </TabsContent>
      </div>
    </div>
  );
};

export default TeamsPage;
