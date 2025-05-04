
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
import { Calendar, Gauge, Bell, Brain, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getTaskOptimization, DEEPSEEK_MODELS } from '@/utils/deepSeekApi';

const AiTaskAutomation: React.FC = () => {
  const { tasks } = useTasks();
  const [activeFeatures, setActiveFeatures] = useState({
    smartScheduling: true,
    predictiveReminders: false,
    autoCategories: true,
    deepSeekIntegration: false,
  });
  const [apiKey, setApiKey] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Schedule 'Research new technologies' during your most productive hours (9-11am)",
    "Break down 'Plan sprint tasks' into smaller sub-tasks for better management",
    "Consider delegating 'Refactor legacy code' to team members with more availability",
  ]);

  // Saved key from local storage
  useEffect(() => {
    const savedKey = localStorage.getItem('deepseek-api-key');
    if (savedKey) {
      setApiKey(savedKey);
      setActiveFeatures(prev => ({ ...prev, deepSeekIntegration: true }));
    }
  }, []);

  const toggleFeature = (feature: keyof typeof activeFeatures) => {
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

  const handleAutomaticScheduling = () => {
    toast.success("Tasks have been automatically scheduled based on priority and deadlines");
  };
  
  const handleGenerateReminders = () => {
    toast.success("Predictive reminders have been set for upcoming tasks");
  };

  const handleGetAiSuggestions = async () => {
    if (!activeFeatures.deepSeekIntegration) {
      toast.error("Please enable DeepSeek integration first");
      return;
    }
    
    setLoadingAi(true);
    try {
      // Filter for incomplete tasks
      const incompleteTasks = tasks.filter(task => !task.completed && !task.archived);
      
      // Get AI suggestions using DeepSeek API
      const suggestions = await getTaskOptimization(incompleteTasks, apiKey);
      setAiSuggestions(suggestions);
      toast.success("AI suggestions updated using DeepSeek");
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast.error("Failed to get AI suggestions");
    } finally {
      setLoadingAi(false);
    }
  };
  
  // Calculate upcoming deadlines
  const upcomingDeadlines = tasks
    .filter(task => !task.completed && !task.archived)
    .slice(0, 3);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Gauge className="h-5 w-5 mr-2 text-primary" />
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
        <Tabs defaultValue="scheduling" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="scheduling">
              <Calendar className="h-4 w-4 mr-1" /> Smart Scheduling
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Bell className="h-4 w-4 mr-1" /> Predictive Reminders
            </TabsTrigger>
            <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
            <TabsTrigger value="deepseek">
              <Brain className="h-4 w-4 mr-1" /> DeepSeek
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scheduling" className="space-y-4">
            <div className="flex items-center space-x-2 pb-4">
              <Switch 
                id="smart-scheduling" 
                checked={activeFeatures.smartScheduling}
                onCheckedChange={() => toggleFeature('smartScheduling')}
              />
              <Label htmlFor="smart-scheduling">Enable Smart Scheduling</Label>
            </div>
            
            <div className="space-y-2 text-sm">
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
            
            <Button 
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={handleAutomaticScheduling}
              disabled={!activeFeatures.smartScheduling}
            >
              Auto-Schedule Tasks
            </Button>
          </TabsContent>
          
          <TabsContent value="reminders" className="space-y-4">
            <div className="flex items-center space-x-2 pb-4">
              <Switch 
                id="predictive-reminders" 
                checked={activeFeatures.predictiveReminders}
                onCheckedChange={() => toggleFeature('predictiveReminders')}
              />
              <Label htmlFor="predictive-reminders">Enable Predictive Reminders</Label>
            </div>
            
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-3 mb-3">
              <p className="text-sm">
                Our AI analyzes your task completion patterns and sends reminders 
                based on when you're most likely to complete tasks.
              </p>
            </div>
            
            <Button 
              variant="secondary"
              size="sm" 
              className="w-full"
              onClick={handleGenerateReminders}
              disabled={!activeFeatures.predictiveReminders}
            >
              Generate Smart Reminders
            </Button>
          </TabsContent>
          
          <TabsContent value="suggestions" className="space-y-4">
            <div className="flex items-center space-x-2 pb-4">
              <Switch 
                id="auto-categories" 
                checked={activeFeatures.autoCategories}
                onCheckedChange={() => toggleFeature('autoCategories')}
              />
              <Label htmlFor="auto-categories">Enable Auto-Categorization</Label>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">AI Suggestions Based on Your Tasks</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGetAiSuggestions}
                  disabled={loadingAi || !activeFeatures.deepSeekIntegration}
                >
                  {loadingAi ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Brain className="h-4 w-4 mr-1" />}
                  Refresh
                </Button>
              </div>
              
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
            </div>
          </TabsContent>
          
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
