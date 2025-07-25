import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-headline text-2xl text-primary mb-4">GlowUp</h3>
            <p className="text-sm text-gray-400">
              Redefining beauty with products that care. High-performance, clean ingredients for a radiant you.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary">Shop</Link></li>
              <li><Link href="/account" className="hover:text-primary">My Account</Link></li>
              <li><Link href="#" className="hover:text-primary">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Details</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> <span>support@glowup.com</span></li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> <span>(555) 123-4567</span></li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> <span>123 Glow St, Beautyville</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
             <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-primary">
                Instagram
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                Facebook
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                Twitter
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-center md:text-left text-gray-500">
            &copy; {new Date().getFullYear()} GlowUp. All Rights Reserved.
          </p>
           <p className="text-gray-500 mt-4 md:mt-0">
             Designed by <Link href="#" className="text-primary hover:underline">Studio</Link>
           </p>
        </div>
      </div>
    </footer>
  );
}
