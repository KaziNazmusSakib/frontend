// app/seller/[id]/page.tsx
"use client";
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { sellerAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import Link from 'next/link'
 
interface SellerProfile {
  id: number
  name: string
  email: string
  companyName: string
  isVerified: boolean
  rating: number
  totalSales: number
  profile: {
    businessAddress: string
    phone: string
    website: string
    description: string
  }
  createdAt: string
}
 
export default function SellerProfilePage() {
  const params = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    fetchProfile()
  }, [params.id])
 
  const fetchProfile = async () => {
    try {
      const response = await sellerAPI.getById(Number(params.id))
      setProfile(response.data)
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }
 
  if (loading) {
    return (
<div className="flex justify-center items-center min-h-[60vh]">
<span className="loading loading-spinner loading-lg"></span>
</div>
    )
  }
 
  if (!profile) {
    return (
<div className="text-center py-12">
<h2 className="text-2xl font-bold mb-4">Seller not found</h2>
</div>
    )
  }
 
  const isOwnProfile = user?.role === 'seller' && user.id === profile.id
 
  return (
<div className="max-w-4xl mx-auto">
<div className="card bg-base-100 shadow-xl">
<div className="card-body">
          {/* Header */}
<div className="flex flex-col md:flex-row justify-between items-start gap-6">
<div className="flex-1">
<div className="flex items-center gap-4">
<div className="avatar placeholder">
<div className="bg-success text-success-content rounded-full w-16 h-16">
<span className="text-2xl">{profile.name.charAt(0)}</span>
</div>
</div>
<div>
<h1 className="text-3xl font-bold">{profile.name}</h1>
<div className="flex items-center gap-2 mt-2">
<span className="badge badge-success">
                      {profile.isVerified ? 'Verified Seller' : 'Pending Verification'}
</span>
<div className="rating rating-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
<input
                          key={star}
                          type="radio"
                          name="rating-2"
                          className="mask mask-star-2 bg-orange-400"
                          checked={star <= Math.round(profile.rating)}
                          readOnly
                        />
                      ))}
</div>
<span className="text-gray-600">({profile.rating.toFixed(1)})</span>
</div>
</div>
</div>
</div>
            {isOwnProfile && (
<div className="flex gap-3">
<Link href="/seller/profile/edit" className="btn btn-outline">
                  Edit Profile
</Link>
<Link href="/seller/products" className="btn btn-success">
                  Manage Products
</Link>
</div>
            )}
</div>
 
          <div className="divider"></div>
 
          {/* Company Information */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="space-y-4">
<h2 className="text-xl font-semibold">Company Information</h2>
<div className="space-y-3">
<div>
<label className="text-sm text-gray-500">Company Name</label>
<p className="font-medium">{profile.companyName}</p>
</div>
<div>
<label className="text-sm text-gray-500">Email</label>
<p className="font-medium">{profile.email}</p>
</div>
<div>
<label className="text-sm text-gray-500">Phone</label>
<p className="font-medium">{profile.profile?.phone || 'Not provided'}</p>
</div>
<div>
<label className="text-sm text-gray-500">Website</label>
<p className="font-medium">
                    {profile.profile?.website ? (
<a href={profile.profile.website} className="link link-success" target="_blank">
                        {profile.profile.website}
</a>
                    ) : 'Not provided'}
</p>
</div>
</div>
</div>
 
            <div className="space-y-4">
<h2 className="text-xl font-semibold">Business Details</h2>
<div className="space-y-3">
<div>
<label className="text-sm text-gray-500">Business Address</label>
<p className="font-medium">
                    {profile.profile?.businessAddress || 'Not provided'}
</p>
</div>
<div>
<label className="text-sm text-gray-500">Member Since</label>
<p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
</p>
</div>
<div>
<label className="text-sm text-gray-500">Total Sales</label>
<p className="font-medium">${profile.totalSales.toFixed(2)}</p>
</div>
</div>
</div>
</div>
 
          {/* Description */}
          {profile.profile?.description && (
<div className="mt-8">
<h2 className="text-xl font-semibold mb-4">About</h2>
<div className="bg-base-200 p-6 rounded-lg">
<p className="text-gray-700">{profile.profile.description}</p>
</div>
</div>
          )}
 
          {/* Products Section */}
<div className="mt-8">
<div className="flex justify-between items-center mb-6">
<h2 className="text-xl font-semibold">Products</h2>
              {isOwnProfile ? (
<Link href="/seller/products" className="btn btn-outline">
                  View All Products
</Link>
              ) : (
<Link href={`/products?seller=${profile.id}`} className="btn btn-outline">
                  View Products
</Link>
              )}
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product cards would be fetched here */}
<div className="card bg-base-200 shadow">
<div className="card-body items-center text-center">
<p className="text-gray-600">No products to display</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
  )
}