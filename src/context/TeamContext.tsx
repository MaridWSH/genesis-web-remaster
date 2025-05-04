
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { Team, TeamMember, UserId, Role, SharedProject } from '@/types';
import { useAuth } from './AuthContext';

type TeamContextType = {
  teams: Team[];
  sharedProjects: SharedProject[];
  currentTeam: Team | null;
  createTeam: (name: string, description?: string) => Promise<Team>;
  updateTeam: (teamId: string, data: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  joinTeam: (teamId: string) => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;
  inviteToTeam: (teamId: string, email: string, role: Role) => Promise<void>;
  updateMemberRole: (teamId: string, userId: string, role: Role) => Promise<void>;
  removeMember: (teamId: string, userId: string) => Promise<void>;
  createSharedProject: (teamId: string, name: string, description?: string) => Promise<SharedProject>;
  updateSharedProject: (projectId: string, data: Partial<SharedProject>) => Promise<void>;
  deleteSharedProject: (projectId: string) => Promise<void>;
  setCurrentTeam: (team: Team | null) => void;
  userHasPermission: (teamId: string, permission: 'admin' | 'edit' | 'view') => boolean;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeams = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamProvider');
  }
  return context;
};

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const { user } = useAuth();

  // Mock team data for demo purposes
  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from your backend
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Development Team',
          description: 'Team responsible for product development',
          createdBy: user.id,
          members: [
            { userId: user.id, role: 'admin', joinedAt: new Date().toISOString() },
            { userId: '2', role: 'editor', joinedAt: new Date().toISOString() }
          ]
        }
      ];
      
      const mockSharedProjects: SharedProject[] = [
        {
          id: '1',
          name: 'Q2 Feature Release',
          description: 'Tasks for Q2 feature release cycle',
          teamId: '1',
          tasks: ['1', '3'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setTeams(mockTeams);
      setSharedProjects(mockSharedProjects);
      setCurrentTeam(mockTeams[0]);
    }
  }, [user]);

  const createTeam = async (name: string, description?: string): Promise<Team> => {
    if (!user) throw new Error('User must be logged in');
    
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      description,
      createdBy: user.id,
      members: [
        { userId: user.id, role: 'admin', joinedAt: new Date().toISOString() }
      ]
    };
    
    setTeams([...teams, newTeam]);
    toast.success('Team created successfully');
    return newTeam;
  };

  const updateTeam = async (teamId: string, data: Partial<Team>): Promise<void> => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, ...data } : team
    ));
    
    if (currentTeam?.id === teamId) {
      setCurrentTeam(prev => prev ? { ...prev, ...data } : null);
    }
    
    toast.success('Team updated');
  };

  const deleteTeam = async (teamId: string): Promise<void> => {
    if (!userHasPermission(teamId, 'admin')) {
      toast.error('You do not have permission to delete this team');
      return;
    }
    
    setTeams(teams.filter(team => team.id !== teamId));
    if (currentTeam?.id === teamId) {
      setCurrentTeam(null);
    }
    
    // Also delete shared projects for this team
    setSharedProjects(sharedProjects.filter(project => project.teamId !== teamId));
    
    toast.success('Team deleted');
  };

  const joinTeam = async (teamId: string): Promise<void> => {
    // In a real app, this would involve an invite system
    toast.success('Team joined successfully');
  };

  const leaveTeam = async (teamId: string): Promise<void> => {
    if (!user) return;
    
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    // Don't allow last admin to leave
    const admins = team.members.filter(m => m.role === 'admin');
    if (admins.length === 1 && admins[0].userId === user.id) {
      toast.error('You are the only admin. Transfer ownership before leaving.');
      return;
    }
    
    setTeams(teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          members: t.members.filter(m => m.userId !== user.id)
        };
      }
      return t;
    }));
    
    if (currentTeam?.id === teamId) {
      setCurrentTeam(null);
    }
    
    toast.success('You have left the team');
  };

  const inviteToTeam = async (teamId: string, email: string, role: Role): Promise<void> => {
    if (!userHasPermission(teamId, 'admin')) {
      toast.error('You do not have permission to invite members');
      return;
    }
    
    // In a real app, this would send an email invitation
    toast.success(`Invitation sent to ${email}`);
  };

  const updateMemberRole = async (teamId: string, userId: string, role: Role): Promise<void> => {
    if (!userHasPermission(teamId, 'admin')) {
      toast.error('You do not have permission to update roles');
      return;
    }
    
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.map(member => 
            member.userId === userId ? { ...member, role } : member
          )
        };
      }
      return team;
    }));
    
    if (currentTeam?.id === teamId) {
      setCurrentTeam(prev => {
        if (!prev) return null;
        return {
          ...prev,
          members: prev.members.map(member => 
            member.userId === userId ? { ...member, role } : member
          )
        };
      });
    }
    
    toast.success('Member role updated');
  };

  const removeMember = async (teamId: string, userId: string): Promise<void> => {
    if (!userHasPermission(teamId, 'admin')) {
      toast.error('You do not have permission to remove members');
      return;
    }
    
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.filter(member => member.userId !== userId)
        };
      }
      return team;
    }));
    
    if (currentTeam?.id === teamId) {
      setCurrentTeam(prev => {
        if (!prev) return null;
        return {
          ...prev,
          members: prev.members.filter(member => member.userId !== userId)
        };
      });
    }
    
    toast.success('Member removed from team');
  };

  const createSharedProject = async (teamId: string, name: string, description?: string): Promise<SharedProject> => {
    if (!userHasPermission(teamId, 'edit')) {
      toast.error('You do not have permission to create projects');
      throw new Error('Permission denied');
    }
    
    const newProject: SharedProject = {
      id: Date.now().toString(),
      name,
      description,
      teamId,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setSharedProjects([...sharedProjects, newProject]);
    toast.success('Project created');
    return newProject;
  };

  const updateSharedProject = async (projectId: string, data: Partial<SharedProject>): Promise<void> => {
    const project = sharedProjects.find(p => p.id === projectId);
    if (!project) {
      toast.error('Project not found');
      return;
    }
    
    if (!userHasPermission(project.teamId, 'edit')) {
      toast.error('You do not have permission to update this project');
      return;
    }
    
    setSharedProjects(sharedProjects.map(p => 
      p.id === projectId ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    ));
    
    toast.success('Project updated');
  };

  const deleteSharedProject = async (projectId: string): Promise<void> => {
    const project = sharedProjects.find(p => p.id === projectId);
    if (!project) return;
    
    if (!userHasPermission(project.teamId, 'admin')) {
      toast.error('You do not have permission to delete this project');
      return;
    }
    
    setSharedProjects(sharedProjects.filter(p => p.id !== projectId));
    toast.success('Project deleted');
  };

  const userHasPermission = (teamId: string, permission: 'admin' | 'edit' | 'view'): boolean => {
    if (!user) return false;
    
    const team = teams.find(t => t.id === teamId);
    if (!team) return false;
    
    const member = team.members.find(m => m.userId === user.id);
    if (!member) return false;
    
    switch (permission) {
      case 'admin':
        return member.role === 'admin';
      case 'edit':
        return member.role === 'admin' || member.role === 'editor';
      case 'view':
        return true; // All roles can view
      default:
        return false;
    }
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        sharedProjects,
        currentTeam,
        createTeam,
        updateTeam,
        deleteTeam,
        joinTeam,
        leaveTeam,
        inviteToTeam,
        updateMemberRole,
        removeMember,
        createSharedProject,
        updateSharedProject,
        deleteSharedProject,
        setCurrentTeam,
        userHasPermission,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
