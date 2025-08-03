import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

export default function AdminBannersPage() {
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
            <Input id="hero-title" defaultValue="Reality Redefined" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-description">Description</Label>
            <Textarea id="hero-description" defaultValue="Discover a new dimension of beauty that blurs the lines between the real and the imagined." />
          </div>
          <div className="space-y-2">
            <Label>Current Image</Label>
            <div className="relative aspect-video w-full max-w-sm rounded-md overflow-hidden">
                <Image src="https://storage.googleapis.com/gemini-studio-assets/project-images/b4893708-5d25-4504-86dd-e13768b99529.jpeg" alt="Hero banner" fill className="object-cover" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-image">Upload New Image</Label>
            <Input id="hero-image" type="file" />
            <p className="text-xs text-muted-foreground">Recommended size: 1920x1080px</p>
          </div>
           <Button>Save Changes</Button>
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
                <Image src="https://storage.googleapis.com/gemini-studio-assets/project-images/b9800e2b-2357-410a-ae42-95a2b8510c4d.jpeg" alt="Newsletter banner" fill className="object-cover" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newsletter-image">Upload New Image</Label>
            <Input id="newsletter-image" type="file" />
             <p className="text-xs text-muted-foreground">Recommended size: 1920x400px</p>
          </div>
           <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
