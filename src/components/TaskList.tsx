
import React, { useState } from 'react';
import { useTasks, Task } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Pencil, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

type FilterType = 'All' | 'Active' | 'Completed';

const TaskList = () => {
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
  const [filterType, setFilterType] = useState<FilterType>('All');
  const [searchText, setSearchText] = useState('');

  const filteredTasks = tasks
    .filter((task) => {
      if (filterType === 'All') return true;
      if (filterType === 'Active') return !task.completed;
      if (filterType === 'Completed') return task.completed;
      return true;
    })
    .filter((task) => 
      task.title.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Your Tasks</h1>
          <p className="text-gray-600">Manage your tasks and stay productive</p>
        </div>
        <Link to="/tasks/new">
          <Button className="bg-primary hover:bg-primary/90 mt-4 md:mt-0">
            <Plus size={20} className="mr-1" /> Add Task
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="border-b mb-6">
        <div className="flex space-x-2">
          {(['All', 'Active', 'Completed'] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 ${
                filterType === type
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-gray-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks found. {filterType === 'All' ? 'Add a new task to get started!' : `Try changing your filter from "${filterType}".`}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggleCompletion={toggleTaskCompletion}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggleCompletion, onDelete }: TaskItemProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-amber-600';
      case 'Low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="border rounded-md p-4 flex items-center justify-between bg-white">
      <div className="flex items-center">
        <button 
          onClick={() => onToggleCompletion(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
            task.completed ? 'bg-primary border-primary' : 'border-gray-300'
          }`}
        >
          {task.completed && <Check size={16} className="text-white" />}
        </button>
        
        <div>
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <span className={getPriorityColor(task.priority)}>Priority: {task.priority}</span>
            <span className="mx-2">•</span>
            <span>Due: {format(new Date(task.dueDate), 'MM/dd/yyyy, h:mm a')}</span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Link to={`/tasks/edit/${task.id}`}>
          <Button size="sm" variant="outline">
            <Pencil size={16} />
          </Button>
        </Link>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-red-500 hover:text-red-600"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TaskList;
