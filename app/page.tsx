import ProductCard from '@/components/ProductCard';
import axiosClient from '@/lib/axiosClient';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: {
    id: number;
    name: string;
  };
}

export default async function HomePage() {
  let products: Product[] = [];
  let categories: { id: number; name: string }[] = [];
  
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      axiosClient.get('/product'),
      axiosClient.get('/category'),
    ]);
    products = productsRes.data.slice(0, 6); // Get first 6 products
    categories = categoriesRes.data.slice(0, 4); // Get first 4 categories
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="hero bg-gradient-to-r from-primary to-secondary text-white rounded-box p-8 mb-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Welcome to Nexify Store</h1>
            <p className="text-xl mb-8">
              Discover amazing products at unbeatable prices. Shop with confidence.
            </p>
            <Link href="/products" className="btn btn-accent btn-lg">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/products" className="btn btn-outline btn-primary">
            View All Products
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <h3 className="card-title text-xl">{category.name}</h3>
                <div className="card-actions">
                  <Link href={`/category/${category.id}`} className="btn btn-primary">
                    Browse
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card bg-base-200 shadow">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="card-title">Free Shipping</h3>
            <p>On orders over $50</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="card-title">Secure Payment</h3>
            <p>100% secure payment</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="card-title">Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
        </div>
      </section>
    </div>
  );
}