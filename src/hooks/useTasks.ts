
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Task, Priority, Category } from '@/types/tasks';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch tasks from Supabase
  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) {
        throw error;
      }

      // Transform database tasks to our Task type
      const transformedTasks: Task[] = data.map(task => ({
        id: task.id,
        title: task.title,
        notes: task.notes || '',
        dueDate: task.due_date,
        priority: task.priority as Priority,
        completed: task.completed || false,
        category: task.category as Category,
        recurring: task.recurring,
        attachments: [],  // We'll load these in separate functions if needed
        comments: [],     // We'll load these in separate functions if needed
        dependencies: [], // We'll load these in separate functions if needed
        archived: task.archived || false,
        assignedTo: task.user_id,
        createdBy: task.user_id,
        teamId: task.team_id,
        isShared: task.team_id ? true : false,
        pointsValue: task.points_value || 0,
        streakTask: task.streak_task || false
      }));

      setTasks(transformedTasks);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
      setIsLoading(false);
      toast.error('Failed to load tasks');
    }
  }, [user]);

  // Load tasks on component mount or when user changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add a new task
  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!user) {
      toast.error('You must be logged in to add tasks');
      return;
    }

    try {
      const combinedDate = new Date(task.dueDate).toISOString();

      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: task.title,
            notes: task.notes,
            due_date: combinedDate,
            priority: task.priority,
            completed: false,
            category: task.category,
            recurring: task.recurring,
            user_id: user.id,
            team_id: task.teamId,
            points_value: task.pointsValue || (task.priority === 'High' ? 10 : task.priority === 'Medium' ? 5 : 2),
            streak_task: task.streakTask || false,
            archived: false
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      // Transform the new task to our Task type
      const newTask: Task = {
        id: data[0].id,
        title: data[0].title,
        notes: data[0].notes || '',
        dueDate: data[0].due_date,
        priority: data[0].priority as Priority,
        completed: data[0].completed || false,
        category: data[0].category as Category,
        recurring: data[0].recurring,
        attachments: [],
        comments: [],
        dependencies: [],
        archived: data[0].archived || false,
        assignedTo: data[0].user_id,
        createdBy: data[0].user_id,
        teamId: data[0].team_id,
        isShared: data[0].team_id ? true : false,
        pointsValue: data[0].points_value || 0,
        streakTask: data[0].streak_task || false
      };

      setTasks(prev => [...prev, newTask]);
      toast.success('Task added successfully');
    } catch (err: any) {
      console.error('Error adding task:', err);
      toast.error('Failed to add task');
    }
  };

  // Update an existing task
  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    if (!user) return;
    
    try {
      // For temp tasks, just acknowledge the update would be stored later
      if (id.startsWith('temp-')) {
        toast.success('Changes will be saved when task is created');
        return;
      }
      
      // Prepare the data for update
      const updateData: any = {};
      
      if (updatedFields.title !== undefined) updateData.title = updatedFields.title;
      if (updatedFields.notes !== undefined) updateData.notes = updatedFields.notes;
      if (updatedFields.dueDate !== undefined) updateData.due_date = updatedFields.dueDate;
      if (updatedFields.priority !== undefined) updateData.priority = updatedFields.priority;
      if (updatedFields.completed !== undefined) updateData.completed = updatedFields.completed;
      if (updatedFields.category !== undefined) updateData.category = updatedFields.category;
      if (updatedFields.recurring !== undefined) updateData.recurring = updatedFields.recurring;
      if (updatedFields.archived !== undefined) updateData.archived = updatedFields.archived;
      if (updatedFields.assignedTo !== undefined) updateData.user_id = updatedFields.assignedTo;
      if (updatedFields.teamId !== undefined) updateData.team_id = updatedFields.teamId;
      if (updatedFields.pointsValue !== undefined) updateData.points_value = updatedFields.pointsValue;
      if (updatedFields.streakTask !== undefined) updateData.streak_task = updatedFields.streakTask;

      // Update the task in Supabase
      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === id ? { ...task, ...updatedFields } : task))
      );

      // If updating task completion status, show appropriate toast
      if (updatedFields.completed !== undefined) {
        const task = tasks.find(t => t.id === id);
        if (task && updatedFields.completed) {
          toast.success('Task completed! 🎉');
        }
      } else {
        toast.success('Task updated');
      }
    } catch (err: any) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast.success('Task deleted');
    } catch (err: any) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    await updateTask(id, { completed: !task.completed });
  };

  // Archive a task
  const archiveTask = async (id: string) => {
    await updateTask(id, { archived: true });
    toast.success('Task archived');
  };

  // Add comment to a task
  const addComment = async (taskId: string, comment: { text: string, author: string }) => {
    if (!user) return;
    
    try {
      // For temp tasks, just acknowledge the comment would be stored later
      if (taskId.startsWith('temp-')) {
        toast.success('Comment will be added when task is saved');
        return;
      }
      
      const { error } = await supabase
        .from('task_comments')
        .insert([
          {
            task_id: taskId,
            text: comment.text,
            author: comment.author,
          }
        ]);

      if (error) {
        throw error;
      }
      
      // Refetch comments for this task
      const { data: comments, error: fetchError } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId);
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Update the local task with the new comments
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              comments: comments.map(c => ({
                id: c.id,
                text: c.text,
                createdAt: c.created_at,
                author: c.author,
                likes: c.likes || 0
              }))
            };
          }
          return task;
        })
      );
      
      toast.success('Comment added');
    } catch (err: any) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
    }
  };

  // Add attachment to a task
  const addAttachment = async (taskId: string, attachmentUrl: string) => {
    if (!user) return;
    
    try {
      // For temp tasks, just acknowledge the attachment would be stored later
      if (taskId.startsWith('temp-')) {
        toast.success('Attachment will be added when task is saved');
        return;
      }
      
      const { error } = await supabase
        .from('task_attachments')
        .insert([
          {
            task_id: taskId,
            url: attachmentUrl
          }
        ]);

      if (error) {
        throw error;
      }
      
      // Refetch attachments for this task
      const { data: attachments, error: fetchError } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId);
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Update the local task with the new attachments
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              attachments: attachments.map(a => a.url)
            };
          }
          return task;
        })
      );
      
      toast.success('Attachment added');
    } catch (err: any) {
      console.error('Error adding attachment:', err);
      toast.error('Failed to add attachment');
    }
  };

  // Assign task to a user
  const assignTask = async (taskId: string, userId: string) => {
    await updateTask(taskId, { assignedTo: userId });
    toast.success('Task assigned');
  };

  // Share task with a team
  const shareTask = async (taskId: string, teamId: string) => {
    await updateTask(taskId, { teamId, isShared: true });
    toast.success('Task shared with team');
  };

  // Unshare a task
  const unshareTask = async (taskId: string) => {
    await updateTask(taskId, { teamId: undefined, isShared: false });
    toast.success('Task is no longer shared');
  };

  // Get tasks for a specific team
  const getTeamTasks = (teamId: string) => {
    return tasks.filter((task) => task.teamId === teamId);
  };

  // Get tasks assigned to a specific user
  const getAssignedTasks = (userId: string) => {
    return tasks.filter((task) => task.assignedTo === userId);
  };

  // Additional functions for task dependencies
  const addDependency = async (taskId: string, dependsOnTaskId: string) => {
    if (!user) return;
    
    try {
      // For temp tasks, just acknowledge the dependency would be stored later
      if (taskId.startsWith('temp-')) {
        toast.success('Dependency will be added when task is saved');
        return;
      }
      
      const { error } = await supabase
        .from('task_dependencies')
        .insert([
          {
            task_id: taskId,
            depends_on_task_id: dependsOnTaskId
          }
        ]);

      if (error) {
        throw error;
      }
      
      // Refetch dependencies for this task
      const { data: dependencies, error: fetchError } = await supabase
        .from('task_dependencies')
        .select('*')
        .eq('task_id', taskId);
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Update the local task with the new dependencies
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              dependencies: dependencies.map(d => d.depends_on_task_id)
            };
          }
          return task;
        })
      );
      
      toast.success('Task dependency added');
    } catch (err: any) {
      console.error('Error adding task dependency:', err);
      toast.error('Failed to add task dependency');
    }
  };

  // Remove a task dependency
  const removeDependency = async (taskId: string, dependsOnTaskId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('task_dependencies')
        .delete()
        .eq('task_id', taskId)
        .eq('depends_on_task_id', dependsOnTaskId);

      if (error) {
        throw error;
      }
      
      // Update the local task
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId && task.dependencies) {
            return {
              ...task,
              dependencies: task.dependencies.filter(depId => depId !== dependsOnTaskId)
            };
          }
          return task;
        })
      );
      
      toast.success('Task dependency removed');
    } catch (err: any) {
      console.error('Error removing task dependency:', err);
      toast.error('Failed to remove task dependency');
    }
  };

  return {
    tasks,
    isLoading,
    error,
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
    addDependency,
    removeDependency,
    refreshTasks: fetchTasks
  };
};
