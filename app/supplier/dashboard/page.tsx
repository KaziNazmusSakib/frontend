// app/supplier/dashboard/page.tsx
"use client";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supplierAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface DashboardStats {
  totalProducts: number
  activeProducts: number
  totalRevenue: number
  totalDeliveries: number
  pendingOrders: number
  monthlyRevenue: number
  performanceScore: number
}

interface RecentActivity {
  id: number
  type: string
  description: string
  time: string
}

interface QuickStats {
  newOrders: number
  pendingShipments: number
  lowStockItems: number
  customerReviews: number
}

export default function SupplierDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'supplier') {
      router.push('/supplier/login')
      return
    }

    fetchDashboardData()
  }, [isAuthenticated, user, router])

  const fetchDashboardData = async () => {
    try {
      const response = await supplierAPI.getDashboard()
      setStats(response.data.dashboard)
      setRecentActivities(response.data.recentActivities || [])
      setQuickStats(response.data.quickStats)
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
          <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex gap-3">
          <Link href="/supplier/products/add" className="btn btn-warning">
            Add Product
          </Link>
          <Link href="/supplier/orders" className="btn btn-outline">
            View Orders
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-3xl">{stats?.totalProducts || 0}</h2>
            <p className="text-gray-600">Total Products</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-3xl">${stats?.totalRevenue?.toFixed(2) || '0.00'}</h2>
            <p className="text-gray-600">Total Revenue</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-3xl">{stats?.totalDeliveries || 0}</h2>
            <p className="text-gray-600">Total Deliveries</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-3xl">{stats?.performanceScore || 0}%</h2>
            <p className="text-gray-600">Performance Score</p>
          </div>
        </div>
      </div>

      {/* Performance and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Monthly Performance</h2>
              <div className="h-64 flex items-center justify-center bg-base-200 rounded-lg">
                <div className="text-center">
                  <p className="text-3xl font-bold text-warning">
                    ${stats?.monthlyRevenue?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-gray-600">Revenue this month</p>
                  <div className="mt-4">
                    <div className="radial-progress text-warning" 
                      style={{"--value": stats?.performanceScore || 0} as any}>
                      {stats?.performanceScore || 0}%
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Performance Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Orders</span>
                <span className="font-bold">{quickStats?.newOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Shipments</span>
                <span className="font-bold">{quickStats?.pendingShipments || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Low Stock Items</span>
                <span className="font-bold text-error">{quickStats?.lowStockItems || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer Reviews</span>
                <span className="font-bold">{quickStats?.customerReviews || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                    <span className="text-warning">📦</span>
                  </div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <span className="badge badge-warning badge-sm">{activity.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Inventory Management</h3>
            <p className="text-gray-600 mb-4">Manage your products and stock</p>
            <Link href="/supplier/inventory" className="btn btn-outline">
              Manage Inventory
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Order Fulfillment</h3>
            <p className="text-gray-600 mb-4">Process and track orders</p>
            <Link href="/supplier/orders" className="btn btn-outline">
              Fulfill Orders
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Analytics Reports</h3>
            <p className="text-gray-600 mb-4">View detailed analytics</p>
            <Link href="/supplier/analytics" className="btn btn-outline">
              View Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}