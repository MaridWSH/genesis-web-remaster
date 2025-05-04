
import React, { createContext, useState, useContext } from 'react';

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
};

type Comment = {
  id: string;
  text: string;
  createdAt: string;
  author: string;
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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Research new technologies',
      notes: '',
      dueDate: '2025-05-26T03:00:00.000Z',
      priority: 'Medium',
      completed: false,
      category: 'Work',
    },
    {
      id: '2',
      title: 'Learn new framework',
      notes: '',
      dueDate: '2025-05-19T03:00:00.000Z',
      priority: 'Low',
      completed: false,
      category: 'Personal',
    },
    {
      id: '3',
      title: 'Plan sprint tasks',
      notes: '',
      dueDate: '2025-05-31T03:00:00.000Z',
      priority: 'High',
      completed: false,
      category: 'Work',
    },
    {
      id: '4',
      title: 'Refactor legacy code',
      notes: '',
      dueDate: '2025-05-21T03:00:00.000Z',
      priority: 'Medium',
      completed: false,
      category: 'Work',
    },
  ]);

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    // Update document classes for dark mode
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
    const newTask = {
      ...task,
      id: Date.now().toString(),
      comments: [],
      attachments: [],
      dependencies: [],
      archived: false,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const archiveTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, archived: true } : task
      )
    );
  };

  const addComment = (taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newComment = {
            ...comment,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
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
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
