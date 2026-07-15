import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  ChevronDown,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Check,
  Search,
} from "lucide-react";
import { useOrders, type Order, type OrderStatus } from "@/context/OrderContext";
import { formatPrice } from "@/data/products";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending_verification: { label: "Pending Review", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  confirmed: { label: "Quotation Sent", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle2 },
  processing: { label: "Under Negotiation", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: Package },
  shipped: { label: "Order Confirmed", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Truck },
  delivered: { label: "Completed", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200", icon: Package },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 border-red-200", icon: Package },
};

const ORDER_PROGRESS = ["pending_verification", "confirmed", "processing", "shipped", "delivered"];
const PROGRESS_LABELS = ["Received", "Quotation Sent", "Negotiation", "Order Confirmed", "Completed"];

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[order.status];
  const StatusIcon = config.icon;

  const progressIdx = ORDER_PROGRESS.indexOf(order.status);
  const isCancelled = order.status === "cancelled" || order.status === "rejected";

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-md">
      {/* Order header */}
      <button
        className="w-full p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground">{order.orderId}</span>
              <Badge className={`${config.color} text-xs flex items-center gap-1`}>
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Requested Items: <span className="font-semibold text-foreground">{order.items.reduce((s, i) => s + i.quantity, 0)}</span>
            </p>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border animate-fade-in-up">
          {/* Progress tracker */}
          {!isCancelled && (
            <div className="p-5 border-b border-border">
              <div className="flex items-center">
                {PROGRESS_LABELS.map((label, i) => {
                  const done = progressIdx >= i;
                  const active = progressIdx === i;
                  return (
                    <div key={label} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center border-2 transition-all ${
                          done ? "bg-primary border-primary text-primary-foreground" :
                          "border-muted-foreground/30 text-muted-foreground"
                        } ${active ? "ring-2 ring-primary/30" : ""}`}>
                          {done ? <Check className="h-3.5 w-3.5" /> : <span className="text-[10px]">{i + 1}</span>}
                        </div>
                        <span className={`text-[10px] mt-1 font-medium ${done ? "text-primary" : "text-muted-foreground"}`}>
                          {label}
                        </span>
                      </div>
                      {i < PROGRESS_LABELS.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-1 mb-4 transition-colors ${i < progressIdx ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="p-5 border-b border-border">
            <h4 className="font-semibold text-foreground mb-3 text-sm">Requested Items</h4>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <span className="text-foreground">{item.name}</span>
                    {item.variant && <span className="text-muted-foreground"> · {item.variant}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          <div className="p-5 border-b border-border">
            <h4 className="font-semibold text-foreground mb-2 text-sm flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" /> Delivery/Installation Address
            </h4>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
              {`, ${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.pinCode}`}
            </p>
          </div>

          {/* Admin notes */}
          {order.adminNotes && (
            <div className="p-5 border-t border-border">
              <h4 className="font-semibold text-foreground mb-1 text-sm">Note from Indotech</h4>
              <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                {order.adminNotes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyOrders() {
  const { fetchOrdersByPhone } = useOrders();
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const results = await fetchOrdersByPhone(phone.trim());
      setOrders(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-secondary py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">My Enquiries</h1>
          <p className="text-secondary-foreground/80 mb-8">Track all your quotation requests by entering your billing phone number.</p>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter 10-digit phone number"
                className="pl-9 bg-background"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                maxLength={10}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Track"}
            </Button>
          </form>
        </div>
      </section>

      <section className="py-10 min-h-[40vh]">
        <div className="container mx-auto px-4 max-w-3xl">
          {!searched ? (
            <div className="text-center py-20 opacity-50">
              <ShoppingCart className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p>Enter your phone number above to see your enquiry requests.</p>
            </div>
          ) : loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Looking up enquiries...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">No enquiries found</h2>
              <p className="text-muted-foreground mb-6">We couldn't find any enquiries for {phone}.</p>
              <Button asChild size="lg"><Link to="/products">Browse Products</Link></Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground mb-4">Found {orders.length} enquiry request{orders.length > 1 ? 's' : ''}</h3>
              {orders.map(order => <OrderCard key={order.orderId} order={order} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
