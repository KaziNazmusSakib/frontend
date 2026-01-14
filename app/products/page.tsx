import ProductCard from '@/components/ProductCard';
import axiosClient from '@/lib/axiosClient';
import { cookies } from 'next/headers';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  category: {
    id: number;
    name: string;
  };
  seller: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { category?: string; search?: string };
}) {
  let products: Product[] = [];
  let categories: Category[] = [];
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      axiosClient.get('/product'),
      axiosClient.get('/category'),
    ]);
    products = productsRes.data;
    categories = categoriesRes.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  // Filter products by category if specified
  if (searchParams?.category) {
    products = products.filter(
      (product) => product.category.id.toString() === searchParams.category
    );
  }

  // Filter products by search term if specified
  if (searchParams?.search) {
    const searchTerm = searchParams.search.toLowerCase();
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.name.toLowerCase().includes(searchTerm)
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Our Products</h1>
          <p className="text-gray-600">
            {products.length} products available
            {searchParams?.category && ` in ${searchParams.category}`}
          </p>
        </div>
        {token && (
          <div className="mt-4 md:mt-0">
            <button className="btn btn-primary">Add New Product</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow sticky top-24">
            <div className="card-body">
              <h3 className="card-title mb-4">Categories</h3>
              <div className="space-y-2">
                <a
                  href="/products"
                  className={`block p-2 rounded ${
                    !searchParams?.category
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-base-200'
                  }`}
                >
                  All Categories
                </a>
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className={`block p-2 rounded ${
                      searchParams?.category === category.id.toString()
                        ? 'bg-primary text-primary-content'
                        : 'hover:bg-base-200'
                    }`}
                  >
                    {category.name}
                  </a>
                ))}
              </div>

              <div className="divider"></div>

              <div>
                <h4 className="font-semibold mb-2">Price Range</h4>
                <div className="space-y-2">
                  <label className="cursor-pointer label">
                    <input type="radio" name="price" className="radio" />
                    <span className="label-text">Under $25</span>
                  </label>
                  <label className="cursor-pointer label">
                    <input type="radio" name="price" className="radio" />
                    <span className="label-text">$25 - $50</span>
                  </label>
                  <label className="cursor-pointer label">
                    <input type="radio" name="price" className="radio" />
                    <span className="label-text">$50 - $100</span>
                  </label>
                  <label className="cursor-pointer label">
                    <input type="radio" name="price" className="radio" />
                    <span className="label-text">Over $100</span>
                  </label>
                </div>
              </div>

              <div className="divider"></div>

              <div>
                <h4 className="font-semibold mb-2">Sort By</h4>
                <select className="select select-bordered w-full">
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Best Selling</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchParams?.search || searchParams?.category
                  ? 'Try different filters or search terms'
                  : 'No products available at the moment'}
              </p>
              <a href="/products" className="btn btn-outline">
                Clear Filters
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {products.length > 0 && (
            <div className="join flex justify-center mt-8">
              <button className="join-item btn">«</button>
              <button className="join-item btn btn-active">1</button>
              <button className="join-item btn">2</button>
              <button className="join-item btn">3</button>
              <button className="join-item btn">4</button>
              <button className="join-item btn">»</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}