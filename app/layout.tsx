// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'
 
const inter = Inter({ subsets: ['latin'] })
 
export const metadata: Metadata = {
  title: 'ECommerce Platform',
  description: 'Full-stack ecommerce platform with Next.js and NestJS',
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<html lang="en" data-theme="light">
<body className={inter.className}>
<AuthProvider>
<div className="min-h-screen flex flex-col">
<Navbar />
<main className="flex-1 container mx-auto px-4 py-8">
              {children}
</main>
<footer className="footer footer-center p-4 bg-base-200 text-base-content">
<div>
<p>© 2024 ECommerce Platform. All rights reserved.</p>
</div>
</footer>
</div>
<Toaster position="top-right" />
</AuthProvider>
</body>
</html>
  )
}