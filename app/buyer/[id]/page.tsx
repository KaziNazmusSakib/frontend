// app/buyer/[id]/page.tsx
"use client";
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { buyerAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

interface BuyerProfile {
  id: number
  name: string
  email: string
  phone: string
  shippingAddress: string
  billingAddress: string
  createdAt: string
  totalOrders: number
  totalSpent: number
}

export default function BuyerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<BuyerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [params.id])

  const fetchProfile = async () => {
    try {
      const response = await buyerAPI.getById(Number(params.id))
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
        <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
        <button onClick={() => router.back()} className="btn btn-primary">
          Go Back
        </button>
      </div>
    )
  }

  const isOwnProfile = user?.role === 'buyer' && user.id === profile.id

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="card-title text-3xl">{profile.name}</h1>
              <p className="text-gray-600">Buyer Profile</p>
            </div>
            {isOwnProfile && (
              <button className="btn btn-outline">
                Edit Profile
              </button>
            )}
          </div>

          <div className="divider"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{profile.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Member Since</label>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Address Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Shipping Address</label>
                  <p className="font-medium">
                    {profile.shippingAddress || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Billing Address</label>
                  <p className="font-medium">
                    {profile.billingAddress || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="stat bg-base-200 rounded-lg p-6">
              <div className="stat-title">Total Orders</div>
              <div className="stat-value">{profile.totalOrders}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-6">
              <div className="stat-title">Total Spent</div>
              <div className="stat-value">${profile.totalSpent.toFixed(2)}</div>
            </div>
          </div>

          {/* Actions */}
          {isOwnProfile && (
            <div className="mt-8 flex gap-4">
              <button className="btn btn-primary">View Order History</button>
              <button className="btn btn-outline">Update Password</button>
              <button className="btn btn-ghost">Delete Account</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}