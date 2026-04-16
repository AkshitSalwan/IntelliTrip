'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatTabProps {
  trip: any;
}

export function ChatTab({ trip }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>(trip.chatHistory || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/trips/${trip._id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: {
            destination: trip.destination,
            duration: trip.duration,
            interests: trip.interests,
          },
        }),
      });

      if (response.ok) {
        const assistantMessage = await response.json();
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-purple-200/50 bg-gradient-to-br from-white to-pink-50/30 p-6">
      {/* Chat Messages */}
      <div className="mb-4 flex-1 space-y-4 overflow-auto max-h-96">
        {messages.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <div className="mb-2">
              <h3 className="font-semibold text-purple-900">Ask AI Assistant</h3>
              <p className="mt-1 text-sm text-purple-600/70">
                Get personalized recommendations and trip planning advice
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-sm'
                    : 'bg-purple-100/50 text-purple-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-purple-100/50 px-4 py-2">
              <Loader className="h-4 w-4 animate-spin text-purple-600" />
              <span className="text-sm text-purple-600">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about your trip..."
          disabled={isLoading}
          className="flex-1 border-purple-200/50 bg-white/60 text-purple-900 placeholder:text-purple-400 focus:border-pink-400 focus:ring-pink-300/50"
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          size="icon"
          className="btn-gradient"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
