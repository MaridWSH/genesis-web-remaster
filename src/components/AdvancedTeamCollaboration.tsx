
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
import { Mail, MessageSquare, Users } from 'lucide-react';
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
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Advanced Team Collaboration
            </CardTitle>
            <CardDescription>
              Real-time communication and workflow management
            </CardDescription>
          </div>
          {currentTeam && (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {currentTeam.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-1" /> Team Chat
            </TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="guests">Guest Access</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4">
            {!currentTeam ? (
              <div className="text-center p-4">
                <p className="text-sm text-gray-500">Select a team to view chat</p>
              </div>
            ) : (
              <>
                <div className="h-64 overflow-y-auto border rounded-md p-2 mb-3 bg-gray-50 dark:bg-gray-900">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex mb-2 ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      {!msg.isCurrentUser && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{msg.avatar}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`px-3 py-2 rounded-lg max-w-[80%] ${msg.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-gray-200 dark:bg-gray-800'}`}>
                        {!msg.isCurrentUser && (
                          <p className="text-xs font-bold">{msg.sender}</p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
                      </div>
                      {msg.isCurrentUser && (
                        <Avatar className="h-8 w-8 ml-2">
                          <AvatarFallback>{msg.avatar}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
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
          
          <TabsContent value="approvals" className="space-y-4">
            {pendingApprovals.length > 0 ? (
              <div className="space-y-3">
                {pendingApprovals.map(approval => (
                  <div key={approval.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{approval.title}</h4>
                        <p className="text-xs text-gray-500">
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectRequest(approval.id)}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => approveRequest(approval.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-sm text-gray-500">No pending approvals</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="guests" className="space-y-4">
            <div className="rounded-md bg-green-50 dark:bg-green-950/30 p-3 mb-3">
              <p className="text-sm">
                Invite guests from outside your organization for limited collaboration access.
              </p>
            </div>
            
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
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="guest-access" className="text-sm font-medium">
                  Access Level
                </label>
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
              
              <Button onClick={inviteGuest} className="w-full">
                <Mail className="h-4 w-4 mr-2" /> Send Invitation
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 justify-between">
        <span>Active team members: {currentTeam?.members?.length || 0}</span>
        <span>End-to-end encrypted</span>
      </CardFooter>
    </Card>
  );
};

export default AdvancedTeamCollaboration;
