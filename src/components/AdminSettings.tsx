
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const AdminSettings = () => {
  const { toast } = useToast();
  
  // Website settings state
  const [settings, setSettings] = useState({
    siteName: "TaskMaster",
    siteDescription: "The ultimate task management application",
    allowRegistration: true,
    requireEmailVerification: true,
    taskLimit: "100",
    teamLimit: "5",
    maintenanceMode: false
  });

  // DeepSeek API key state
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');

  // Load saved API key on mount
  useEffect(() => {
    const key = localStorage.getItem('admin-deepseek-api-key');
    if (key) {
      setSavedApiKey(key);
      setApiKey(key);
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setSettings({
      ...settings,
      [name]: checked
    });
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save the settings to your backend
    console.log("Saving settings:", settings);
    
    toast({
      title: "Settings Saved",
      description: "Your website settings have been updated successfully."
    });
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('admin-deepseek-api-key', apiKey);
      setSavedApiKey(apiKey);
      toast({
        title: "API Key Saved",
        description: "DeepSeek API key has been saved successfully for all users."
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">General Settings</CardTitle>
          <CardDescription>Configure your website's general settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("maintenanceMode", checked === true)
                }
              />
              <Label htmlFor="maintenanceMode" className="text-sm">
                Enable Maintenance Mode
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Integration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
            AI Integration
          </CardTitle>
          <CardDescription>Configure DeepSeek AI API for all users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="deepseek-api-key">DeepSeek API Key</Label>
              <Input
                id="deepseek-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter DeepSeek API key"
              />
              {savedApiKey && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  API key is configured and available for all users
                </p>
              )}
            </div>
            <Button onClick={handleSaveApiKey} className="w-full md:w-auto">
              Save API Key
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* User Registration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">User Settings</CardTitle>
          <CardDescription>Configure user registration and account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowRegistration"
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("allowRegistration", checked === true)
                }
              />
              <Label htmlFor="allowRegistration" className="text-sm">
                Allow New User Registration
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("requireEmailVerification", checked === true)
                }
              />
              <Label htmlFor="requireEmailVerification" className="text-sm">
                Require Email Verification
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Advanced Settings */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced-settings">
          <AccordionTrigger>
            <div className="text-left">
              <h3 className="text-lg font-medium">Advanced Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure advanced system settings
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="border-none shadow-none">
              <CardContent className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskLimit">Task Limit Per User</Label>
                    <Input
                      id="taskLimit"
                      name="taskLimit"
                      value={settings.taskLimit}
                      onChange={handleInputChange}
                      type="number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teamLimit">Team Limit Per User</Label>
                    <Input
                      id="teamLimit"
                      name="teamLimit"
                      value={settings.teamLimit}
                      onChange={handleInputChange}
                      type="number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <CardFooter className="flex justify-end border-t p-6">
        <Button variant="outline" className="mr-2">Reset to Defaults</Button>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </CardFooter>
    </div>
  );
};

export default AdminSettings;
