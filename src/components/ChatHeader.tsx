import React, { useState } from 'react';
import { MessageCircle, Menu, Trash2, Plus, User, LogOut, Download, Upload } from 'lucide-react';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onClearHistory: () => void;
  currentChatTitle?: string;
  user?: any;
  onLogout: () => void;
  onExportHistory: () => void;
  onImportHistory: (file: File) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onToggleSidebar, 
  onNewChat, 
  onClearHistory,
  currentChatTitle,
  user,
  onLogout,
  onExportHistory,
  onImportHistory
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportHistory(file);
      e.target.value = '';
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {currentChatTitle || 'Gemini Chat'}
              </h1>
              <p className="text-xs text-gray-500">
                {user ? `Welcome, ${user.username}` : 'Guest Mode'} • Powered by Google AI
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          
          <button
            onClick={onClearHistory}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 text-red-600 hover:text-red-700"
            title="Clear All History"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {user && (
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{user.username}</p>
                    <p className="text-xs text-gray-500">
                      Joined {user.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    onExportHistory();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export History
                </button>
                
                <label className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Import History
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>
                
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {user ? 'Sign Out' : 'Back to Login'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;