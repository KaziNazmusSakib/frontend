import { cookies } from 'next/headers';
import axiosClient from '@/lib/axiosClient';
import Link from 'next/link';

async function getBuyerData() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const [profileRes, ordersRes, wishlistRes] = await Promise.all([
      axiosClient.get('/buyer/profile', {
        headers: token ? { Cookie: `token=${token}` } : {},
      }),
      axiosClient.get('/buyer/orders', {
        headers: token ? { Cookie: `token=${token}` } : {},
      }),
      axiosClient.get('/buyer/wishlist', {
        headers: token ? { Cookie: `token=${token}` } : {},
      }),
    ]);

    return {
      profile: profileRes.data,
      orders: ordersRes.data,
      wishlist: wishlistRes.data,
    };
  } catch (error) {
    console.error('Buyer data fetch error:', error);
    return {
      profile: null,
      orders: [],
      wishlist: [],
    };
  }
}

export default async function BuyerDashboardPage() {
  const { profile, orders, wishlist } = await getBuyerData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">👤 Buyer Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {profile?.name || 'Guest'}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">📦 Total Orders</h2>
            <p className="text-3xl font-bold">{orders.length}</p>
            <div className="card-actions justify-end">
              <Link href="/orders" className="btn btn-sm btn-outline">
                View All
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">⭐ Wishlist</h2>
            <p className="text-3xl font-bold">{wishlist.length}</p>
            <div className="card-actions justify-end">
              <Link href="/wishlist" className="btn btn-sm btn-outline">
                View All
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">💰 Total Spent</h2>
            <p className="text-3xl font-bold">
              ${orders.reduce((total: number, order: any) => total + order.total, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Recent Orders</h2>
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
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
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders yet</p>
                <Link href="/products" className="btn btn-primary mt-4">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Wishlist Items</h2>
            {wishlist.length > 0 ? (
              <div className="space-y-4">
                {wishlist.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 bg-base-200">
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <span>📦</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{item.name}</div>
                        <div className="text-sm text-gray-500">${item.price}</div>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-primary">Add to Cart</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Wishlist is empty</p>
                <Link href="/products" className="btn btn-primary mt-4">
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}