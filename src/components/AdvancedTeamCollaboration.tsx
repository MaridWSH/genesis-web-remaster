import React, { useState } from 'react';
import { useTeams } from '@/context/TeamContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Mail, MessageSquare, Users, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AdvancedTeamCollaboration: React.FC = () => {
  const { teams, currentTeam } = useTeams();
  const { user } = useAuth();
  
  const [chatMessage, setChatMessage] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestAccess, setGuestAccess] = useState('view');
  
  // Mock chat messages
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      sender: 'Alex Thompson', 
      content: 'Has anyone started on the Q2 feature planning yet?', 
      timestamp: '10:34 AM',
      avatar: 'AT'
    },
    { 
      id: '2', 
      sender: 'You', 
      content: 'I\'ll be working on that this afternoon.', 
      timestamp: '10:36 AM', 
      avatar: user?.name?.split(' ').map(n => n[0]).join('') || 'U',
      isCurrentUser: true
    },
    { 
      id: '3', 
      sender: 'Sarah Lee', 
      content: 'Great! I can help with the roadmap section if needed.', 
      timestamp: '10:40 AM',
      avatar: 'SL'
    },
  ]);
  
  // Mock pending approvals
  const pendingApprovals = [
    { 
      id: '1', 
      title: 'Website redesign proposal', 
      requestedBy: 'Alex Thompson',
      requestedAt: '2025-05-03T14:30:00Z'
    },
    { 
      id: '2', 
      title: 'Q2 Marketing budget increase', 
      requestedBy: 'Sarah Lee',
      requestedAt: '2025-05-04T09:15:00Z'
    }
  ];

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'You',
      content: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: user?.name?.split(' ').map(n => n[0]).join('') || 'U',
      isCurrentUser: true
    };
    
    setMessages([...messages, newMessage]);
    setChatMessage('');
  };
  
  const inviteGuest = () => {
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    toast.success(`Guest invitation sent to ${guestEmail}`);
    setGuestEmail('');
  };
  
  const approveRequest = (id: string) => {
    toast.success('Request approved');
  };
  
  const rejectRequest = (id: string) => {
    toast.success('Request rejected');
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Advanced Collaboration</h2>
        <p className="text-muted-foreground">
          Real-time communication and workflow management tools
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-1">
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Team Collaboration</CardTitle>
                  <CardDescription>
                    Work together in real-time
                  </CardDescription>
                </div>
              </div>
              {currentTeam && (
                <Badge 
                  className="bg-blue-100 hover:bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                >
                  {currentTeam.name}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="w-full rounded-none bg-muted/40 border-b justify-start p-0">
                <TabsTrigger 
                  value="chat"
                  className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3"
                >
                  <MessageSquare className="h-4 w-4 mr-2" /> Team Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="approvals"
                  className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3"
                >
                  <Check className="h-4 w-4 mr-2" /> Approvals
                </TabsTrigger>
                <TabsTrigger 
                  value="guests"
                  className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-3"
                >
                  <Mail className="h-4 w-4 mr-2" /> Guest Access
                </TabsTrigger>
              </TabsList>
              
              <div className="p-6">
                <TabsContent value="chat" className="mt-0 space-y-4">
                  {!currentTeam ? (
                    <div className="text-center py-10">
                      <div className="inline-flex rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-4">
                        <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Select a team to start chatting</h3>
                      <p className="text-muted-foreground">
                        Choose a team from the dropdown above to access the team chat
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="h-64 overflow-y-auto rounded-lg border bg-muted/10">
                        <div className="p-4 space-y-4">
                          {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                              {!msg.isCurrentUser && (
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback className="bg-primary/10 text-primary">{msg.avatar}</AvatarFallback>
                                </Avatar>
                              )}
                              <div className={`px-4 py-2 rounded-lg max-w-[80%] ${
                                msg.isCurrentUser 
                                  ? 'bg-primary text-white' 
                                  : 'bg-muted border border-border'
                              }`}>
                                {!msg.isCurrentUser && (
                                  <p className="text-xs font-bold mb-1">{msg.sender}</p>
                                )}
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
                              </div>
                              {msg.isCurrentUser && (
                                <Avatar className="h-8 w-8 ml-2">
                                  <AvatarFallback className="bg-white text-primary border border-primary/20">{msg.avatar}</AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <form onSubmit={sendMessage} className="flex gap-2">
                        <Input 
                          value={chatMessage} 
                          onChange={(e) => setChatMessage(e.target.value)} 
                          placeholder="Type your message..." 
                          className="flex-1"
                        />
                        <Button type="submit" size="sm">Send</Button>
                      </form>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="approvals" className="mt-0">
                  {pendingApprovals.length > 0 ? (
                    <div className="space-y-4">
                      {pendingApprovals.map(approval => (
                        <Card key={approval.id} className="overflow-hidden">
                          <div className="p-4 flex justify-between items-center border-l-4 border-amber-400">
                            <div className="flex items-start space-x-4">
                              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <h4 className="font-medium">{approval.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Requested by {approval.requestedBy} • {
                                    new Date(approval.requestedAt).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => rejectRequest(approval.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30"
                              >
                                <X className="h-4 w-4 mr-1" /> Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => approveRequest(approval.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="h-4 w-4 mr-1" /> Approve
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="inline-flex rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
                        <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No pending approvals</h3>
                      <p className="text-muted-foreground">
                        All items have been reviewed
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="guests" className="mt-0 space-y-4">
                  <Card className="bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-100 dark:border-green-900/50">
                    <CardContent className="p-4">
                      <p className="text-sm flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        Invite guests from outside your organization for limited collaboration access
                      </p>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="guest-email" className="text-sm font-medium">
                        Guest Email
                      </label>
                      <Input
                        id="guest-email"
                        type="email"
                        placeholder="colleague@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="max-w-md"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="guest-access" className="text-sm font-medium">
                        Access Level
                      </label>
                      <div className="max-w-md">
                        <Select value={guestAccess} onValueChange={setGuestAccess}>
                          <SelectTrigger id="guest-access">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">View Only</SelectItem>
                            <SelectItem value="comment">Can Comment</SelectItem>
                            <SelectItem value="edit">Can Edit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button onClick={inviteGuest} className="mt-2">
                      <Mail className="h-4 w-4 mr-2" /> Send Invitation
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
          
          <CardFooter className="bg-muted/20 text-xs text-muted-foreground justify-between py-3">
            <span>Active team members: {currentTeam?.members?.length || 0}</span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span> 
              End-to-end encrypted
            </span>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AdvancedTeamCollaboration;
