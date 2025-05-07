
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
  assignedTo?: string;
  createdBy?: string;
  teamId?: string;
  isShared?: boolean;
  // Gamification features
  pointsValue?: number;
  streakTask?: boolean;
};

export type Comment = {
  id: string;
  text: string;
  createdAt: string;
  author: string;
  likes?: number;
};
