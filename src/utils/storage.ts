import axios from 'axios';
import { ChatSession, ChatMessage } from '../types/chat';
import { getToken } from './auth';

const API_URL = 'http://localhost:5000/api';

export async function saveChatSessions(sessions: ChatSession[], userId?: string): Promise<void> {
  // Note: This function is mostly for compatibility with existing code.
  // Actual session creation and updates are handled via API calls in sendMessage.
  // For import functionality, we'll implement session creation.
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    for (const session of sessions) {
      // Create or update session
      const sessionData = {
        title: session.title,
      };
      const response = await axios.post(`${API_URL}/chat/sessions`, sessionData, { headers });
      const sessionId = response.data.session.id;

      // Save messages for the session
      for (const message of session.messages) {
        await axios.post(
          `${API_URL}/chat/sessions/${sessionId}/messages`,
          { content: message.content },
          { headers }
        );
      }
    }
  } catch (error: any) {
    console.error('Error saving sessions:', error.response?.data?.message || error.message);
    throw error;
  }
}

export async function loadChatSessions(userId?: string): Promise<ChatSession[]> {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/chat/sessions`, { headers });
    return response.data.map((session: any) => ({
      id: session.id,
      title: session.title,
      messages: [],
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      userId: session.userId,
    }));
  } catch (error: any) {
    console.error('Error loading sessions:', error.response?.data?.message || error.message);
    return [];
  }
}

export async function loadSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/chat/sessions/${sessionId}/messages`, { headers });
    return response.data.map((message: any) => ({
      id: message.id,
      content: message.content,
      role: message.role,
      timestamp: new Date(message.timestamp),
    }));
  } catch (error: any) {
    console.error('Error loading messages:', error.response?.data?.message || error.message);
    return [];
  }
}

export function generateChatTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  if (!firstUserMessage) return 'New Chat';

  const words = firstUserMessage.content.split(' ').slice(0, 6);
  return words.join(' ') + (firstUserMessage.content.split(' ').length > 6 ? '...' : '');
}

export async function exportChatHistory(userId?: string): Promise<string> {
  try {
    const sessions = await loadChatSessions(userId);
    for (const session of sessions) {
      session.messages = await loadSessionMessages(session.id);
    }
    const exportData = {
      exportDate: new Date().toISOString(),
      userId: userId || 'guest',
      sessions,
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error: any) {
    console.error('Error exporting chat history:', error.response?.data?.message || error.message);
    return '';
  }
}

export async function importChatHistory(jsonData: string, userId?: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonData);
    if (data.sessions && Array.isArray(data.sessions)) {
      await saveChatSessions(data.sessions, userId);
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Error importing chat history:', error.response?.data?.message || error.message);
    return false;
  }
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axios.delete(`${API_URL}/chat/sessions/${sessionId}`, { headers });
  } catch (error: any) {
    console.error('Error deleting session:', error.response?.data?.message || error.message);
    throw error;
  }
}