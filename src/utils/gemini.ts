import axios from 'axios';
import { getToken } from './auth';

const API_URL = 'http://localhost:5000/api';

export async function sendMessageToGemini(message: string, sessionId: string): Promise<string> {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(
      `${API_URL}/chat/sessions/${sessionId}/messages`,
      { content: message },
      { headers }
    );
    // The backend returns an array of [userMessage, assistantMessage]
    const assistantMessage = response.data.find((msg: any) => msg.role === 'assistant');
    return assistantMessage.content;
  } catch (error: any) {
    console.error('Error calling backend Gemini API:', error.response?.data?.message || error.message);
    throw new Error('Failed to get response from Gemini AI');
  }
}