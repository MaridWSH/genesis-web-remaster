
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AiNotConfigured = () => {
  const { user } = useAuth();
  const isAdmin = user?.id === "1"; // Simple admin check, in a real app this would check roles

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
          AI Features Not Available
        </CardTitle>
        <CardDescription>
          The AI features require configuration by an administrator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTitle>DeepSeek API Key Not Configured</AlertTitle>
          <AlertDescription>
            An administrator needs to set up the DeepSeek API key in the admin settings before AI features can be used.
          </AlertDescription>
        </Alert>
        
        {isAdmin ? (
          <div className="text-center">
            <p className="mb-4 text-sm">As an administrator, you can configure the API key now:</p>
            <Button asChild>
              <Link to="/admin">Go to Admin Settings</Link>
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Please contact your administrator to enable the AI features.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AiNotConfigured;
