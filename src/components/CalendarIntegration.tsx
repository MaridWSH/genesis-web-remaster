
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CalendarIntegration = () => {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [appleConnected, setAppleConnected] = useState(false);
  
  const [syncFrequency, setSyncFrequency] = useState("30");
  const [autoSync, setAutoSync] = useState(true);
  const [exportCompleted, setExportCompleted] = useState(true);
  const [importEvents, setImportEvents] = useState(true);
  
  const [lastSync, setLastSync] = useState<string | null>(null);
  
  const handleGoogleConnect = () => {
    // In a real app, this would redirect to the OAuth flow
    setTimeout(() => {
      setGoogleConnected(true);
      setLastSync(new Date().toISOString());
      toast.success('Google Calendar connected successfully');
    }, 1000);
  };
  
  const handleOutlookConnect = () => {
    // In a real app, this would redirect to the OAuth flow
    setTimeout(() => {
      setOutlookConnected(true);
      setLastSync(new Date().toISOString());
      toast.success('Outlook Calendar connected successfully');
    }, 1000);
  };
  
  const handleAppleConnect = () => {
    // In a real app, this would redirect to the OAuth flow
    setTimeout(() => {
      setAppleConnected(true);
      setLastSync(new Date().toISOString());
      toast.success('Apple Calendar connected successfully');
    }, 1000);
  };
  
  const handleDisconnect = (calendarType: 'google' | 'outlook' | 'apple') => {
    if (calendarType === 'google') {
      setGoogleConnected(false);
    } else if (calendarType === 'outlook') {
      setOutlookConnected(false);
    } else if (calendarType === 'apple') {
      setAppleConnected(false);
    }
    
    toast.success(`${calendarType.charAt(0).toUpperCase() + calendarType.slice(1)} Calendar disconnected`);
  };
  
  const handleManualSync = () => {
    // In a real app, this would trigger a sync with the calendar provider
    toast.success('Syncing calendars...');
    
    setTimeout(() => {
      setLastSync(new Date().toISOString());
      toast.success('Calendars synced successfully');
    }, 1500);
  };
  
  const formatLastSync = () => {
    if (!lastSync) return 'Never';
    
    const date = new Date(lastSync);
    return date.toLocaleString();
  };
  
  const isAnyCalendarConnected = googleConnected || outlookConnected || appleConnected;
  
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Calendar Integration</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect and sync your tasks with external calendars
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Connect Calendars</CardTitle>
          <CardDescription>
            Link your external calendars to sync tasks and events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-medium">Google Calendar</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {googleConnected 
                    ? 'Connected' 
                    : 'Sync your Google Calendar with TaskMaster'}
                </p>
              </div>
            </div>
            {googleConnected ? (
              <Button 
                variant="outline" 
                onClick={() => handleDisconnect('google')}
              >
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleGoogleConnect}>
                Connect
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">Outlook Calendar</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {outlookConnected 
                    ? 'Connected' 
                    : 'Sync your Outlook Calendar with TaskMaster'}
                </p>
              </div>
            </div>
            {outlookConnected ? (
              <Button 
                variant="outline" 
                onClick={() => handleDisconnect('outlook')}
              >
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleOutlookConnect}>
                Connect
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium">Apple Calendar</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {appleConnected 
                    ? 'Connected' 
                    : 'Sync your Apple Calendar with TaskMaster'}
                </p>
              </div>
            </div>
            {appleConnected ? (
              <Button 
                variant="outline" 
                onClick={() => handleDisconnect('apple')}
              >
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleAppleConnect}>
                Connect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
          <CardDescription>
            Configure how your calendars sync with TaskMaster
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-3">
            <Label htmlFor="syncFrequency">Sync Frequency</Label>
            <Select
              value={syncFrequency}
              onValueChange={setSyncFrequency}
              disabled={!isAnyCalendarConnected}
            >
              <SelectTrigger id="syncFrequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every hour</SelectItem>
                <SelectItem value="daily">Once daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Automatic Sync</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically sync according to frequency
                </p>
              </div>
              <Switch 
                checked={autoSync} 
                onCheckedChange={setAutoSync} 
                disabled={!isAnyCalendarConnected}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Completed Tasks</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Include completed tasks in calendar
                </p>
              </div>
              <Switch 
                checked={exportCompleted} 
                onCheckedChange={setExportCompleted} 
                disabled={!isAnyCalendarConnected}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Import Calendar Events</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Import events from calendars as tasks
                </p>
              </div>
              <Switch 
                checked={importEvents} 
                onCheckedChange={setImportEvents} 
                disabled={!isAnyCalendarConnected}
              />
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Last synced: {formatLastSync()}
            </p>
            <Button 
              onClick={handleManualSync} 
              disabled={!isAnyCalendarConnected}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Calendar Export</CardTitle>
          <CardDescription>
            Share your TaskMaster calendar with other services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Use this URL to subscribe to your TaskMaster calendar in other apps
            </p>
            <div className="flex space-x-2">
              <Input
                value="https://taskmaster.app/calendar/user-12345/ical"
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText("https://taskmaster.app/calendar/user-12345/ical");
                  toast.success('Calendar URL copied to clipboard');
                }}
              >
                Copy
              </Button>
            </div>
          </div>
          
          <div className="pt-2">
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Download iCal File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarIntegration;
