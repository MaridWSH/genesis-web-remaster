
import React, { createContext, useContext, useState } from 'react';
import { useTasksData } from '@/hooks/useTasks';
import { Task, Priority, Category, Comment } from '@/types/tasks';
import { UserId, TeamId } from '@/types';

type TaskContextType = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  archiveTask: (id: string) => void;
  addComment: (taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addAttachment: (taskId: string, attachmentUrl: string) => void;
  assignTask: (taskId: string, userId: UserId) => void;
  shareTask: (taskId: string, teamId: TeamId) => void;
  unshareTask: (taskId: string) => void;
  getTeamTasks: (teamId: TeamId) => Task[];
  getAssignedTasks: (userId: UserId) => Task[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  refreshTasks: () => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

// Re-export these types for backward compatibility
export { type Task, type Priority, type Category, type Comment };

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const taskHook = useTasksData();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    // Update document classes for dark mode
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save to local storage
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  // Initialize dark mode based on user preference
  React.useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save dark mode preference
  React.useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <TaskContext.Provider
      value={{
        ...taskHook,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
