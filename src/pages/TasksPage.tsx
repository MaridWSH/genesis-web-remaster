
import React, { useState } from 'react';
import TaskList from '@/components/TaskList';
import TaskStatistics from '@/components/TaskStatistics';
import Header from '@/components/Header';
import { useTasks } from '@/context/TaskContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TasksPage = () => {
  const { darkMode } = useTasks();
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tasks">Task List</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks" className="mt-6">
            <TaskList />
          </TabsContent>
          <TabsContent value="dashboard" className="mt-6">
            <TaskStatistics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TasksPage;
