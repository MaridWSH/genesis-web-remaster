
import React, { useEffect, useState } from 'react';
import { useTasks, Task, Priority } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface TaskDialogProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId?: string;
}

const TaskDialog = ({ mode, open, onOpenChange, taskId }: TaskDialogProps) => {
  const { tasks, addTask, updateTask } = useTasks();
  
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          setTitle(task.title);
          setNotes(task.notes);
          
          const date = new Date(task.dueDate);
          setDueDate(format(date, 'yyyy-MM-dd'));
          setDueTime(format(date, 'HH:mm'));
          setPriority(task.priority);
        }
      } else if (mode === 'create') {
        // Set default values for new task
        setTitle('');
        setNotes('');
        setDueDate('');
        setDueTime('');
        setPriority('Medium');
      }
    }
  }, [mode, taskId, tasks, open]);

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
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Task' : 'Edit Task'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new task to your list.' : 'Make changes to your task here.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Task title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">Notes</label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details"
              className="h-24"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">Due date</label>
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
          
          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">Priority</label>
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
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Task' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
