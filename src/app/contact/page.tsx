
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import LiveChat from '@/components/contact/LiveChat';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Contact Us</h1>
        <p className="text-lg text-muted-foreground mt-4">We're here to help! Reach out to us anytime.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Find our contact details below. We look forward to hearing from you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">support@evanieglow.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-muted-foreground">123 Beauty Lane, Glamour City, 90210</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
                <p>Monday - Friday: 9:00 AM - 6:00 PM (PST)</p>
                <p>Saturday: 10:00 AM - 4:00 PM (PST)</p>
                <p>Sunday: Closed</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Get instant answers from our AI-powered support agent.</CardDescription>
            </CardHeader>
            <CardContent>
              <LiveChat />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
