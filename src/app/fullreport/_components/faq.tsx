"use client"
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, Send, Circle } from "lucide-react";

interface insight {
  title: string;
  text: string;
}
interface FAQsProps {
  params: {
    _spt: string;
    _nme: string;
    _ct: string;
    _st: string;
    _rt: number;
  };
  report: {
    insights?: insight[];
    summary?: string;
    totalReviews?: number;
    yearlyData?: any[];
    positiveComments?: any;
    negativeComment?: any;
    originalApiResponse?: any[];
  };
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp?: string;
}

const FAQs = ({ params, report }: FAQsProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 5;
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const sampleFAQs = [
    "What is the doctor's specialization?",
    "What are patients saying?",
    "What is the doctor's rating?",
    "Is there anything to note about the doctor?"
  ];

  const getWebSocketUrl = () => {
    return process.env.NEXT_PUBLIC_WS_URL;
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth', force: boolean = false) => {
    const container = messagesContainerRef.current;
    if (container) {

      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

      if (force || isNearBottom || behavior === 'auto') {
        setTimeout(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: behavior
          });
        }, 10);
      }
    }
  };

  const connectWebSocket = useCallback(() => {
    // Clean up existing connection
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close();
    }

    try {
      setConnectionError(null);
      console.log('Attempting to connect to WebSocket...');

      const wsUrl = getWebSocketUrl();
      console.log('Connecting to:', wsUrl);
      const ws = new WebSocket(wsUrl);

      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          setConnectionError('Connection timeout. Please try again.');
        }
      }, 10000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        setReconnectAttempts(0);
        setConnectionError(null);

        try {
          ws.send(JSON.stringify({
            type: 'INIT_CHAT',
            payload: { params, report }
          }));
        } catch (sendError) {
          console.error('Error sending init message:', sendError);
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setIsBotTyping(false);

        // Only attempt to reconnect if it wasn't a manual close and we haven't exceeded max attempts
        if (event.code !== 1000 && event.code !== 1001 && reconnectAttempts < maxReconnectAttempts) {
          const timeout = Math.min(Math.pow(2, reconnectAttempts) * 1000, 30000); // Max 30 seconds
          console.log(`Reconnecting in ${timeout}ms... (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connectWebSocket();
          }, timeout);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          setConnectionError('Unable to connect to chat service. Please refresh the page.');
        }
      };

      ws.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('WebSocket error occurred:', error);

        if (wsRef.current?.readyState === WebSocket.CONNECTING) {
          setConnectionError('Failed to connect to chat service. Please check if the server is running.');
        } else {
          setConnectionError('Connection error occurred. Trying to reconnect...');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to establish connection. Please check if the server is running.');
    }
  }, [params, report, reconnectAttempts]);

  const handleWebSocketMessage = (data: any) => {
    const { type, payload } = data;

    switch (type) {
      case 'CHAT_INITIALIZED':
        setMessages([{ role: 'bot', content: payload.message }]);
        break;

      case 'BOT_TYPING':
        setIsBotTyping(payload.isTyping);
        if (payload.isTyping) {
          scrollToBottom('smooth', true);
        }
        break;

      case 'BOT_RESPONSE':
        setIsBotTyping(false);
        setMessages(prev => [...prev, {
          role: 'bot',
          content: payload.message,
          timestamp: payload.timestamp
        }]);
        break;

      case 'ERROR':
        setIsBotTyping(false);
        setConnectionError(payload.message);
        break;

      default:
        console.warn('Unknown message type:', type);
    }
  };

  useEffect(() => {
    // Delay the initial connection slightly to ensure component is fully mounted
    const connectionDelay = setTimeout(() => {
      connectWebSocket();
    }, 100);

    return () => {
      clearTimeout(connectionDelay);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        console.log('Closing WebSocket connection...');
        wsRef.current.close(1000, 'Component unmounting');
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom('auto', true);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      scrollToBottom('smooth', lastMessage.role === 'bot');
    }
  }, [messages]);

  useEffect(() => {
    if (isBotTyping) {
      scrollToBottom('smooth', true);
    }
  }, [isBotTyping]);

  const sendMessage = (messageText: string) => {
    if (!messageText.trim() || isBotTyping || !isConnected) return;

    const newUserMessage: Message = { role: 'user', content: messageText };

    setMessages(prev => [...prev, newUserMessage]);

    // Send message through WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'CHAT_MESSAGE',
        payload: {
          message: messageText,
          conversationHistory: messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }
      }));
    } else {
      setConnectionError('Connection lost. Trying to reconnect...');
      connectWebSocket();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const retryConnection = () => {
    setConnectionError(null);
    setReconnectAttempts(0);
    connectWebSocket();
  };

  // Function to convert markdown-style formatting to HTML
  const formatMessage = (text: string) => {
    if (!text) return '';

    // Convert **text** to <strong>text</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert *text* to <em>text</em> (italic)
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert bullet points • to proper list items
    formatted = formatted.replace(/^•\s*(.*)$/gm, '<li>$1</li>');

    // Convert numbered lists
    formatted = formatted.replace(/^\d+\.\s*(.*)$/gm, '<li>$1</li>');

    // Wrap lists in <ul> tags - using a different approach without 's' flag
    if (formatted.includes('<li>')) {
      const lines = formatted.split('\n');
      let inList = false;
      let result = '';

      for (const line of lines) {
        if (line.includes('<li>')) {
          if (!inList) {
            result += '<ul>';
            inList = true;
          }
          result += line + '\n';
        } else {
          if (inList) {
            result += '</ul>';
            inList = false;
          }
          result += line + '\n';
        }
      }

      if (inList) {
        result += '</ul>';
      }

      formatted = result;
    }

    // Convert line breaks to <br> tags
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  };

  const replaceObjectObjectWithKeyPoints = (msg: string) => {
    if (!msg.includes('[object Object]')) return msg;
    if (!report.insights) return msg;
    const keyPointsText = report.insights.map(i => `• ${i.text}`).join('\n');
    return msg.replace(/\[object Object\](\n)?/g, keyPointsText + '\n');
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl  font-semibold mb-8">
        Ask About {params._nme}
      </h1>


      <div className="flex items-center gap-1 mb-4">
        <Circle className={`w-4 h-4 ${isConnected ? 'fill-green-600' : 'fill-red-500'}`} />
        <p className="text-primary font-semibold">
          Doctor Information {isConnected ? '(Connected)' : '(Disconnected)'}
        </p>
      </div>


      {connectionError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center justify-between">
          <span className="text-red-700">{connectionError}</span>
          <button
            onClick={retryConnection}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      <div
        ref={messagesContainerRef}
        className="h-96 overflow-y-auto mb-6 border rounded-xl p-4 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-[90%] p-4 rounded-2xl ${msg.role === 'user'
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
              }`}>
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: formatMessage(replaceObjectObjectWithKeyPoints(msg.content)) }}
              />
              {msg.timestamp && (
                <div className="text-xs mt-2 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        ))}
        {isBotTyping && (
          <div className="text-left mb-4">
            <div className="inline-block max-w-[90%] p-4 rounded-2xl bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-none shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
        {sampleFAQs.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuickQuestion(question)}
            className="bg-[#F7F9FB] hover:bg-gray-100 rounded-full p-3 transition-colors disabled:opacity-50"
            disabled={!isConnected}
          >
            <p className="text-primary text-sm">{question}</p>
          </button>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="relative">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isConnected ? "Ask about the doctor..." : "Connecting..."}
          className="w-full p-4 pl-12 pr-16 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
          disabled={isBotTyping || !isConnected}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary rounded-full p-3 hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!inputMessage.trim() || isBotTyping || !isConnected}
        >
          <Send className="text-white" size={20} />
        </button>
      </form>
    </main>
  );
};

export default FAQs;