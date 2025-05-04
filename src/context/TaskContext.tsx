
import React, { createContext, useState, useContext } from 'react';

export type Priority = 'Low' | 'Medium' | 'High';

export type Task = {
  id: string;
  title: string;
  notes: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
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
    },
    {
      id: '2',
      title: 'Learn new framework',
      notes: '',
      dueDate: '2025-05-19T03:00:00.000Z',
      priority: 'Low',
      completed: false,
    },
    {
      id: '3',
      title: 'Plan sprint tasks',
      notes: '',
      dueDate: '2025-05-31T03:00:00.000Z',
      priority: 'High',
      completed: false,
    },
    {
      id: '4',
      title: 'Refactor legacy code',
      notes: '',
      dueDate: '2025-05-21T03:00:00.000Z',
      priority: 'Medium',
      completed: false,
    },
  ]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
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

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
