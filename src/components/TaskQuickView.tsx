
import React from 'react';
import { Task } from '@/context/TaskContext';
import { useTasks } from '@/context/TaskContext';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { ThumbsUp, FileText, Link, MessageSquare, X } from 'lucide-react';
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
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-white dark:bg-gray-800 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">{task.title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Carousel className="w-full">
            <CarouselContent>
              {/* Comments Section */}
              <CarouselItem>
                <div className="p-1">
                  <h3 className="text-base font-medium mb-3 flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" /> Comments
                  </h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {comments.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No comments yet</p>
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
                                <span className="text-xs text-gray-500">
                                  {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                                </span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleLikeComment(comment.id)}
                                className="h-6 p-1 flex items-center"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                <span className="text-xs">{comment.likes || 0}</span>
                              </Button>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CarouselItem>

              {/* Attachments Section */}
              <CarouselItem>
                <div className="p-1">
                  <h3 className="text-base font-medium mb-3 flex items-center">
                    <FileText className="mr-2 h-4 w-4" /> Attachments
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {attachments.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No attachments yet</p>
                    ) : (
                      attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <a 
                              href={getAttachmentUrl(attachment)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-blue-600 hover:underline"
                            >
                              {getAttachmentName(attachment)}
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CarouselItem>

              {/* Links Section */}
              <CarouselItem>
                <div className="p-1">
                  <h3 className="text-base font-medium mb-3 flex items-center">
                    <Link className="mr-2 h-4 w-4" /> Linked Tasks
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {dependencies.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No linked tasks</p>
                    ) : (
                      dependencies.map(dependencyId => {
                        const dependentTask = tasks.find(t => t.id === dependencyId);
                        return dependentTask ? (
                          <div key={dependencyId} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Link className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                              <span className="text-sm">{dependentTask.title}</span>
                            </div>
                          </div>
                        ) : null;
                      })
                    )}
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskQuickView;
