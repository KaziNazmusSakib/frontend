import Image from 'next/image';
import { notFound } from 'next/navigation';
import axiosClient from '@/lib/axiosClient';
import { cookies } from 'next/headers';
import AddToCartButton from '@/components/AddToCartButton';

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
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    name: string;
  };
  createdAt: string;
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let product: Product | null = null;
  let reviews: Review[] = [];
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  try {
    const [productRes, reviewsRes] = await Promise.all([
      axiosClient.get(`/product/${params.id}`),
      axiosClient.get(`/review/product/${params.id}`).catch(() => ({ data: [] })),
    ]);
    product = productRes.data;
    reviews = reviewsRes.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      notFound();
    }
    console.error('Failed to fetch product:', error);
  }

  if (!product) {
    notFound();
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="card bg-base-100 shadow-xl">
            <figure className="h-96 relative">
              <Image
                src={product.imageUrl || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </figure>
            <div className="card-body">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 relative cursor-pointer border rounded">
                    <Image
                      src={product.imageUrl || '/placeholder.jpg'}
                      alt={`${product.name} ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="badge badge-primary">{product.category.name}</div>
                    <div className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.stock} units available
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-gray-600">Seller:</span>
                    <span className="font-medium ml-2">{product.seller.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Rating:</span>
                    <div className="rating rating-sm ml-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <input
                          key={star}
                          type="radio"
                          name="rating-2"
                          className="mask mask-star-2 bg-orange-400"
                          checked={star <= Math.round(averageRating)}
                          readOnly
                        />
                      ))}
                      <span className="ml-2">({reviews.length} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <div className="join">
                      <button className="join-item btn">-</button>
                      <input
                        type="number"
                        className="join-item input input-bordered w-20 text-center"
                        defaultValue="1"
                        min="1"
                        max={product.stock}
                      />
                      <button className="join-item btn">+</button>
                    </div>
                    <AddToCartButton
                      productId={product.id}
                      disabled={product.stock === 0}
                      token={token}
                    />
                    <button className="btn btn-outline">
                      ❤️ Add to Wishlist
                    </button>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product ID:</span>
                    <span>#{product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span>{product.category.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Added:</span>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="card bg-base-100 shadow-xl mt-8">
            <div className="card-body">
              <h3 className="card-title">About the Seller</h3>
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12 h-12">
                    <span>{product.seller.name.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">{product.seller.name}</h4>
                  <p className="text-gray-600">{product.seller.email}</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="btn btn-outline btn-sm">Contact Seller</button>
                <button className="btn btn-outline btn-sm ml-2">View Store</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Customer Reviews</h3>
            
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                <button className="btn btn-primary mt-4">Write a Review</button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{review.user.name}</h4>
                          <div className="rating rating-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <input
                                key={star}
                                type="radio"
                                name={`rating-${review.id}`}
                                className="mask mask-star-2 bg-orange-400"
                                checked={star <= review.rating}
                                readOnly
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button className="btn btn-outline">Load More Reviews</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}