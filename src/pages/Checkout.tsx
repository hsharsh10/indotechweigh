import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Smartphone,
  Truck,
  Copy,
  Upload,
  ShoppingCart,
  User,
  MapPin,
  CreditCard,
  Check,
  Building,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useOrders, type PaymentMethod } from "@/context/OrderContext";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import qrCode from "@/assets/qr-code.png";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const COD_LIMIT = 10000;

const steps = [
  { id: 1, label: "Details", icon: User },
  { id: 2, label: "Address", icon: MapPin },
  { id: 3, label: "Submit", icon: CheckCircle2 },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const { createOrder } = useOrders();

  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);

  // Step 1 — Customer
  const [customer, setCustomer] = useState({
    fullName: "", phone: "", email: "", companyName: "", gstNumber: "",
  });
  const [confirmPhone, setConfirmPhone] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  // Step 2 — Address
  const [address, setAddress] = useState({
    addressLine1: "", addressLine2: "", city: "", state: "", pinCode: "", addressType: "office" as "home" | "office" | "factory",
  });

  // Step 3 — Enquiry Notes
  const [notes, setNotes] = useState("");

  const items = cartState.items;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Your enquiry list is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products before submitting an enquiry.</p>
          <Button asChild><Link to="/products">Browse Products</Link></Button>
        </div>
      </Layout>
    );
  }

  const validateStep1 = () => {
    if (!customer.fullName.trim()) { toast.error("Please enter your full name"); return false; }
    if (!/^[6-9]\d{9}$/.test(customer.phone)) { toast.error("Please enter a valid 10-digit phone number"); return false; }
    if (customer.phone !== confirmPhone) { toast.error("Phone numbers do not match. Please re-confirm."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) { toast.error("Please enter a valid email address"); return false; }
    if (customer.email.toLowerCase() !== confirmEmail.toLowerCase()) { toast.error("Email addresses do not match. Please re-confirm."); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!address.addressLine1.trim()) { toast.error("Please enter your address"); return false; }
    if (!address.city.trim()) { toast.error("Please enter your city"); return false; }
    if (!address.state) { toast.error("Please select your state"); return false; }
    if (!/^\d{6}$/.test(address.pinCode)) { toast.error("Please enter a valid 6-digit pin code"); return false; }
    return true;
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const order = await createOrder({
        items,
        customer,
        shippingAddress: address,
        payment: {
          method: "cod",
        },
        status: "pending_verification",
        subtotal: 0,
        gst: 0,
        shipping: 0,
        total: 0,
        notes: notes,
      });
      clearCart();
      navigate(`/order-confirmation/${order.orderId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done ? "bg-primary border-primary text-primary-foreground" :
                    active ? "border-primary text-primary bg-primary/10" :
                    "border-muted-foreground/30 text-muted-foreground"
                  }`}>
                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-0.5 w-16 sm:w-24 mx-2 transition-colors duration-300 ${done ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">

            {/* Step 1: Customer Details */}
            {step === 1 && (
              <Card className="animate-fade-in-up">
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Customer Details
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input id="fullName" placeholder="Rajesh Kumar" value={customer.fullName}
                        onChange={e => setCustomer({ ...customer, fullName: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" placeholder="9876543210" maxLength={10} value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, "") })} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPhone">Confirm Phone *</Label>
                      <Input id="confirmPhone" placeholder="Re-enter phone" maxLength={10} value={confirmPhone}
                        onChange={e => setConfirmPhone(e.target.value.replace(/\D/g, ""))} className="mt-1" />
                      {confirmPhone && confirmPhone !== customer.phone && (
                        <p className="text-xs text-red-500 mt-1">Phone numbers don't match</p>
                      )}
                      {confirmPhone && confirmPhone === customer.phone && customer.phone.length === 10 && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Phone confirmed</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="rajesh@company.com" value={customer.email}
                        onChange={e => setCustomer({ ...customer, email: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="confirmEmail">Confirm Email *</Label>
                      <Input id="confirmEmail" type="email" placeholder="Re-enter email" value={confirmEmail}
                        onChange={e => setConfirmEmail(e.target.value)} className="mt-1" />
                      {confirmEmail && confirmEmail.toLowerCase() !== customer.email.toLowerCase() && (
                        <p className="text-xs text-red-500 mt-1">Emails don't match</p>
                      )}
                      {confirmEmail && confirmEmail.toLowerCase() === customer.email.toLowerCase() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Email confirmed</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Input id="company" placeholder="ABC Industries Pvt Ltd" value={customer.companyName}
                        onChange={e => setCustomer({ ...customer, companyName: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="gst">GST Number <span className="text-muted-foreground text-xs">(optional, for invoice)</span></Label>
                      <Input id="gst" placeholder="22AAAAA0000A1Z5" value={customer.gstNumber}
                        onChange={e => setCustomer({ ...customer, gstNumber: e.target.value.toUpperCase() })} className="mt-1" />
                    </div>
                  </div>
                  <Button className="w-full mt-2" size="lg" onClick={() => validateStep1() && setStep(2)}>
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <Card className="animate-fade-in-up">
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="addr1">Address Line 1 *</Label>
                      <Input id="addr1" placeholder="Building / Plot No, Street" value={address.addressLine1}
                        onChange={e => setAddress({ ...address, addressLine1: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="addr2">Address Line 2 <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Input id="addr2" placeholder="Area, Landmark" value={address.addressLine2}
                        onChange={e => setAddress({ ...address, addressLine2: e.target.value })} className="mt-1" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" placeholder="New Delhi" value={address.city}
                          onChange={e => setAddress({ ...address, city: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select value={address.state} onValueChange={v => setAddress({ ...address, state: v })}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Select state" /></SelectTrigger>
                          <SelectContent>
                            {INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pin">Pin Code *</Label>
                        <Input id="pin" placeholder="110084" maxLength={6} value={address.pinCode}
                          onChange={e => setAddress({ ...address, pinCode: e.target.value.replace(/\D/g, "") })} className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label>Address Type</Label>
                      <div className="flex gap-3 mt-2">
                        {(["home", "office", "factory"] as const).map(type => (
                          <button key={type} onClick={() => setAddress({ ...address, addressType: type })}
                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                              address.addressType === type ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                            }`}>
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button className="flex-1" size="lg" onClick={() => validateStep2() && setStep(3)}>
                      Continue <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Submit Enquiry */}
            {step === 3 && (
              <Card className="animate-fade-in-up">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" /> Review & Submit Enquiry
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="enquiryNotes">Special Requirements / Customization Details</Label>
                      <textarea
                        id="enquiryNotes"
                        placeholder="Please write capacity requirements, accuracy details, installation requests, or any other query..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button className="flex-1" size="lg" onClick={handlePlaceOrder} disabled={placing}>
                      {placing ? "Submitting..." : "Submit Enquiry Request"}
                      {!placing && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Enquiry Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-4">Enquiry Summary</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                        {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
