'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  productId: number;
  disabled?: boolean;
  token?: string | null;
}

export default function AddToCartButton({
  productId,
  disabled = false,
  token,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { token: authToken } = useAuth();
  const router = useRouter();
  const actualToken = token || authToken;

  const handleAddToCart = async () => {
    if (!actualToken) {
      router.push('/login');
      return;
    }

    setIsAdding(true);
    try {
      await axiosClient.post(
        '/cart',
        {
          productId,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${actualToken}` },
        }
      );
      // Show success message
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Product added to cart!', type: 'success' },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Failed to add product to cart', type: 'error' },
      });
      window.dispatchEvent(event);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className="btn btn-primary btn-lg flex-1"
    >
      {isAdding ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Adding...
        </>
      ) : (
        'Add to Cart'
      )}
    </button>
  );
}