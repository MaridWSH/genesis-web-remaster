
import React, { useState } from 'react';
import TaskList from '@/components/TaskList';
import TaskStatistics from '@/components/TaskStatistics';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskAiAssistant from '@/components/TaskAiAssistant';
import { ListTodo, BarChart3, Sparkles } from 'lucide-react';

const TasksPage = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Tasks Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your tasks and track your progress
          </p>
        </div>
        
        <Tabs 
          defaultValue="tasks" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="bg-background border border-border rounded-xl p-1 mb-6 w-full sm:w-auto inline-flex">
            <TabsTrigger 
              value="tasks" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <ListTodo className="h-4 w-4 mr-1.5" /> Task List
            </TabsTrigger>
            <TabsTrigger 
              value="dashboard" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-1.5" /> Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Sparkles className="h-4 w-4 mr-1.5" /> AI Assistant
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-gradient-to-b from-background to-muted/20 rounded-2xl p-1">
            <div className="bg-background backdrop-blur-sm rounded-xl shadow-lg border border-border/50">
              <TabsContent value="tasks" className="m-0 p-6">
                <TaskList />
              </TabsContent>
              
              <TabsContent value="dashboard" className="m-0 p-6">
                <TaskStatistics />
              </TabsContent>
              
              <TabsContent value="ai" className="m-0 p-6">
                <TaskAiAssistant />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TasksPage;
