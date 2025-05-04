
import React, { useState } from 'react';
import { Task } from '@/context/TaskContext';
import { useTasks } from '@/context/TaskContext';
import { 
  ThumbsUp, 
  FileText, 
  Link as LinkIcon, 
  MessageSquare, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskQuickViewProps {
  task: Task;
  onClose: () => void;
}

const TaskQuickView = ({ task, onClose }: TaskQuickViewProps) => {
  const { tasks, updateTask } = useTasks();
  const [activeTab, setActiveTab] = useState<'comments' | 'attachments' | 'links'>('comments');
  
  const comments = task?.comments || [];
  const attachments = task?.attachments || [];
  const dependencies = task?.dependencies || [];
  
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
      
      updateTask(task.id, { comments: updatedComments });
      toast.success('Comment liked');
    }
  };
  
  const getAttachmentName = (attachment: string): string => {
    if (attachment.includes('|')) {
      return attachment.split('|')[0];
    }
    
    try {
      const url = new URL(attachment);
      return url.pathname.split('/').pop() || 'Attachment';
    } catch {
      return 'Attachment';
    }
  };
  
  const getAttachmentUrl = (attachment: string): string => {
    if (attachment.includes('|')) {
      return attachment.split('|')[1];
    }
    return attachment;
  };

  const getTabColors = (tabName: 'comments' | 'attachments' | 'links') => {
    return activeTab === tabName 
      ? "bg-primary text-white" 
      : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200";
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-primary/80 to-primary/60 text-white p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center">
              <span className="mr-2">{task.title}</span>
              <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">
                {task.category}
              </span>
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <div className="flex border-b dark:border-gray-700">
          <button 
            className={`flex-1 p-3 flex items-center justify-center gap-2 ${getTabColors('comments')}`}
            onClick={() => setActiveTab('comments')}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Comments{comments.length > 0 ? ` (${comments.length})` : ''}</span>
          </button>
          <button 
            className={`flex-1 p-3 flex items-center justify-center gap-2 ${getTabColors('attachments')}`}
            onClick={() => setActiveTab('attachments')}
          >
            <FileText className="h-4 w-4" />
            <span>Files{attachments.length > 0 ? ` (${attachments.length})` : ''}</span>
          </button>
          <button 
            className={`flex-1 p-3 flex items-center justify-center gap-2 ${getTabColors('links')}`}
            onClick={() => setActiveTab('links')}
          >
            <LinkIcon className="h-4 w-4" />
            <span>Links{dependencies.length > 0 ? ` (${dependencies.length})` : ''}</span>
          </button>
        </div>
        
        <CardContent className="p-4">
          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                  <p className="mt-2 text-gray-500 dark:text-gray-400">No comments yet</p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8 bg-primary/20">
                        <AvatarFallback className="text-primary">{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{comment.author}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleLikeComment(comment.id)}
                            className="h-6 p-1 flex items-center hover:bg-primary/10 text-gray-600 dark:text-gray-300"
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span className="text-xs">{comment.likes || 0}</span>
                          </Button>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === 'attachments' && (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {attachments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                  <p className="mt-2 text-gray-500 dark:text-gray-400">No attachments yet</p>
                </div>
              ) : (
                attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <a 
                          href={getAttachmentUrl(attachment)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {getAttachmentName(attachment)}
                        </a>
                      </div>
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => window.open(getAttachmentUrl(attachment), '_blank')}
                    >
                      View
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Links Tab */}
          {activeTab === 'links' && (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {dependencies.length === 0 ? (
                <div className="text-center py-8">
                  <LinkIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                  <p className="mt-2 text-gray-500 dark:text-gray-400">No linked tasks</p>
                </div>
              ) : (
                dependencies.map(dependencyId => {
                  const dependentTask = tasks.find(t => t.id === dependencyId);
                  return dependentTask ? (
                    <div key={dependencyId} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors">
                      <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <LinkIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {dependentTask.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Due: {format(new Date(dependentTask.dueDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  ) : null;
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskQuickView;
