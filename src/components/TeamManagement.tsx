
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
  X,
  UserPlus,
  Check
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
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700';
    }
  };
  
  const getMemberInitials = (userId: string) => {
    if (user && userId === user.id) {
      // Make sure user.name exists and is a string before calling split
      return user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U';
    }
    return 'U'; // Default fallback
  };
  
  const getMemberName = (userId: string) => {
    if (user && userId === user.id) {
      return (user.name || 'You') + ' (You)';
    }
    return 'Team Member';
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Team Management</h2>
          <p className="text-muted-foreground">
            Create and manage teams to collaborate on tasks
          </p>
        </div>
        <div className="flex mt-4 md:mt-0">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus size={16} /> Create Team
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
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
        <Card className="border border-dashed bg-muted/20">
          <CardContent className="pt-10 pb-10 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">No Teams Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first team to start collaborating on tasks with your colleagues
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus size={16} className="mr-1" /> Create Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="bg-gradient-to-b from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6">
            <Label htmlFor="selectTeam" className="text-sm font-medium mb-2 block">Select Active Team</Label>
            <Select 
              value={currentTeam?.id} 
              onValueChange={(value) => {
                const team = teams.find(t => t.id === value);
                if (team) setCurrentTeam(team);
              }}
            >
              <SelectTrigger id="selectTeam" className="w-full md:w-[300px] bg-background">
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.id} className="flex items-center gap-2">
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {currentTeam && (
            <Card className="overflow-hidden border-border/80">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-muted/30 border-b border-border/50 gap-0">
                <Tabs defaultValue="members" className="w-full">
                  <TabsList className="bg-white/20 dark:bg-black/20 backdrop-blur">
                    <TabsTrigger value="members" className="data-[state=active]:bg-background">
                      <Users size={14} className="mr-1" /> Members
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="data-[state=active]:bg-background">
                      <File size={14} className="mr-1" /> Projects
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-background">
                      <Settings size={14} className="mr-1" /> Settings
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="pt-6 px-2">
                    <TabsContent value="members" className="mt-0">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Team Members</h3>
                        {userHasPermission(currentTeam.id, 'admin') && (
                          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:text-primary hover:bg-primary/10">
                                <UserPlus size={14} className="mr-1" /> Invite
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
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
                    </TabsContent>
                  </div>
                </Tabs>
              </CardHeader>
              
              <CardContent className="p-0">
                <TabsContent value="members" className="mt-0">
                  <div className="divide-y divide-border">
                    {currentTeam.members.map(member => (
                      <div key={member.userId} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Avatar className="border-2 border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getMemberInitials(member.userId)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{getMemberName(member.userId)}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className={`${getRoleColor(member.role)} border`}>
                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                              </Badge>
                              {member.userId === currentTeam.createdBy && (
                                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
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
                              <SelectTrigger className="w-[120px] h-8">
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
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="projects" className="p-6 text-center">
                  <div className="py-10">
                    <div className="inline-flex rounded-full bg-primary/10 p-3 mb-4">
                      <File className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Team Projects</h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                      Projects feature coming soon...
                    </p>
                    <Button variant="outline" disabled>Coming Soon</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="p-6 space-y-6">
                  <h3 className="text-lg font-medium">Team Settings</h3>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Team Information</CardTitle>
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
                          className="max-w-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="updateTeamDescription">Description</Label>
                        <Input 
                          id="updateTeamDescription" 
                          value={currentTeam.description || ''}
                          onChange={(e) => updateTeam(currentTeam.id, { description: e.target.value })}
                          disabled={!userHasPermission(currentTeam.id, 'admin')}
                          className="max-w-md"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {userHasPermission(currentTeam.id, 'admin') && (
                    <Card className="border-red-200 dark:border-red-900/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                        <CardDescription>
                          Actions here cannot be undone
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button 
                          variant="destructive" 
                          onClick={handleDeleteTeam}
                          size="sm"
                        >
                          Delete Team
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default TeamManagement;
