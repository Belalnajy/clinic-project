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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const formatMessage = (content) => {
    const boldFormatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return boldFormatted.replace(/\n/g, '<br>');
  };

  const sendMessage = async () => {
    const currentMessage = input.trim();
    if (!currentMessage || loading) return;

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

      const assistantMessage = {
        role: 'assistant',
        content: res.data.response || 'No response from AI.',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${errorMsg}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto mt-10 shadow-xl rounded-2xl">
      <CardContent className="p-6 space-y-5">
        <h2 className="text-2xl font-bold text-center">Clinic Assistant</h2>
        <ScrollArea
          className="h-[400px] border rounded-lg p-4 overflow-y-auto bg-gray-50"
          ref={scrollRef}
        >
          <div className="flex flex-col space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] px-5 py-4 rounded-2xl shadow-md whitespace-pre-wrap break-words ${
                  msg.role === 'user'
                    ? 'bg-blue-100 ml-auto text-right'
                    : 'bg-white mr-auto text-left border'
                }`}
              >
                <div className="text-xs text-gray-500 font-medium mb-1">
                  {msg.role === 'user' ? 'You' : 'Assistant'} • {msg.timestamp}
                </div>
                {msg.role === 'assistant' ? (
                  <div
                    className="text-gray-800 text-sm leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                ) : (
                  <div className="text-sm text-gray-800">{msg.content}</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="bg-white border px-5 py-3 rounded-2xl inline-block mr-auto text-sm animate-pulse shadow-sm">
                <Loader2 className="animate-spin inline-block mr-2" />
                AI is thinking...
              </div>
            )}
          </div>
        </ScrollArea>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) sendMessage();
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a clinical or administrative question..."
            className="flex-1 resize-none border focus:ring-2 focus:ring-blue-500"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button type="submit" disabled={loading} className="h-10">
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
