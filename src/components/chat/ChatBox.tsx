import React, { useEffect, useRef, useState } from 'react';
import { sendMessage, listenForMessages, getOrCreateChat } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';

interface ChatBoxProps {
  caseId: string;
  clientId: string;
  clientName: string;
  lawyerId: string;
  lawyerName: string;
  userType: 'client' | 'lawyer';
  onClose?: () => void;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  caseId,
  clientId,
  clientName,
  lawyerId,
  lawyerName,
  userType,
  onClose
}) => {
  const { user } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine the other participant
  const otherName = userType === 'client' ? lawyerName : clientName;
  const otherAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherName)}&background=random&size=128`;

  useEffect(() => {
    const setupChat = async () => {
      setLoading(true);
      const id = await getOrCreateChat(caseId, clientId, clientName, lawyerId, lawyerName);
      setChatId(id);
      setLoading(false);
    };
    setupChat();
  }, [caseId, clientId, clientName, lawyerId, lawyerName]);

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = listenForMessages(chatId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    return () => unsubscribe && unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim() || !user || !chatId) return;
    await sendMessage(chatId, user.uid, user.displayName || otherName, input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-gray-100 flex flex-col items-center justify-center z-40">
      <div className="w-full max-w-3xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center gap-4 px-8 py-5 border-b bg-gradient-to-r from-blue-600 to-blue-400">
          <img
            src={otherAvatar}
            alt={otherName}
            className="w-12 h-12 rounded-full border-2 border-white shadow-md"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-wide">{otherName}</span>
            <span className="text-xs text-blue-100">Online</span>
          </div>
          {onClose && (
            <button className="ml-auto text-blue-100 hover:text-white text-2xl font-bold px-2 py-1 rounded-full transition" onClick={onClose}>&times;</button>
          )}
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-br from-blue-50 via-white to-gray-100 relative">
          {loading ? (
            <div className="text-center text-gray-400 mt-8">Loading chat...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">No messages yet. Say hello!</div>
          ) : (
            <div className="flex flex-col gap-2">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div className={`rounded-2xl px-5 py-3 max-w-[70%] text-base shadow-md transition-all duration-200 ${msg.senderId === user?.uid ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'}`}>
                    <div>{msg.text}</div>
                    <div className="text-xs text-right mt-1 opacity-60">
                      {msg.senderId === user?.uid ? 'You' : msg.senderName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <div className="flex items-center px-8 py-5 border-t bg-white sticky bottom-0">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 mr-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base bg-gray-50 shadow-sm"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            className="bg-blue-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-blue-700 transition text-base shadow-md disabled:opacity-50"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ChatBox; 