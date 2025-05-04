
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ChartBar, Activity, TrendingUp } from 'lucide-react';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Mock data for user registrations
  const registrationData = [
    { date: 'Apr 28', count: 3 },
    { date: 'Apr 29', count: 5 },
    { date: 'Apr 30', count: 2 },
    { date: 'May 01', count: 7 },
    { date: 'May 02', count: 4 },
    { date: 'May 03', count: 6 },
    { date: 'May 04', count: 8 }
  ];

  // Mock data for system usage
  const systemUsageData = [
    { name: 'Tasks Created', value: 245 },
    { name: 'Tasks Completed', value: 178 },
    { name: 'Comments Added', value: 86 },
    { name: 'AI Features Used', value: 124 }
  ];

  // Mock data for active users
  const activeUserData = [
    { date: 'Apr 28', count: 12 },
    { date: 'Apr 29', count: 15 },
    { date: 'Apr 30', count: 10 },
    { date: 'May 01', count: 18 },
    { date: 'May 02', count: 20 },
    { date: 'May 03', count: 22 },
    { date: 'May 04', count: 25 }
  ];

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Admin Analytics</CardTitle>
            <CardDescription>Track user engagement and system metrics</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Total Users</span>
                  <Badge className="bg-blue-500">+12%</Badge>
                </div>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground mt-1">5 new this week</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Active Users</span>
                  <Badge className="bg-green-500">+8%</Badge>
                </div>
                <div className="text-2xl font-bold">85</div>
                <p className="text-xs text-muted-foreground mt-1">66% of total users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Tasks Created</span>
                  <Badge className="bg-amber-500">+15%</Badge>
                </div>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground mt-1">32 new this week</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">AI Usage</span>
                  <Badge className="bg-purple-500">+24%</Badge>
                </div>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground mt-1">AI features most popular</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="users">User Activity</TabsTrigger>
            <TabsTrigger value="system">System Usage</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* User Activity Tab */}
          <TabsContent value="users" className="mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">New User Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={registrationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip formatter={(value) => [`${value} users`, 'New Registrations']} />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activeUserData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip formatter={(value) => [`${value} users`, 'Active Users']} />
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Usage Tab */}
          <TabsContent value="system" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={systemUsageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {systemUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} operations`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Feature Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Task Auto', count: 42 },
                          { name: 'Priority Suggest', count: 28 },
                          { name: 'Subtask Gen', count: 35 },
                          { name: 'Analytics', count: 19 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip formatter={(value) => [`${value} uses`, 'Usage Count']} />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: 'Apr 28', tasks: 25, ai: 12, users: 12 },
                        { date: 'Apr 29', tasks: 30, ai: 15, users: 15 },
                        { date: 'Apr 30', tasks: 28, ai: 14, users: 10 },
                        { date: 'May 01', tasks: 35, ai: 18, users: 18 },
                        { date: 'May 02', tasks: 32, ai: 20, users: 20 },
                        { date: 'May 03', tasks: 40, ai: 22, users: 22 },
                        { date: 'May 04', tasks: 42, ai: 25, users: 25 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="tasks" name="Tasks" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="ai" name="AI Usage" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="users" name="Active Users" stroke="#ffc658" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t p-4 text-xs text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </CardFooter>
    </Card>
  );
};

export default AdminAnalytics;
