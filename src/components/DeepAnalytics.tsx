
import React, { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileChartLine } from 'lucide-react';

const DeepAnalytics: React.FC = () => {
  const { tasks } = useTasks();
  const [timeRange, setTimeRange] = useState('week');
  
  // Mock time tracking data
  const timeTrackingData = [
    { day: 'Mon', hours: 5.2 },
    { day: 'Tue', hours: 6.8 },
    { day: 'Wed', hours: 4.5 },
    { day: 'Thu', hours: 7.3 },
    { day: 'Fri', hours: 5.9 },
    { day: 'Sat', hours: 2.1 },
    { day: 'Sun', hours: 0.5 },
  ];
  
  // Mock productivity score data
  const productivityData = [
    { date: 'Apr 28', score: 68 },
    { date: 'Apr 29', score: 72 },
    { date: 'Apr 30', score: 75 },
    { date: 'May 1', score: 82 },
    { date: 'May 2', score: 85 },
    { date: 'May 3', score: 79 },
    { date: 'May 4', score: 81 },
  ];
  
  // Calculate task categories for pie chart
  const categoryData = Object.entries(
    tasks.reduce((acc: Record<string, number>, task) => {
      const category = task.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Mock workload heatmap data for team members
  const workloadData = [
    { name: 'You', Mon: 80, Tue: 65, Wed: 90, Thu: 45, Fri: 60 },
    { name: 'Alex', Mon: 55, Tue: 75, Wed: 40, Thu: 80, Fri: 85 },
    { name: 'Sarah', Mon: 70, Tue: 35, Wed: 60, Thu: 90, Fri: 25 },
  ];
  
  const formatWorkloadCell = (value: number) => {
    if (value < 40) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
    if (value < 70) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300';
    return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FileChartLine className="h-5 w-5 mr-2 text-primary" />
              Deep Analytics & Productivity Insights
            </CardTitle>
            <CardDescription>
              Visualize performance data and optimize productivity
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="time" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="time">Time Tracking</TabsTrigger>
            <TabsTrigger value="tasks">Task Distribution</TabsTrigger>
            <TabsTrigger value="workload">Team Workload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="time" className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">Hours Worked</h4>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Total: {timeTrackingData.reduce((acc, day) => acc + day.hours, 0).toFixed(1)}h
                </Badge>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeTrackingData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} hours`, 'Time']} />
                    <Bar dataKey="hours" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Productivity Score</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productivityData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#82ca9d" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-right text-gray-500">Productivity trending upward</p>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Tasks by Category</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} tasks`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Completion Rate by Priority</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { priority: 'High', completed: 65, total: 100 },
                        { priority: 'Medium', completed: 82, total: 100 },
                        { priority: 'Low', completed: 93, total: 100 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="priority" />
                      <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                      <Bar dataKey="completed" fill="#8884d8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Task Velocity</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average task completion time: <span className="font-medium">2.3 days</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fastest category: <span className="font-medium">Personal (1.4 days)</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Slowest category: <span className="font-medium">Work (3.7 days)</span>
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="workload" className="space-y-4">
            <h4 className="text-sm font-medium">Team Workload Heatmap</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left font-medium px-2 py-1">Member</th>
                    <th className="font-medium px-2 py-1">Mon</th>
                    <th className="font-medium px-2 py-1">Tue</th>
                    <th className="font-medium px-2 py-1">Wed</th>
                    <th className="font-medium px-2 py-1">Thu</th>
                    <th className="font-medium px-2 py-1">Fri</th>
                  </tr>
                </thead>
                <tbody>
                  {workloadData.map((row, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1 font-medium">{row.name}</td>
                      <td className={`px-2 py-1 text-center rounded ${formatWorkloadCell(row.Mon)}`}>{row.Mon}%</td>
                      <td className={`px-2 py-1 text-center rounded ${formatWorkloadCell(row.Tue)}`}>{row.Tue}%</td>
                      <td className={`px-2 py-1 text-center rounded ${formatWorkloadCell(row.Wed)}`}>{row.Wed}%</td>
                      <td className={`px-2 py-1 text-center rounded ${formatWorkloadCell(row.Thu)}`}>{row.Thu}%</td>
                      <td className={`px-2 py-1 text-center rounded ${formatWorkloadCell(row.Fri)}`}>{row.Fri}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 rounded-md bg-gray-50 dark:bg-gray-900 p-3">
              <h4 className="text-sm font-medium mb-1">Insights</h4>
              <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Your workload peaks on Wednesday (90%)</li>
                <li>• Team average workload: 67%</li>
                <li>• Consider redistributing tasks from Wednesday to Thursday</li>
                <li>• Sarah has high variance in workload distribution</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 flex justify-end">
        Updated 5 minutes ago
      </CardFooter>
    </Card>
  );
};

export default DeepAnalytics;
