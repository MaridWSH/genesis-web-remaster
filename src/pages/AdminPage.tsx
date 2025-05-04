
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUsers from '@/components/AdminUsers';
import AdminSettings from '@/components/AdminSettings';
import AdminAnalytics from '@/components/AdminAnalytics';
import { Shield, Users, Settings, Activity } from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  
  // Admin access check - for demo purposes, only user with id "1" is admin
  // In a real application, this would check a proper admin role
  const isAdmin = user?.id === "1";
  
  if (!isAdmin) {
    return <Navigate to="/tasks" replace />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-6">
            <AdminUsers />
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <AdminAnalytics />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
