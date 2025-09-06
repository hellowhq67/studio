
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

const blogTopics = [
  {
    topic: 'The Ultimate Guide to a Flawless Foundation Routine',
    slug: 'ultimate-guide-flawless-foundation',
    category: 'Makeup',
    emoji: '🎨',
  },
  {
    topic: '5 Must-Have Skincare Ingredients for Radiant Skin',
    slug: '5-must-have-skincare-ingredients',
    category: 'Skincare',
    emoji: '✨',
  },
  {
    topic: 'Decoding Makeup Brushes: A Beginner\'s Guide',
    slug: 'decoding-makeup-brushes',
    category: 'Tools',
    emoji: '🖌️',
  },
  {
    topic: 'Top 7 Summer Hair Care Tips to Beat the Heat',
    slug: 'summer-hair-care-tips',
    category: 'Haircare',
    emoji: '☀️',
  },
  {
    topic: 'The Rise of Sustainable Beauty: What You Need to Know',
    slug: 'sustainable-beauty-rise',
    category: 'Trends',
    emoji: '🌿',
  },
  {
    topic: 'How to Find the Perfect Nude Lipstick for Your Skin Tone',
    slug: 'perfect-nude-lipstick',
    category: 'Makeup',
    emoji: '💄',
  },
];

const cardVariants = {
  initial: {
    y: 0,
    rotateX: 0,
    boxShadow: '0px 10px 15px -3px rgba(0,0,0, 0.1), 0px 4px 6px -2px rgba(0,0,0, 0.05)',
  },
  hover: {
    y: -5,
    rotateX: 5,
    boxShadow: '0px 20px 25px -5px rgba(var(--primary-hsl), 0.2), 0px 10px 10px -5px rgba(var(--primary-hsl), 0.1)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">From Our AI Brain</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Select a topic and our AI will generate a fresh blog post for you in seconds, powered by the latest web search results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: '1000px' }}>
        {blogTopics.map((post) => (
          <motion.div
            key={post.slug}
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            className="h-full"
          >
            <Link href={`/blog/${post.slug}`} className="contents">
              <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-border/20 rounded-xl overflow-hidden cursor-pointer transform-style-3d">
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-4xl">{post.emoji}</span>
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">{post.category}</span>
                  </div>
                  <h2 className="text-xl font-bold font-headline mt-4 mb-3 flex-grow">{post.topic}</h2>
                  <div className="mt-auto flex justify-between items-center text-sm text-primary">
                    <span>Generate Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
