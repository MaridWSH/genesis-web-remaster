
import React, { useEffect, useState } from 'react';
import { useTasks, Task, Priority, Category } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
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
import TaskComments from './TaskComments';
import TaskAttachments from './TaskAttachments';
import TaskDependencies from './TaskDependencies';

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
  const [category, setCategory] = useState<Category>('Work');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [activeTab, setActiveTab] = useState('details');
  const [tempTaskId, setTempTaskId] = useState<string | undefined>(undefined);

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
          setCategory(task.category || 'Other');
          setRecurring(task.recurring || 'none');
          setTempTaskId(taskId);
        }
      } else if (mode === 'create') {
        // Set default values for new task
        setTitle('');
        setNotes('');
        setDueDate('');
        setDueTime('');
        setPriority('Medium');
        setCategory('Work');
        setRecurring('none');
        
        // Create a temporary task ID for new tasks
        if (!tempTaskId) {
          setTempTaskId(`temp-${Date.now()}`);
        }
      }
      // Reset to first tab when opening dialog
      setActiveTab('details');
    } else {
      // Clear temporary task ID when closing dialog
      if (mode === 'create') {
        setTempTaskId(undefined);
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
        category,
        recurring: recurring === 'none' ? undefined : recurring,
      });
      toast.success('Task created successfully');
    } else if (mode === 'edit' && taskId) {
      updateTask(taskId, {
        title,
        notes,
        dueDate: combinedDate.toISOString(),
        priority,
        category,
        recurring: recurring === 'none' ? undefined : recurring,
      });
      toast.success('Task updated successfully');
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Task' : 'Edit Task'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new task to your list.' : 'Make changes to your task here.'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="attachments">Files</TabsTrigger>
            <TabsTrigger value="dependencies">Links</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <form id="taskForm" onSubmit={handleSubmit} className="space-y-4">
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                  <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <label htmlFor="recurring" className="text-sm font-medium">Recurring</label>
                <Select 
                  value={recurring} 
                  onValueChange={(value) => setRecurring(value as 'none' | 'daily' | 'weekly' | 'monthly')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Set recurring schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not recurring</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="comments" className="space-y-4 pt-4">
            {tempTaskId && <TaskComments taskId={tempTaskId} />}
          </TabsContent>
          
          <TabsContent value="attachments" className="space-y-4 pt-4">
            {tempTaskId && <TaskAttachments taskId={tempTaskId} />}
          </TabsContent>
          
          <TabsContent value="dependencies" className="space-y-4 pt-4">
            {tempTaskId && <TaskDependencies taskId={tempTaskId} />}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Quick View</h3>
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem className="pl-1">
                <div className="p-4 border rounded-md">
                  <h4 className="text-sm font-semibold mb-2">Comments</h4>
                  <div className="h-24 overflow-y-auto">
                    {tempTaskId && <TaskComments taskId={tempTaskId} />}
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1">
                <div className="p-4 border rounded-md">
                  <h4 className="text-sm font-semibold mb-2">Files</h4>
                  <div className="h-24 overflow-y-auto">
                    {tempTaskId && <TaskAttachments taskId={tempTaskId} />}
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1">
                <div className="p-4 border rounded-md">
                  <h4 className="text-sm font-semibold mb-2">Links</h4>
                  <div className="h-24 overflow-y-auto">
                    {tempTaskId && <TaskDependencies taskId={tempTaskId} />}
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="taskForm">
            {mode === 'create' ? 'Create Task' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
