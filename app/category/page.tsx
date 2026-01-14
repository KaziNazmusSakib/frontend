import { cookies } from 'next/headers';
import axiosClient from '@/lib/axiosClient';
import Link from 'next/link';

async function getCategories() {
  try {
    const response = await axiosClient.get('/category');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export default async function CategoryPage() {
  const categories = await getCategories();

  const categoryIcons: Record<string, string> = {
    electronics: '📱',
    clothing: '👕',
    home: '🏠',
    books: '📚',
    beauty: '💄',
    sports: '⚽',
    toys: '🎮',
    food: '🍎',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">📂 Categories</h1>
        <p className="text-gray-600">Browse products by category</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category: any) => (
          <Link
            key={category.id}
            href={`/products?category=${category.name.toLowerCase()}`}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="card-body items-center text-center">
              <div className="text-4xl mb-4">
                {categoryIcons[category.name.toLowerCase()] || '📦'}
              </div>
              <h2 className="card-title">{category.name}</h2>
              <p className="text-gray-500">
                {category.productCount || 0} products
              </p>
              {category.description && (
                <p className="text-sm mt-2">{category.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📂</div>
          <p className="text-gray-500">No categories found</p>
        </div>
      )}
    </div>
  );
}