// app/page.tsx
"use client";
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="hero min-h-[80vh]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to ECommerce Platform
          </h1>
          <p className="text-xl mb-10 text-gray-600">
            A complete ecommerce solution built with Next.js 14 and NestJS
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buyer/login" className="btn btn-primary btn-lg">
                Login as Buyer
              </Link>
              <Link href="/seller/register" className="btn btn-secondary btn-lg">
                Start Selling
              </Link>
              <Link href="/supplier/register" className="btn btn-accent btn-lg">
                Become Supplier
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${user.role}/dashboard`} className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
              <Link href="/products" className="btn btn-outline btn-lg">
                Browse Products
              </Link>
            </div>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-4">🛒</div>
                <h2 className="card-title">For Buyers</h2>
                <p>Shop from thousands of products with secure payments</p>
                <div className="card-actions mt-4">
                  <Link href="/buyer/register" className="btn btn-primary">
                    Sign Up Free
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-4">🏪</div>
                <h2 className="card-title">For Sellers</h2>
                <p>Sell your products to millions of customers worldwide</p>
                <div className="card-actions mt-4">
                  <Link href="/seller/register" className="btn btn-secondary">
                    Start Selling
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h2 className="card-title">For Suppliers</h2>
                <p>Supply products to sellers and expand your business</p>
                <div className="card-actions mt-4">
                  <Link href="/supplier/register" className="btn btn-accent">
                    Join Network
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}