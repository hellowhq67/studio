
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, User, Bot } from 'lucide-react';
import { customerService } from '@/ai/flows/customer-service';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await customerService(input);
      const botMessage: Message = { text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Error with customer service AI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-end gap-2',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={20}/></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md rounded-2xl p-3 text-sm',
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                )}
              >
                {message.text}
              </div>
               {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User size={20}/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
               <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={20}/></AvatarFallback>
                </Avatar>
              <div className="bg-muted rounded-2xl p-3 rounded-bl-none">
                 <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || input.trim() === ''}>
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
