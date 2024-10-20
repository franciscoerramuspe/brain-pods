import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { User, RealtimeChannel } from '@supabase/supabase-js';

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name: string;
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
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const subscriptionRef = useRef<RealtimeChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_message')
        .select('*')
        .eq('pod_id', podId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else if (data) {
        setMessages(data);
      }
    };

    fetchMessages();

    // Set up subscription for new messages
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
    }

    const channel = supabase
      .channel('public:chat_message')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_message',
          filter: `pod_id=eq.${podId}`,
        },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    subscriptionRef.current = channel;

    // Cleanup
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [podId]);

  // Fetch user names when messages change
  useEffect(() => {
    // Create a set of known user IDs
    const knownUserIds = new Set(Object.keys(userNames));

    // Find new user IDs from messages that are not in userNames
    const newUserIds = messages
      .filter((m) => m.user_id !== user.id)
      .map((m) => m.user_id)
      .filter((id) => !knownUserIds.has(id));

    const uniqueUserIds = Array.from(new Set(newUserIds));

    if (uniqueUserIds.length === 0) return;

    const fetchUserNames = async () => {
      const uniqueUserIds = Array.from(
        new Set(
          messages
            .filter((m) => m.user_id !== user.id && !userNames[m.user_id])
            .map((m) => m.user_id)
        )
      );

      if (uniqueUserIds.length === 0) return;

      const { data, error } = await supabase
        .from('raw_user_meta_data')
        .select('user_id, name')
        .in('user_id', uniqueUserIds);

      if (error) {
        console.error('Error fetching user names:', error);
      } else if (data) {
        const newUserNames = Object.fromEntries(
          data.map((profile) => [profile.user_id, profile.name || 'Anonymous'])
        );
        setUserNames((prev) => ({ ...prev, ...newUserNames }));
      }
    };

    fetchUserNames();
  }, [messages, userNames]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const messageData = {
      content: newMessage,
      pod_id: podId,
      user_id: user.id,
      user_name: user.user_metadata.full_name || 'Anonymous',
      created_at: new Date().toISOString(),
      role: 'STUDENT',
      is_private: false,
    };

    const { data, error } = await supabase.from('chat_message').insert([messageData]).select();

    if (error) {
      console.error('Error sending message:', error);
      return;
    } else if (data && data.length > 0) {
      setNewMessage('');
      // Messages will update via the subscription
    } else {
      console.warn('No error occurred, but no data was returned');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1E1E1E] text-white">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.user_id === user.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`w-[70%] p-2 rounded-lg ${
                message.user_id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              <div className="text-xs mb-1">
                {message.user_id === user.id ? 'You' : message.user_name}
              </div>
              <p className="text-sm break-words">{message.content}</p>
            </div>
          </div>
        ))}
        {/* Div to scroll into view */}
        <div ref={messagesEndRef} />
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
