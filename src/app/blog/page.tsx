
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/blog-data';

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">From Our Blog</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Get the latest beauty tips, skincare advice, and product news.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="overflow-hidden flex flex-col group">
            <Link href={`/blog/${post.slug}`} className="contents">
              <CardHeader className="p-0">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="beauty blog"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col">
                <p className="text-sm text-muted-foreground mb-2">
                  By {post.author} on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h2 className="text-xl font-bold font-headline mb-3 flex-grow">{post.title}</h2>
                <p className="text-muted-foreground mb-4 text-sm">{post.description}</p>
                 <div className="mt-auto">
                   <Button variant="link" className="p-0 h-auto text-primary">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                   </Button>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
