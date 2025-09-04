'use client';

import Link from 'next/link';
import { User, Bell, Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/hooks/useAuth';

const Logo = () => (
    <Link href="/admin" className="flex items-center gap-2">
       <span className="text-3xl font-extrabold tracking-tight text-primary">Evanie</span>
       <span className="font-semibold text-xl text-foreground">Glow</span>
    </Link>
)

export default function AdminHeader() {
  const { user, logout } = useAuth();
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  }

  return (
     <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="flex items-center gap-4">
             <Button size="sm" variant="outline" className="h-8 w-8" asChild>
                <Link href="/">
                    <Home className="h-4 w-4" />
                    <span className="sr-only">Back to Site</span>
                </Link>
            </Button>
        </div>
        <div className="ml-auto flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
               <PopoverContent align="end" className="w-80">
                 <div className="p-4">
                    <h4 className="font-medium">Notifications</h4>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        <p>No new notifications</p>
                    </div>
                 </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
                >
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'Admin'} />
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/account">Settings</Link></DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
  )
}
