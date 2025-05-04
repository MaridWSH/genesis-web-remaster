
import React from 'react';
import { useTasks } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isToday, isThisWeek, isPast } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TaskStatistics = () => {
  const { tasks } = useTasks();
  
  // Filter out archived tasks
  const activeTasks = tasks.filter(task => !task.archived);
  
  // Calculate statistics
  const totalTasks = activeTasks.length;
  const completedTasks = activeTasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const overdueTasks = activeTasks.filter(task => 
    isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed
  ).length;
  
  const todayTasks = activeTasks.filter(task => 
    isToday(new Date(task.dueDate))
  ).length;
  
  const thisWeekTasks = activeTasks.filter(task => 
    isThisWeek(new Date(task.dueDate), { weekStartsOn: 1 })
  ).length;
  
  // Data for pie chart
  const pieData = [
    { name: 'Completed', value: completedTasks, color: '#4ade80' },
    { name: 'Remaining', value: totalTasks - completedTasks, color: '#94a3b8' },
  ];
  
  // Data for priority distribution
  const priorityData = [
    { name: 'High', value: activeTasks.filter(task => task.priority === 'High').length },
    { name: 'Medium', value: activeTasks.filter(task => task.priority === 'Medium').length },
    { name: 'Low', value: activeTasks.filter(task => task.priority === 'Low').length },
  ];
  
  // Data for category distribution
  const categoryData = Object.entries(
    activeTasks.reduce((acc: Record<string, number>, task) => {
      const category = task.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Tasks Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{completionRate}%</p>
                <p className="text-xs text-gray-500">
                  {completedTasks} of {totalTasks} tasks completed
                </p>
              </div>
              <div className="h-16 w-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={15}
                      outerRadius={30}
                      strokeWidth={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Tasks Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Overdue</span>
                <span className={overdueTasks > 0 ? "text-red-500 font-medium" : ""}>
                  {overdueTasks}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Due Today</span>
                <span className="font-medium">{todayTasks}</span>
              </div>
              <div className="flex justify-between">
                <span>This Week</span>
                <span>{thisWeekTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  width={50}
                />
                <Tooltip 
                  formatter={(value) => [`${value} tasks`, 'Count']}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8"
                  barSize={15}
                  radius={[0, 4, 4, 0]}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#f97316" />
                  <Cell fill="#3b82f6" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No category data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStatistics;
