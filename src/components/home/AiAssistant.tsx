
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Mic, Send, X, Loader2, MessageSquareHeart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatAssistant, textToSpeech } from '@/ai/flows/chat-assistant';
import type { Product } from '@/lib/types';
import ProductCard from '../products/ProductCard';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

type Message = {
  role: 'user' | 'assistant';
  text: string;
  products?: Product[];
  checkoutUrl?: string;
};

const suggestedPrompts = [
  "What's on sale?",
  "Show me some popular skincare products.",
  "Do you have any products with free delivery?",
  "I'm looking for a gift."
];

const welcomeMessage: Message = {
    role: 'assistant',
    text: "Hi, I'm Eva, your friendly shopping assistant! How can I help you today? You can ask me about products, sales, or anything else you need.",
};

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { addItem, clearCart } = useCart(); // Assuming addItem is stable

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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

    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatAssistant({ query: text });
      
      const assistantMessage: Message = { 
        role: 'assistant', 
        text: response.reply,
        products: (response.products as Product[] || []).map(p => ({...p, deliveryCharge: p.deliveryCharge || 0})),
        checkoutUrl: response.checkoutUrl,
      };

      // Check if a product was added to the cart by the assistant
      const toolCalls = (response as any).toolCalls;
      if (toolCalls) {
        const addToCartCall = toolCalls.find((call: any) => call.tool === 'addToCart');
        if (addToCartCall) {
            const product = await getProducts().then(prods => prods.find(p => p.id === addToCartCall.args.productId));
            if(product) {
                addItem(product, addToCartCall.args.quantity);
            }
        }
      }
      
      setMessages(prev => [...prev, assistantMessage]);

      const ttsResponse = await textToSpeech(response.reply);
      if (ttsResponse.media) {
        playAudio(ttsResponse.media);
      }

    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMessage: Message = { role: 'assistant', text: 'Sorry, I am having trouble connecting. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
            <CardTitle className="flex items-center gap-2"><Bot /> Eva</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-0">
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={cn('flex flex-col gap-2', msg.role === 'user' ? 'items-end' : 'items-start')}>
                     <div className={cn('flex items-end gap-2 w-full', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'assistant' && <Bot className="w-6 h-6 text-primary flex-shrink-0 self-start" />}
                        <div className={cn(
                          'max-w-[85%] p-3 rounded-lg',
                          msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}>
                          <p className="text-sm">{msg.text}</p>
                           {msg.checkoutUrl && (
                                <Button asChild size="sm" className="mt-2 w-full">
                                    <Link href={msg.checkoutUrl}>Proceed to Checkout</Link>
                                </Button>
                            )}
                        </div>
                     </div>
                     {msg.role === 'assistant' && msg.products && msg.products.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 mt-2 w-full pl-8">
                            {msg.products.slice(0, 2).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                     )}
                  </div>
                ))}
                 {messages.length === 1 && !isLoading && (
                    <div className="pt-4 pl-8 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />Suggestions</p>
                        {suggestedPrompts.map(prompt => (
                            <Button key={prompt} variant="outline" size="sm" className="w-full justify-start h-auto py-2 text-left" onClick={() => handleSendMessage(prompt)}>
                                {prompt}
                            </Button>
                        ))}
                    </div>
                 )}
                {isLoading && (
                   <div className='flex items-end gap-2 justify-start mt-4'>
                      <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                      <div className="bg-muted p-3 rounded-lg">
                         <Loader2 className="w-5 h-5 animate-spin"/>
                      </div>
                   </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Eva..."
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
