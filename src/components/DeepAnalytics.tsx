
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
import { BarChart as BarChartIcon, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

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
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-600 shadow-lg">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          <p className="text-muted-foreground">
            Data-driven insights to optimize team productivity
          </p>
        </div>
      </div>
      
      <Card className="shadow-lg overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                <BarChartIcon className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Performance Analytics
              </CardTitle>
              <CardDescription className="mt-1">
                Visualize data and optimize productivity
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[130px] h-8 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
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
            <TabsList className="grid grid-cols-3 mb-4 bg-slate-100 dark:bg-slate-800/80">
              <TabsTrigger 
                value="time" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
              >
                Time Tracking
              </TabsTrigger>
              <TabsTrigger 
                value="tasks"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
              >
                Task Distribution
              </TabsTrigger>
              <TabsTrigger 
                value="workload"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
              >
                Team Workload
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="time" className="space-y-6 pt-2">
              <div className="rounded-xl bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between mb-4">
                  <h4 className="text-lg font-medium flex items-center">
                    <BarChartIcon className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                    Hours Worked
                  </h4>
                  <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 dark:from-purple-900/40 dark:to-indigo-900/40 dark:text-purple-200 border-purple-200 dark:border-purple-800/50">
                    Total: {timeTrackingData.reduce((acc, day) => acc + day.hours, 0).toFixed(1)}h
                  </Badge>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeTrackingData} margin={{ top: 0, right: 0, left: 0, bottom: 5 }}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value) => [`${value} hours`, 'Time']} 
                        contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "8px", border: "1px solid #e2e8f0" }} 
                      />
                      <Bar 
                        dataKey="hours" 
                        radius={[4, 4, 0, 0]} 
                        fill="url(#purpleGradient)" 
                      />
                      <defs>
                        <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.5}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="rounded-xl bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="text-lg font-medium flex items-center mb-4">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                  Productivity Score
                </h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={productivityData} margin={{ top: 0, right: 0, left: 0, bottom: 5 }}>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Score']} 
                        contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "8px", border: "1px solid #e2e8f0" }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ r: 4, stroke: "#10b981", fill: "white", strokeWidth: 2 }} 
                      />
                      <defs>
                        <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.5}/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-right text-gray-500 pt-2">Productivity trending upward +6% this week</p>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="text-lg font-medium flex items-center mb-4">
                    <PieChartIcon className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Tasks by Category
                  </h4>
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
                        <Tooltip 
                          formatter={(value, name) => [`${value} tasks`, name]} 
                          contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "8px", border: "1px solid #e2e8f0" }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="rounded-xl bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="text-lg font-medium flex items-center mb-4">
                    <BarChartIcon className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Completion Rate by Priority
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={[
                          { priority: 'High', completed: 65, total: 100 },
                          { priority: 'Medium', completed: 82, total: 100 },
                          { priority: 'Low', completed: 93, total: 100 },
                        ]}
                        margin={{ top: 20, right: 5, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="priority" axisLine={false} tickLine={false} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                        <Bar 
                          dataKey="completed" 
                          radius={[0, 4, 4, 0]}
                        >
                          {[
                            <Cell key="high" fill="#ef4444" />,
                            <Cell key="medium" fill="#f59e0b" />,
                            <Cell key="low" fill="#10b981" />
                          ]}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/10 p-6 border border-slate-200 dark:border-slate-700 shadow-sm col-span-1 md:col-span-2">
                  <h4 className="text-lg font-medium flex items-center mb-4">Task Velocity</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                      <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Average completion</h5>
                      <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">2.3 days</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                      <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fastest category</h5>
                      <p className="text-2xl font-semibold text-green-600 dark:text-green-400">1.4 days</p>
                      <span className="text-xs text-gray-500">(Personal tasks)</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                      <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Slowest category</h5>
                      <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">3.7 days</p>
                      <span className="text-xs text-gray-500">(Work tasks)</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="workload" className="pt-2">
              <div className="rounded-xl bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="text-lg font-medium mb-4">Team Workload Heatmap</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left font-medium px-3 py-2 border-b border-slate-200 dark:border-slate-700">Member</th>
                        <th className="font-medium px-3 py-2 border-b border-slate-200 dark:border-slate-700">Mon</th>
                        <th className="font-medium px-3 py-2 border-b border-slate-200 dark:border-slate-700">Tue</th>
                        <th className="font-medium px-3 py-2 border-b border-slate-200 dark:border-slate-700">Wed</th>
                        <th className="font-medium px-3 py-2 border-b border-slate-200 dark:border-slate-700">Thu</th>
                        <th className="font-medium px-3 py-2 border-b border-slate-200 dark:border-slate-700">Fri</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workloadData.map((row, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 font-medium border-b border-slate-200 dark:border-slate-700">{row.name}</td>
                          <td className={`px-3 py-2 text-center rounded-md m-1 ${formatWorkloadCell(row.Mon)}`}>{row.Mon}%</td>
                          <td className={`px-3 py-2 text-center rounded-md m-1 ${formatWorkloadCell(row.Tue)}`}>{row.Tue}%</td>
                          <td className={`px-3 py-2 text-center rounded-md m-1 ${formatWorkloadCell(row.Wed)}`}>{row.Wed}%</td>
                          <td className={`px-3 py-2 text-center rounded-md m-1 ${formatWorkloadCell(row.Thu)}`}>{row.Thu}%</td>
                          <td className={`px-3 py-2 text-center rounded-md m-1 ${formatWorkloadCell(row.Fri)}`}>{row.Fri}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-6 rounded-xl bg-gradient-to-r from-slate-50 to-purple-50/30 dark:from-slate-800 dark:to-purple-900/10 p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="text-lg font-medium mb-3">Insights</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="bg-white dark:bg-slate-800/80 px-4 py-3 rounded-lg text-sm flex items-center space-x-2 border border-slate-100 dark:border-slate-700">
                    <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                    <span>Your workload peaks on Wednesday (90%)</span>
                  </li>
                  <li className="bg-white dark:bg-slate-800/80 px-4 py-3 rounded-lg text-sm flex items-center space-x-2 border border-slate-100 dark:border-slate-700">
                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    <span>Team average workload: 67%</span>
                  </li>
                  <li className="bg-white dark:bg-slate-800/80 px-4 py-3 rounded-lg text-sm flex items-center space-x-2 border border-slate-100 dark:border-slate-700">
                    <span className="h-2 w-2 bg-amber-500 rounded-full"></span>
                    <span>Consider redistributing tasks from Wednesday to Thursday</span>
                  </li>
                  <li className="bg-white dark:bg-slate-800/80 px-4 py-3 rounded-lg text-sm flex items-center space-x-2 border border-slate-100 dark:border-slate-700">
                    <span className="h-2 w-2 bg-purple-500 rounded-full"></span>
                    <span>Sarah has high variance in workload distribution</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="bg-slate-50 dark:bg-slate-800/80 text-xs text-gray-500 flex justify-end border-t border-slate-200 dark:border-slate-700/50 py-3">
          Last updated: {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeepAnalytics;
