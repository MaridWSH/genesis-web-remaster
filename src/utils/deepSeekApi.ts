
import { toast } from "sonner";
import { Task, Priority } from "@/context/TaskContext";

// DeepSeek API integration
interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface DeepSeekRequestBody {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export const DEEPSEEK_MODELS = {
  DEEPSEEK_CODER: 'deepseek-coder:1.5',
  DEEPSEEK_CHAT: 'deepseek-chat'
};

// Helper to get the admin API key
const getAdminApiKey = (): string => {
  const apiKey = localStorage.getItem('admin-deepseek-api-key');
  if (!apiKey) {
    toast.error("DeepSeek API is not configured. Please contact an administrator.");
    return '';
  }
  return apiKey;
};

export async function getAiSuggestion(
  prompt: string, 
  model = DEEPSEEK_MODELS.DEEPSEEK_CHAT
): Promise<string> {
  try {
    const apiKey = getAdminApiKey();
    
    if (!apiKey) {
      throw new Error('DeepSeek API key is not configured');
    }

    const requestBody: DeepSeekRequestBody = {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant for a task management app. Provide concise, practical suggestions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    };

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`DeepSeek API error: ${errorData.error?.message || response.statusText}`);
    }

    const data: DeepSeekResponse = await response.json();
    return data.choices[0]?.message?.content || 'No suggestion available';
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    toast.error(`AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return 'Unable to generate suggestion at this time.';
  }
}

// Updated to remove the apiKey parameter since we only use the admin key now
export async function getTaskOptimization(
  tasks: { title: string; priority: string; dueDate: string }[]
): Promise<string[]> {
  try {
    const apiKey = getAdminApiKey();
    
    if (!apiKey) {
      throw new Error('DeepSeek API key is not configured');
    }

    const taskInfo = tasks.map(task => 
      `Title: ${task.title}, Priority: ${task.priority}, Due Date: ${new Date(task.dueDate).toLocaleDateString()}`
    ).join('\n');

    const prompt = `Based on these tasks:\n${taskInfo}\n\nProvide 3 concise suggestions for optimizing task scheduling and prioritization. Focus on efficiency and workload balance.`;

    const suggestion = await getAiSuggestion(prompt);
    
    // Parse the response into bullet points
    const suggestions = suggestion
      .split(/\d+\.\s+/)
      .filter(item => item.trim().length > 0)
      .map(item => item.trim())
      .slice(0, 3);
    
    return suggestions.length > 0 ? suggestions : ['Analyze task deadlines for better scheduling', 'Group similar tasks for batch processing', 'Consider delegating lower priority items'];
  } catch (error) {
    console.error('Error getting task optimization:', error);
    return ['Analyze task deadlines for better scheduling', 'Group similar tasks for batch processing', 'Consider delegating lower priority items'];
  }
}

// All the remaining functions are updated to remove the apiKey parameter
export async function getSmartScheduleSuggestions(
  tasks: Task[]
): Promise<{ taskId: string; suggestion: string; suggestedTime?: string }[]> {
  try {
    const apiKey = getAdminApiKey();
    
    if (!apiKey || tasks.length === 0) {
      return [];
    }

    const taskDetails = tasks
      .filter(task => !task.completed && !task.archived)
      .map(task => (
        `ID: ${task.id}, Title: ${task.title}, Priority: ${task.priority}, ` +
        `Due Date: ${new Date(task.dueDate).toLocaleDateString()}, Category: ${task.category || 'Uncategorized'}`
      )).join('\n');

    const prompt = `You are an AI assistant specialized in task scheduling. 
    Analyze these tasks and suggest optimal times to work on them based on priority and deadlines:
    ${taskDetails}
    
    For each task, provide:
    1. A brief scheduling suggestion (when to work on it)
    2. A reason for this suggestion (based on priority/deadline)
    
    Format your response as one task per line, with the task ID at the beginning:
    [ID] - Scheduling suggestion | Reason`;

    const response = await getAiSuggestion(prompt);
    
    // Parse the response into task-specific suggestions
    return response
      .split('\n')
      .filter(line => line.trim().startsWith('['))
      .map(line => {
        const idMatch = line.match(/\[(.*?)\]/);
        const taskId = idMatch ? idMatch[1] : '';
        
        // Extract suggestion text after the ID
        const suggestionText = line.replace(/\[.*?\]\s*-\s*/, '').trim();
        
        // Try to identify a time suggestion
        const timeRegex = /(\d{1,2}(?::\d{2})?\s*(?:AM|PM)|morning|afternoon|evening|night|today|tomorrow|next week)/i;
        const timeMatch = suggestionText.match(timeRegex);
        const suggestedTime = timeMatch ? timeMatch[0] : undefined;
        
        return {
          taskId,
          suggestion: suggestionText,
          suggestedTime
        };
      });
  } catch (error) {
    console.error('Error getting smart schedule suggestions:', error);
    return [];
  }
}

export async function getAutoPrioritySuggestions(
  tasks: Task[]
): Promise<{ taskId: string; suggestedPriority: Priority; reason: string }[]> {
  try {
    const apiKey = getAdminApiKey();
    
    if (!apiKey || tasks.length === 0) {
      return [];
    }

    const incompleteTasks = tasks.filter(task => !task.completed && !task.archived);
    
    // If there are too many tasks, limit to a reasonable number
    const tasksToAnalyze = incompleteTasks.slice(0, 10);
    
    const taskDetails = tasksToAnalyze.map(task => (
      `ID: ${task.id}, Title: ${task.title}, Current Priority: ${task.priority}, ` +
      `Due Date: ${new Date(task.dueDate).toLocaleDateString()}, ` +
      `Days Until Due: ${Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}`
    )).join('\n');

    const prompt = `You are an AI assistant specialized in task prioritization. 
    Analyze these tasks and suggest priority adjustments based on deadlines and importance:
    ${taskDetails}
    
    For each task, suggest whether the priority should be adjusted to High, Medium, or Low.
    If the current priority is already optimal, indicate that.
    
    Format your response for each task as:
    [ID] - Suggested Priority: (High/Medium/Low) | Reason: (brief explanation)`;

    const response = await getAiSuggestion(prompt);
    
    // Parse the response
    return response
      .split('\n')
      .filter(line => line.trim().startsWith('['))
      .map(line => {
        const idMatch = line.match(/\[(.*?)\]/);
        const taskId = idMatch ? idMatch[1] : '';
        
        // Extract priority
        const priorityMatch = line.match(/Priority:\s*(High|Medium|Low)/i);
        const suggestedPriority = priorityMatch 
          ? (priorityMatch[1].charAt(0).toUpperCase() + priorityMatch[1].slice(1).toLowerCase()) as Priority 
          : 'Medium' as Priority;
        
        // Extract reason
        const reasonMatch = line.match(/Reason:\s*(.*?)$/);
        const reason = reasonMatch ? reasonMatch[1].trim() : '';
        
        return { taskId, suggestedPriority, reason };
      });
  } catch (error) {
    console.error('Error getting auto-priority suggestions:', error);
    return [];
  }
}

export async function generateSubtasks(
  taskTitle: string,
  taskDescription: string
): Promise<string[]> {
  try {
    const apiKey = getAdminApiKey();
    
    if (!apiKey) {
      throw new Error('DeepSeek API key is not configured');
    }

    const prompt = `Break down this task into 3-5 actionable subtasks:
    Task Title: ${taskTitle}
    Task Description: ${taskDescription || 'No description provided'}
    
    For each subtask, provide a clear, concise title that starts with an action verb.
    Format your response as a numbered list (1., 2., etc.).`;

    const response = await getAiSuggestion(prompt);
    
    // Parse the subtasks
    return response
      .split(/\d+\.\s+/)
      .filter(item => item.trim().length > 0)
      .map(item => item.trim())
      .slice(0, 5); // Limit to 5 subtasks max
  } catch (error) {
    console.error('Error generating subtasks:', error);
    return [];
  }
}

export async function optimizeRecurringTasks(
  recurringTasks: Task[]
): Promise<{ taskId: string; suggestion: string; suggestedFrequency?: string }[]> {
  try {
    const apiKey = getAdminApiKey();
    
    if (!apiKey || recurringTasks.length === 0) {
      return [];
    }

    const taskDetails = recurringTasks
      .filter(task => task.recurring && task.recurring !== 'none')
      .map(task => (
        `ID: ${task.id}, Title: ${task.title}, Current Frequency: ${task.recurring}, ` +
        `Priority: ${task.priority}, Category: ${task.category || 'Uncategorized'}`
      )).join('\n');

    if (!taskDetails) {
      return [];
    }

    const prompt = `You are an AI assistant specialized in optimizing recurring tasks. 
    Analyze these recurring tasks and suggest optimal frequencies or adjustments:
    ${taskDetails}
    
    For each task, provide:
    1. A suggestion for optimal frequency (daily, weekly, monthly, or specific days)
    2. A brief explanation for your suggestion
    
    Format your response as:
    [ID] - Suggestion | Recommended frequency: (frequency)`;

    const response = await getAiSuggestion(prompt);
    
    // Parse the response
    return response
      .split('\n')
      .filter(line => line.trim().startsWith('['))
      .map(line => {
        const idMatch = line.match(/\[(.*?)\]/);
        const taskId = idMatch ? idMatch[1] : '';
        
        // Extract frequency recommendation
        const frequencyMatch = line.match(/frequency:\s*([^|.]+)/i);
        const suggestedFrequency = frequencyMatch ? frequencyMatch[1].trim() : undefined;
        
        // Extract the entire suggestion text after ID
        const suggestion = line.replace(/\[.*?\]\s*-\s*/, '').trim();
        
        return { taskId, suggestion, suggestedFrequency };
      });
  } catch (error) {
    console.error('Error optimizing recurring tasks:', error);
    return [];
  }
}

export async function suggestTaskDelegation(
  tasks: Task[],
  teamMembers: { userId: string; name: string; skills?: string[] }[]
): Promise<{ taskId: string; suggestedUserId: string; reason: string }[]> {
  try {
    const apiKey = getAdminApiKey();
    
    if (!apiKey || tasks.length === 0 || teamMembers.length === 0) {
      return [];
    }

    const incompleteTasks = tasks.filter(task => !task.completed && !task.archived);
    
    // If there are too many tasks, limit to a reasonable number
    const tasksToAnalyze = incompleteTasks.slice(0, 10);
    
    const taskDetails = tasksToAnalyze.map(task => (
      `Task ID: ${task.id}, Title: ${task.title}, Priority: ${task.priority}, ` +
      `Category: ${task.category || 'Uncategorized'}, ` +
      `Due Date: ${new Date(task.dueDate).toLocaleDateString()}`
    )).join('\n');

    const memberDetails = teamMembers.map(member => (
      `Member ID: ${member.userId}, Name: ${member.name}, ` +
      `Skills: ${member.skills?.join(', ') || 'Not specified'}`
    )).join('\n');

    const prompt = `You are an AI assistant specialized in task delegation. 
    Suggest the best team member for each task based on skills, workload, and task requirements.
    
    Tasks:
    ${taskDetails}
    
    Team Members:
    ${memberDetails}
    
    For each task, suggest which team member should be assigned and why.
    
    Format your response as:
    [Task ID] - Assign to: [Member ID] | Reason: (brief explanation)`;

    const response = await getAiSuggestion(prompt);
    
    // Parse the response
    return response
      .split('\n')
      .filter(line => line.trim().startsWith('['))
      .map(line => {
        const taskIdMatch = line.match(/\[(.*?)\]/);
        const taskId = taskIdMatch ? taskIdMatch[1] : '';
        
        // Extract member ID
        const memberIdMatch = line.match(/Assign to:\s*\[(.*?)\]/i);
        const suggestedUserId = memberIdMatch ? memberIdMatch[1] : '';
        
        // Extract reason
        const reasonMatch = line.match(/Reason:\s*(.*?)$/i);
        const reason = reasonMatch ? reasonMatch[1].trim() : '';
        
        return { taskId, suggestedUserId, reason };
      });
  } catch (error) {
    console.error('Error suggesting task delegation:', error);
    return [];
  }
}
