
import { getProducts } from '@/actions/product-actions';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { ArrowRight, Star, Heart, ShoppingCart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProductCard from '@/components/products/ProductCard';
import PopupBanner from '@/components/home/PopupBanner';

const CategoryCard = ({ img, title, dataAiHint }: { img: string, title: string, dataAiHint: string }) => (
    <div className="text-center group">
        <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300">
            <img src={img} alt={title} className="w-full h-full object-cover" data-ai-hint={dataAiHint} />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
    </div>
)

const heroContent = {
  mainImage: {
    src: "https://s4l5h54ozlgwxxa4.public.blob.vercel-storage.com/download.jpeg",
    alt: "A radiant model showcasing Evanie Glow cosmetics",
    "data-ai-hint": "beauty model face"
  },
  sideImage: {
    src: "https://s4l5h54ozlgwxxa4.public.blob.vercel-storage.com/eva/Screenshot_20250903-043910.png",
    alt: "A portrait of a model with elegant makeup",
    "data-ai-hint": "beauty model portrait"
  },
  productCard: {
    src: "https://s4l5h54ozlgwxxa4.public.blob.vercel-storage.com/eva/Screenshot_20250903-044810.png",
    alt: "A luxurious cosmetic product bottle from Evanie Glow",
    "data-ai-hint": "cosmetic product bottle"
  }
};


export default async function Home() {
  const allProducts = await getProducts();
  const beautyCareProducts = allProducts.slice(0, 8);

  return (
    <div className="bg-background">
      <PopupBanner />
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="md:col-start-1">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-4">
              Evanie Glow Cosmetics
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover our new cosmetics. We believe in the power of nature to reveal your natural beauty and glow.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">Explore Collection <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
          <div className="relative flex items-center justify-center gap-4">
            <div className="relative w-40 h-64 rounded-t-full rounded-b-lg overflow-hidden shadow-lg">
                 <img src={heroContent.sideImage.src} alt={heroContent.sideImage.alt} className="w-full h-full object-cover" data-ai-hint={heroContent.sideImage['data-ai-hint']} />
            </div>
            <div className="relative w-64 h-96 rounded-t-full rounded-b-lg overflow-hidden shadow-2xl">
                 <img src={heroContent.mainImage.src} alt={heroContent.mainImage.alt} className="w-full h-full object-cover" data-ai-hint={heroContent.mainImage['data-ai-hint']} />
            </div>
             <div className="absolute top-1/2 -right-16 bg-card p-4 rounded-lg shadow-lg w-48">
                <p className="font-bold">Luxurious Beauty Product</p>
                 <div className="w-full h-24 my-2 rounded-md overflow-hidden">
                    <img src={heroContent.productCard.src} alt={heroContent.productCard.alt} className="w-full h-full object-cover" data-ai-hint={heroContent.productCard['data-ai-hint']}/>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg">$25.00</p>
                        <div className="flex text-yellow-400">
                           <Star size={16} fill="currentColor" />
                           <Star size={16} fill="currentColor" />
                           <Star size={16} fill="currentColor" />
                           <Star size={16} fill="currentColor" />
                           <Star size={16} />
                        </div>
                    </div>
                    <Button size="sm">Buy Now</Button>
                </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Categories */}
      <section className="py-16 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <Button variant="outline" className="rounded-full pointer-events-none mb-2">Shop by categories</Button>
                <h2 className="text-4xl font-bold text-center">Popular Categories</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
                <CategoryCard img="https://s4l5h54ozlgwxxa4.public.blob.vercel-storage.com/eva/1756851677967.png" title="Eye Shadow" dataAiHint="eyeshadow makeup" />
                <CategoryCard img="https://s4l5h54ozlgwxxa4.public.blob.vercel-storage.com/eva/1756851723167.png" title="Face Cream" dataAiHint="face cream product" />
                <CategoryCard img="https://picsum.photos/160/160" title="Skin Care" dataAiHint="woman skincare routine" />
                <CategoryCard img="https://picsum.photos/160/160" title="Body Spray" dataAiHint="perfume bottle" />
                <CategoryCard img="https://picsum.photos/160/160" title="Lipstick" dataAiHint="lipstick swatch" />
                <CategoryCard img="https://picsum.photos/160/160" title="Foundation" dataAiHint="foundation bottle" />
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
          <ProductGrid products={beautyCareProducts} />
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
          <div className="bg-card p-8 rounded-lg flex items-center">
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
              <div className="bg-card p-6 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold">Stripes Are Back!</h4>
                  <p className="text-muted-foreground">Why Stripes is the best!</p>
                </div>
                <img src="https://storage.googleapis.com/gemini-studio-assets/project-images/e8c8949c-939e-4e43-982e-6ea10c43666b.jpeg" alt="Stripes" className="w-28 h-28 object-contain" data-ai-hint="beauty cream jar" />
              </div>
              <div className="bg-card p-6 rounded-lg flex items-center justify-between">
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
            <div className="absolute inset-0 bg-black/10 flex flex-col justify-center items-end p-12 text-right">
               <div className="max-w-md">
                 <h2 className="text-5xl font-extrabold text-white leading-tight">FLASH<br />SALE!</h2>
                 <p className="text-2xl font-semibold text-white my-2">UP TO <span className="text-yellow-300">50% OFF</span></p>
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
       <section className="py-16 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <Button variant="outline" className="rounded-full pointer-events-none mb-2">Testimonial</Button>
                <h2 className="text-4xl font-bold">What Our Clients Say</h2>
            </div>
             <div className="relative">
                <div className="text-center max-w-2xl mx-auto">
                    <p className="text-lg text-muted-foreground mb-6">"This is the best beauty product I've ever used. My skin feels amazing and looks so radiant. I highly recommend it to everyone!"</p>
                    <div className="flex justify-center items-center gap-4">
                        <Avatar>
                            <AvatarImage src="https://storage.googleapis.com/gemini-studio-assets/project-images/4915089c-3642-4265-af34-4a43b2933939.jpeg" alt="Jenny Wilson" data-ai-hint="woman smiling"/>
                            <AvatarFallback>JW</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold">Jenny Wilson</p>
                            <p className="text-sm text-muted-foreground">Marketing Coordinator</p>
                        </div>
                    </div>
                </div>
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
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-card rounded-lg overflow-hidden shadow-sm">
                            <img src={`https://storage.googleapis.com/gemini-studio-assets/project-images/172e2938-7557-416b-9c99-382d5a35ba16.jpeg`} alt="Blog post" className="w-full h-48 object-cover" data-ai-hint="beauty lifestyle" />
                            <div className="p-6">
                                <p className="text-sm text-muted-foreground mb-2">Dec 22, 2022 - By Admin</p>
                                <h3 className="font-bold text-lg mb-4">Including Animation in Your Design System</h3>
                                <Link href="#" className="text-primary font-semibold flex items-center gap-2">
                                    Read More <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    </div>
  );
}
