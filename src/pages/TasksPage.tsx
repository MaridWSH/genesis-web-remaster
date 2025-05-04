
import React from 'react';
import TaskList from '@/components/TaskList';
import Header from '@/components/Header';

const TasksPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskList />
      </div>
    </div>
  );
};

export default TasksPage;
