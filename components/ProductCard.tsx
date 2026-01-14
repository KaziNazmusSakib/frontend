'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import axiosClient from '@/lib/axiosClient';
import { useState } from 'react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    stock: number;
    category?: {  // Make optional
      id: number;
      name: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { token } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAdding(true);
    try {
      await axiosClient.post('/cart', {
        productId: product.id,
        quantity: 1,
      });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="h-48 relative">
        <Image
          src={product.imageUrl || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.name}
          {product.stock === 0 && (
            <div className="badge badge-error">Out of Stock</div>
          )}
        </h2>
        <p className="text-gray-600 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mt-2">
          {product.category && (
            <span className="badge badge-outline">{product.category.name}</span>
          )}
        </div>
        <div className="card-actions justify-between items-center mt-4">
          <div className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </div>
          <div className="flex gap-2">
            <Link href={`/products/${product.id}`} className="btn btn-outline">
              View
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className="btn btn-primary"
            >
              {isAdding ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}