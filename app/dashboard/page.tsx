import { cookies } from 'next/headers';
import axiosClient from '@/lib/axiosClient';
import Link from 'next/link';

async function getDashboardData() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const [userRes, productsRes, ordersRes] = await Promise.all([
      axiosClient.get('/auth/profile', {
        headers: token ? { Cookie: `token=${token}` } : {},
      }),
      axiosClient.get('/products'),
      axiosClient.get('/orders'),
    ]);

    return {
      user: userRes.data,
      products: productsRes.data,
      orders: ordersRes.data,
    };
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return {
      user: null,
      products: [],
      orders: [],
    };
  }
}

export default async function DashboardPage() {
  const { user, products, orders } = await getDashboardData();

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: '📦',
      color: 'bg-blue-500',
      link: '/products',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: '💳',
      color: 'bg-green-500',
      link: '/orders',
    },
    {
      title: 'Profile Views',
      value: '1,234',
      icon: '📊',
      color: 'bg-purple-500',
      link: '/profile',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || 'Guest'}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link key={index} href={stat.link}>
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} text-white text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order: any) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>${order.total}</td>
                      <td>
                        <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions justify-end mt-4">
              <Link href="/orders" className="btn btn-sm btn-outline">
                View All Orders
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Profile Information</h2>
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                      <span className="text-lg">{user.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role:</span>
                    <span className="badge badge-primary">{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Member Since:</span>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">👤</div>
                <p>Please login to view profile</p>
                <Link href="/auth/login" className="btn btn-primary mt-4">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}