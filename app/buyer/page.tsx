'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosClient from '@/lib/axiosClient';

interface BuyerStats {
  totalOrders: number;
  totalSpent: number;
  cartItems: number;
  wishlistItems: number;
}

export default function BuyerPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<BuyerStats>({
    totalOrders: 0,
    totalSpent: 0,
    cartItems: 0,
    wishlistItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/buyer/login');
      return;
    }

    if (user?.role !== 'buyer') {
      router.push('/dashboard');
      return;
    }

    fetchBuyerStats();
  }, [token, user, router]);

  const fetchBuyerStats = async () => {
    try {
      // Simulate API calls
      setStats({
        totalOrders: 12,
        totalSpent: 1250.75,
        cartItems: 3,
        wishlistItems: 8,
      });
    } catch (error) {
      console.error('Failed to fetch buyer stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="hero bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-box p-8 mb-8">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Welcome, Buyer!</h1>
            <p className="text-xl opacity-90">
              Discover amazing products and shop with confidence. Enjoy exclusive deals and fast delivery.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-desc">↗︎ 4 this month</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Spent</div>
            <div className="stat-value">${stats.totalSpent.toFixed(2)}</div>
            <div className="stat-desc">↗︎ $125 this month</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <div className="indicator">
                <span className="indicator-item badge badge-secondary">{stats.cartItems}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
            <div className="stat-title">Cart Items</div>
            <div className="stat-value">{stats.cartItems}</div>
            <div className="stat-desc">Ready to checkout</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Wishlist</div>
            <div className="stat-value">{stats.wishlistItems}</div>
            <div className="stat-desc">Saved items</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/buyer/dashboard" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="card-title">Dashboard</h3>
            <p>View detailed statistics and insights</p>
          </div>
        </Link>

        <Link href="/orders" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="card-title">My Orders</h3>
            <p>Track and manage your orders</p>
          </div>
        </Link>

        <Link href="/cart" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="card-title">Shopping Cart</h3>
            <p>Review items and checkout</p>
          </div>
        </Link>

        <Link href="/wishlist" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="card-title">Wishlist</h3>
            <p>Saved items for later</p>
          </div>
        </Link>

        <Link href="/buyer/profile" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="card-title">Profile</h3>
            <p>Manage your account</p>
          </div>
        </Link>

        <Link href="/products" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="card-title">Browse Products</h3>
            <p>Discover new items</p>
          </div>
        </Link>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recommended For You</h2>
          <p>Based on your browsing history and preferences</p>
          <div className="mt-4">
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Check out our latest deals and exclusive offers for buyers!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}