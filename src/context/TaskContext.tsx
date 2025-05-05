import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { UserId, TeamId } from '@/types';
import { useAuth } from '@/context/AuthContext';

export type Priority = 'Low' | 'Medium' | 'High';
export type Category = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Finance' | 'Other';

export type Task = {
  id: string;
  title: string;
  notes: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  category?: Category;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  attachments?: string[]; // URLs to attachments
  comments?: Comment[];
  dependencies?: string[]; // IDs of tasks that this task depends on
  archived?: boolean;
  // Collaboration features
  assignedTo?: UserId;
  createdBy?: UserId;
  teamId?: TeamId;
  isShared?: boolean;
  // Gamification features
  pointsValue?: number;
  streakTask?: boolean;
};

type Comment = {
  id: string;
  text: string;
  createdAt: string;
  author: string;
  likes?: number;
};

type TaskContextType = {
  tasks: Task[];
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
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with empty array instead of default tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  const { user } = useAuth();

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

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      comments: [],
      attachments: [],
      dependencies: [],
      archived: false,
      // Default gamification values
      pointsValue: task.priority === 'High' ? 10 : task.priority === 'Medium' ? 5 : 2,
      createdBy: user?.id // Associate task with the current user
    };
    setTasks([...tasks, newTask]);
    toast.success('Task added successfully');
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    // Handle temp IDs specially - for new tasks being created
    if (id.startsWith('temp-')) {
      return;
    }
    
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success('Task deleted');
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    // Show different toast message based on completion status
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      toast.success('Task completed! 🎉');
    }
  };

  const archiveTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, archived: true } : task
      )
    );
    toast.success('Task archived');
  };

  const addComment = (taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    // For temp tasks, we don't actually add to the task list yet
    if (taskId.startsWith('temp-')) {
      // For temp tasks, just acknowledge the comment would be stored later
      toast.success('Comment will be added when task is saved');
      return;
    }
    
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newComment = {
            ...comment,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            likes: 0,
          };
          return {
            ...task,
            comments: [...(task.comments || []), newComment],
          };
        }
        return task;
      })
    );
  };

  const addAttachment = (taskId: string, attachmentUrl: string) => {
    // For temp tasks, we don't actually add to the task list yet
    if (taskId.startsWith('temp-')) {
      // For temp tasks, just acknowledge the attachment would be stored later
      toast.success('Attachment will be added when task is saved');
      return;
    }
    
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            attachments: [...(task.attachments || []), attachmentUrl],
          };
        }
        return task;
      })
    );
  };

  // New functions for collaboration features
  const assignTask = (taskId: string, userId: UserId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            assignedTo: userId,
          };
        }
        return task;
      })
    );
    toast.success('Task assigned');
  };

  const shareTask = (taskId: string, teamId: TeamId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            teamId,
            isShared: true,
          };
        }
        return task;
      })
    );
    toast.success('Task shared with team');
  };

  const unshareTask = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task };
          delete updatedTask.teamId;
          updatedTask.isShared = false;
          return updatedTask;
        }
        return task;
      })
    );
    toast.success('Task is no longer shared');
  };

  const getTeamTasks = (teamId: TeamId) => {
    return tasks.filter((task) => task.teamId === teamId);
  };

  const getAssignedTasks = (userId: UserId) => {
    return tasks.filter((task) => task.assignedTo === userId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        archiveTask,
        addComment,
        addAttachment,
        assignTask,
        shareTask,
        unshareTask,
        getTeamTasks,
        getAssignedTasks,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
