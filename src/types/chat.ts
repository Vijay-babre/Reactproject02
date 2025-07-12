export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string | null;
}

export interface User {
  _id: string;
  username: string;
  createdAt: Date;
  lastLogin: Date;
}