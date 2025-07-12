import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, ChatMessage } from '../types/chat';
import { sendMessageToGemini } from '../utils/gemini';
import { loadChatSessions, loadSessionMessages, deleteChatSession, exportChatHistory, importChatHistory } from '../utils/storage';
import ChatHeader from './ChatHeader';
import ChatSidebar from './ChatSidebar';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { MessageCircle, Sparkles } from 'lucide-react';
import { getToken } from '../utils/auth';

interface ChatInterfaceProps {
  user?: any;
  onLogout: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onLogout }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const loadedSessions = await loadChatSessions(user?._id);
        setSessions(loadedSessions);
        if (loadedSessions.length > 0) {
          setCurrentSessionId(loadedSessions[0].id);
          const messages = await loadSessionMessages(loadedSessions[0].id);
          setSessions(prev => prev.map(s => s.id === loadedSessions[0].id ? { ...s, messages } : s));
        } else {
          await createNewChat();
        }
      } catch (error: any) {
        console.error('Error fetching sessions:', error.message);
      }
    };
    fetchSessions();
  }, [user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const createNewChat = async () => {
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch('http://localhost:5000/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({ title: 'New Chat' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create session: ${errorData.message || response.statusText}`);
      }

      const { session } = await response.json();
      if (!session || !session.id) {
        throw new Error('Invalid session response from server');
      }

      const newSession: ChatSession = {
        id: session.id,
        title: session.title,
        messages: [],
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        userId: session.userId || null,
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setSidebarOpen(false);
    } catch (error: any) {
      console.error('Error creating session:', error.message);
      // Fallback: Create a local session to keep UI functional
      const fallbackSession: ChatSession = {
        id: Date.now().toString(),
        title: 'New Chat (Offline)',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user?._id || null,
      };
      setSessions(prev => [fallbackSession, ...prev]);
      setCurrentSessionId(fallbackSession.id);
    }
  };

  const selectSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSidebarOpen(false);
    try {
      const messages = await loadSessionMessages(sessionId);
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages } : s));
    } catch (error: any) {
      console.error('Error loading session messages:', error.message);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await deleteChatSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        const remaining = sessions.filter(s => s.id !== sessionId);
        if (remaining.length > 0) {
          setCurrentSessionId(remaining[0].id);
          const messages = await loadSessionMessages(remaining[0].id);
          setSessions(prev => prev.map(s => s.id === remaining[0].id ? { ...s, messages } : s));
        } else {
          await createNewChat();
        }
      }
    } catch (error: any) {
      console.error('Error deleting session:', error.message);
    }
  };

  const clearAllHistory = async () => {
    if (window.confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) {
      try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const sessionsToDelete = await loadChatSessions(user?._id);
        for (const session of sessionsToDelete) {
          await fetch(`http://localhost:5000/api/chat/sessions/${session.id}`, {
            method: 'DELETE',
            headers,
          });
        }
        setSessions([]);
        setCurrentSessionId(null);
        await createNewChat();
      } catch (error: any) {
        console.error('Error clearing history:', error.message);
      }
    }
  };

  const handleExportHistory = async () => {
    try {
      const data = await exportChatHistory(user?._id);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gemini-chat-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error exporting history:', error.message);
    }
  };

  const handleImportHistory = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        if (await importChatHistory(content, user?._id)) {
          const loadedSessions = await loadChatSessions(user?._id);
          setSessions(loadedSessions);
          alert('Chat history imported successfully!');
        } else {
          alert('Failed to import chat history. Please check the file format.');
        }
      } catch (error: any) {
        alert('Error reading file. Please try again.');
        console.error('Error importing history:', error.message);
      }
    };
    reader.readAsText(file);
  };

  const sendMessage = async (content: string) => {
    if (!currentSessionId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const tempLoadingId = (Date.now() + 1).toString();
    const loadingMessage: ChatMessage = {
      id: tempLoadingId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    // First, add the user message and loading message
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          messages: [...session.messages, userMessage, loadingMessage],
          updatedAt: new Date(),
        };
      }
      return session;
    }));

    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(content, currentSessionId);
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      // Replace the loading message with the actual response
      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          const updatedMessages = session.messages.map(msg => 
            msg.id === tempLoadingId ? assistantMessage : msg
          );
          return {
            ...session,
            messages: updatedMessages,
            updatedAt: new Date(),
          };
        }
        return session;
      }));

      // Refresh session list to update title if needed
      try {
        const updatedSessions = await loadChatSessions(user?._id);
        setSessions(prev => {
          const currentMessages = prev.find(s => s.id === currentSessionId)?.messages || [];
          return updatedSessions.map(s => {
            if (s.id === currentSessionId) {
              return { ...s, messages: currentMessages };
            }
            return s;
          });
        });
      } catch (error: any) {
        console.error('Error refreshing session list:', error.message);
      }

    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };

      // Replace the loading message with the error message
      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          const updatedMessages = session.messages.map(msg => 
            msg.id === tempLoadingId ? errorMessage : msg
          );
          return {
            ...session,
            messages: updatedMessages,
            updatedAt: new Date(),
          };
        }
        return session;
      }));
      console.error('Error sending message:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionPrompts = [
    'Explain quantum computing in simple terms',
    'Write a creative story about space travel',
    'Help me plan a weekend trip',
    'Suggest a healthy meal recipe',
    'What are the latest trends in AI?',
    'How can I improve my productivity?',
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={createNewChat}
          onClearHistory={clearAllHistory}
          currentChatTitle={currentSession?.title}
          user={user}
          onLogout={onLogout}
          onExportHistory={handleExportHistory}
          onImportHistory={handleImportHistory}
        />
        
        <div className="flex-1 overflow-y-auto">
          {!currentSession?.messages || currentSession.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center max-w-2xl">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl mb-6 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Start a Conversation
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Ask me anything! I'm here to help with your questions and ideas.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {suggestionPrompts.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(suggestion)}
                      disabled={isLoading}
                      className="group p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:bg-white hover:shadow-lg hover:border-indigo-200 transition-all duration-300 text-left hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-500 mt-0.5 group-hover:rotate-12 transition-transform duration-300" />
                        <p className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                          {suggestion}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-4">
              {currentSession.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;