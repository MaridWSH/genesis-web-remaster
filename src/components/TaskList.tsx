import React, { useState } from 'react';
import { useTasks, Task, Category } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Check, 
  Pencil, 
  Trash2, 
  Plus, 
  ArchiveIcon, 
  SortAsc, 
  SortDesc, 
  CalendarIcon, 
  Tag,
  Moon,
  Sun
} from 'lucide-react';
import { format } from 'date-fns';
import TaskDialog from './TaskDialog';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterType = 'All' | 'Active' | 'Completed' | 'Archived';
type SortType = 'dueDate' | 'priority' | 'alphabetical';
type SortDirection = 'asc' | 'desc';

const TaskList = () => {
  const { tasks, toggleTaskCompletion, deleteTask, archiveTask, darkMode, toggleDarkMode } = useTasks();
  const [filterType, setFilterType] = useState<FilterType>('All');
  const [searchText, setSearchText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleAddTask = () => {
    setDialogMode('create');
    setSelectedTaskId(undefined);
    setDialogOpen(true);
  };

  const handleEditTask = (taskId: string) => {
    setDialogMode('edit');
    setSelectedTaskId(taskId);
    setDialogOpen(true);
  };

  const handleArchiveTask = (taskId: string) => {
    archiveTask(taskId);
  };

  const toggleCalendarView = () => {
    setShowCalendar(!showCalendar);
  };

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      if (filterType === 'All') return !task.archived;
      if (filterType === 'Active') return !task.completed && !task.archived;
      if (filterType === 'Completed') return task.completed && !task.archived;
      if (filterType === 'Archived') return task.archived;
      return true;
    })
    .filter((task) => {
      if (categoryFilter === 'All') return true;
      return task.category === categoryFilter;
    })
    .filter((task) => 
      task.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((task) => {
      if (!selectedDate) return true;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === selectedDate.getFullYear() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getDate() === selectedDate.getDate()
      );
    })
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (sortBy === 'dueDate') {
        return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * modifier;
      }
      
      if (sortBy === 'priority') {
        const priorityValue = { 'Low': 1, 'Medium': 2, 'High': 3 };
        return (priorityValue[a.priority] - priorityValue[b.priority]) * modifier;
      }
      
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title) * modifier;
      }
      
      return 0;
    });

  const categories = Array.from(new Set(tasks.map(task => task.category).filter(Boolean))) as Category[];
  
  const tasksWithDueDates = tasks
    .filter(task => !task.archived)
    .reduce((acc, task) => {
      const dueDate = new Date(task.dueDate);
      const dateKey = format(dueDate, 'yyyy-MM-dd');
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      
      acc[dateKey].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

  const toggleSort = () => {
    setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Your Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your tasks and stay productive</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleDarkMode}
            className="mr-2"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleAddTask}
          >
            <Plus size={20} className="mr-1" /> Add Task
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 md:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Tag size={16} className="mr-1" /> {categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as Category | 'All')}>
                <DropdownMenuRadioItem value="All">All Categories</DropdownMenuRadioItem>
                {categories.map(category => (
                  <DropdownMenuRadioItem key={category} value={category}>
                    {category}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                {sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                <span className="ml-1 hidden md:inline">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortType)}>
                <DropdownMenuRadioItem value="dueDate">Due Date</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="priority">Priority</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="alphabetical">Alphabetical</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortDirection} onValueChange={(value) => setSortDirection(value as SortDirection)}>
                <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" onClick={toggleCalendarView}>
                <CalendarIcon size={16} className="mr-1" /> 
                <span className="hidden md:inline">Calendar</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
                initialFocus
                modifiers={{
                  hasTasks: Object.keys(tasksWithDueDates).map(dateStr => new Date(dateStr)),
                }}
                modifiersStyles={{
                  hasTasks: { fontWeight: 'bold', textDecoration: 'underline' }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="border-b mb-6">
        <div className="flex space-x-2">
          {(['All', 'Active', 'Completed', 'Archived'] as FilterType[]).map((type) => (
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

      {/* Show either calendar view or list view */}
      {selectedDate ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedDate(undefined)}
            >
              Clear Date
            </Button>
          </div>
          
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks scheduled for this date.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAndSortedTasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggleCompletion={toggleTaskCompletion}
                  onDelete={deleteTask}
                  onEdit={handleEditTask}
                  onArchive={handleArchiveTask}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No tasks found. {filterType === 'All' ? 'Add a new task to get started!' : `Try changing your filter from "${filterType}".`}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAndSortedTasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggleCompletion={toggleTaskCompletion}
                  onDelete={deleteTask}
                  onEdit={handleEditTask}
                  onArchive={handleArchiveTask}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <TaskDialog 
        mode={dialogMode}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        taskId={selectedTaskId}
      />
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
}

const TaskItem = ({ task, onToggleCompletion, onDelete, onEdit, onArchive }: TaskItemProps) => {
  const hasComments = task.comments && task.comments.length > 0;
  const hasAttachments = task.attachments && task.attachments.length > 0;
  const hasDependencies = task.dependencies && task.dependencies.length > 0;
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 dark:text-red-400';
      case 'Medium':
        return 'text-amber-600 dark:text-amber-400';
      case 'Low':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category?: Category) => {
    switch (category) {
      case 'Work':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Personal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Shopping':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Health':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Finance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const isOverdue = (date: string) => {
    const dueDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && !task.completed;
  };

  return (
    <div className="border rounded-md p-4 flex items-center justify-between bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center">
        <button 
          onClick={() => onToggleCompletion(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
            task.completed ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          {task.completed && <Check size={16} className="text-white" />}
        </button>
        
        <div>
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
            {task.title}
          </h3>
          <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400 flex-wrap space-x-2">
            <span className={getPriorityColor(task.priority)}>
              {task.priority}
            </span>
            <span>•</span>
            <span className={isOverdue(task.dueDate) ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </span>
            
            {task.category && (
              <>
                <span>•</span>
                <Badge variant="outline" className={getCategoryColor(task.category)}>
                  {task.category}
                </Badge>
              </>
            )}
            
            {task.recurring && task.recurring !== 'none' && (
              <>
                <span>•</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Repeats: {task.recurring}
                </span>
              </>
            )}
            
            {/* Indicators for comments, attachments, and links */}
            {(hasComments || hasAttachments || hasDependencies) && (
              <>
                <span>•</span>
                <span className="flex space-x-1">
                  {hasComments && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-1 py-0">
                      {task.comments?.length}c
                    </Badge>
                  )}
                  {hasAttachments && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-1 py-0">
                      {task.attachments?.length}f
                    </Badge>
                  )}
                  {hasDependencies && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-1 py-0">
                      {task.dependencies?.length}l
                    </Badge>
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onEdit(task.id)}
        >
          <Pencil size={16} />
        </Button>
        {!task.archived && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onArchive(task.id)}
          >
            <ArchiveIcon size={16} />
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline" 
          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TaskList;
