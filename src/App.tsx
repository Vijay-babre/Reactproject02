import React, { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from './utils/auth';
import LoginScreen from './components/LoginScreen';
import ChatInterface from './components/ChatInterface';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setShowWelcome(false);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (loggedInUser: any) => {
    setUser(loggedInUser);
    setIsGuestMode(false);
    setShowWelcome(false);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsGuestMode(false);
    setShowWelcome(true);
  };

  const handleGuestMode = () => {
    setIsGuestMode(true);
    setShowWelcome(false);
  };

  const handleStartChat = () => {
    setShowWelcome(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomeScreen onStartChat={handleStartChat} />;
  }

  if (!user && !isGuestMode) {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        onGuestMode={handleGuestMode}
      />
    );
  }

  return (
    <ChatInterface 
      user={user} 
      onLogout={handleLogout}
    />
  );
}

export default App;
