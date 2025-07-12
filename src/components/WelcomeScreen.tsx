import React from 'react';
import { MessageCircle, Sparkles, Zap, Globe, Shield, Clock, Code, Palette, Database, Cpu, Star, ArrowRight, Github, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Natural Conversations',
      description: 'Chat naturally with Google\'s advanced Gemini 2.0 Flash model that understands context and nuance',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'Creative & Intelligent',
      description: 'Get creative ideas, solve complex problems, and explore new concepts with AI assistance',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Powered by Google\'s latest AI technology for rapid, intelligent responses',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Communicate in multiple languages with global understanding and cultural awareness',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your conversations are stored locally with secure authentication and data protection',
      color: 'from-red-500 to-rose-500'
    },
    {
      icon: Clock,
      title: 'Persistent History',
      description: 'Access your complete chat history with advanced search and organization features',
      color: 'from-indigo-500 to-purple-500'
    },
  ];

  const technologies = [
    {
      icon: Code,
      name: 'React 18',
      description: 'Modern React with hooks and functional components',
      category: 'Frontend Framework'
    },
    {
      icon: Palette,
      name: 'TypeScript',
      description: 'Type-safe development with enhanced IDE support',
      category: 'Language'
    },
    {
      icon: Sparkles,
      name: 'Tailwind CSS',
      description: 'Utility-first CSS framework for rapid UI development',
      category: 'Styling'
    },
    {
      icon: Database,
      name: 'Local Storage',
      description: 'Client-side data persistence with JSON structure',
      category: 'Data Storage'
    },
    {
      icon: Cpu,
      name: 'Gemini 2.0 Flash',
      description: 'Google\'s most advanced AI model integration',
      category: 'AI Engine'
    },
    {
      icon: Zap,
      name: 'Vite',
      description: 'Next-generation frontend build tool for fast development',
      category: 'Build Tool'
    },
  ];

  const stats = [
    { label: 'AI Model', value: 'Gemini 2.0', icon: Cpu },
    { label: 'Response Time', value: '< 2s', icon: Zap },
    { label: 'Languages', value: '100+', icon: Globe },
    { label: 'Uptime', value: '99.9%', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Gemini Chat
              </span>
            </div>
            <button
              onClick={onStartChat}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-8 animate-fade-in">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Powered by Google's Latest AI Technology</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-fade-in leading-tight">
              The Future of
              <br />
              <span className="relative">
                AI Conversation
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transform scale-x-0 animate-scale-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}></div>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.5s' }}>
              Experience premium AI conversations with Google's Gemini 2.0 Flash model. 
              Built with modern React, TypeScript, and cutting-edge web technologies for 
              an unparalleled chat experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '1s' }}>
              <button
                onClick={onStartChat}
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Chatting Now
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live & Ready</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>100% Secure</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Powerful Features for
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Modern AI Chat</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the advanced capabilities that make our AI chat platform the perfect choice for intelligent conversations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="px-6 py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Built with
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Modern Technology</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Crafted using the latest web technologies and best practices for optimal performance, security, and user experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="group p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <tech.icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-800">{tech.name}</h3>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                          {tech.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{tech.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-2xl text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Experience the Future?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of users who are already experiencing the next generation of AI conversation
                </p>
                <button
                  onClick={onStartChat}
                  className="group px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-800">Gemini Chat</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span>Built with</span>
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>using React & TypeScript</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Powered by Google Gemini 2.0</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>© 2024 Gemini Chat. A premium AI conversation platform built with modern web technologies.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WelcomeScreen;