import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/hooks/useCart';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/hooks/useAuth';
import { GeistSans } from 'geist/font/sans';
import { CurrencyProvider } from '@/hooks/useCurrency';
import { app } from '@/lib/firebase'; // Ensure firebase is initialized


export const metadata: Metadata = {
  title: 'Evanie Glow',
  description: 'Discover your radiance with Evanie Glow cosmetics.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${GeistSans.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
