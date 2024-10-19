import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  pod_id: string;
  role: string;
  is_private: boolean;
}

interface ChatProps {
  podId: string;
  user: User;
}

export default function Chat({ podId, user }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    console.log('Chat component mounted. podId:', podId, 'userId:', user.id);

    // Fetch initial messages
    const fetchMessages = async () => {
      console.log('Fetching initial messages...');
      const { data, error } = await supabase
        .from('chat_message')
        .select('*')
        .eq('pod_id', podId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else if (data) {
        console.log('Initial messages fetched:', data);
        setMessages(data);
      }
    };

    fetchMessages();

    // Subscribe to database changes
    const channel = supabase
      .channel('public:chat_message')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_message',
          filter: `"pod_id"=eq.${podId}`,
        },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Current session:', sessionData?.session);
      if (!sessionData?.session) {
        console.error('User is not authenticated');
        // Handle unauthenticated user (e.g., redirect to login page)
      }
    };

    checkSession();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [podId, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    console.log('Attempting to send message:', newMessage);

    const messageData = {
      content: newMessage,
      pod_id: podId,
      user_id: user.id,
      created_at: new Date().toISOString(),
      role: 'STUDENT',
      is_private: false,
    };

    console.log('Message data to be inserted:', messageData);

    const { data, error } = await supabase.from('chat_message').insert([messageData]).select();

    if (error) {
      console.error('Error sending message:', error);
      console.log('Error details:', error.details, 'Error hint:', error.hint);
      return;
    } else if (data && data.length > 0) {
      console.log('Message sent successfully:', data[0]);
      setNewMessage('');
      setMessages(prevMessages => [...prevMessages, data[0]]);
    } else {
      console.warn('No error occurred, but no data was returned');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1E1E1E] text-white">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col justify-end">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.user_id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`w-[70%] p-2 rounded-lg ${
                message.user_id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              <div className="text-xs mb-1">
                {message.user_id === user.id ? 'You' : user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'}
              </div>
              <p className="text-sm break-words">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex rounded-full bg-[#2C2C2C] overflow-hidden border border-gray-700">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}