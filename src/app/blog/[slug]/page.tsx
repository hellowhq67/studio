
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/blog-data';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, User } from 'lucide-react';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  if (!post) {
    notFound();
  }

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <article>
        <header className="mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
             <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    {/* Placeholder for author image */}
                    <AvatarFallback>{getInitials(post.author)}</AvatarFallback>
                </Avatar>
                <span>{post.author}</span>
             </div>
             <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
             </div>
          </div>
        </header>

        <div className="w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
            data-ai-hint="beauty article"
          />
        </div>

        <Card>
            <CardContent>
                 <div 
                    className="prose dark:prose-invert max-w-none text-muted-foreground py-6"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </CardContent>
        </Card>
      </article>
    </div>
  );
}
