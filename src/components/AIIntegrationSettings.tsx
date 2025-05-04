
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const AIIntegrationSettings = () => {
  const { toast } = useToast();
  
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

  const handleRevokeApiKey = () => {
    localStorage.removeItem('admin-deepseek-api-key');
    setApiKey('');
    setSavedApiKey('');
    toast({
      title: "API Key Revoked",
      description: "DeepSeek API key has been removed from all users."
    });
  };
  
  return (
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
              className="font-mono"
            />
            {savedApiKey && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                API key is configured and available for all users
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveApiKey} className="w-full md:w-auto">
              Save API Key
            </Button>
            {savedApiKey && (
              <Button onClick={handleRevokeApiKey} variant="destructive" className="w-full md:w-auto">
                Revoke API Key
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIIntegrationSettings;
