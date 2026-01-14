import { cookies } from 'next/headers';
import axiosClient from '@/lib/axiosClient';
import Link from 'next/link';

async function getOrders() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await axiosClient.get('/orders', {
      headers: token ? { Cookie: `token=${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await getOrders();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge-warning';
      case 'processing':
        return 'badge-info';
      case 'shipped':
        return 'badge-primary';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">📦 My Orders</h1>
        <p className="text-gray-600">
          View your order history and track shipments
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
          <Link href="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id}>
                      <td>
                        <div className="font-bold">#{order.id}</div>
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex items-center">
                          <span className="mr-2">{order.items.length}</span>
                          <span className="text-gray-500">items</span>
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-primary">
                          ${order.total.toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/orders/${order.id}`}
                          className="btn btn-sm btn-outline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6">
              <div className="join">
                <button className="join-item btn">«</button>
                <button className="join-item btn btn-active">1</button>
                <button className="join-item btn">2</button>
                <button className="join-item btn">3</button>
                <button className="join-item btn">»</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}