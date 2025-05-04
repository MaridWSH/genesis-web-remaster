
import React, { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ThumbsUp } from 'lucide-react';

interface TaskCommentsProps {
  taskId: string;
}

const TaskComments = ({ taskId }: TaskCommentsProps) => {
  const { tasks, addComment, updateTask } = useTasks();
  const [commentText, setCommentText] = useState('');
  
  const task = tasks.find(t => t.id === taskId);
  const comments = task?.comments || [];
  const isTemporaryTask = taskId.startsWith('temp-');
  
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(taskId, { 
        text: commentText,
        author: 'Me' // In a real app, this would be the current user's name
      });
      setCommentText('');
      
      // Only show toast if it's not a temporary task
      // (TaskContext will handle showing toast for temporary tasks)
      if (!isTemporaryTask) {
        toast.success('Comment added');
      }
    }
  };
  
  const handleDeleteComment = (commentId: string) => {
    if (task) {
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      updateTask(taskId, { comments: updatedComments });
      toast.success('Comment deleted');
    }
  };
  
  const handleLikeComment = (commentId: string) => {
    if (task) {
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return { 
            ...comment, 
            likes: (comment.likes || 0) + 1 
          };
        }
        return comment;
      });
      
      updateTask(taskId, { comments: updatedComments });
      toast.success('Comment liked');
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Comments</h3>
      
      <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            {isTemporaryTask 
              ? 'Comments can be added after saving the task' 
              : 'No comments yet'}
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{comment.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{comment.author}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleLikeComment(comment.id)}
                      className="h-6 p-1 flex items-center"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span className="text-xs">{comment.likes || 0}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="h-6 w-6 p-0"
                    >
                      <span className="sr-only">Delete comment</span>
                      ✕
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleAddComment} className="flex space-x-2">
        <Input 
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1"
          disabled={isTemporaryTask && !task}
        />
        <Button 
          type="submit" 
          disabled={!commentText.trim() || (isTemporaryTask && !task)}
        >
          Add
        </Button>
      </form>
    </div>
  );
};

export default TaskComments;
