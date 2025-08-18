'use client';

import Link from 'next/link';
import { ShoppingBag, User, Menu, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import CartSheetContent from '@/components/cart/CartSheetContent';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useCurrency } from '@/hooks/useCurrency';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const Logo = () => (
    <Link href="/" className="flex items-center gap-2">
       <span className="text-3xl font-extrabold tracking-tight text-primary">EVQ</span>
       <span className="font-semibold text-xl text-foreground">EVANIEGLOW</span>
    </Link>
)

const CurrencySwitcher = () => {
    const { currency, setCurrency } = useCurrency();

    return (
        <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-auto h-9 text-sm bg-transparent border-0 shadow-none focus:ring-0">
                <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="BDT">BDT</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default function Header() {
  const { itemCount } = useCart();
  const { user, loading, logout } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center">
        <div className="md:hidden">
            <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <Logo />
                <nav className="flex flex-col space-y-4 mt-8">
                    {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="transition-colors hover:text-primary text-lg"
                    >
                        {link.label}
                    </Link>
                    ))}
                </nav>
            </SheetContent>
            </Sheet>
        </div>
        
        <div className="hidden md:flex">
            <Logo />
        </div>

        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex items-center space-x-8 text-base font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>


        <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <Search className="h-5 w-5" />
            </Button>
             <div className="hidden md:flex items-center">
                <CurrencySwitcher />
                <Select defaultValue="en">
                    <SelectTrigger className="w-auto h-9 text-sm bg-transparent border-0 shadow-none focus:ring-0">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {itemCount}
                    </span>
                  )}
                  <span className="sr-only">Shopping Cart</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <CartSheetContent />
              </SheetContent>
            </Sheet>

            {!loading && (
              user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuItem asChild>
                        <Link href="/account">
                          <User className="mr-2 h-4 w-4" />
                          <span>Account</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                 <Button asChild>
                    <Link href="/login">
                        <User className="mr-2 h-4 w-4" />
                        Login
                    </Link>
                 </Button>
              )
            )}
        </div>
      </div>
    </header>
  );
}