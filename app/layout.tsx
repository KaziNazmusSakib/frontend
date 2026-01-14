import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/global.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nexify Store - Modern E-commerce Platform',
  description: 'A full-featured e-commerce platform built with Next.js and Nest.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className} min-h-screen bg-base-100`}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="footer footer-center p-10 bg-base-200 text-base-content">
            <aside>
              <p className="font-bold">
                Nexify Store <br />Modern E-commerce Platform
              </p>
              <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
            </aside>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}