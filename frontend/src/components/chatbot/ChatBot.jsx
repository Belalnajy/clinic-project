import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, History, Mic, MicOff, Database, ChevronLeft, ChevronRight, Calendar, RefreshCw, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ScrollAreaWithRef = forwardRef((props, ref) => {
  const { children, className, ...rest } = props;
  return (
    <div ref={ref} className={className} {...rest}>
      <ScrollArea>
        {children}
      </ScrollArea>
    </div>
  );
});

ScrollAreaWithRef.displayName = 'ScrollAreaWithRef';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTestingDB, setIsTestingDB] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  });
  const [dateRange, setDateRange] = useState(30); // Default to last 30 days
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    setupVoiceRecognition();
  }, [pagination.page, dateRange]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isTyping]);

  const setupVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await axiosInstance.get('/chatbot/', {
        params: {
          page: pagination.page,
          page_size: pagination.pageSize,
          days: dateRange
        }
      });

      if (response.data.messages && response.data.messages.length > 0) {
        const formattedMessages = response.data.messages
          .reverse()
          .map(msg => ({
            ...msg,
            timestamp: format(new Date(msg.timestamp), 'MMM d, yyyy h:mm a')
          }));
        
        setMessages(formattedMessages);
        setPagination(response.data.pagination);
        
        if (pagination.page === 1) {
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
          }, 100);
        }
      } else {
        setMessages([{
          role: 'assistant',
          content: 'Hello! How can I assist you today?',
          timestamp: format(new Date(), 'MMM d, yyyy h:mm a'),
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast.error('Failed to load chat history');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleDateRangeChange = (days) => {
    setDateRange(days);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setSelectedImage(file);
      toast.success('Image selected. Add a message (optional) and click send.');
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async () => {
    const currentMessage = input.trim();
    if ((!currentMessage && !selectedImage) || loading) return;

    const formData = new FormData();
    if (currentMessage) {
      formData.append('message', currentMessage);
    }
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    const userMessage = {
      role: 'user',
      content: currentMessage || 'Image uploaded',
      timestamp: format(new Date(), 'MMM d, yyyy h:mm a'),
      uploaded_image: selectedImage ? URL.createObjectURL(selectedImage) : null,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await axiosInstance.post('/chatbot/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const assistantMessage = {
        role: 'assistant',
        content: res.data.response || 'No response from AI.',
        timestamp: format(new Date(), 'MMM d, yyyy h:mm a'),
        image_url: res.data.image_url,
        is_image: res.data.is_image,
        has_image: res.data.has_image,
        revised_prompt: res.data.revised_prompt,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      if (err.response?.status === 401) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Please log in to chat with the assistant.',
            timestamp: format(new Date(), 'MMM d, yyyy h:mm a'),
          },
        ]);
      } else {
        const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Error: ${errorMsg}`,
            timestamp: format(new Date(), 'MMM d, yyyy h:mm a'),
          },
        ]);
      }
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const regenerateImage = async (originalPrompt) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/chatbot/', { 
        message: `regenerate: ${originalPrompt}`,
        is_regenerate: true
      });

      if (res.data.image_url) {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.is_image) {
            lastMessage.content = res.data.response;
            lastMessage.image_url = res.data.image_url;
            lastMessage.revised_prompt = res.data.revised_prompt;
          }
          return newMessages;
        });
      }
    } catch (error) {
      toast.error('Failed to regenerate image');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const testDatabaseConnection = async () => {
    setIsTestingDB(true);
    try {
      const response = await axiosInstance.get('/chatbot/test-db/');
      if (response.data.status === 'success') {
        toast.success('Database connection successful!');
      } else {
        toast.error('Database test failed');
      }
    } catch (error) {
      toast.error('Failed to test database connection');
      console.error('Database test error:', error);
    } finally {
      setIsTestingDB(false);
    }
  };

  const renderMessage = (message) => {
    const isAssistant = message.role === 'assistant';
    
    return (
      <div
        className={cn(
          'flex w-full gap-2 py-2',
          isAssistant ? 'bg-muted/50' : ''
        )}
      >
        <div className="flex-1 px-4">
          <div className="mb-1 text-xs text-muted-foreground">
            {message.role === 'assistant' ? 'AI Assistant' : 'You'} • {message.timestamp}
          </div>
          
          {(message.uploaded_image || message.image_url) && (
            <div className="mb-4">
              <img 
                src={message.uploaded_image || message.image_url} 
                alt="Uploaded or generated" 
                className="max-w-md rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          )}
          
          {message.is_image ? (
            <div className="space-y-4">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              <div className="relative group">
                <img 
                  src={message.image_url} 
                  alt="Generated" 
                  className="max-w-full rounded-lg shadow-lg"
                  loading="lazy"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => regenerateImage(message.revised_prompt || message.content)}
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Regenerate
                </Button>
              </div>
              {message.revised_prompt && (
                <p className="text-sm text-muted-foreground italic">
                  Revised prompt: {message.revised_prompt}
                </p>
              )}
            </div>
          ) : (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      language={match[1]}
                      PreTag="div"
                      style={vscDarkPlus}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-10 shadow-xl rounded-2xl">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Clinic Assistant</h2>
          <div className="flex space-x-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDateRangeChange(7)}
                className={dateRange === 7 ? 'bg-blue-100' : ''}
              >
                7d
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDateRangeChange(30)}
                className={dateRange === 30 ? 'bg-blue-100' : ''}
              >
                30d
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDateRangeChange(90)}
                className={dateRange === 90 ? 'bg-blue-100' : ''}
              >
                90d
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={testDatabaseConnection}
              disabled={isTestingDB}
              className="hover:bg-gray-100"
            >
              {isTestingDB ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Database className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        <ScrollAreaWithRef
          className="h-[500px] border rounded-lg p-4 overflow-y-auto bg-gray-50"
          ref={scrollRef}
        >
          <div className="flex flex-col space-y-4">
            {pagination.hasPrevious && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="flex items-center space-x-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Load Previous Messages</span>
                </Button>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={cn(
                  "max-w-[75%] px-5 py-4 rounded-2xl shadow-md whitespace-pre-wrap break-words",
                  msg.role === 'user'
                    ? 'bg-blue-100 ml-auto text-right'
                    : msg.is_error
                    ? 'bg-red-50 mr-auto text-left border border-red-200'
                    : 'bg-white mr-auto text-left border'
                )}
              >
                <div className="text-xs text-gray-500 font-medium mb-1">
                  {msg.role === 'user' ? 'You' : 'Assistant'} • {msg.timestamp}
                </div>
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))}
            
            {pagination.hasNext && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="flex items-center space-x-1"
                >
                  <span>Load More Messages</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {isTyping && (
              <div className="bg-white mr-auto text-left border max-w-[75%] px-5 py-4 rounded-2xl shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
          </div>
        </ScrollAreaWithRef>

        <div className="flex space-x-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="hover:bg-gray-100"
            disabled={loading}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>

          {selectedImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearImage}
              className="text-red-500 hover:text-red-700"
            >
              Clear Image
            </Button>
          )}

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={selectedImage ? "Add a message (optional) and click send" : "Type your message..."}
            className="flex-1 min-h-[60px] resize-none"
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoiceRecognition}
            className={cn(
              "hover:bg-gray-100",
              isListening && "bg-red-100 hover:bg-red-200"
            )}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            onClick={sendMessage}
            disabled={loading || (!input.trim() && !selectedImage)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
