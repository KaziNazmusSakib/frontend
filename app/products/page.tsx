import { cookies } from 'next/headers';
import axiosClient from '@/lib/axiosClient';
import Link from 'next/link';

async function getProducts(searchParams?: any) {
  try {
    const params = new URLSearchParams(searchParams);
    const response = await axiosClient.get(`/products?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const products = await getProducts(searchParams);
  const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Books'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-gray-600">Browse our collection of products</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered pl-10 w-full"
                defaultValue={searchParams.q as string}
              />
            </div>
          </div>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-outline">
              ⚙️ Filter
            </div>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
              <li><a>Price: Low to High</a></li>
              <li><a>Price: High to Low</a></li>
              <li><a>Newest First</a></li>
              <li><a>Most Popular</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`btn btn-sm ${category === 'All' ? 'btn-primary' : 'btn-outline'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <figure className="px-4 pt-4">
                <div className="relative w-full h-48 bg-base-200 rounded-xl overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-4xl">📦</div>
                    </div>
                  )}
                </div>
              </figure>
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="badge badge-primary badge-sm">
                    {product.category}
                  </span>
                  {product.discount && (
                    <span className="badge badge-success badge-sm">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <h3 className="card-title text-lg line-clamp-1">{product.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                  {product.description}
                </p>
                <div className="flex items-center mb-2">
                  <div className="rating rating-xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <input
                        key={star}
                        type="radio"
                        name="rating"
                        className="mask mask-star-2 bg-orange-400"
                        checked={star <= product.rating}
                        readOnly
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/products/${product.id}`} className="btn btn-sm">
                      👁️ View
                    </Link>
                    <button className="btn btn-primary btn-sm">
                      🛒 Add
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    {product.stock > 0 ? (
                      <span className="text-success">✅ In Stock ({product.stock})</span>
                    ) : (
                      <span className="text-error">❌ Out of Stock</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-gray-500">No products found</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <div className="join">
          <button className="join-item btn">«</button>
          <button className="join-item btn btn-active">1</button>
          <button className="join-item btn">2</button>
          <button className="join-item btn">3</button>
          <button className="join-item btn">»</button>
        </div>
      </div>
    </div>
  );
}