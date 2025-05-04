
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Teams & Collaboration
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your teams and access advanced collaboration features
          </p>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="bg-background border border-border rounded-xl p-1 mb-6 w-full sm:w-auto inline-flex">
            <TabsTrigger 
              value="team" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Team Management
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              AI Automation
            </TabsTrigger>
            <TabsTrigger 
              value="collab" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Collaboration
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-gradient-to-b from-background to-muted/20 rounded-2xl p-1">
            <div className="bg-background backdrop-blur-sm rounded-xl shadow-lg border border-border/50">
              <TabsContent value="team" className="m-0 p-6">
                <TeamManagement />
              </TabsContent>
              
              <TabsContent value="ai" className="m-0 p-6">
                <div className="max-w-4xl mx-auto">
                  <AiTaskAutomation />
                </div>
              </TabsContent>
              
              <TabsContent value="collab" className="m-0 p-6">
                <div className="max-w-4xl mx-auto">
                  <AdvancedTeamCollaboration />
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="m-0 p-6">
                <div className="max-w-4xl mx-auto">
                  <DeepAnalytics />
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamsPage;
