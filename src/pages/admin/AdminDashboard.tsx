import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useOrders, type OrderStatus, type Order } from "@/context/OrderContext";
import { formatPrice } from "@/data/products";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  TrendingUp,
  Package,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_verification: "bg-amber-100 text-amber-700 border-amber-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-indigo-100 text-indigo-700 border-indigo-200",
  shipped: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_verification: "Pending Review",
  confirmed: "Quotation Sent",
  processing: "Under Negotiation",
  shipped: "Order Confirmed",
  delivered: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { fetchAllOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("indotech_admin") !== "true") {
      navigate("/admin");
      return;
    }

    async function load() {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate, fetchAllOrders]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending_verification").length,
    confirmed: orders.filter((o) => o.status === "confirmed" || o.status === "processing").length,
    completed: orders.filter((o) => o.status === "delivered").length,
  };

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: "Total Enquiries", value: stats.total, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", attention: stats.pending > 0 },
    { label: "Quotations Sent", value: stats.confirmed, icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of your enquiries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`rounded-xl border p-5 ${card.bg} ${card.border} ${card.attention ? "ring-2 ring-amber-400 ring-offset-1" : ""}`}
              >
                <div className={`h-10 w-10 rounded-lg ${card.bg} border ${card.border} flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-xs text-slate-500 mt-1">{card.label}</p>
                {card.attention && (
                  <p className="text-xs text-amber-600 font-medium mt-1 animate-pulse">⚠ Needs attention</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button asChild size="sm">
            <Link to="/admin/orders">View All Enquiries <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/products">Manage Products</Link>
          </Button>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Enquiries</h2>
            <Link to="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No enquiries yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-slate-600 font-medium">Enquiry ID</th>
                    <th className="text-left px-6 py-3 text-slate-600 font-medium">Customer</th>
                    <th className="text-left px-6 py-3 text-slate-600 font-medium hidden md:table-cell">Date</th>
                    <th className="text-left px-6 py-3 text-slate-600 font-medium hidden sm:table-cell">Items Count</th>
                    <th className="text-left px-6 py-3 text-slate-600 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr key={order.orderId} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                      <td className="px-6 py-3 font-mono text-xs font-medium text-slate-700">{order.orderId}</td>
                      <td className="px-6 py-3">
                        <p className="font-medium text-slate-800">{order.customer.fullName}</p>
                        <p className="text-slate-500 text-xs">{order.customer.phone}</p>
                      </td>
                      <td className="px-6 py-3 text-slate-500 hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                      <td className="px-6 py-3 font-semibold text-slate-800 hidden sm:table-cell">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </td>
                      <td className="px-6 py-3">
                        <Badge className={`${STATUS_COLORS[order.status]} text-xs`}>
                          {STATUS_LABELS[order.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
