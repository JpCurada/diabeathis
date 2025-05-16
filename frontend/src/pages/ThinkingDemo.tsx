import React, { useState } from 'react';
import ChatArea from '../components/chatbot/ChatArea';

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

const ThinkingDemo = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-1',
      role: 'system',
      content: 'You are Debie, a friendly and knowledgeable diabetes management assistant.'
    }
  ]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // This would normally be where you'd call your backend API
    // But our useThinkingProcess hook already handles the "thinking" UI
    // After thinking completes, add the assistant response
    
    // We don't immediately add the assistant message because the thinking process
    // is handling the visual transition to the final response
    
    // Wait for the thinking process to complete (this timing is set in ChatArea.tsx)
    // and then add the message to the chat history
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            DiaBeatThis: Agentic Thinking Demo
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            See how our AI assistant thinks through diabetes management queries
          </p>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden min-h-[calc(100vh-10rem)]">
            <ChatArea 
              messages={messages} 
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-sm p-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Powered by DiaBeatThis AI Assistant | Try asking about glucose readings, diet recommendations, or exercise plans</p>
        </div>
      </footer>
    </div>
  );
};

export default ThinkingDemo; 