
import type { Metadata } from 'next';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import AdminPanel from './AdminPanel';
import { AuthProvider } from '@/hooks/useAuth';
import '../globals.css';


export const metadata: Metadata = {
  title: 'Evanie Glow Admin',
  description: 'Admin dashboard for Evanie Glow.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body>
            <AuthProvider>
                <TooltipProvider>
                <AdminPanel>{children}</AdminPanel>
                <Toaster />
                </TooltipProvider>
            </AuthProvider>
        </body>
    </html>
  );
}
