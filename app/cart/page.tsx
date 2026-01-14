'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axiosClient from '@/lib/axiosClient';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axiosClient.get('/cart', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCartItems(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const token = localStorage.getItem('token');
      await axiosClient.put(`/cart/${itemId}`, { quantity: newQuantity }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axiosClient.delete(`/cart/${itemId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      setCartItems(items => items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🛒 Shopping Cart</h1>
        <p className="text-gray-600">
          {cartItems.length} items in your cart
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link href="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Cart Items</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="avatar">
                          <div className="mask mask-squircle w-16 h-16 bg-base-200">
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full">
                                <span className="text-2xl">📦</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="join">
                          <button
                            className="join-item btn btn-sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            className="join-item btn btn-sm btn-disabled w-12"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="join-item btn btn-sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => removeItem(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Items ({getItemCount()}):</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${(getTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="divider"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${(getTotal() + 5 + getTotal() * 0.1).toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="btn btn-primary btn-block">
                    💳 Proceed to Checkout
                  </button>
                  <Link href="/products" className="btn btn-outline btn-block">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}