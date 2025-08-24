import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Logo = () => (
    <Link href="/" className="flex items-center gap-2">
       <span className="text-3xl font-extrabold tracking-tight text-primary">Evanie</span>
       <span className="font-semibold text-xl text-white">Glow</span>
    </Link>
)

export default function Footer() {
  return (
    <footer className="bg-foreground text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Logo />
            <p className="text-sm text-gray-400 mt-4 max-w-sm">
                Discover your radiance with Evanie Glow. We believe in the power of nature to reveal your natural beauty.
            </p>
            <div className="flex space-x-4 mt-4">
                <Link href="#" className="text-gray-400 hover:text-primary">f</Link>
                <Link href="#" className="text-gray-400 hover:text-primary">t</Link>
                <Link href="#" className="text-gray-400 hover:text-primary">in</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Customer Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/refund-policy" className="hover:text-primary">Returns & Exchanges</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary">Shop</Link></li>
              <li><Link href="/account" className="hover:text-primary">My Account</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
           <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Sign up for our newsletter to get the latest updates.</p>
            <form className="flex">
                <Input type="email" placeholder="Enter your email" className="bg-secondary/20 border-secondary/50 rounded-r-none" />
                <Button type="submit" className="rounded-l-none">Sign Up</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-secondary/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-center md:text-left text-gray-500">
            &copy; {new Date().getFullYear()} Evanie Glow. All Rights Reserved.
          </p>
           <div className="flex items-center gap-4 mt-4 md:mt-0">
             <img src="https://placehold.co/50x30/ffffff/000000?text=Visa" alt="Visa" />
             <img src="https://placehold.co/50x30/ffffff/000000?text=MC" alt="Mastercard" />
             <img src="https://placehold.co/50x30/ffffff/000000?text=Amex" alt="American Express" />
           </div>
        </div>
      </div>
    </footer>
  );
}
