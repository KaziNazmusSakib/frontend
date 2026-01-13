"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

export default function BuyerDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    api.get("/orders/my").then(res => setOrders(res.data));
    api.get("/cart").then(res => setCart(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Buyer Dashboard</h1>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">My Orders</div>
          <div className="stat-value">{orders.length}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Cart Items</div>
          <div className="stat-value">{cart.length}</div>
        </div>
      </div>
    </div>
  );
}
