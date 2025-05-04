
import React from 'react';
import TaskForm from '@/components/TaskForm';
import Header from '@/components/Header';

const CreateTask = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskForm mode="create" />
      </div>
    </div>
  );
};

export default CreateTask;
