// app/buyer/dashboard/page.tsx
"use client";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { buyerAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  totalSpent: number
  wishlistCount: number
}

interface RecentOrder {
  id: number
  orderNumber: string
  status: string
  total: number
  date: string
}

export default function BuyerDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'buyer') {
      router.push('/buyer/login')
      return
    }

    fetchDashboardData()
  }, [isAuthenticated, user, router])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        buyerAPI.getDashboard(),
        buyerAPI.getRecentOrders(),
      ])

      setStats(statsRes.data)
      setRecentOrders(ordersRes.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <Link href="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-3xl">{stats?.totalOrders || 0}</h2>
            <p className="text-gray-600">Total Orders</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-3xl">{stats?.pendingOrders || 0}</h2>
            <p className="text-gray-600">Pending Orders</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-3xl">${stats?.totalSpent?.toFixed(2) || '0.00'}</h2>
            <p className="text-gray-600">Total Spent</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-3xl">{stats?.wishlistCount || 0}</h2>
            <p className="text-gray-600">Wishlist Items</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        order.status === 'delivered' ? 'badge-success' :
                        order.status === 'processing' ? 'badge-warning' :
                        'badge-error'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <Link href={`/orders/${order.id}`} className="btn btn-ghost btn-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Profile Settings</h3>
            <p className="text-gray-600 mb-4">Update your personal information</p>
            <Link href="/buyer/profile" className="btn btn-outline">
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Shopping Cart</h3>
            <p className="text-gray-600 mb-4">View and manage your cart items</p>
            <Link href="/cart" className="btn btn-outline">
              Go to Cart
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Wishlist</h3>
            <p className="text-gray-600 mb-4">Save products for later</p>
            <Link href="/wishlist" className="btn btn-outline">
              View Wishlist
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}