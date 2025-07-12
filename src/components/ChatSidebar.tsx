import React, { useState } from 'react';
import { ChatSession } from '../types/chat';
import { MessageCircle, Clock, Trash2, Search, X, Calendar, Hash } from 'lucide-react';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    if (date >= today) {
      return 'Today';
    } else if (date >= yesterday) {
      return 'Yesterday';
    } else if (date >= thisWeek) {
      return 'This Week';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const filterSessions = (sessions: ChatSession[]) => {
    let filtered = sessions;

    // Apply date filter
    if (selectedFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = sessions.filter(session => {
        const sessionDate = session.updatedAt;
        switch (selectedFilter) {
          case 'today':
            return sessionDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return sessionDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return sessionDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(query) ||
        session.messages.some(msg => 
          msg.content.toLowerCase().includes(query)
        )
      );
    }

    return filtered;
  };

  const filteredSessions = filterSessions(sessions);

  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const dateKey = formatDate(session.updatedAt);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
    return groups;
  }, {} as Record<string, ChatSession[]>);

  const filterOptions = [
    { key: 'all', label: 'All Chats', count: sessions.length },
    { key: 'today', label: 'Today', count: filterSessions(sessions.filter(s => selectedFilter === 'today' || selectedFilter === 'all')).length },
    { key: 'week', label: 'This Week', count: filterSessions(sessions.filter(s => selectedFilter === 'week' || selectedFilter === 'all')).length },
    { key: 'month', label: 'This Month', count: filterSessions(sessions.filter(s => selectedFilter === 'month' || selectedFilter === 'all')).length },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen w-80 bg-white/95 backdrop-blur-md border-r border-gray-200 z-50 transform transition-all duration-300 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white/90 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Chat History
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setSelectedFilter(option.key as any)}
                className={`
                  flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200
                  ${selectedFilter === option.key 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {option.key === 'all' ? <Hash className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                {option.label}
                <span className="bg-white/70 px-1.5 py-0.5 rounded text-xs">
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {Object.keys(groupedSessions).length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-medium">
                {searchQuery ? 'No chats found' : 'No chat history yet'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery ? 'Try a different search term' : 'Start a conversation to see it here'}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedSessions).map(([dateKey, sessions]) => (
                <div key={dateKey} className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {dateKey}
                    <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                      {sessions.length}
                    </span>
                  </h3>
                  <div className="space-y-1">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`
                          group relative p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-sm
                          ${currentSessionId === session.id 
                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 shadow-sm' 
                            : 'hover:border-l-4 hover:border-gray-300'
                          }
                        `}
                        onClick={() => {
                          onSelectSession(session.id);
                          onClose();
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate mb-1">
                              {session.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MessageCircle className="w-3 h-3" />
                              <span>{session.messages.length} messages</span>
                              <span>•</span>
                              <span>{session.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            {session.messages.length > 0 && (
                              <p className="text-xs text-gray-400 mt-1 truncate">
                                {session.messages[session.messages.length - 1].content.substring(0, 50)}...
                              </p>
                            )}
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg text-red-500 hover:text-red-700 transition-all duration-200 ml-2"
                            title="Delete chat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-gray-200 bg-white/90 backdrop-blur-md">
          <div className="text-xs text-gray-500 text-center">
            <p>{sessions.length} total conversations</p>
            <p>{sessions.reduce((acc, s) => acc + s.messages.length, 0)} messages exchanged</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;