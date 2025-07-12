import React from 'react';
import { ChatMessage } from '../types/chat';
import { User, Bot, Clock, Copy, Check } from 'lucide-react';
import { formatMarkdown } from '../utils/markdown';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} mb-6 group animate-fade-in`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`
        max-w-[75%] relative
        ${isUser ? 'order-first' : ''}
      `}>
        <div className={`
          px-4 py-3 rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md
          ${isUser 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent' 
            : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300'
          }
          ${message.isLoading ? 'animate-pulse' : ''}
        `}>
          {message.isLoading ? (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-600">AI is thinking...</span>
            </div>
          ) : (
            <div className="text-sm leading-relaxed">
              {isUser ? (
                <div className="whitespace-pre-wrap">{message.content}</div>
              ) : (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMarkdown(message.content) 
                  }}
                />
              )}
            </div>
          )}
        </div>
        
        {/* Message Actions */}
        <div className={`
          flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
          ${isUser ? 'justify-end' : 'justify-start'}
        `}>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatTime(message.timestamp)}</span>
          </div>
          
          {!message.isLoading && (
            <button
              onClick={copyToClipboard}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-200 text-gray-500 hover:text-gray-700"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;