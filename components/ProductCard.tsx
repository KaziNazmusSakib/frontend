// components/ProductCard.tsx
import Link from 'next/link'
import Image from 'next/image'
 
interface ProductCardProps {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  sellerName: string
  rating: number
  stock: number
  category: string
}
 
export default function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  sellerName,
  rating,
  stock,
  category,
}: ProductCardProps) {
  return (
<div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
<figure className="px-4 pt-4">
<div className="relative h-48 w-full">
          {imageUrl ? (
<img
              src={imageUrl}
              alt={name}
              className="rounded-xl object-cover w-full h-full"
            />
          ) : (
<div className="bg-base-200 rounded-xl w-full h-full flex items-center justify-center">
<span className="text-4xl">📦</span>
</div>
          )}
<div className="absolute top-2 right-2">
<span className="badge badge-accent">{category}</span>
</div>
</div>
</figure>
<div className="card-body">
<h2 className="card-title">{name}</h2>
<p className="text-gray-600 line-clamp-2">{description}</p>
<div className="flex items-center justify-between mt-2">
<div className="flex items-center gap-1">
<div className="rating rating-sm">
              {[1, 2, 3, 4, 5].map((star) => (
<input
                  key={star}
                  type="radio"
                  name={`rating-${id}`}
                  className="mask mask-star-2 bg-orange-400"
                  checked={star <= Math.round(rating)}
                  readOnly
                />
              ))}
</div>
<span className="text-sm text-gray-500">({rating.toFixed(1)})</span>
</div>
<span className="text-sm text-gray-500">Stock: {stock}</span>
</div>
 
        <div className="mt-2">
<span className="text-sm text-gray-600">Sold by: {sellerName}</span>
</div>
 
        <div className="card-actions justify-between items-center mt-4">
<div>
<span className="text-2xl font-bold">${price.toFixed(2)}</span>
</div>
<div className="flex gap-2">
<Link href={`/products/${id}`} className="btn btn-primary btn-sm">
              View Details
</Link>
<button className="btn btn-outline btn-sm">
              Add to Cart
</button>
</div>
</div>
</div>
</div>
  )
}