import axios from 'axios';
import { User } from '../types/chat';

const API_URL = 'http://localhost:5000/api';
const CURRENT_USER_KEY = 'gemini-chat-current-user';
const TOKEN_KEY = 'gemini-chat-token';

export async function loginUser(username: string, password: string): Promise<User | null> {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    const { user, token } = response.data;
    setCurrentUser(user, token);
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: new Date(user.lastLogin),
    };
  } catch (error: any) {
    console.error('Login error:', error.response?.data?.message || error.message);
    return null;
  }
}

export async function registerUser(username: string, password: string): Promise<User | null> {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password });
    const { user, token } = response.data;
    setCurrentUser(user, token);
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: new Date(user.lastLogin),
    };
  } catch (error: any) {
    console.error('Registration error:', error.response?.data?.message || error.message);
    return null;
  }
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;

  try {
    const user = JSON.parse(stored);
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: new Date(user.lastLogin),
    };
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null, token?: string): void {
  if (user && token) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function logoutUser(): void {
  setCurrentUser(null);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}