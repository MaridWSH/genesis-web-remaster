
import { toast } from "sonner";

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

export async function getAiSuggestion(
  prompt: string, 
  apiKey: string, 
  model = DEEPSEEK_MODELS.DEEPSEEK_CHAT
): Promise<string> {
  try {
    if (!apiKey) {
      throw new Error('DeepSeek API key is required');
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

export async function getTaskOptimization(
  tasks: { title: string; priority: string; dueDate: string }[],
  apiKey: string
): Promise<string[]> {
  try {
    if (!apiKey) {
      throw new Error('DeepSeek API key is required');
    }

    const taskInfo = tasks.map(task => 
      `Title: ${task.title}, Priority: ${task.priority}, Due Date: ${new Date(task.dueDate).toLocaleDateString()}`
    ).join('\n');

    const prompt = `Based on these tasks:\n${taskInfo}\n\nProvide 3 concise suggestions for optimizing task scheduling and prioritization. Focus on efficiency and workload balance.`;

    const suggestion = await getAiSuggestion(prompt, apiKey);
    
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
