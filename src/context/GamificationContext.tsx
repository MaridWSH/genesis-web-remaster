
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { Achievement, UserId } from '@/types';
import { useTasks } from './TaskContext';
import { useAuth } from './AuthContext';

type GamificationContextType = {
  userAchievements: Achievement[];
  streakDays: number;
  completedTasksCount: number;
  leaderboard: LeaderboardEntry[];
  awardAchievement: (achievement: Achievement) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  incrementCompleted: () => void;
};

type LeaderboardEntry = {
  userId: UserId;
  name: string;
  avatar?: string;
  points: number;
  tasksCompleted: number;
  streak: number;
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  const { tasks } = useTasks();
  const { user } = useAuth();
  
  // Initialize with demo data
  useEffect(() => {
    if (user) {
      // Mock achievements
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          name: 'First Task Completed',
          description: 'You completed your first task!',
          icon: 'trophy',
          earnedAt: new Date().toISOString()
        }
      ];
      
      // Mock leaderboard
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          userId: user.id,
          name: user.name,
          points: 75,
          tasksCompleted: 15,
          streak: 3
        },
        {
          userId: '2',
          name: 'Jane Doe',
          points: 120,
          tasksCompleted: 22,
          streak: 5
        }
      ];
      
      setUserAchievements(mockAchievements);
      setStreakDays(3);
      setCompletedTasksCount(15);
      setLeaderboard(mockLeaderboard);
    }
  }, [user]);
  
  // Check completed tasks for achievements
  useEffect(() => {
    if (!user) return;
    
    const completedTasks = tasks.filter(task => task.completed);
    const completedCount = completedTasks.length;
    
    // Check for achievements based on completion count
    if (completedCount >= 10 && !userAchievements.some(a => a.name === '10 Tasks Completed')) {
      awardAchievement({
        id: Date.now().toString(),
        name: '10 Tasks Completed',
        description: 'You completed 10 tasks!',
        icon: 'award',
        earnedAt: new Date().toISOString()
      });
    }
    
    // Set the completed count
    setCompletedTasksCount(completedCount);
  }, [tasks, user]);
  
  // Check for streak
  useEffect(() => {
    const checkStreak = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get date from local storage
      const lastCompletedStr = localStorage.getItem('lastTaskCompleted');
      if (!lastCompletedStr) return;
      
      const lastCompleted = new Date(lastCompletedStr);
      lastCompleted.setHours(0, 0, 0, 0);
      
      // Check if yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastCompleted.getTime() === yesterday.getTime()) {
        // Streak continues
        incrementStreak();
      } else if (lastCompleted.getTime() < yesterday.getTime()) {
        // Streak broken
        resetStreak();
      }
    };
    
    checkStreak();
  }, []);

  const awardAchievement = (achievement: Achievement) => {
    setUserAchievements(prev => [...prev, achievement]);
    toast.success(`Achievement Unlocked: ${achievement.name}!`);
  };

  const incrementStreak = () => {
    setStreakDays(prev => {
      const newStreak = prev + 1;
      
      // Check for streak achievements
      if (newStreak === 7 && !userAchievements.some(a => a.name === 'Week Warrior')) {
        awardAchievement({
          id: Date.now().toString(),
          name: 'Week Warrior',
          description: 'Maintain a 7-day streak!',
          icon: 'flame',
          earnedAt: new Date().toISOString()
        });
      }
      
      return newStreak;
    });
    
    // Update leaderboard
    if (user) {
      setLeaderboard(prev => 
        prev.map(entry => 
          entry.userId === user.id 
            ? { ...entry, streak: streakDays + 1 } 
            : entry
        )
      );
    }
  };

  const resetStreak = () => {
    setStreakDays(0);
    
    // Update leaderboard
    if (user) {
      setLeaderboard(prev => 
        prev.map(entry => 
          entry.userId === user.id 
            ? { ...entry, streak: 0 } 
            : entry
        )
      );
    }
  };

  const incrementCompleted = () => {
    setCompletedTasksCount(prev => {
      const newCount = prev + 1;
      
      // Save the date of task completion for streak tracking
      localStorage.setItem('lastTaskCompleted', new Date().toISOString());
      
      return newCount;
    });
    
    // Update leaderboard
    if (user) {
      setLeaderboard(prev => 
        prev.map(entry => 
          entry.userId === user.id 
            ? { 
                ...entry, 
                tasksCompleted: completedTasksCount + 1,
                points: entry.points + 5 
              } 
            : entry
        )
      );
    }
  };

  return (
    <GamificationContext.Provider
      value={{
        userAchievements,
        streakDays,
        completedTasksCount,
        leaderboard,
        awardAchievement,
        incrementStreak,
        resetStreak,
        incrementCompleted
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};
