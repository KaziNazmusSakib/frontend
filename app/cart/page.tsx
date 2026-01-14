'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

export default function CartPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetchCartItems();
  }, [token, router]);

  const fetchCartItems = async () => {
    try {
      const response = await axiosClient.get('/cart/1'); // Replace with actual user ID
      setCartItems(response.data?.items || []);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdating(itemId);
    try {
      // Update cart item quantity
      await axiosClient.put(`/cart/item/${itemId}`, { quantity: newQuantity });
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await axiosClient.delete(`/cart/item/${itemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08; // 8% tax
    return subtotal + shipping + tax;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="loading-spinner mx-auto"></div>
          <p className="mt-4">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/products" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 relative">
                              <Image
                                src={item.product.imageUrl || '/placeholder.jpg'}
                                alt={item.product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/products/${item.product.id}`}
                                className="font-semibold hover:link"
                              >
                                {item.product.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td>${item.product.price.toFixed(2)}</td>
                        <td>
                          <div className="join">
                            <button
                              className="join-item btn btn-xs"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1 || updating === item.id}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="join-item input input-xs w-12 text-center"
                              value={
                                updating === item.id
                                  ? '...'
                                  : item.quantity
                              }
                              readOnly
                            />
                            <button
                              className="join-item btn btn-xs"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={updating === item.id}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </td>
                        <td>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="btn btn-error btn-xs"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between mt-6">
                <Link href="/products" className="btn btn-outline">
                  ← Continue Shopping
                </Link>
                <button
                  onClick={() => setCartItems([])}
                  className="btn btn-error"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card bg-base-100 shadow sticky top-24">
            <div className="card-body">
              <h3 className="card-title mb-4">Order Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {calculateSubtotal() > 50 ? 'FREE' : '$5.99'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${(calculateSubtotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <button className="btn btn-primary btn-block">
                  Proceed to Checkout
                </button>
                <button className="btn btn-outline btn-block">
                  Apply Coupon Code
                </button>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="text-success">✓</div>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="text-success">✓</div>
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="text-success">✓</div>
                  <span>Secure payment</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow mt-6">
            <div className="card-body">
              <h4 className="font-semibold mb-2">Payment Methods</h4>
              <div className="flex gap-2">
                <div className="badge badge-outline">Visa</div>
                <div className="badge badge-outline">MasterCard</div>
                <div className="badge badge-outline">PayPal</div>
                <div className="badge badge-outline">Apple Pay</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}