
import React, { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

interface TaskAttachmentsProps {
  taskId: string;
}

const TaskAttachments = ({ taskId }: TaskAttachmentsProps) => {
  const { tasks, addAttachment, updateTask } = useTasks();
  const [attachmentUrl, setAttachmentUrl] = useState('');
  
  const task = tasks.find(t => t.id === taskId);
  const attachments = task?.attachments || [];
  
  // In a real app, this would upload the file to storage
  // Here we're just simulating it by allowing URL input
  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (attachmentUrl.trim()) {
      addAttachment(taskId, attachmentUrl);
      setAttachmentUrl('');
      toast.success('Attachment added');
    }
  };
  
  // In a real app with file uploads:
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, this would upload to cloud storage
      // For demo purposes, we'll create an object URL
      const url = URL.createObjectURL(file);
      addAttachment(taskId, `${file.name}|${url}`);
      toast.success(`Uploaded ${file.name}`);
      e.target.value = ''; // Reset input
    }
  };
  
  const handleDeleteAttachment = (index: number) => {
    if (task) {
      const updatedAttachments = [...attachments];
      updatedAttachments.splice(index, 1);
      updateTask(taskId, { attachments: updatedAttachments });
      toast.success('Attachment removed');
    }
  };
  
  const getAttachmentName = (attachment: string): string => {
    // Handle both URL-only attachments and name|url format
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
    <div className="space-y-4">
      <h3 className="text-base font-medium">Attachments</h3>
      
      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDeleteAttachment(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
      
      <div className="space-y-3">
        {/* Add attachment by URL form */}
        <form onSubmit={handleAddAttachment} className="flex space-x-2">
          <Input 
            placeholder="Add attachment URL"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!attachmentUrl.trim()}>Add</Button>
        </form>
        
        {/* Upload file option */}
        <div className="flex items-center">
          <Button variant="outline" className="w-full" onClick={() => document.getElementById('file-upload')?.click()}>
            <Paperclip className="h-4 w-4 mr-2" /> Upload File
          </Button>
          <Input 
            id="file-upload"
            type="file" 
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskAttachments;
