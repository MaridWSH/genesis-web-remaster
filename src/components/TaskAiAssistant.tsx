
import React, { useState, useEffect } from 'react';
import { useTasks } from '@/context/TaskContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Sparkles, Brain, Lightbulb, Loader2, ListCheck } from 'lucide-react';
import { 
  getTaskOptimization,
  getSmartScheduleSuggestions,
  getAutoPrioritySuggestions,
  generateSubtasks,
  DEEPSEEK_MODELS 
} from '@/utils/deepSeekApi';
import { useAuth } from '@/context/AuthContext';

const TaskAiAssistant: React.FC = () => {
  const { tasks, updateTask } = useTasks();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [prioritySuggestions, setPrioritySuggestions] = useState<Array<{
    taskId: string;
    suggestedPriority: 'High' | 'Medium' | 'Low';
    reason: string;
  }>>([]);
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  
  // Check for admin-configured API key on component mount
  useEffect(() => {
    const adminApiKey = localStorage.getItem('admin-deepseek-api-key');
    setIsApiConfigured(!!adminApiKey);
  }, []);
  
  const getIncompleteTasks = () => {
    return tasks.filter(task => !task.completed && !task.archived);
  };
  
  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };
  
  const handleGetAiSuggestions = async () => {
    if (!isApiConfigured) {
      toast.error("AI features are not configured. Please contact an administrator.");
      return;
    }
    
    setLoading(true);
    try {
      const incompleteTasks = getIncompleteTasks();
      const adminApiKey = localStorage.getItem('admin-deepseek-api-key') || '';
      const suggestions = await getTaskOptimization(incompleteTasks, adminApiKey);
      setAiSuggestions(suggestions);
      toast.success("AI suggestions generated");
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast.error("Failed to get suggestions");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateSubtasks = async () => {
    if (!isApiConfigured) {
      toast.error("AI features are not configured. Please contact an administrator.");
      return;
    }
    
    if (!selectedTask) {
      toast.error("Please select a task first");
      return;
    }
    
    const task = getTaskById(selectedTask);
    if (!task) {
      toast.error("Task not found");
      return;
    }
    
    setLoading(true);
    try {
      const adminApiKey = localStorage.getItem('admin-deepseek-api-key') || '';
      const generatedSubtasks = await generateSubtasks(task.title, task.notes, adminApiKey);
      setSubtasks(generatedSubtasks);
      toast.success("Subtasks generated successfully");
    } catch (error) {
      console.error("Error generating subtasks:", error);
      toast.error("Failed to generate subtasks");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetPrioritySuggestions = async () => {
    if (!isApiConfigured) {
      toast.error("AI features are not configured. Please contact an administrator.");
      return;
    }
    
    setLoading(true);
    try {
      const incompleteTasks = getIncompleteTasks();
      const adminApiKey = localStorage.getItem('admin-deepseek-api-key') || '';
      const suggestions = await getAutoPrioritySuggestions(incompleteTasks, adminApiKey);
      setPrioritySuggestions(suggestions);
      toast.success("Priority suggestions generated");
    } catch (error) {
      console.error("Error generating priority suggestions:", error);
      toast.error("Failed to generate priority suggestions");
    } finally {
      setLoading(false);
    }
  };
  
  const handleApplyPriority = (taskId: string, priority: 'High' | 'Medium' | 'Low') => {
    updateTask(taskId, { priority });
    toast.success(`Task priority updated to ${priority}`);
    
    // Remove the applied suggestion from the list
    setPrioritySuggestions(prev => prev.filter(sugg => sugg.taskId !== taskId));
  };
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 py-8">
          <CardTitle className="flex items-center text-3xl font-bold">
            <Sparkles className="h-6 w-6 mr-3 text-purple-500" />
            AI Task Assistant
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Enhance your productivity with AI-powered task management tools
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 px-8">
          {!isApiConfigured ? (
            <div className="space-y-6">
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-5 border border-amber-100 dark:border-amber-900/50">
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-amber-500" />
                  AI Features Not Available
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The AI features are not currently configured. Please contact your administrator to enable AI assistance.
                </p>

                {user?.id === "1" && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800/30">
                    <p className="text-sm font-medium mb-2">Administrator Notice</p>
                    <p className="text-sm text-muted-foreground">
                      As an administrator, you can configure the DeepSeek API key in the Admin Settings panel.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
                <p className="text-sm font-medium flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                  AI features are ready to use
                </p>
              </div>
              
              {/* AI Features Section */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Task Optimization */}
                <Card className="border border-purple-100 dark:border-purple-900/30 overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                    <CardTitle className="text-lg flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                      Task Optimization
                    </CardTitle>
                    <CardDescription>
                      Get AI suggestions to improve your tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      AI will analyze your tasks and provide optimization suggestions.
                    </p>
                    <Button 
                      onClick={handleGetAiSuggestions}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                    >
                      {loading ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                      ) : (
                        <>Generate Suggestions</>
                      )}
                    </Button>
                    
                    {aiSuggestions.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium">Suggestions:</h4>
                        <ul className="space-y-3">
                          {aiSuggestions.map((suggestion, index) => (
                            <li key={index} className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-sm flex items-start border border-purple-100 dark:border-purple-800/30">
                              <span className="bg-purple-100 dark:bg-purple-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 text-purple-700 dark:text-purple-200">
                                {index + 1}
                              </span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Subtask Generation */}
                <Card className="border border-blue-100 dark:border-blue-900/30 overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                    <CardTitle className="text-lg flex items-center">
                      <ListCheck className="h-4 w-4 mr-2 text-blue-500" />
                      Subtask Generation
                    </CardTitle>
                    <CardDescription>
                      Break down complex tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Break down complex tasks into smaller, manageable steps.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="task-select">Select a task</Label>
                        <Select value={selectedTask} onValueChange={setSelectedTask}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a task" />
                          </SelectTrigger>
                          <SelectContent>
                            {getIncompleteTasks().map(task => (
                              <SelectItem key={task.id} value={task.id}>
                                {task.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        onClick={handleGenerateSubtasks}
                        disabled={loading || !selectedTask}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        {loading ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                        ) : (
                          <>Generate Subtasks</>
                        )}
                      </Button>
                    </div>
                    
                    {subtasks.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium">Generated Subtasks:</h4>
                        <ul className="space-y-3">
                          {subtasks.map((subtask, index) => (
                            <li key={index} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm flex items-start border border-blue-100 dark:border-blue-800/30">
                              <span className="bg-blue-100 dark:bg-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 text-blue-700 dark:text-blue-200">
                                {index + 1}
                              </span>
                              {subtask}
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">
                          Create these as separate tasks in your task list.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Priority Suggestions */}
                <Card className="border border-amber-100 dark:border-amber-900/30 overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                    <CardTitle className="text-lg flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-amber-500" />
                      Priority Suggestions
                    </CardTitle>
                    <CardDescription>
                      Get optimal priority levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      AI will analyze your tasks and suggest optimal priority levels.
                    </p>
                    <Button 
                      onClick={handleGetPrioritySuggestions}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      {loading ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                      ) : (
                        <>Analyze Task Priorities</>
                      )}
                    </Button>
                    
                    {prioritySuggestions.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium">Priority Suggestions:</h4>
                        <ul className="space-y-3">
                          {prioritySuggestions.map((suggestion, index) => {
                            const task = getTaskById(suggestion.taskId);
                            if (!task) return null;
                            
                            const priorityColor = {
                              High: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-100 dark:border-red-900/50',
                              Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-100 dark:border-amber-900/50',
                              Low: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-100 dark:border-green-900/50'
                            };
                            
                            return (
                              <li key={index} className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-lg text-sm border border-amber-100 dark:border-amber-900/30">
                                <div className="font-medium mb-2">{task.title}</div>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                                      Current: {task.priority}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${priorityColor[suggestion.suggestedPriority]}`}>
                                      Suggested: {suggestion.suggestedPriority}
                                    </span>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-xs h-7 border-amber-200 dark:border-amber-800"
                                    onClick={() => handleApplyPriority(task.id, suggestion.suggestedPriority)}
                                  >
                                    Apply
                                  </Button>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/10 p-2 rounded border border-amber-100/50 dark:border-amber-900/20">{suggestion.reason}</p>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-xs text-gray-500 mt-6 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <p>Available models: {DEEPSEEK_MODELS.DEEPSEEK_CHAT}, {DEEPSEEK_MODELS.DEEPSEEK_CODER}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskAiAssistant;
