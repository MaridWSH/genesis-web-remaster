
import React from 'react';
import TaskAiAssistant from '@/components/TaskAiAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles, Zap } from 'lucide-react';

const AiTaskAutomation: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-start space-x-4">
          <div className="bg-gradient-to-br from-purple-400 to-violet-600 p-3 rounded-xl shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Task Automation</h1>
            <p className="text-muted-foreground mt-2">
              Leverage advanced AI to automate repetitive tasks and enhance productivity
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="flex items-center text-xl">
              <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
              Task AI Features
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TaskAiAssistant />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 border-blue-200 dark:border-blue-800/40 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="rounded-full bg-blue-100 dark:bg-blue-800/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                AI learns your work patterns and automatically schedules tasks for optimal productivity.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 border-purple-200 dark:border-purple-800/40 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="rounded-full bg-purple-100 dark:bg-purple-800/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Content Generation</h3>
              <p className="text-sm text-muted-foreground">
                Generate task descriptions, summaries, and documentation with a single click.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 border-green-200 dark:border-green-800/40 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="rounded-full bg-green-100 dark:bg-green-800/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Insight Detection</h3>
              <p className="text-sm text-muted-foreground">
                Automatically identify patterns and insights from your completed tasks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiTaskAutomation;
