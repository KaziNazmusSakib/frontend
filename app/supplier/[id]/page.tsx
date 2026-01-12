// app/supplier/[id]/page.tsx
"use client";
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supplierAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface SupplierProfile {
  id: number
  name: string
  email: string
  companyName: string
  contactPerson: string
  phone: string
  businessType: string
  taxNumber: string
  isVerified: boolean
  isActive: boolean
  totalRevenue: number
  totalDeliveries: number
  certifications: string[]
  profile: {
    address: string
    website: string
    description: string
    logoUrl: string
    rating: number
    reviewCount: number
  }
  createdAt: string
}

export default function SupplierProfilePage() {
  const params = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState<SupplierProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [params.id])

  const fetchProfile = async () => {
    try {
      const response = await supplierAPI.getById(Number(params.id))
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
        <h2 className="text-2xl font-bold mb-4">Supplier not found</h2>
      </div>
    )
  }

  const isOwnProfile = user?.role === 'supplier' && user.id === profile.id

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                {profile.profile?.logoUrl ? (
                  <img
                    src={profile.profile.logoUrl}
                    alt={profile.companyName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="avatar placeholder">
                    <div className="bg-warning text-warning-content rounded-full w-16 h-16">
                      <span className="text-2xl">{profile.name.charAt(0)}</span>
                    </div>
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold">{profile.companyName}</h1>
                  <p className="text-gray-600">{profile.businessType}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {profile.isVerified && (
                      <span className="badge badge-success">Verified</span>
                    )}
                    {profile.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-error">Inactive</span>
                    )}
                    <div className="rating rating-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <input
                          key={star}
                          type="radio"
                          name="rating-2"
                          className="mask mask-star-2 bg-yellow-400"
                          checked={star <= Math.round(profile.profile?.rating || 0)}
                          readOnly
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      ({profile.profile?.rating?.toFixed(1)} • {profile.profile?.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {isOwnProfile && (
              <div className="flex gap-3">
                <Link href="/supplier/profile/edit" className="btn btn-outline">
                  Edit Profile
                </Link>
                <Link href="/supplier/products" className="btn btn-warning">
                  Manage Products
                </Link>
              </div>
            )}
          </div>

          <div className="divider"></div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Contact Person</label>
                  <p className="font-medium">{profile.contactPerson}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{profile.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Website</label>
                  <p className="font-medium">
                    {profile.profile?.website ? (
                      <a href={profile.profile.website} className="link link-warning" target="_blank">
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
                  <label className="text-sm text-gray-500">Business Type</label>
                  <p className="font-medium">{profile.businessType}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Tax Number</label>
                  <p className="font-medium">{profile.taxNumber || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Member Since</label>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Total Revenue</label>
                  <p className="font-medium">${profile.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          {profile.profile?.address && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Address</h2>
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-gray-700">{profile.profile.address}</p>
              </div>
            </div>
          )}

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {profile.certifications.map((cert, index) => (
                  <span key={index} className="badge badge-outline">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {profile.profile?.description && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <p className="text-gray-700">{profile.profile.description}</p>
              </div>
            </div>
          )}

          {/* Performance Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat bg-base-200 rounded-lg p-6">
              <div className="stat-title">Total Deliveries</div>
              <div className="stat-value text-warning">{profile.totalDeliveries}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-6">
              <div className="stat-title">Rating</div>
              <div className="stat-value text-warning">{profile.profile?.rating?.toFixed(1)}</div>
              <div className="stat-desc">{profile.profile?.reviewCount} reviews</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-6">
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value text-warning">${profile.totalRevenue.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}