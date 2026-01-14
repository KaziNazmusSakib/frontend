import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center">
      <div className="hero bg-base-200 rounded-2xl p-8 mb-8">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Welcome to Nexify Store</h1>
            <p className="text-xl mb-8">
              Your one-stop destination for modern shopping experience. Quality products, fast delivery, and secure payments.
            </p>
            <Link href="/products" className="btn btn-primary btn-lg">
              🛍️ Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="card-title">Fast Delivery</h3>
            <p>Free shipping on orders over $50</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="card-title">Secure Payments</h3>
            <p>100% secure payment processing</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="card-title">Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="card-title">Quality Products</h3>
            <p>Carefully curated selection</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Featured Categories</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/products?category=electronics" className="btn btn-outline">
            📱 Electronics
          </Link>
          <Link href="/products?category=clothing" className="btn btn-outline">
            👕 Clothing
          </Link>
          <Link href="/products?category=home" className="btn btn-outline">
            🏠 Home & Kitchen
          </Link>
          <Link href="/products?category=books" className="btn btn-outline">
            📚 Books
          </Link>
        </div>
      </div>
    </div>
  );
}