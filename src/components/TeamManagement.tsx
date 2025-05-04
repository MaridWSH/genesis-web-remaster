
import React, { useState } from 'react';
import { useTeams } from '@/context/TeamContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
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
  SelectValue 
} from '@/components/ui/select';
import { 
  Plus, 
  Users, 
  User, 
  Settings, 
  File, 
  Mail, 
  Shield, 
  X 
} from 'lucide-react';
import { toast } from 'sonner';

const TeamManagement = () => {
  const { teams, currentTeam, setCurrentTeam, createTeam, updateTeam, deleteTeam, inviteToTeam, updateMemberRole, removeMember, userHasPermission } = useTeams();
  const { user } = useAuth();
  
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  
  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }
    
    try {
      const team = await createTeam(newTeamName, newTeamDescription);
      setCurrentTeam(team);
      setCreateDialogOpen(false);
      setNewTeamName('');
      setNewTeamDescription('');
    } catch (error) {
      toast.error('Failed to create team');
    }
  };
  
  const handleInviteUser = async () => {
    if (!currentTeam) return;
    
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    try {
      await inviteToTeam(currentTeam.id, inviteEmail, inviteRole);
      setInviteDialogOpen(false);
      setInviteEmail('');
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };
  
  const handleUpdateRole = async (userId: string, role: 'admin' | 'editor' | 'viewer') => {
    if (!currentTeam) return;
    
    try {
      await updateMemberRole(currentTeam.id, userId, role);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };
  
  const handleRemoveMember = async (userId: string) => {
    if (!currentTeam) return;
    
    try {
      await removeMember(currentTeam.id, userId);
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };
  
  const handleDeleteTeam = async () => {
    if (!currentTeam) return;
    
    if (window.confirm(`Are you sure you want to delete "${currentTeam.name}"? This action cannot be undone.`)) {
      try {
        await deleteTeam(currentTeam.id);
      } catch (error) {
        toast.error('Failed to delete team');
      }
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getMemberInitials = (userId: string) => {
    if (user && userId === user.id) {
      return user.name.split(' ').map(n => n[0]).join('');
    }
    return 'U';
  };
  
  const getMemberName = (userId: string) => {
    if (user && userId === user.id) {
      return user.name + ' (You)';
    }
    return 'Team Member';
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Team Collaboration</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage teams to collaborate on tasks
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-1" /> Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input 
                    id="teamName" 
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g., Marketing Team"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamDescription">Description (Optional)</Label>
                  <Input 
                    id="teamDescription" 
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    placeholder="What does this team do?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTeam}>Create Team</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {teams.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="mb-4 flex justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Teams Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first team to start collaborating on tasks
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus size={16} className="mr-1" /> Create Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <Label htmlFor="selectTeam">Select Team</Label>
            <Select 
              value={currentTeam?.id} 
              onValueChange={(value) => {
                const team = teams.find(t => t.id === value);
                if (team) setCurrentTeam(team);
              }}
            >
              <SelectTrigger id="selectTeam" className="w-full md:w-[300px]">
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {currentTeam && (
            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="members">
                  <Users size={16} className="mr-1" /> Members
                </TabsTrigger>
                <TabsTrigger value="projects">
                  <File size={16} className="mr-1" /> Projects
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings size={16} className="mr-1" /> Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="members" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">Team Members</h2>
                  {userHasPermission(currentTeam.id, 'admin') && (
                    <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Mail size={16} className="mr-1" /> Invite
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invite Team Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email" 
                              type="email"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              placeholder="colleague@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select 
                              value={inviteRole} 
                              onValueChange={(value) => setInviteRole(value as 'editor' | 'viewer')}
                            >
                              <SelectTrigger id="role">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="editor">Editor (can edit tasks)</SelectItem>
                                <SelectItem value="viewer">Viewer (read-only)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleInviteUser}>
                            Send Invitation
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                
                <div className="space-y-3">
                  {currentTeam.members.map(member => (
                    <Card key={member.userId}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{getMemberInitials(member.userId)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{getMemberName(member.userId)}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className={getRoleColor(member.role)}>
                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                              </Badge>
                              {member.userId === currentTeam.createdBy && (
                                <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                  <Shield size={12} className="mr-1" /> Owner
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {userHasPermission(currentTeam.id, 'admin') && member.userId !== user?.id && (
                          <div className="flex items-center space-x-2">
                            <Select 
                              value={member.role} 
                              onValueChange={(value) => handleUpdateRole(member.userId, value as 'admin' | 'editor' | 'viewer')}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveMember(member.userId)}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                <h2 className="text-xl font-medium">Team Projects</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Projects feature coming soon...
                </p>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <h2 className="text-xl font-medium">Team Settings</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Team Information</CardTitle>
                    <CardDescription>Update your team's basic information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="updateTeamName">Team Name</Label>
                      <Input 
                        id="updateTeamName" 
                        value={currentTeam.name}
                        onChange={(e) => updateTeam(currentTeam.id, { name: e.target.value })}
                        disabled={!userHasPermission(currentTeam.id, 'admin')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="updateTeamDescription">Description</Label>
                      <Input 
                        id="updateTeamDescription" 
                        value={currentTeam.description || ''}
                        onChange={(e) => updateTeam(currentTeam.id, { description: e.target.value })}
                        disabled={!userHasPermission(currentTeam.id, 'admin')}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {userHasPermission(currentTeam.id, 'admin') && (
                  <Card className="border-red-200 dark:border-red-800">
                    <CardHeader>
                      <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                      <CardDescription>
                        Actions here cannot be undone
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteTeam}
                      >
                        Delete Team
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
};

export default TeamManagement;
