
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
import { Calendar, Brain, Zap, Loader2, ListCheck } from 'lucide-react';
import { 
  getTaskOptimization,
  getSmartScheduleSuggestions,
  getAutoPrioritySuggestions,
  generateSubtasks,
  DEEPSEEK_MODELS 
} from '@/utils/deepSeekApi';

const TaskAiAssistant: React.FC = () => {
  const { tasks, updateTask } = useTasks();
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [prioritySuggestions, setPrioritySuggestions] = useState<Array<{
    taskId: string;
    suggestedPriority: 'High' | 'Medium' | 'Low';
    reason: string;
  }>>([]);
  
  // Check for saved API key on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('deepseek-api-key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsConfigured(true);
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('deepseek-api-key', apiKey);
      setIsConfigured(true);
      toast.success("API key saved successfully");
    } else {
      toast.error("Please enter a valid API key");
    }
  };
  
  const handleClearApiKey = () => {
    localStorage.removeItem('deepseek-api-key');
    setApiKey('');
    setIsConfigured(false);
    toast.success("API key removed");
  };
  
  const getIncompleteTasks = () => {
    return tasks.filter(task => !task.completed && !task.archived);
  };
  
  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };
  
  const handleGetAiSuggestions = async () => {
    if (!isConfigured) {
      toast.error("Please configure your DeepSeek API key first");
      return;
    }
    
    setLoading(true);
    try {
      const incompleteTasks = getIncompleteTasks();
      const suggestions = await getTaskOptimization(incompleteTasks, apiKey);
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
    if (!isConfigured) {
      toast.error("Please configure your DeepSeek API key first");
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
      const generatedSubtasks = await generateSubtasks(task.title, task.notes, apiKey);
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
    if (!isConfigured) {
      toast.error("Please configure your DeepSeek API key first");
      return;
    }
    
    setLoading(true);
    try {
      const incompleteTasks = getIncompleteTasks();
      const suggestions = await getAutoPrioritySuggestions(incompleteTasks, apiKey);
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
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            AI Task Assistant
          </CardTitle>
          <CardDescription>
            Use AI to help optimize your tasks and workflow
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {!isConfigured ? (
            <div className="space-y-4">
              <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-3">
                <p className="text-sm">
                  To use AI features, you need to configure your DeepSeek API key. 
                  Your API key is stored locally in your browser and never shared.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">DeepSeek API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your DeepSeek API key"
                  />
                  <Button onClick={handleSaveApiKey}>Save</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm">API key configured</p>
                <Button variant="outline" size="sm" onClick={handleClearApiKey}>
                  Change API Key
                </Button>
              </div>
              
              <Separator />
              
              {/* General AI suggestions */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-blue-500" />
                  Get Task Optimization Tips
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI will analyze your tasks and provide general optimization suggestions.
                </p>
                <Button 
                  onClick={handleGetAiSuggestions}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</>
                  ) : (
                    <>Generate Suggestions</>
                  )}
                </Button>
                
                {aiSuggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Suggestions:</h4>
                    <ul className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="bg-muted p-3 rounded-md text-sm flex items-start">
                          <span className="bg-blue-100 dark:bg-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Subtask generation */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center">
                  <ListCheck className="h-4 w-4 mr-2 text-blue-500" />
                  Generate Subtasks
                </h3>
                <p className="text-sm text-muted-foreground">
                  Break down complex tasks into smaller, manageable steps.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="task-select">Select a task</Label>
                  <Select value={selectedTask} onValueChange={setSelectedTask}>
                    <SelectTrigger>
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
                  className="w-full"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <>Generate Subtasks</>
                  )}
                </Button>
                
                {subtasks.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Generated Subtasks:</h4>
                    <ul className="space-y-2">
                      {subtasks.map((subtask, index) => (
                        <li key={index} className="bg-muted p-3 rounded-md text-sm flex items-start">
                          <span className="bg-blue-100 dark:bg-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
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
              </div>
              
              <Separator />
              
              {/* Priority suggestions */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  Get Priority Suggestions
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI will analyze your tasks and suggest optimal priority levels.
                </p>
                <Button 
                  onClick={handleGetPrioritySuggestions}
                  disabled={loading}
                  className="w-full"
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
                          <li key={index} className="bg-muted p-3 rounded-md text-sm">
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
              </div>
              
              <div className="text-xs text-gray-500 mt-4">
                <p>Available models: {DEEPSEEK_MODELS.DEEPSEEK_CHAT}, {DEEPSEEK_MODELS.DEEPSEEK_CODER}</p>
                <p className="mt-1">Your API key is stored locally in your browser and is not sent to our servers.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskAiAssistant;
