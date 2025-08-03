'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X } from 'lucide-react';

const POPUP_DISMISSED_KEY = 'glowup_popup_dismissed';

export default function PopupBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(POPUP_DISMISSED_KEY);
    if (!isDismissed) {
      // Delay popup to let the user settle
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(POPUP_DISMISSED_KEY, 'true');
    setIsOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      handleDismiss();
    }
    setIsOpen(open);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white p-0 max-w-2xl rounded-lg overflow-hidden">
         <DialogHeader>
            <DialogTitle className="sr-only">Exclusive Offer</DialogTitle>
         </DialogHeader>
         <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 text-gray-400 hover:text-white hover:bg-gray-700 z-10"
            onClick={handleDismiss}
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-full">
                 <img
                    src="https://storage.googleapis.com/gemini-studio-assets/project-images/7f9408d2-45e0-41a4-972d-419b49b3d76e.jpeg"
                    alt="Special Offer"
                    className="object-cover w-full h-full"
                    data-ai-hint="luxury beauty model"
                />
            </div>
            <div className="p-8 flex flex-col justify-center items-start">
                <h2 className="font-headline text-3xl md:text-4xl text-primary mb-3">Exclusive Offer</h2>
                <p className="text-gray-300 mb-6">
                    Sign up today and get <span className="text-accent font-bold">25% OFF</span> your first order. Discover your new favorite beauty essentials.
                </p>
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/signup">Shop Now</Link>
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
