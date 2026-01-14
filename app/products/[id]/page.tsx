import { cookies } from 'next/headers';
import axiosClient from '@/lib/axiosClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getProductDetails(id: string) {
  try {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductDetails(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="carousel w-full rounded-2xl overflow-hidden">
            {product.images && product.images.length > 0 ? (
              product.images.map((image: string, index: number) => (
                <div key={index} className="carousel-item relative w-full">
                  <div className="aspect-square bg-base-200 flex items-center justify-center">
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="object-contain max-w-full max-h-full"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="aspect-square bg-base-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">📦</div>
                  <p>No image available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <span className="badge badge-primary">{product.category}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="rating rating-half">
              {[1, 2, 3, 4, 5].map((star) => (
                <input
                  key={star}
                  type="radio"
                  name="rating-10"
                  className="bg-yellow-400 mask mask-star-2 mask-half-1"
                  checked={star <= product.rating}
                  readOnly
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              {product.rating} ⭐ ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-primary mb-2">
              ${product.price}
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through ml-2">
                  ${product.originalPrice}
                </span>
              )}
            </p>
            {product.discount && (
              <span className="badge badge-success">
                Save {product.discount}%
              </span>
            )}
          </div>

          <div className="prose max-w-none mb-6">
            <p>{product.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="font-bold mb-2">Features</h3>
            <ul className="space-y-1">
              {product.features?.map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="text-success mr-2">✅</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Quantity</h3>
            <div className="flex items-center space-x-4">
              <div className="join">
                <button className="join-item btn">-</button>
                <input
                  className="join-item btn btn-disabled w-16 text-center"
                  value="1"
                  readOnly
                />
                <button className="join-item btn">+</button>
              </div>
              <div className="text-sm text-gray-500">
                {product.stock} items in stock
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <button className="btn btn-primary btn-lg">
              🛒 Add to Cart
            </button>
            <button className="btn btn-outline btn-lg">💳 Buy Now</button>
            <button className="btn btn-ghost btn-lg">
              ⭐ Add to Wishlist
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center">
              <span className="mr-3 text-primary text-xl">🚚</span>
              <div>
                <p className="font-bold">Free Shipping</p>
                <p className="text-sm text-gray-500">Over $50</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-3 text-primary text-xl">🔄</span>
              <div>
                <p className="font-bold">30-Day Returns</p>
                <p className="text-sm text-gray-500">Easy returns</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-3 text-primary text-xl">🛡️</span>
              <div>
                <p className="font-bold">Secure Payment</p>
                <p className="text-sm text-gray-500">Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}