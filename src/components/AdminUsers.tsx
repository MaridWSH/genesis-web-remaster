
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  ShieldCheck, 
  Shield,
  UserPlus
} from 'lucide-react';
import { UserProfile } from '@/types';
import { useToast } from "@/components/ui/use-toast";

// Mock user data for demo purposes
// In a real app, this would come from your backend API
const mockUsers: UserProfile[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    memberSince: "2023-01-15",
    streakDays: 45,
    totalCompleted: 120,
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    memberSince: "2023-03-21",
    streakDays: 12,
    totalCompleted: 45,
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    memberSince: "2023-04-10",
    streakDays: 30,
    totalCompleted: 85,
  },
  {
    id: "4",
    name: "Robert Johnson",
    email: "robert@example.com",
    memberSince: "2023-05-05",
    streakDays: 5,
    totalCompleted: 23,
  },
  {
    id: "5",
    name: "Sarah Williams",
    email: "sarah@example.com",
    memberSince: "2023-06-18",
    streakDays: 15,
    totalCompleted: 37,
  },
];

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: ""
  });
  const { toast } = useToast();
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add new user
  const handleAddUser = () => {
    // Validation
    if (!newUser.name || !newUser.email) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Name and email are required."
      });
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === newUser.email)) {
      toast({
        variant: "destructive",
        title: "Email already exists",
        description: "Please use a different email address."
      });
      return;
    }

    // Generate a new unique ID (in a real app, the backend would do this)
    const newId = (Math.max(...users.map(user => parseInt(user.id))) + 1).toString();
    
    // Create new user with default values
    const userToAdd: UserProfile = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      memberSince: new Date().toISOString().split('T')[0],
      streakDays: 0,
      totalCompleted: 0
    };
    
    // Add to users array
    setUsers([...users, userToAdd]);
    
    // Reset form and close dialog
    setNewUser({ name: "", email: "" });
    setOpen(false);
    
    // Show success toast
    toast({
      title: "User added",
      description: `${newUser.name} has been added successfully.`
    });
  };
  
  // Mock functions for user actions
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    // In a real app, you would call an API endpoint
    console.log(`Delete user with ID: ${userId}`);
    
    toast({
      title: "User deleted",
      description: "The user has been removed successfully."
    });
  };
  
  const handleEditUser = (userId: string) => {
    // In a real app, this would open a modal or navigate to an edit page
    console.log(`Edit user with ID: ${userId}`);
    
    toast({
      title: "Edit user",
      description: "This feature is not implemented yet."
    });
  };
  
  const handleMakeAdmin = (userId: string) => {
    // In a real app, this would update the user's role
    console.log(`Make user ${userId} an admin`);
    
    toast({
      title: "Role updated",
      description: "User has been promoted to admin."
    });
  };
  
  const handleRemoveAdmin = (userId: string) => {
    // In a real app, this would update the user's role
    console.log(`Remove admin privileges for user ${userId}`);
    
    toast({
      title: "Role updated",
      description: "Admin privileges have been removed."
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">User Management</CardTitle>
        <CardDescription>Manage all users of the application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="ml-2">
                <UserPlus className="h-4 w-4 mr-1" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account. The user will receive a welcome email with instructions to set their password.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input 
                    id="name" 
                    className="col-span-3" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email"
                    className="col-span-3" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.memberSince).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs">Streak: {user.streakDays} days</span>
                        <span className="text-xs">Tasks: {user.totalCompleted} completed</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.id === "1" ? (
                        <Badge variant="default" className="bg-primary">Admin</Badge>
                      ) : (
                        <Badge variant="outline">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          {user.id === "1" ? (
                            <DropdownMenuItem onClick={() => handleRemoveAdmin(user.id)}>
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Remove Admin</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleMakeAdmin(user.id)}>
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              <span>Make Admin</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
