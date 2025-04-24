import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import axios from 'axios'; // Import Axios

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Utility function to log in and get tokens
  const login = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/jwt/create/', {
        email: 'hamseldakrory14@gmail.com',
        password: 'team4',
      });

      const { access, refresh } = res.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      console.log('Login successful. Tokens saved.');
    } catch (err) {
      console.error('Login failed:', err);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  // Utility function to get access token
  const getAccessToken = async () => {
    let token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!token && !refreshToken) {
      console.error('No valid tokens found. Logging in...');
      await login(); // Log in if no tokens are found
      token = localStorage.getItem('access_token');
    }

    if (!token && refreshToken) {
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/auth/jwt/refresh/', {
          refresh: refreshToken,
        });
        token = res.data.access;
        localStorage.setItem('access_token', token); // Update access token
      } catch (err) {
        console.error('Failed to refresh token:', err);
        throw new Error('Authentication failed. Please log in again.');
      }
    }

    console.log('Access Token:', token); // Debug log
    return token;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = await getAccessToken(); // Get or refresh the token
      console.log('Sending message with token:', token); // Debug log

      // Send the chat message to backend with JWT using Axios
      const res = await axios.post(
        'http://127.0.0.1:8000/api/chatbot/',
        { message: input },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`,
          },
        }
      );

      // Handle response from backend
      if (res.data.response) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '⚠️ Error: ' + (res.data.error || 'Unknown error'),
          },
        ]);
      }
    } catch (err) {
      console.error('Error sending message:', err); // Debug log
      setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ Network error' }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
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
                msg.role === 'user' ? 'bg-blue-100 text-right ml-auto' : 'bg-gray-100 text-left'
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="bg-gray-100 p-3 rounded-2xl inline-block">
              <Loader2 className="animate-spin inline-block mr-2" /> AI is thinking...
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
          />
          <Button onClick={sendMessage} disabled={loading}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
