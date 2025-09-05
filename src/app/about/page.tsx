
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Eye } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <img 
                    src="https://storage.googleapis.com/gemini-studio-assets/project-images/42f9b33a-6b83-42e6-8987-9d41b5258e72.jpeg" 
                    alt="Our Team" 
                    className="absolute inset-0 w-full h-full object-cover"
                    data-ai-hint="team working" 
                />
                <div className="relative z-20 container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-headline font-bold">About Evanie Glow</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                        Discover the story, mission, and values behind your favorite beauty brand.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-headline font-bold text-primary mb-4">Our Story</h2>
                        <p className="text-muted-foreground mb-4">
                            Evanie Glow was founded on the belief that beauty should be an empowering celebration of individuality. Frustrated by a market saturated with one-size-fits-all solutions, our founders envisioned a brand that blended the best of nature with cutting-edge science to create products that are both effective and a joy to use.
                        </p>
                        <p className="text-muted-foreground">
                            From a small workshop to a beloved global brand, our journey has been fueled by a passion for quality, innovation, and a deep respect for our customers and the planet. We are more than just a cosmetics company; we are a community dedicated to helping you discover and enhance your unique radiance.
                        </p>
                    </div>
                    <div className="rounded-lg overflow-hidden shadow-xl">
                        <img 
                            src="https://storage.googleapis.com/gemini-studio-assets/project-images/75949175-1049-4340-8b10-189a05b4a742.jpeg" 
                            alt="Evanie Glow Products" 
                            className="w-full h-full object-cover"
                            data-ai-hint="skincare products flatlay"
                        />
                    </div>
                </div>
            </section>

            {/* Mission and Vision Section */}
            <section className="py-16 lg:py-24 bg-card">
                <div className="container mx-auto px-4 text-center">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="flex flex-col items-center">
                            <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                                <Target className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-headline font-bold mb-2">Our Mission</h3>
                            <p className="text-muted-foreground max-w-md">
                                To craft high-performance, conscious beauty products that inspire creativity and confidence, making luxury and efficacy accessible to all.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                                <Eye className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-headline font-bold mb-2">Our Vision</h3>
                            <p className="text-muted-foreground max-w-md">
                                To be a global leader in inclusive and sustainable beauty, fostering a community where everyone feels seen, valued, and empowered to glow their own way.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

    