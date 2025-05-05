export type UserId = string;
export type ProjectId = string;
export type TeamId = string;
export type Role = 'admin' | 'editor' | 'viewer';

// We're not using this UserProfile anymore, but keeping it for backward compatibility
// New code should import UserProfile from @/hooks/useAuthState
export interface UserProfile {
  id: UserId;
  name: string;
  email: string;
  avatar?: string;
  memberSince: string;
  achievements?: Achievement[];
  streakDays?: number;
  totalCompleted?: number;
}

export interface Team {
  id: TeamId;
  name: string;
  description?: string;
  createdBy: UserId;
  members: TeamMember[];
}

export interface TeamMember {
  userId: UserId;
  role: Role;
  joinedAt: string;
}

export interface SharedProject {
  id: ProjectId;
  name: string;
  description?: string;
  teamId: TeamId;
  tasks: string[]; // Task IDs
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}
