
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTasks, Task, Priority } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type FormProps = {
  mode: 'create' | 'edit';
};

const TaskForm = ({ mode }: FormProps) => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { tasks, addTask, updateTask } = useTasks();
  
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  useEffect(() => {
    if (mode === 'edit' && taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setTitle(task.title);
        setNotes(task.notes);
        
        const date = new Date(task.dueDate);
        setDueDate(format(date, 'yyyy-MM-dd'));
        setDueTime(format(date, 'HH:mm'));
        setPriority(task.priority);
      } else {
        navigate('/tasks');
        toast.error('Task not found');
      }
    }
  }, [mode, taskId, tasks, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error('Please enter a task title');
      return;
    }
    
    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }

    const combinedDate = new Date(`${dueDate}T${dueTime || '00:00'}`);
    
    if (mode === 'create') {
      addTask({
        title,
        notes,
        dueDate: combinedDate.toISOString(),
        priority,
        completed: false,
      });
      toast.success('Task created successfully');
    } else if (mode === 'edit' && taskId) {
      updateTask(taskId, {
        title,
        notes,
        dueDate: combinedDate.toISOString(),
        priority,
      });
      toast.success('Task updated successfully');
    }
    
    navigate('/tasks');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/tasks" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold">{mode === 'create' ? 'Create Task' : 'Edit Task'}</h1>
      </div>
      
      <div className="bg-white p-6 rounded-md shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">Task title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="block mb-2">Notes</label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details"
              className="h-32"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="dueDate" className="block mb-2">Due date</label>
            <div className="flex gap-2">
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full"
              />
              <Input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="priority" className="block mb-2">Priority</label>
            <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/tasks')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {mode === 'create' ? 'Save Task' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
