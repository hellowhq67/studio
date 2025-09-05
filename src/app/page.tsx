
'use client';

import { getProducts, seedSampleProduct } from '@/actions/product-actions';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { ArrowRight, Star, Heart, ShoppingCart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProductCard from '@/components/products/ProductCard';
import PopupBanner from '@/components/home/PopupBanner';
import AiAssistantLoader from '@/components/home/AiAssistantLoader';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import type { Product } from '@/lib/types';
import { Spotlight } from '@/components/ui/spotlight';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { FocusCards, Card as FocusCard } from '@/components/ui/focus-cards';
import { BackgroundBeams } from '@/components/ui/background-beams';


const CategoryCard = ({ img, title, dataAiHint }: { img: string, title: string, dataAiHint: string }) => (
    <Link href={`/category/${title.toLowerCase().replace(/ /g, '-')}`} className="text-center group">
        <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300">
            <img src={img} alt={title} className="w-full h-full object-cover" data-ai-hint={dataAiHint} />
        </div>
    </Link>
)

const testimonials = [
  {
    quote:
      "This is the best beauty product I've ever used. My skin feels amazing and looks so radiant. I highly recommend it to everyone!",
    name: 'Jenny Wilson',
    title: 'Marketing Coordinator',
    image: 'https://storage.googleapis.com/gemini-studio-assets/project-images/4915089c-3642-4265-af34-4a43b2933939.jpeg',
  },
  {
    quote:
      "The Radiant Glow Serum has completely transformed my skincare routine. I've never received so many compliments on my skin. A must-have!",
    name: 'Sarah Thompson',
    title: 'Graphic Designer',
    image: 'https://picsum.photos/100/100?random=10',
  },
  {
    quote:
      "I was skeptical at first, but the results speak for themselves. The Velvet Matte Lipstick lasts all day without drying out my lips. Incredible quality.",
    name: 'Jessica Miller',
    title: 'Software Engineer',
    image: 'https://picsum.photos/100/100?random=11',
  },
  {
    quote:
      'As a professional makeup artist, I am very picky about the products I use. Evanie Glow has exceeded all my expectations. The quality is simply superb.',
    name: 'Emily Rodriguez',
    title: 'Makeup Artist',
    image: 'https://picsum.photos/100/100?random=12',
  },
  {
    quote:
      'Customer service is top-notch, and the products are even better. The Midnight Bloom perfume is my new signature scent. I feel so confident wearing it.',
    name: 'Laura Chen',
    title: 'Project Manager',
    image: 'https://picsum.photos/100/100?random=13',
  },
];


const categoryFocusItems = [
    {
        url: "https://arhil8oggbq9cksx.public.blob.vercel-storage.com/Generated%20Image%20September%2005%2C%202025%20-%209_37PM.jpeg",
        title: "Skincare",
        description: "Pure ingredients for a natural glow.",
        href: "/category/skincare"
    },
    {
        url: "https://arhil8oggbq9cksx.public.blob.vercel-storage.com/Generated%20Image%20September%2005%2C%202025%20-%209_51PM.jpeg",
        title: "Makeup",
        description: "Express your vibrant self.",
        href: "/category/makeup"
    },
    {
        url: "https://arhil8oggbq9cksx.public.blob.vercel-storage.com/Generated%20Image%20September%2005%2C%202025%20-%209_39PM.jpeg",
        title: "Haircare",
        description: "Nourish your locks to perfection.",
        href: "/category/haircare"
    },
    {
        url: "https://arhil8oggbq9cksx.public.blob.vercel-storage.com/Generated%20Image%20September%2005%2C%202025%20-%209_58PM.jpeg",
        title: "Fragrance",
        description: "Captivating scents for every mood.",
        href: "/category/fragrance"
    }
]


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsAndSeed = async () => {
        await seedSampleProduct(); // This will seed the product if it doesn't exist
        const allProducts = await getProducts();
        setProducts(allProducts.slice(0, 8));
        setLoading(false);
    }
    fetchProductsAndSeed();
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="bg-background overflow-x-hidden">
      <PopupBanner />
      <AiAssistantLoader />
      {/* Hero Section */}
      <div className="relative flex h-[40rem] w-full overflow-hidden rounded-md bg-background antialiased md:items-center md:justify-center">
          <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
            <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
              Evanie Glow
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
            Discover your inner radiance with our exquisite collection of cosmetics.
            </p>
            <div className="flex justify-center mt-8">
                <Button asChild>
                    <Link href="/products">Shop Now</Link>
                </Button>
            </div>
          </div>
          <BackgroundBeams />
      </div>
      
      {/* Popular Categories */}
       <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <Button variant="outline" className="rounded-full pointer-events-none mb-2">Shop by categories</Button>
                <h2 className="text-4xl font-bold text-center">Popular Categories</h2>
              </div>
              <div className="mx-auto max-w-5xl">
                 <FocusCards>
                    {categoryFocusItems.map((item, i) => (
                        <FocusCard key={item.href}>
                             <Link href={item.href}>
                                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-card">
                                    <img src={item.url} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 p-4">
                                        <h3 className="mb-2 text-2xl font-medium text-white">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-zinc-300">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </FocusCard>
                    ))}
                 </FocusCards>
              </div>
          </div>
      </section>

      {/* Beauty Care Products */}
       <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Button variant="outline" className="rounded-full pointer-events-none mb-2">Top Brands</Button>
            <h2 className="text-4xl font-bold">Beauty Care Products</h2>
          </div>
          <ProductGrid products={products} />
           <div className="text-center mt-12">
                <Button variant="outline" asChild>
                    <Link href="/products">View All Products</Link>
                </Button>
           </div>
        </div>
      </section>

       {/* Featured Banners */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-card/50 p-8 rounded-lg flex items-center">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-2">Flawless Finish Powder!</h3>
              <p className="text-muted-foreground mb-4">New product with 10% off</p>
              <Button>Shop Now</Button>
            </div>
            <div className="flex-1">
                <img src="https://s4l5h54ozlgwxxa4.public.blob.vercel-storage.com/eva/Screenshot_20250903-043938.png" alt="Flawless Finish Powder" className="w-full object-contain" data-ai-hint="cosmetic powder jar" />
            </div>
          </div>
          <div className="grid gap-8">
              <div className="bg-card/50 p-6 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold">Stripes Are Back!</h4>
                  <p className="text-muted-foreground">Why Stripes is the best!</p>
                </div>
                <img src="https://storage.googleapis.com/gemini-studio-assets/project-images/e8c8949c-939e-4e43-982e-6ea10c43666b.jpeg" alt="Stripes" className="w-28 h-28 object-contain" data-ai-hint="beauty cream jar" />
              </div>
              <div className="bg-card/50 p-6 rounded-lg flex items-center justify-between">
                 <div>
                  <h4 className="text-2xl font-bold">Body Lotion</h4>
                  <p className="text-muted-foreground">Check Now</p>
                </div>
                <img src="https://storage.googleapis.com/gemini-studio-assets/project-images/01986161-2f08-4443-8588-4-48a31385dkc.jpeg" alt="Body Lotion" className="w-28 h-28 object-contain" data-ai-hint="applying body lotion" />
              </div>
          </div>
        </div>
      </section>
      
       {/* Highly Performing CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-lg overflow-hidden">
            <img src="https://storage.googleapis.com/gemini-studio-assets/project-images/7a421a97-920f-48d6-953e-f14d86b856a1.jpeg" alt="Flash Sale Banner" className="w-full h-full object-cover" data-ai-hint="cosmetic product sale" />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-end p-12 text-right">
               <div className="max-w-md">
                 <h2 className="text-5xl font-extrabold text-white leading-tight">FLASH<br />SALE!</h2>
                 <p className="text-2xl font-semibold text-white my-2">UP TO <span className="text-accent">50% OFF</span></p>
                 <p className="text-white/90 my-4">Experience Radiant Skin with our New Launch. Don't miss out on these amazing deals!</p>
                 <Button size="lg" asChild>
                   <Link href="/products">Shop Now</Link>
                 </Button>
               </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
       <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <Button variant="outline" className="rounded-full pointer-events-none mb-2">Testimonial</Button>
                <h2 className="text-4xl font-bold">What Our Clients Say</h2>
            </div>
             <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-md">
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                />
            </div>
          </div>
       </section>
       
       {/* Blog Section */}
        <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
                    <Button variant="outline" className="rounded-full pointer-events-none mb-2">Recent News</Button>
                    <h2 className="text-4xl font-bold">From The Blog</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-card/50 rounded-lg overflow-hidden shadow-sm">
                        <img src="https://storage.googleapis.com/gemini-studio-assets/project-images/42f9b33a-6b83-42e6-8987-9d41b5258e72.jpeg" alt="Blog post" className="w-full h-48 object-cover" data-ai-hint="beauty lifestyle" />
                        <div className="p-6">
                            <p className="text-sm text-muted-foreground mb-2">Jul 15, 2024 - By Alexia Glow</p>
                            <h3 className="font-bold text-lg mb-4">The Ultimate Guide to a Flawless Foundation Routine</h3>
                            <Link href="/blog/ultimate-guide-flawless-foundation" className="text-primary font-semibold flex items-center gap-2">
                                Read More <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                    <div className="bg-card/50 rounded-lg overflow-hidden shadow-sm">
                        <img src="https://storage.googleapis.com/gemini-studio-assets/project-images/75949175-1049-4340-8b10-189a05b4a742.jpeg" alt="Blog post" className="w-full h-48 object-cover" data-ai-hint="skincare products" />
                        <div className="p-6">
                            <p className="text-sm text-muted-foreground mb-2">Jul 10, 2024 - By Casey Derma</p>
                            <h3 className="font-bold text-lg mb-4">5 Must-Have Skincare Ingredients for Radiant Skin</h3>
                            <Link href="/blog/5-must-have-skincare-ingredients" className="text-primary font-semibold flex items-center gap-2">
                                Read More <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                    <div className="bg-card/50 rounded-lg overflow-hidden shadow-sm">
                        <img src="https://storage.googleapis.com/gemini-studio-assets/project-images/0b45d55b-77c8-4720-a685-613d9697d81a.jpeg" alt="Blog post" className="w-full h-48 object-cover" data-ai-hint="makeup brushes" />
                        <div className="p-6">
                            <p className="text-sm text-muted-foreground mb-2">Jul 05, 2024 - By Jen Brushstroke</p>
                            <h3 className="font-bold text-lg mb-4">Decoding Makeup Brushes: A Beginner's Guide</h3>
                            <Link href="/blog/decoding-makeup-brushes" className="text-primary font-semibold flex items-center gap-2">
                                Read More <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                     <div className="bg-card/50 rounded-lg overflow-hidden shadow-sm">
                        <img src="https://storage.googleapis.com/gemini-studio-assets/project-images/9140c838-51bb-455b-8032-4e0d421f2eed.jpeg" alt="Blog post" className="w-full h-48 object-cover" data-ai-hint="summer hair" />
                        <div className="p-6">
                            <p className="text-sm text-muted-foreground mb-2">Jun 28, 2024 - By Serena Strands</p>
                            <h3 className="font-bold text-lg mb-4">Top 7 Summer Hair Care Tips to Beat the Heat</h3>
                            <Link href="/blog/summer-hair-care-tips" className="text-primary font-semibold flex items-center gap-2">
                                Read More <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
                 <div className="text-center mt-12">
                     <Button asChild>
                         <Link href="/blog">More From The Blog</Link>
                    </Button>
                </div>
            </div>
        </section>

    </div>
  );
}
