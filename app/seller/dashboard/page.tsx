// app/seller/dashboard/page.tsx
"use client";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sellerAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import Link from 'next/link'
 
interface DashboardStats {
  totalProducts: number
  activeProducts: number
  totalSales: number
  pendingOrders: number
  totalRevenue: number
  monthlyRevenue: number
}
 
interface RecentProduct {
  id: number
  name: string
  price: number
  stock: number
  status: string
}
 
export default function SellerDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/seller/login')
      return
    }
 
    fetchDashboardData()
  }, [isAuthenticated, user, router])
 
  const fetchDashboardData = async () => {
    try {
      const response = await sellerAPI.getDashboard()
      setStats(response.data.dashboard)
      setRecentProducts(response.data.recentProducts || [])
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
<h1 className="text-3xl font-bold">Seller Dashboard</h1>
<p className="text-gray-600">Welcome back, {user?.name}!</p>
</div>
<div className="flex gap-3">
<Link href="/seller/products/add" className="btn btn-success">
            Add Product
</Link>
<Link href="/seller/products" className="btn btn-outline">
            View Products
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
<h2 className="card-title text-3xl">{stats?.activeProducts || 0}</h2>
<p className="text-gray-600">Active Products</p>
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
<h2 className="card-title text-3xl">${stats?.totalRevenue?.toFixed(2) || '0.00'}</h2>
<p className="text-gray-600">Total Revenue</p>
</div>
</div>
</div>
 
      {/* Revenue Chart Placeholder */}
<div className="card bg-base-100 shadow-lg">
<div className="card-body">
<h2 className="card-title">Revenue Overview</h2>
<div className="h-64 flex items-center justify-center bg-base-200 rounded-lg">
<div className="text-center">
<p className="text-2xl font-bold">${stats?.monthlyRevenue?.toFixed(2) || '0.00'}</p>
<p className="text-gray-600">Monthly Revenue</p>
</div>
</div>
</div>
</div>
 
      {/* Recent Products */}
<div className="card bg-base-100 shadow-lg">
<div className="card-body">
<div className="flex justify-between items-center mb-4">
<h2 className="card-title">Recent Products</h2>
<Link href="/seller/products" className="btn btn-ghost btn-sm">
              View All
</Link>
</div>
<div className="overflow-x-auto">
<table className="table">
<thead>
<tr>
<th>Product</th>
<th>Price</th>
<th>Stock</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>
<tbody>
                {recentProducts.map((product) => (
<tr key={product.id}>
<td>{product.name}</td>
<td>${product.price.toFixed(2)}</td>
<td>{product.stock}</td>
<td>
<span className={`badge ${
                        product.status === 'active' ? 'badge-success' : 'badge-error'
                      }`}>
                        {product.status}
</span>
</td>
<td>
<Link href={`/seller/products/${product.id}`} className="btn btn-ghost btn-sm">
                        Edit
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
<h3 className="card-title">Order Management</h3>
<p className="text-gray-600 mb-4">Process and track orders</p>
<Link href="/seller/orders" className="btn btn-outline">
              Manage Orders
</Link>
</div>
</div>
 
        <div className="card bg-base-100 shadow-lg">
<div className="card-body">
<h3 className="card-title">Analytics</h3>
<p className="text-gray-600 mb-4">View sales analytics</p>
<Link href="/seller/analytics" className="btn btn-outline">
              View Analytics
</Link>
</div>
</div>
 
        <div className="card bg-base-100 shadow-lg">
<div className="card-body">
<h3 className="card-title">Profile Settings</h3>
<p className="text-gray-600 mb-4">Update seller information</p>
<Link href="/seller/profile" className="btn btn-outline">
              Edit Profile
</Link>
</div>
</div>
</div>
</div>
  )
}