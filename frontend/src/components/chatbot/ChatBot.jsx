import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import axiosInstance from '@/lib/axios';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! How can I assist you today?',
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const sendMessage = async () => {
    const currentMessage = input.trim();
    if (!currentMessage) return;

    const userMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/chatbot/', { message: currentMessage });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.response || 'No response from AI',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Error: ${err.response?.data?.error || err.message || 'Unknown error'}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10 shadow-lg">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold">💬 Clinic Assistant</h2>

        <ScrollArea className="h-80 border rounded-md p-4 space-y-4" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl max-w-sm ${
                msg.role === 'user'
                  ? 'bg-blue-100 text-right ml-auto'
                  : 'bg-gray-100 text-left mr-auto'
              }`}
            >
              <div className="font-medium">
                {msg.role === 'user' ? 'You' : 'Assistant'}
                <span className="text-xs text-gray-500 ml-2">{msg.timestamp}</span>
              </div>
              <div>{msg.content}</div>
            </div>
          ))}

          {loading && (
            <div className="bg-gray-100 p-3 rounded-2xl inline-block">
              <Loader2 className="animate-spin inline-block mr-2" />
              AI is thinking...
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1"
            rows={2}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
