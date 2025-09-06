
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useRef } from 'react';
import type { PutBlobResult } from '@vercel/blob';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminBannersPage() {
  const { toast } = useToast();
  const [heroTitle, setHeroTitle] = useState('Reality Redefined');
  const [heroDescription, setHeroDescription] = useState('Discover a new dimension of beauty that blurs the lines between the real and the imagined.');
  const [heroImage, setHeroImage] = useState('https://storage.googleapis.com/gemini-studio-assets/project-images/b4893708-5d25-4504-86dd-e13768b99529.jpeg');
  const [newsletterImage, setNewsletterImage] = useState('https://storage.googleapis.com/gemini-studio-assets/project-images/b9800e2b-2357-410a-ae42-95a2b8510c4d.jpeg');
  
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const newsletterFileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  const handleUpload = async (file: File | undefined, setImage: (url: string) => void, fieldName: string) => {
    if (!file) {
      toast({ variant: 'destructive', title: 'No file selected' });
      return;
    }

    setIsUploading(prev => ({...prev, [fieldName]: true}));

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Upload failed');
      }

      const newBlob = (await response.json()) as PutBlobResult;
      setImage(newBlob.url);

      toast({ title: 'Image Uploaded', description: 'Your new image is now displayed.' });

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Error', description: error.message });
    } finally {
      setIsUploading(prev => ({...prev, [fieldName]: false}));
    }
  };
  
  const handleSaveChanges = (bannerName: string) => {
    // In a real app, you'd save the new text and image URLs to your database
    console.log(`Saving ${bannerName}...`);
    console.log({heroTitle, heroDescription, heroImage, newsletterImage});
    toast({ title: `${bannerName} Saved`, description: 'Your changes have been saved.' });
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Home Page Hero Banner</CardTitle>
          <CardDescription>Update the main banner displayed on the home page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Title</Label>
            <Input id="hero-title" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-description">Description</Label>
            <Textarea id="hero-description" value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Current Image</Label>
            <div className="relative aspect-video w-full max-w-sm rounded-md overflow-hidden">
                <img src={heroImage} alt="Hero banner" className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-image">Upload New Image</Label>
            <div className="flex gap-2">
                <Input id="hero-image" type="file" ref={heroFileInputRef} />
                 <Button 
                    onClick={() => handleUpload(heroFileInputRef.current?.files?.[0], setHeroImage, 'hero')}
                    disabled={isUploading['hero']}
                >
                   {isUploading['hero'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   Upload
                 </Button>
            </div>
            <p className="text-xs text-muted-foreground">Recommended size: 1920x1080px</p>
          </div>
           <Button onClick={() => handleSaveChanges('Hero Banner')}>Save Changes</Button>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Newsletter Banner</CardTitle>
          <CardDescription>The banner for the newsletter signup section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label>Current Image</Label>
            <div className="relative aspect-[4.8/1] w-full max-w-lg rounded-md overflow-hidden">
                <img src={newsletterImage} alt="Newsletter banner" className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newsletter-image">Upload New Image</Label>
             <div className="flex gap-2">
                <Input id="newsletter-image" type="file" ref={newsletterFileInputRef} />
                <Button 
                    onClick={() => handleUpload(newsletterFileInputRef.current?.files?.[0], setNewsletterImage, 'newsletter')}
                    disabled={isUploading['newsletter']}
                >
                    {isUploading['newsletter'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Upload
                </Button>
            </div>
             <p className="text-xs text-muted-foreground">Recommended size: 1920x400px</p>
          </div>
           <Button onClick={() => handleSaveChanges('Newsletter Banner')}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
