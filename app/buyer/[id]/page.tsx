import { cookies } from 'next/headers';
import axiosClient from '@/lib/axiosClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getBuyerProfile(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await axiosClient.get(`/buyer/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : {},
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

async function getBuyerOrders(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await axiosClient.get(`/buyer/${id}/orders`, {
      headers: token ? { Cookie: `token=${token}` } : {},
    });
    return response.data;
  } catch (error) {
    return [];
  }
}

export default async function BuyerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const buyer = await getBuyerProfile(params.id);
  const orders = await getBuyerOrders(params.id);

  if (!buyer) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/buyer" className="btn btn-ghost btn-sm mb-4">
          ← Back to Buyer List
        </Link>
        <h1 className="text-3xl font-bold">Buyer Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-20">
                      <span className="text-3xl">{buyer.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{buyer.name}</h3>
                    <p className="text-gray-500">📧 {buyer.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Total Orders</div>
                      <div className="stat-value">{orders.length}</div>
                    </div>
                  </div>

                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Member Since</div>
                      <div className="stat-value text-lg">
                        {new Date(buyer.createdAt).getFullYear()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                <div>
                  <h3 className="font-bold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">📱 Phone:</span>
                      <span>{buyer.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">🏠 Address:</span>
                      <span>{buyer.address || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl mt-6">
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
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Orders:</span>
                  <span className="font-bold">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Spent:</span>
                  <span className="font-bold">
                    ${orders.reduce((total: number, order: any) => total + order.total, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Account Status:</span>
                  <span className={`badge ${buyer.isActive ? 'badge-success' : 'badge-error'}`}>
                    {buyer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="divider"></div>

              <div>
                <h3 className="font-bold mb-2">Account Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">📅 Created:</span>
                    <span>{new Date(buyer.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">🕒 Last Login:</span>
                    <span>
                      {buyer.lastLogin
                        ? new Date(buyer.lastLogin).toLocaleDateString()
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}