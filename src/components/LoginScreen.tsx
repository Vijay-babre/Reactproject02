import React, { useState } from 'react';
import { User, LogIn, UserPlus, MessageCircle, Shield, Clock } from 'lucide-react';
import { loginUser, registerUser } from '../utils/auth';

interface LoginScreenProps {
  onLogin: (user: any) => void;
  onGuestMode: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGuestMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let user;
      if (isLogin) {
        user = await loginUser(username, password);
        if (!user) {
          setError('Invalid username or password');
          setIsLoading(false);
          return;
        }
      } else {
        user = await registerUser(username, password);
        if (!user) {
          setError('Username already exists or invalid input');
          setIsLoading(false);
          return;
        }
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome to Gemini Chat
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to access your chat history' : 'Create an account to get started'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-8 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only letters, numbers, and underscores allowed
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setUsername('');
                setPassword('');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Guest Mode */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onGuestMode}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Continue as Guest
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Guest mode - your chats won't be saved permanently
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 animate-fade-in">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
            <Shield className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Secure</p>
            <p className="text-xs text-gray-500">Your data is protected</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">History</p>
            <p className="text-xs text-gray-500">Access your past chats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
