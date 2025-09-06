
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, X, Loader2, MessageSquareHeart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatAssistant, textToSpeech } from '@/ai/flows/chat-assistant';
import type { Product } from '@/lib/types';
import ProductCard from '../products/ProductCard';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getProducts } from '@/actions/product-actions';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  products?: Product[];
  checkoutUrl?: string;
};

const suggestedPrompts = [
  "What skincare collections do you have?",
  "Show me some popular products on sale.",
  "Do you have any items with free delivery?",
  "I'm looking for a gift."
];


export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();


  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  }

  useEffect(() => {
    if (isOpen && !hasWelcomed) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const welcomeMessage: Message = {
            id: Date.now(),
            role: 'assistant',
            text: `Hi ${user?.displayName || 'there'}, I'm Leo, your expert sales assistant! How can I help you find the perfect product today?`,
        };
        setMessages([welcomeMessage]);
        setIsLoading(false);
        setHasWelcomed(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasWelcomed, user]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendMessage(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleToggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const playAudio = (audioDataUri: string) => {
    const audio = new Audio(audioDataUri);
    audio.play();
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForGenkit = messages.map(({id, ...rest}) => rest);
      const response = await chatAssistant({ 
        query: text,
        userName: user?.displayName || undefined,
        history: historyForGenkit,
      });
      
      const assistantMessage: Message = { 
        id: Date.now() + 1,
        role: 'assistant', 
        text: response.reply,
        products: (response.products as Product[] || []).map(p => ({...p, deliveryCharge: p.deliveryCharge || 0})),
        checkoutUrl: response.checkoutUrl,
      };

      // Check if a product was added to the cart by the assistant
      if (response.products && response.products.length > 0) {
        // This is a simplified check. A more robust implementation might check
        // for a specific tool call confirmation in the response.
        const addedProduct = response.products.find(p => response.reply.toLowerCase().includes(p.name.toLowerCase()) && response.reply.toLowerCase().includes('added to your cart'));
        if (addedProduct) {
            const product = await getProducts().then(prods => prods.find(p => p.id === addedProduct.id));
            if(product) addItem(product, 1);
        }
      }
      
      setMessages(prev => [...prev, assistantMessage]);

      const ttsResponse = await textToSpeech(response.reply);
      if (ttsResponse.media) {
        playAudio(ttsResponse.media);
      }

    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMessage: Message = { id: Date.now() + 1, role: 'assistant', text: 'Sorry, I am having trouble connecting. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className={cn("fixed bottom-4 right-4 z-50 transition-transform duration-300", isOpen ? 'translate-x-[calc(100%+2rem)]' : 'translate-x-0')}>
        <Button onClick={() => setIsOpen(true)} size="lg" className="rounded-full w-16 h-16 shadow-lg bg-accent hover:bg-accent/90">
          <MessageSquareHeart className="w-8 h-8" />
        </Button>
      </div>

      <div className={cn(
          "fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",
          isOpen ? 'opacity-100 visible w-[380px] h-[600px]' : 'opacity-0 invisible w-0 h-0'
      )}>
        <Card className="w-full h-full flex flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
             <CardTitle className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://storage.googleapis.com/gemini-studio-assets/project-images/611a73a2-b45e-4402-be25-1e2474813f2b.jpeg" alt="Leo" />
                    <AvatarFallback>L</AvatarFallback>
                </Avatar>
                Leo
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-0">
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div 
                    key={msg.id} 
                    className={cn('flex flex-col gap-2', msg.role === 'user' ? 'items-end' : 'items-start')}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                     <div className={cn('flex items-end gap-2 w-full', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'assistant' && (
                             <Avatar className="h-8 w-8 flex-shrink-0 self-start">
                                <AvatarImage src="https://storage.googleapis.com/gemini-studio-assets/project-images/611a73a2-b45e-4402-be25-1e2474813f2b.jpeg" alt="Leo" />
                                <AvatarFallback>L</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                          'max-w-[85%] p-3 rounded-lg',
                          msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}>
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                           {msg.checkoutUrl && (
                                <Button asChild size="sm" className="mt-2 w-full">
                                    <Link href={msg.checkoutUrl}>Proceed to Checkout</Link>
                                </Button>
                            )}
                        </div>
                        {msg.role === 'user' && (
                             <Avatar className="h-8 w-8 flex-shrink-0 self-start">
                                <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                            </Avatar>
                        )}
                     </div>
                     {msg.role === 'assistant' && msg.products && msg.products.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 mt-2 w-full pl-10">
                            {msg.products.slice(0, 3).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                     )}
                  </motion.div>
                ))}
                </AnimatePresence>
                 {hasWelcomed && messages.length === 1 && !isLoading && (
                    <motion.div
                        className="pt-4 pl-10 space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />Suggestions</p>
                        {suggestedPrompts.map((prompt, i) => (
                            <motion.div
                                key={prompt}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                            >
                                <Button variant="outline" size="sm" className="w-full justify-start h-auto py-2 text-left" onClick={() => handleSendMessage(prompt)}>
                                    {prompt}
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                 )}
                {isLoading && (
                   <motion.div
                    className='flex items-end gap-2 justify-start mt-4'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                   >
                        <Avatar className="h-8 w-8 flex-shrink-0 self-start">
                           <AvatarImage src="https://storage.googleapis.com/gemini-studio-assets/project-images/611a73a2-b45e-4402-be25-1e2474813f2b.jpeg" alt="Leo" />
                           <AvatarFallback>L</AvatarFallback>
                       </Avatar>
                      <div className="bg-muted p-3 rounded-lg">
                         <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-0"></span>
                            <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150"></span>
                            <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-300"></span>
                         </div>
                      </div>
                   </motion.div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Leo..."
                  disabled={isLoading}
                />
                <Button type="button" variant={isListening ? "destructive" : "outline"} size="icon" onClick={handleToggleListen} disabled={!recognitionRef.current || isLoading}>
                    <Mic className="h-4 w-4" />
                </Button>
                <Button type="submit" size="icon" disabled={isLoading || !input}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    