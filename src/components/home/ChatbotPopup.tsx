'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { customerService } from '@/ai/flows/customer-service';
import { Bot, Loader2, Send } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatbotPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await customerService(input);
      const botMessage: Message = { text: response, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message to Genkit:', error);
      const errorMessage: Message = { text: 'Sorry, I am having trouble connecting. Please try again later.', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg">
            <Bot size={28} />
            <span className="sr-only">Open Chatbot</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>GlowUp Assistant</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
                <div key={index} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                    {message.sender === 'bot' && <Avatar className="h-8 w-8"><AvatarFallback>G</AvatarFallback></Avatar>}
                    <span className={`max-w-[75%] inline-block p-3 rounded-2xl ${message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                        {message.text}
                    </span>
                </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2">
                <Avatar className="h-8 w-8"><AvatarFallback>G</AvatarFallback></Avatar>
                <span className="flex items-center gap-2 p-3 rounded-2xl bg-muted rounded-bl-none">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                </span>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotPopup;

const Avatar = ({children, className}: {children: React.ReactNode, className?: string}) => (
    <div className={`flex items-center justify-center bg-primary text-primary-foreground rounded-full ${className}`}>
        {children}
    </div>
)

const AvatarFallback = ({children}: {children: React.ReactNode}) => (
    <span className="font-bold">{children}</span>
)
