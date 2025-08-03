import { products } from '@/lib/products';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Percent, Truck, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProductCard from '@/components/products/ProductCard';


const FeatureIcon = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="font-headline text-lg font-semibold">{title}</h3>
    <p className="text-muted-foreground mt-2 text-sm">{description}</p>
  </div>
)


export default function Home() {
  const featuredProducts = products.slice(0, 8);
  const latestProducts = products.slice(8, 12);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gray-900 text-white flex items-center">
        <div className="absolute inset-0">
            <Image
            src="https://storage.googleapis.com/gemini-studio-assets/project-images/b4893708-5d25-4504-86dd-e13768b99529.jpeg"
            alt="Beauty campaign"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
            data-ai-hint="beauty model face"
            />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
                <h1 className="font-headline text-5xl md:text-7xl text-white mb-4 uppercase tracking-wider">
                    Reality Redefined
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8">
                    Discover a new dimension of beauty that blurs the lines between the real and the imagined.
                </p>
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/products">Explore The Collection</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white text-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm text-primary font-semibold uppercase tracking-widest">A Curated Selection</p>
            <h2 className="font-headline text-4xl text-center mt-2">Add a Flavor to Being a Girl</h2>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="relative aspect-square">
                 <Image src="https://storage.googleapis.com/gemini-studio-assets/project-images/3494792d-c14e-4e4b-9e4a-57a5db740e50.jpeg" alt="A whole new look" fill className="object-cover rounded-lg shadow-lg" data-ai-hint="natural beauty product"/>
             </div>
             <div className="text-left">
                <p className="text-sm text-primary font-semibold uppercase tracking-widest">So mild so divine</p>
                <h2 className="font-headline text-4xl mt-2 mb-4">A Whole New Look</h2>
                <p className="text-muted-foreground mb-6">Discover our latest collection, crafted with natural ingredients to bring out your inner radiance. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <Button variant="outline">Read More</Button>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white text-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
            <FeatureIcon icon={Percent} title="Season Sale" description="Enjoy up to 20% off on selected items this season." />
            <FeatureIcon icon={Truck} title="Free Shipping" description="Free shipping on all orders over $50 across the country." />
            <FeatureIcon icon={ShieldCheck} title="Money Back Guarantee" description="Not satisfied? We offer a 14-day money-back guarantee." />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                     <p className="text-sm text-primary font-semibold uppercase tracking-widest">Testimonials</p>
                    <h2 className="font-headline text-4xl mt-2 mb-6">Our Happy Clients</h2>
                    <blockquote className="text-lg text-muted-foreground border-l-4 border-primary pl-6 italic mb-6">
                        "I'm absolutely in love with the quality and feel of these products. My skin has never looked better! Lorem ipsum dolor sit amet."
                    </blockquote>
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src="https://storage.googleapis.com/gemini-studio-assets/project-images/2a77a944-a1dc-413c-a815-5606d2d78707.jpeg" alt="Yusra Miller" />
                            <AvatarFallback>YM</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">Yusra Miller</p>
                            <p className="text-sm text-muted-foreground">Makeup Artist</p>
                        </div>
                    </div>
                </div>
                 <div className="relative aspect-square">
                    <Image src="https://storage.googleapis.com/gemini-studio-assets/project-images/593e105e-8533-455b-862d-966952763f92.jpeg" alt="Happy client" fill className="object-cover rounded-lg shadow-lg" data-ai-hint="woman smiling beauty"/>
                 </div>
            </div>
          </div>
      </section>
      
      {/* Latest Products Section */}
      <section className="py-16 bg-white text-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
            <p className="text-sm text-primary font-semibold uppercase tracking-widest">Discover What's New</p>
            <h2 className="font-headline text-4xl text-center mt-2">Latest Products</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latestProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-cover bg-center" style={{ backgroundImage: "url('https://storage.googleapis.com/gemini-studio-assets/project-images/b9800e2b-2357-410a-ae42-95a2b8510c4d.jpeg')" }}>
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="font-headline text-4xl">Sign-Up The Makeup Fan Club</h2>
            <p className="text-gray-300 my-4 max-w-2xl mx-auto">Join our fan club to receive exclusive offers, new product announcements, and beauty tips straight to your inbox.</p>
            <form className="max-w-md mx-auto flex gap-2 mt-8">
                <Input type="email" placeholder="Enter your email..." className="flex-grow bg-white/90 text-black placeholder:text-gray-500 h-12" />
                <Button type="submit" size="lg" className="h-12 bg-accent text-accent-foreground hover:bg-accent/90">Subscribe</Button>
            </form>
         </div>
      </section>
    </div>
  );
}
