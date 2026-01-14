import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axiosClient from '@/lib/axiosClient';
import Link from 'next/link';

interface Buyer {
  id: number;
  name: string;
  email: string;
  role: string;
  shippingAddress?: string;
  phone?: string;
}

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export default async function BuyerDashboardPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  if (!token) {
    redirect('/buyer/login');
  }

  let buyer: Buyer | null = null;
  let recentOrders: Order[] = [];
  let cartItems = 0;
  
  try {
    const [userRes, ordersRes] = await Promise.all([
      axiosClient.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axiosClient.get('/order', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => ({ data: [] })),
    ]);
    
    buyer = userRes.data;
    
    // Check if user is buyer
    if (buyer?.role !== 'buyer') {
      redirect('/dashboard');
    }
    
    recentOrders = ordersRes.data.slice(0, 5);
    cartItems = 3; // Mock data
  } catch (error) {
    redirect('/buyer/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {buyer?.name}! Here's your shopping overview.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Total Orders</h2>
            <p className="text-4xl font-bold">{recentOrders.length}</p>
            <div className="card-actions">
              <Link href="/orders" className="btn btn-sm btn-outline btn-white">
                View All
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Cart Items</h2>
            <p className="text-4xl font-bold">{cartItems}</p>
            <div className="card-actions">
              <Link href="/cart" className="btn btn-sm btn-outline btn-white">
                Go to Cart
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Wishlist</h2>
            <p className="text-4xl font-bold">8</p>
            <div className="card-actions">
              <Link href="/wishlist" className="btn btn-sm btn-outline btn-white">
                View Wishlist
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Reviews</h2>
            <p className="text-4xl font-bold">12</p>
            <div className="card-actions">
              <Link href="/reviews" className="btn btn-sm btn-outline btn-white">
                My Reviews
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Recent Orders</h2>
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${
                              order.status === 'delivered' ? 'badge-success' :
                              order.status === 'processing' ? 'badge-warning' :
                              order.status === 'shipped' ? 'badge-info' :
                              'badge-error'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td>${order.totalAmount.toFixed(2)}</td>
                          <td>
                            <Link href={`/orders/${order.id}`} className="btn btn-xs btn-outline">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No orders yet</p>
                  <Link href="/products" className="btn btn-primary mt-4">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl mt-8">
            <div className="card-body">
              <h2 className="card-title">Recommended Products</h2>
              <p className="text-gray-600 mb-4">Based on your browsing history</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card bg-base-200">
                    <div className="card-body p-4">
                      <div className="h-32 bg-base-300 rounded mb-2"></div>
                      <h3 className="font-semibold">Product {i}</h3>
                      <p className="text-primary font-bold">$49.99</p>
                      <button className="btn btn-xs btn-primary mt-2">Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-base-100 shadow-xl sticky top-24">
            <div className="card-body">
              <h2 className="card-title">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-600">Name</h3>
                  <p>{buyer?.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Email</h3>
                  <p>{buyer?.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Shipping Address</h3>
                  <p>{buyer?.shippingAddress || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Phone</h3>
                  <p>{buyer?.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="card-actions mt-6">
                <Link href="/buyer/profile" className="btn btn-outline btn-block">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl mt-6">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/cart" className="btn btn-outline btn-block justify-start">
                  🛒 View Cart
                </Link>
                <Link href="/wishlist" className="btn btn-outline btn-block justify-start">
                  ❤️ Wishlist
                </Link>
                <Link href="/orders" className="btn btn-outline btn-block justify-start">
                  📦 Order History
                </Link>
                <Link href="/support" className="btn btn-outline btn-block justify-start">
                  💬 Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}