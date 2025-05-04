
import React, { useState, useEffect } from 'react';
import TaskList from '@/components/TaskList';
import TaskStatistics from '@/components/TaskStatistics';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskAiAssistant from '@/components/TaskAiAssistant';

const TasksPage = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="tasks">Task List</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks" className="mt-6">
            <TaskList />
          </TabsContent>
          <TabsContent value="dashboard" className="mt-6">
            <TaskStatistics />
          </TabsContent>
          <TabsContent value="ai" className="mt-6">
            <TaskAiAssistant />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TasksPage;
