
import React from 'react';
import { useGamification } from '@/context/GamificationContext';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Flame, Medal, Crown, Star } from 'lucide-react';
import { format } from 'date-fns';

const Achievements = () => {
  const { userAchievements, streakDays, completedTasksCount, leaderboard } = useGamification();
  const { user } = useAuth();
  
  // Map achievement names to icons
  const getAchievementIcon = (name: string) => {
    if (name.includes('First Task')) return Trophy;
    if (name.includes('Week')) return Flame;
    if (name.includes('10 Tasks')) return Medal;
    return Award;
  };
  
  // Calculate progress to next tier
  const getProgressToNextTier = () => {
    if (completedTasksCount < 10) return {
      current: completedTasksCount,
      next: 10,
      label: 'Bronze',
      progress: (completedTasksCount / 10) * 100
    };
    
    if (completedTasksCount < 25) return {
      current: completedTasksCount,
      next: 25,
      label: 'Silver',
      progress: ((completedTasksCount - 10) / 15) * 100
    };
    
    if (completedTasksCount < 50) return {
      current: completedTasksCount,
      next: 50,
      label: 'Gold',
      progress: ((completedTasksCount - 25) / 25) * 100
    };
    
    return {
      current: completedTasksCount,
      next: completedTasksCount,
      label: 'Platinum',
      progress: 100
    };
  };
  
  const nextTierProgress = getProgressToNextTier();
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Achievements & Rewards</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and earn rewards
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flame className="h-5 w-5 mr-2 text-orange-500" />
              Current Streak
            </CardTitle>
            <CardDescription>
              Keep completing tasks to maintain your streak
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-orange-500">{streakDays}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {streakDays === 0 
                  ? 'Complete a task today to start a streak!'
                  : streakDays === 1 
                    ? '1 day streak! Keep it going!'
                    : `${streakDays} day streak! You're on fire!`}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-amber-500" />
              Progress to Next Tier
            </CardTitle>
            <CardDescription>
              {nextTierProgress.label} tier unlocks at {nextTierProgress.next} completed tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{nextTierProgress.current} completed</span>
                <span>{nextTierProgress.next} needed</span>
              </div>
              <Progress value={nextTierProgress.progress} className="h-2" />
              <div className="flex justify-center">
                <Badge variant="outline" className="px-4 py-1">
                  {nextTierProgress.label} Tier
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-medium mb-4">Your Achievements</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {userAchievements.length === 0 ? (
          <Card className="col-span-full border border-dashed">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <Award className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Achievements Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Complete tasks and goals to earn achievements
              </p>
            </CardContent>
          </Card>
        ) : (
          userAchievements.map(achievement => {
            const Icon = getAchievementIcon(achievement.name);
            
            return (
              <Card key={achievement.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 rounded-full bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(achievement.earnedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      
      <h2 className="text-xl font-medium mb-4">Leaderboard</h2>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {leaderboard.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No leaderboard data available
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between font-medium text-sm text-gray-500 dark:text-gray-400 px-2">
                  <span className="w-8 text-center">#</span>
                  <span className="flex-1">User</span>
                  <span className="w-16 text-right">Tasks</span>
                  <span className="w-16 text-right">Points</span>
                  <span className="w-16 text-right">Streak</span>
                </div>
                
                {leaderboard
                  .sort((a, b) => b.points - a.points)
                  .map((entry, index) => (
                    <div 
                      key={entry.userId}
                      className={`flex items-center justify-between py-3 px-2 rounded-lg ${
                        index === 0 
                          ? 'bg-amber-50 dark:bg-amber-950/30'
                          : index === 1 
                            ? 'bg-gray-50 dark:bg-gray-800/50' 
                            : index === 2 
                              ? 'bg-orange-50 dark:bg-orange-950/30'
                              : ''
                      }`}
                    >
                      <span className="w-8 text-center font-semibold">
                        {index === 0 ? (
                          <Crown className="h-5 w-5 mx-auto text-amber-500" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      
                      <div className="flex items-center flex-1">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>
                            {entry.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {entry.userId === user?.id ? `${entry.name} (You)` : entry.name}
                        </span>
                      </div>
                      
                      <span className="w-16 text-right font-medium">
                        {entry.tasksCompleted}
                      </span>
                      
                      <span className="w-16 text-right font-bold">
                        {entry.points}
                      </span>
                      
                      <div className="w-16 text-right">
                        {entry.streak > 0 ? (
                          <div className="flex items-center justify-end space-x-1">
                            <span className="font-medium">{entry.streak}</span>
                            <Flame className={`h-4 w-4 ${
                              entry.streak >= 7 ? 'text-red-500' : 'text-orange-400'
                            }`} />
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;
