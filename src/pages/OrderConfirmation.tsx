import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  Clock,
  Copy,
} from "lucide-react";
import { useOrders, type Order } from "@/context/OrderContext";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Bank Transfer (NEFT/RTGS/IMPS)",
  upi: "UPI Payment",
  cod: "Pay on Delivery",
};

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const fetchedOrder = await getOrderById(orderId);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId, getOrderById]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-lg text-muted-foreground">Order not found.</p>
          <Button asChild className="mt-4"><Link to="/products">Continue Shopping</Link></Button>
        </div>
      </Layout>
    );
  }

  const isCOD = order.payment.method === "cod";
  const isPending = order.status === "pending_verification";

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.orderId).then(() => toast.success("Order ID copied!"));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">

        {/* Success Animation */}
        <div className="text-center mb-10">
          <div className="relative inline-flex">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center animate-checkmark animate-pulse-ring">
              <CheckCircle2 className="h-14 w-14 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mt-6 mb-2">Enquiry Submitted!</h1>
          <p className="text-muted-foreground text-lg">
            We have received your quotation request. Our representative will contact you shortly.
          </p>

          {/* Enquiry ID */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-muted rounded-lg border border-border">
            <span className="text-sm text-muted-foreground">Enquiry ID:</span>
            <span className="font-bold text-foreground">{order.orderId}</span>
            <button onClick={copyOrderId} className="text-muted-foreground hover:text-foreground transition-colors">
              <Copy className="h-4 w-4" />
            </button>
          </div>

          {/* Status */}
          <div className="mt-4">
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-sm px-4 py-1.5 font-medium">
              ⏳ Pending Quote Verification
            </Badge>
          </div>
        </div>

        {/* What's Next */}
        <div className="rounded-xl p-5 mb-8 border bg-amber-50 border-amber-200">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Clock className="h-5 w-5" /> What Happens Next?
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Our sales team will review your requested item list.</li>
            <li>• We will draft a custom quotation based on your customization notes.</li>
            <li>• A representative will contact you within <strong>24 business hours</strong> to share details.</li>
          </ul>
        </div>

        {/* Enquiry Items */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" /> Enquiry Items
            </h3>
          </div>
          <div className="divide-y divide-border">
            {order.items.map(item => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                </div>
                <Badge variant="secondary" className="font-semibold text-sm">Qty: {item.quantity}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Shipping */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Customer Details
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{order.customer.fullName}</p>
              <p>{order.customer.phone}</p>
              <p>{order.customer.email}</p>
              {order.customer.companyName && <p>{order.customer.companyName}</p>}
              {order.customer.gstNumber && <p>GST: {order.customer.gstNumber}</p>}
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Shipping Address
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pinCode}</p>
              <Badge variant="outline" className="text-xs capitalize mt-1">{order.shippingAddress.addressType}</Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button asChild className="flex-1" size="lg">
            <Link to="/my-orders">Track My Enquiries</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1" size="lg">
            <Link to="/products">Continue Browsing</Link>
          </Button>
        </div>

        {/* Contact */}
        <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
          <p className="mb-2 font-medium text-foreground">Questions about your order?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:+919811262055" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" /> +91 98112 62055
            </a>
            <a href="mailto:indotechweigh@gmail.com" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail className="h-4 w-4" /> indotechweigh@gmail.com
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
