import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useOrders, type OrderStatus } from "@/context/OrderContext";
import { formatPrice } from "@/data/products";
import {
  ChevronDown,
  Search,
  MapPin,
  Image,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending_verification: { label: "Pending Verification", color: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700 border-blue-200" },
  processing: { label: "Processing", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-700 border-purple-200" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 border-red-200" },
};

const FILTER_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending_verification" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const PAYMENT_LABELS: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  upi: "UPI",
  cod: "COD",
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const { fetchAllOrders, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminNoteInputs, setAdminNoteInputs] = useState<Record<string, string>>({});
  
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("indotech_admin") !== "true") {
      navigate("/admin");
      return;
    }
    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      const data = await fetchAllOrders();
      setAllOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus, label: string) => {
    if (!window.confirm(`Are you sure you want to mark this order as "${label}"?`)) return;
    try {
      await updateOrderStatus(orderId, newStatus, adminNoteInputs[orderId]);
      toast.success(`Order ${orderId} marked as ${label}`);
      // Refresh the orders after update
      await loadOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  const filtered = allOrders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch =
      !search ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search);
    return matchFilter && matchSearch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and verify customer orders</p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by order ID, name, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => {
            const count = tab.value === "all" ? allOrders.length : allOrders.filter((o) => o.status === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === tab.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-primary/50"
                }`}
              >
                {tab.label} <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const config = STATUS_CONFIG[order.status];
              const isExpanded = expandedId === order.orderId;

              return (
                <div key={order.orderId} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow">
                  {/* Order row */}
                  <button
                    className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left hover:bg-slate-50/50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : order.orderId)}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-slate-800">{order.orderId}</span>
                          <Badge className={`${config.color} text-xs`}>{config.label}</Badge>
                          <Badge variant="outline" className="text-xs">{PAYMENT_LABELS[order.payment.method]}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-0.5">
                          {order.customer.fullName} · {order.customer.phone}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-slate-800 text-base">{formatPrice(order.total)}</p>
                      <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 divide-y divide-slate-100 animate-fade-in-up">
                      {/* Customer */}
                      <div className="px-5 py-4 grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Customer Details</p>
                          <div className="space-y-1 text-sm">
                            <p className="font-medium text-slate-800">{order.customer.fullName}</p>
                            <p className="text-slate-600">{order.customer.phone}</p>
                            <p className="text-slate-600">{order.customer.email}</p>
                            {order.customer.companyName && <p className="text-slate-600">{order.customer.companyName}</p>}
                            {order.customer.gstNumber && <p className="text-slate-600">GST: {order.customer.gstNumber}</p>}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> Shipping Address
                          </p>
                          <div className="text-sm text-slate-600">
                            <p>{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pinCode}</p>
                            <Badge variant="outline" className="text-xs capitalize mt-1">{order.shippingAddress.addressType}</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="px-5 py-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Order Items</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <div>
                                <span className="text-slate-800 font-medium">{item.name}</span>
                                {item.variant && <span className="text-slate-500"> · {item.variant}</span>}
                                <span className="text-slate-500"> × {item.quantity}</span>
                              </div>
                              <span className="font-semibold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-2" />
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                          <div className="flex justify-between text-slate-500"><span>GST (18%)</span><span>{formatPrice(order.gst)}</span></div>
                          <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span></div>
                          <div className="flex justify-between font-bold text-slate-800 text-base pt-1"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                        </div>
                      </div>

                      {/* Payment proof */}
                      <div className="px-5 py-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Payment Details</p>
                        <div className="space-y-2">
                          <p className="text-sm text-slate-700">
                            Method: <span className="font-medium">{PAYMENT_LABELS[order.payment.method]}</span>
                          </p>
                          {order.payment.transactionId && (
                            <p className="text-sm text-slate-700">
                              UTR / Transaction ID: <span className="font-mono font-medium">{order.payment.transactionId}</span>
                            </p>
                          )}
                          {order.payment.paymentProof && (
                            <div>
                              <p className="text-sm text-slate-600 mb-2 flex items-center gap-1">
                                <Image className="h-4 w-4" /> Payment Screenshot
                              </p>
                              <img
                                src={order.payment.paymentProof}
                                alt="Payment screenshot"
                                className="max-w-xs rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(order.payment.paymentProof)}
                              />
                            </div>
                          )}
                          {order.payment.method === "cod" && (
                            <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                              ✓ Pay on Delivery — payment to be collected at time of delivery
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Admin note */}
                      <div className="px-5 py-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Admin Note (optional)</p>
                        <textarea
                          rows={2}
                          placeholder="Add a note for this order (e.g. rejection reason)..."
                          value={adminNoteInputs[order.orderId] || order.adminNotes || ""}
                          onChange={(e) => setAdminNoteInputs({ ...adminNoteInputs, [order.orderId]: e.target.value })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>

                      {/* Actions */}
                      <div className="px-5 py-4 bg-slate-50 flex flex-wrap gap-2">
                        {order.status === "pending_verification" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleStatusUpdate(order.orderId, "confirmed", "Confirmed")}>
                              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Verify Payment
                            </Button>
                            <Button size="sm" variant="destructive"
                              onClick={() => handleStatusUpdate(order.orderId, "rejected", "Rejected")}>
                              <XCircle className="h-4 w-4 mr-1.5" /> Reject Payment
                            </Button>
                          </>
                        )}
                        {order.status === "confirmed" && (
                          <>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white"
                              onClick={() => handleStatusUpdate(order.orderId, "processing", "Processing")}>
                              <Package className="h-4 w-4 mr-1.5" /> Mark Processing
                            </Button>
                            <Button size="sm" variant="destructive"
                              onClick={() => handleStatusUpdate(order.orderId, "cancelled", "Cancelled")}>
                              Cancel Order
                            </Button>
                          </>
                        )}
                        {order.status === "processing" && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => handleStatusUpdate(order.orderId, "shipped", "Shipped")}>
                            <Truck className="h-4 w-4 mr-1.5" /> Mark Shipped
                          </Button>
                        )}
                        {order.status === "shipped" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleStatusUpdate(order.orderId, "delivered", "Delivered")}>
                            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark Delivered
                          </Button>
                        )}
                        {(order.status === "delivered" || order.status === "cancelled" || order.status === "rejected") && (
                          <p className="text-sm text-slate-500 italic">
                            {order.status === "delivered" ? "✓ Order completed" : "✗ Order closed"}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
