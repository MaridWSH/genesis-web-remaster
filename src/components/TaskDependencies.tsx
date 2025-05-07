
import React, { useState, useEffect } from 'react';
import { useTasks } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, X } from 'lucide-react';
import { toast } from 'sonner';

interface TaskDependenciesProps {
  taskId: string;
}

const TaskDependencies = ({ taskId }: TaskDependenciesProps) => {
  const { tasks, updateTask } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [dependencies, setDependencies] = useState<string[]>([]);
  
  const currentTask = tasks.find(t => t.id === taskId);
  
  useEffect(() => {
    if (currentTask) {
      setDependencies(currentTask.dependencies || []);
    }
  }, [currentTask]);
  
  const availableTasks = tasks.filter(task => 
    task.id !== taskId && !dependencies.includes(task.id)
  );
  
  const handleAddDependency = () => {
    if (selectedTaskId && currentTask) {
      const newDependencies = [...dependencies, selectedTaskId];
      updateTask(taskId, {
        dependencies: newDependencies
      });
      setDependencies(newDependencies);
      setSelectedTaskId('');
      toast.success('Task linked');
    }
  };
  
  const handleRemoveDependency = (dependencyId: string) => {
    if (currentTask) {
      const newDependencies = dependencies.filter(id => id !== dependencyId);
      updateTask(taskId, {
        dependencies: newDependencies
      });
      setDependencies(newDependencies);
      toast.success('Link removed');
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Linked Tasks</h3>
      
      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
        {dependencies.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No linked tasks</p>
        ) : (
          dependencies.map(dependencyId => {
            const dependentTask = tasks.find(t => t.id === dependencyId);
            return dependentTask ? (
              <div key={dependencyId} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Link className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm">{dependentTask.title}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveDependency(dependencyId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : null;
          })
        )}
      </div>
      
      <div className="flex space-x-2">
        <Select 
          value={selectedTaskId} 
          onValueChange={setSelectedTaskId}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select task to link" />
          </SelectTrigger>
          <SelectContent>
            {availableTasks.length === 0 ? (
              <SelectItem value="none" disabled>No available tasks</SelectItem>
            ) : (
              availableTasks.map(task => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button onClick={handleAddDependency} disabled={!selectedTaskId}>Add</Button>
      </div>
    </div>
  );
};

export default TaskDependencies;
