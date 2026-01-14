import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nexify Store - Modern E-Commerce',
  description: 'A full-featured e-commerce platform built with Next.js and NestJS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-base-100 pt-16">
            {children}
          </main>
          <footer className="footer footer-center p-10 bg-base-300 text-base-content">
            <div>
              <p className="font-bold">
                Nexify Store <br />
                Full Stack E-Commerce Platform
              </p>
              <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}