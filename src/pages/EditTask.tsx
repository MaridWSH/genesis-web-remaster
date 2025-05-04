
import React from 'react';
import TaskForm from '@/components/TaskForm';
import Header from '@/components/Header';

const EditTask = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskForm mode="edit" />
      </div>
    </div>
  );
};

export default EditTask;
