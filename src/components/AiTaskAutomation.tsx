
import React, { useState, useEffect } from 'react';
import { useTasks } from '@/context/TaskContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Clock, 
  Bell, 
  FileText, 
  Loader2, 
  ArrowUp, 
  ListCheck, 
  ListPlus, 
  FileCheck, 
  SquareCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getTaskOptimization, 
  getSmartScheduleSuggestions,
  getAutoPrioritySuggestions,
  generateSubtasks,
  optimizeRecurringTasks,
  suggestTaskDelegation,
  DEEPSEEK_MODELS 
} from '@/utils/deepSeekApi';

type AiFeature = 'smartScheduling' | 'autoPriority' | 'subtaskGeneration' | 'recurringOptimization' | 'taskDelegation' | 'deepSeekIntegration';

const AiTaskAutomation: React.FC = () => {
  const { tasks, updateTask } = useTasks();
  const [activeFeatures, setActiveFeatures] = useState<Record<AiFeature, boolean>>({
    smartScheduling: true,
    autoPriority: true,
    subtaskGeneration: false,
    recurringOptimization: true,
    taskDelegation: false,
    deepSeekIntegration: false,
  });
  
  const [apiKey, setApiKey] = useState('');
  const [loadingAi, setLoadingAi] = useState<Record<string, boolean>>({
    suggestions: false,
    schedule: false,
    priority: false,
    subtasks: false,
    recurring: false,
    delegation: false
  });
  
  // AI suggestion states
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Schedule high-priority tasks during your most productive hours",
    "Break down complex tasks into smaller sub-tasks for better management",
    "Consider delegating tasks that others could handle more efficiently",
  ]);
  
  const [scheduleSuggestions, setScheduleSuggestions] = useState<Array<{
    taskId: string;
    suggestion: string;
    suggestedTime?: string;
  }>>([]);
  
  const [prioritySuggestions, setPrioritySuggestions] = useState<Array<{
    taskId: string;
    suggestedPriority: 'High' | 'Medium' | 'Low';
    reason: string;
  }>>([]);
  
  const [selectedTaskForSubtasks, setSelectedTaskForSubtasks] = useState<string>('');
  const [generatedSubtasks, setGeneratedSubtasks] = useState<string[]>([]);
  
  const [recurringOptimizations, setRecurringOptimizations] = useState<Array<{
    taskId: string;
    suggestion: string;
    suggestedFrequency?: string;
  }>>([]);
  
  // Mock team members for task delegation demo
  const teamMembers = [
    { userId: 'user1', name: 'Alex Johnson', skills: ['Design', 'Frontend'] },
    { userId: 'user2', name: 'Taylor Smith', skills: ['Backend', 'Database'] },
    { userId: 'user3', name: 'Jordan Lee', skills: ['Content', 'Marketing'] }
  ];
  
  const [delegationSuggestions, setDelegationSuggestions] = useState<Array<{
    taskId: string;
    suggestedUserId: string;
    reason: string;
  }>>([]);

  // Saved key from local storage
  useEffect(() => {
    const savedKey = localStorage.getItem('deepseek-api-key');
    if (savedKey) {
      setApiKey(savedKey);
      setActiveFeatures(prev => ({ ...prev, deepSeekIntegration: true }));
    }
  }, []);

  const toggleFeature = (feature: AiFeature) => {
    setActiveFeatures((prev) => {
      const newState = { ...prev, [feature]: !prev[feature] };
      
      // Special handling for DeepSeek integration
      if (feature === 'deepSeekIntegration' && newState[feature] && !apiKey) {
        toast.error("Please enter a DeepSeek API key first");
        return prev;
      }
      
      toast.success(`${feature} ${newState[feature] ? 'enabled' : 'disabled'}`);
      return newState;
    });
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('deepseek-api-key', apiKey);
      setActiveFeatures(prev => ({ ...prev, deepSeekIntegration: true }));
      toast.success("DeepSeek API key saved");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('deepseek-api-key');
    setApiKey('');
    setActiveFeatures(prev => ({ ...prev, deepSeekIntegration: false }));
    toast.success("DeepSeek API key removed");
  };

  // Get task by ID helper
  const getTaskById = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };

  const handleGetAiSuggestions = async () => {
    if (!activeFeatures.deepSeekIntegration) {
      toast.error("Please enable DeepSeek integration first");
      return;
    }
    
    setLoadingAi(prev => ({ ...prev, suggestions: true }));
    try {
      // Filter for incomplete tasks
      const incompleteTasks = tasks.filter(task => !task.completed && !task.archived);
      
      // Get AI suggestions using DeepSeek API
      const suggestions = await getTaskOptimization(incompleteTasks, apiKey);
      setAiSuggestions(suggestions);
      toast.success("AI suggestions updated");
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast.error("Failed to get AI suggestions");
    } finally {
      setLoadingAi(prev => ({ ...prev, suggestions: false }));
    }
  };
  
  const handleSmartScheduling = async () => {
    if (!activeFeatures.deepSeekIntegration || !activeFeatures.smartScheduling) {
      toast.error("Please enable DeepSeek integration and Smart Scheduling");
      return;
    }
    
    setLoadingAi(prev => ({ ...prev, schedule: true }));
    try {
      const incompleteTasks = tasks.filter(task => !task.completed && !task.archived);
      const suggestions = await getSmartScheduleSuggestions(incompleteTasks, apiKey);
      setScheduleSuggestions(suggestions);
      toast.success("Smart scheduling suggestions generated");
    } catch (error) {
      console.error("Error generating smart scheduling:", error);
      toast.error("Failed to generate scheduling suggestions");
    } finally {
      setLoadingAi(prev => ({ ...prev, schedule: false }));
    }
  };
  
  const handleAutoPrioritization = async () => {
    if (!activeFeatures.deepSeekIntegration || !activeFeatures.autoPriority) {
      toast.error("Please enable DeepSeek integration and Auto-Prioritization");
      return;
    }
    
    setLoadingAi(prev => ({ ...prev, priority: true }));
    try {
      const incompleteTasks = tasks.filter(task => !task.completed && !task.archived);
      const suggestions = await getAutoPrioritySuggestions(incompleteTasks, apiKey);
      setPrioritySuggestions(suggestions);
      toast.success("Priority suggestions generated");
    } catch (error) {
      console.error("Error generating priority suggestions:", error);
      toast.error("Failed to generate priority suggestions");
    } finally {
      setLoadingAi(prev => ({ ...prev, priority: false }));
    }
  };
  
  const handleApplyPriority = (taskId: string, priority: 'High' | 'Medium' | 'Low') => {
    updateTask(taskId, { priority });
    toast.success(`Task priority updated to ${priority}`);
    
    // Remove the applied suggestion
    setPrioritySuggestions(prev => prev.filter(sugg => sugg.taskId !== taskId));
  };
  
  const handleGenerateSubtasks = async () => {
    if (!selectedTaskForSubtasks) {
      toast.error("Please select a task first");
      return;
    }
    
    if (!activeFeatures.deepSeekIntegration || !activeFeatures.subtaskGeneration) {
      toast.error("Please enable DeepSeek integration and Subtask Generation");
      return;
    }
    
    const task = getTaskById(selectedTaskForSubtasks);
    if (!task) {
      toast.error("Task not found");
      return;
    }
    
    setLoadingAi(prev => ({ ...prev, subtasks: true }));
    try {
      const subtasks = await generateSubtasks(task.title, task.notes, apiKey);
      setGeneratedSubtasks(subtasks);
      toast.success("Subtasks generated successfully");
    } catch (error) {
      console.error("Error generating subtasks:", error);
      toast.error("Failed to generate subtasks");
    } finally {
      setLoadingAi(prev => ({ ...prev, subtasks: false }));
    }
  };
  
  const handleOptimizeRecurring = async () => {
    if (!activeFeatures.deepSeekIntegration || !activeFeatures.recurringOptimization) {
      toast.error("Please enable DeepSeek integration and Recurring Task Optimization");
      return;
    }
    
    setLoadingAi(prev => ({ ...prev, recurring: true }));
    try {
      // Get tasks with recurring settings
      const recurringTasks = tasks.filter(task => 
        task.recurring && task.recurring !== 'none' && !task.archived
      );
      
      if (recurringTasks.length === 0) {
        toast.info("No recurring tasks found to optimize");
        setLoadingAi(prev => ({ ...prev, recurring: false }));
        return;
      }
      
      const optimizations = await optimizeRecurringTasks(recurringTasks, apiKey);
      setRecurringOptimizations(optimizations);
      toast.success("Recurring task optimizations generated");
    } catch (error) {
      console.error("Error optimizing recurring tasks:", error);
      toast.error("Failed to optimize recurring tasks");
    } finally {
      setLoadingAi(prev => ({ ...prev, recurring: false }));
    }
  };
  
  const handleTaskDelegation = async () => {
    if (!activeFeatures.deepSeekIntegration || !activeFeatures.taskDelegation) {
      toast.error("Please enable DeepSeek integration and Task Delegation");
      return;
    }
    
    setLoadingAi(prev => ({ ...prev, delegation: true }));
    try {
      const incompleteTasks = tasks.filter(task => !task.completed && !task.archived);
      const suggestions = await suggestTaskDelegation(incompleteTasks, teamMembers, apiKey);
      setDelegationSuggestions(suggestions);
      toast.success("Task delegation suggestions generated");
    } catch (error) {
      console.error("Error generating delegation suggestions:", error);
      toast.error("Failed to generate delegation suggestions");
    } finally {
      setLoadingAi(prev => ({ ...prev, delegation: false }));
    }
  };
  
  // Calculate upcoming deadlines
  const upcomingDeadlines = tasks
    .filter(task => !task.completed && !task.archived)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);
  
  // Get incomplete tasks for dropdowns
  const incompleteTasks = tasks.filter(task => !task.completed && !task.archived);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              AI-Powered Task Automation
            </CardTitle>
            <CardDescription>
              Let AI handle routine tasks and optimize your workflow
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Beta
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="smart-scheduling" className="w-full">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="smart-scheduling">
              <Calendar className="h-4 w-4 mr-1" /> Scheduling
            </TabsTrigger>
            <TabsTrigger value="auto-priority">
              <ArrowUp className="h-4 w-4 mr-1" /> Prioritize
            </TabsTrigger>
            <TabsTrigger value="subtasks">
              <ListPlus className="h-4 w-4 mr-1" /> Subtasks
            </TabsTrigger>
            <TabsTrigger value="recurring">
              <Clock className="h-4 w-4 mr-1" /> Recurring
            </TabsTrigger>
            <TabsTrigger value="delegation">
              <SquareCheck className="h-4 w-4 mr-1" /> Delegation
            </TabsTrigger>
            <TabsTrigger value="deepseek">
              <FileText className="h-4 w-4 mr-1" /> API
            </TabsTrigger>
          </TabsList>
          
          {/* Smart Scheduling Tab */}
          <TabsContent value="smart-scheduling" className="space-y-4">
            <div className="flex items-center space-x-2 pb-4">
              <Switch 
                id="smart-scheduling" 
                checked={activeFeatures.smartScheduling}
                onCheckedChange={() => toggleFeature('smartScheduling')}
              />
              <Label htmlFor="smart-scheduling">Enable Smart Scheduling</Label>
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <p className="font-medium">Upcoming Deadlines</p>
              {upcomingDeadlines.length > 0 ? (
                <ul className="space-y-2">
                  {upcomingDeadlines.map((task) => (
                    <li key={task.id} className="flex justify-between items-center border-b pb-1">
                      <span>{task.title}</span>
                      <span className="text-xs opacity-70">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No upcoming deadlines</p>
              )}
            </div>
            
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-3 mb-3">
              <p className="text-sm">
                AI analyzes your workload, deadlines, and habits to suggest optimal times 
                for completing tasks. This helps balance your day and increase productivity.
              </p>
            </div>
            
            <Button 
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={handleSmartScheduling}
              disabled={!activeFeatures.smartScheduling || !activeFeatures.deepSeekIntegration || loadingAi.schedule}
            >
              {loadingAi.schedule ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <>Generate Smart Schedule</>
              )}
            </Button>
            
            {scheduleSuggestions.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">AI Schedule Suggestions:</p>
                <ul className="space-y-2">
                  {scheduleSuggestions.map((suggestion, index) => {
                    const task = getTaskById(suggestion.taskId);
                    if (!task) return null;
                    
                    return (
                      <li key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm">
                        <div className="font-medium mb-1">{task.title}</div>
                        <p>{suggestion.suggestion}</p>
                        {suggestion.suggestedTime && (
                          <div className="mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-blue-500" />
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                              Suggested time: {suggestion.suggestedTime}
                            </span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </TabsContent>
          
          {/* Auto Priority Tab */}
          <TabsContent value="auto-priority" className="space-y-4">
            <div className="flex items-center space-x-2 pb-4">
              <Switch 
                id="auto-priority" 
                checked={activeFeatures.autoPriority}
                onCheckedChange={() => toggleFeature('autoPriority')}
              />
              <Label htmlFor="auto-priority">Enable Auto-Prioritization</Label>
            </div>
            
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-3 mb-3">
              <p className="text-sm">
                AI analyzes your tasks and suggests priority levels based on deadlines, 
                dependencies, and your work patterns. This helps focus on what matters most.
              </p>
            </div>
            
            <Button 
              variant="secondary"
              size="sm" 
              className="w-full"
              onClick={handleAutoPrioritization}
              disabled={!activeFeatures.autoPriority || !activeFeatures.deepSeekIntegration || loadingAi.priority}
            >
              {loadingAi.priority ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <>Analyze & Prioritize Tasks</>
              )}
            </Button>
            
            {prioritySuggestions.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">AI Priority Suggestions:</p>
                <ul className="space-y-2">
                  {prioritySuggestions.map((suggestion, index) => {
                    const task = getTaskById(suggestion.taskId);
                    if (!task) return null;
                    
                    const priorityColor = {
                      High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                      Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                      Low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    };
                    
                    return (
                      <li key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm">
                        <div className="font-medium mb-1">{task.title}</div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">
                              Current: {task.priority}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${priorityColor[suggestion.suggestedPriority]}`}>
                              Suggested: {suggestion.suggestedPriority}
                            </span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleApplyPriority(task.id, suggestion.suggestedPriority)}
                          >
                            Apply
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{suggestion.reason}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </TabsContent>
          
          {/* Subtasks Generation Tab */}
          <TabsContent value="subtasks" className="space-y-4">
            <div className="flex items-center space-x-2 pb-4">
              <Switch 
                id="subtask-generation" 
                checked={activeFeatures.subtaskGeneration}
                onCheckedChange={() => toggleFeature('subtaskGeneration')}
              />
              <Label htmlFor="subtask-generation">Enable AI Subtask Generation</Label>
            </div>
            
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-3 mb-3">
              <p className="text-sm">
                AI analyzes complex tasks and breaks them down into smaller, actionable steps. 
                This helps you plan and execute projects more effectively.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-selector">Select a task to break down:</Label>
              <select 
                id="task-selector"
                className="w-full p-2 border rounded dark:bg-gray-800"
                value={selectedTaskForSubtasks}
                onChange={(e) => setSelectedTaskForSubtasks(e.target.value)}
              >
                <option value="">Select a task...</option>
                {incompleteTasks.map(task => (
                  <option key={task.id} value={task.id}>{task.title}</option>
                ))}
              </select>
            </div>
            
            <Button 
              variant="secondary"
              size="sm" 
              className="w-full"
              onClick={handleGenerateSubtasks}
              disabled={!selectedTaskForSubtasks || !activeFeatures.subtaskGeneration || !activeFeatures.deepSeekIntegration || loadingAi.subtasks}
            >
              {loadingAi.subtasks ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
              ) : (
                <>Generate Subtasks</>
              )}
            </Button>
            
            {generatedSubtasks.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">Generated Subtasks:</p>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  <ul className="space-y-2">
                    {generatedSubtasks.map((subtask, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs mr-2 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        {subtask}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 text-xs text-gray-500">
                    Note: These are suggestions. Create them as new tasks or add to your notes.
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Recurring Task Optimization Tab */}
          <TabsContent value="recurring" className="space-y-4">
            <div className="flex items-center space-x-2 pb-4">
              <Switch 
                id="recurring-optimization" 
                checked={activeFeatures.recurringOptimization}
                onCheckedChange={() => toggleFeature('recurringOptimization')}
              />
              <Label htmlFor="recurring-optimization">Enable Recurring Task Optimization</Label>
            </div>
            
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-3 mb-3">
              <p className="text-sm">
                AI analyzes your recurring tasks and suggests adjustments based on your completion patterns. 
                This helps ensure your recurring tasks match your actual work rhythm.
              </p>
            </div>
            
            <Button 
              variant="secondary"
              size="sm" 
              className="w-full"
              onClick={handleOptimizeRecurring}
              disabled={!activeFeatures.recurringOptimization || !activeFeatures.deepSeekIntegration || loadingAi.recurring}
            >
              {loadingAi.recurring ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <>Optimize Recurring Tasks</>
              )}
            </Button>
            
            {recurringOptimizations.length > 0 ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">Recurring Task Optimizations:</p>
                <ul className="space-y-2">
                  {recurringOptimizations.map((optimization, index) => {
                    const task = getTaskById(optimization.taskId);
                    if (!task) return null;
                    
                    return (
                      <li key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm">
                        <div className="font-medium mb-1">{task.title}</div>
                        <p>{optimization.suggestion}</p>
                        {optimization.suggestedFrequency && (
                          <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                            Suggested frequency: {optimization.suggestedFrequency}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              tasks.some(t => t.recurring && t.recurring !== 'none' && !t.archived) ? (
                <p className="text-sm text-gray-500 mt-2">
                  Click "Optimize Recurring Tasks" to get AI suggestions
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No recurring tasks found. Add recurring tasks to get optimization suggestions.
                </p>
              )
            )}
          </TabsContent>
          
          {/* Task Delegation Tab */}
          <TabsContent value="delegation" className="space-y-4">
            <div className="flex items-center space-x-2 pb-4">
              <Switch 
                id="task-delegation" 
                checked={activeFeatures.taskDelegation}
                onCheckedChange={() => toggleFeature('taskDelegation')}
              />
              <Label htmlFor="task-delegation">Enable Smart Task Delegation</Label>
            </div>
            
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-3 mb-3">
              <p className="text-sm">
                AI analyzes tasks and team members to suggest the best person for each task.
                This optimizes workload distribution and matches skills to requirements.
              </p>
            </div>
            
            <div className="space-y-2 text-sm mb-3">
              <p className="font-medium">Team Members</p>
              <ul className="space-y-1">
                {teamMembers.map((member) => (
                  <li key={member.userId} className="flex justify-between items-center">
                    <span>{member.name}</span>
                    <span className="text-xs opacity-70">
                      {member.skills?.join(', ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button 
              variant="secondary"
              size="sm" 
              className="w-full"
              onClick={handleTaskDelegation}
              disabled={!activeFeatures.taskDelegation || !activeFeatures.deepSeekIntegration || loadingAi.delegation}
            >
              {loadingAi.delegation ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <>Suggest Task Assignments</>
              )}
            </Button>
            
            {delegationSuggestions.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">Task Delegation Suggestions:</p>
                <ul className="space-y-2">
                  {delegationSuggestions.map((suggestion, index) => {
                    const task = getTaskById(suggestion.taskId);
                    if (!task) return null;
                    
                    const member = teamMembers.find(m => m.userId === suggestion.suggestedUserId);
                    if (!member) return null;
                    
                    return (
                      <li key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm">
                        <div className="font-medium mb-1">{task.title}</div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-blue-600 dark:text-blue-400 mr-2">
                            Assign to: {member.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{suggestion.reason}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </TabsContent>
          
          {/* DeepSeek API Tab */}
          <TabsContent value="deepseek" className="space-y-4">
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-3 mb-3">
              <p className="text-sm">
                DeepSeek integration enables advanced AI capabilities for task optimization and scheduling.
                You'll need a DeepSeek API key to use this feature.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">DeepSeek API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="api-key"
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your DeepSeek API key"
                    className="flex-1"
                  />
                  {apiKey ? (
                    <Button variant="outline" size="sm" onClick={handleClearApiKey}>
                      Clear
                    </Button>
                  ) : null}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="deepseek-integration" 
                  checked={activeFeatures.deepSeekIntegration}
                  onCheckedChange={() => toggleFeature('deepSeekIntegration')}
                  disabled={!apiKey}
                />
                <Label htmlFor="deepseek-integration">Enable DeepSeek Integration</Label>
              </div>
              
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={handleSaveApiKey}
                disabled={!apiKey}
              >
                Save API Key & Enable
              </Button>
              
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">AI Suggestions for Your Tasks</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full" 
                  onClick={handleGetAiSuggestions}
                  disabled={loadingAi.suggestions || !activeFeatures.deepSeekIntegration}
                >
                  {loadingAi.suggestions ? (
                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Getting suggestions...</>
                  ) : (
                    <>Get General AI Suggestions</>
                  )}
                </Button>
              </div>
              
              {aiSuggestions.length > 0 && (
                <ul className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index} className="bg-gray-50 dark:bg-gray-900 p-2 rounded-md text-sm flex items-start">
                      <span className="bg-blue-100 dark:bg-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              
              <div className="text-xs text-gray-500 mt-2">
                <p>Available models: {DEEPSEEK_MODELS.DEEPSEEK_CHAT}, {DEEPSEEK_MODELS.DEEPSEEK_CODER}</p>
                <p className="mt-1">Your API key is stored locally in your browser and is not sent to our servers.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 flex justify-end">
        Powered by TaskMaster AI + DeepSeek
      </CardFooter>
    </Card>
  );
};

export default AiTaskAutomation;
