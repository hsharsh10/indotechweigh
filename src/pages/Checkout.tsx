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

const UPI_ID = "indotechweigh@okhdfcbank";
const COD_LIMIT = 10000;

const steps = [
  { id: 1, label: "Details", icon: User },
  { id: 2, label: "Address", icon: MapPin },
  { id: 3, label: "Payment", icon: CreditCard },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { state: cartState, getSubtotal, getGST, getShipping, getTotal, clearCart } = useCart();
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

  // Step 3 — Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [transactionId, setTransactionId] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofName, setPaymentProofName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subtotal = getSubtotal();
  const gst = getGST();
  const shipping = getShipping();
  const total = getTotal();
  const items = cartState.items;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("File size must be under 5MB"); return; }
    setPaymentProofName(file.name);
    setPaymentProof(file);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied!`));
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod !== "cod" && !transactionId.trim()) {
      toast.error("Please enter the Transaction ID / UTR number");
      return;
    }
    if (paymentMethod !== "cod" && !paymentProof) {
      toast.error("Please upload your payment screenshot");
      return;
    }
    setPlacing(true);
    try {
      let proofUrl = undefined;
      
      if (paymentMethod !== "cod" && paymentProof) {
        const fileExt = paymentProof.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `receipts/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment_proofs')
          .upload(filePath, paymentProof);
          
        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to upload screenshot. Please try again.");
          setPlacing(false);
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('payment_proofs')
          .getPublicUrl(filePath);
          
        proofUrl = publicUrl;
      }

      const order = await createOrder({
        items,
        customer,
        shippingAddress: address,
        payment: {
          method: paymentMethod,
          transactionId: transactionId || undefined,
          paymentProof: proofUrl,
        },
        status: paymentMethod === "cod" ? "confirmed" : "pending_verification",
        subtotal,
        gst,
        shipping,
        total,
      });
      clearCart();
      navigate(`/order-confirmation/${order.orderId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order. Please try again.");
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
                  <div className="flex gap-3 mt-2">
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

            {/* Step 3: Payment */}
            {step === 3 && (
              <Card className="animate-fade-in-up">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" /> Select Payment Method
                  </h2>

                  {/* Payment method cards */}
                  <div className="space-y-3">
                    {/* UPI */}
                    <button onClick={() => setPaymentMethod("upi")}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${paymentMethod === "upi" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">UPI Payment</p>
                          <p className="text-xs text-muted-foreground">Pay via Google Pay, PhonePe, Paytm, or any UPI app</p>
                        </div>
                      </div>
                      {paymentMethod === "upi" && (
                        <div className="mt-4 p-4 rounded-lg bg-card border border-border animate-fade-in-up space-y-4" onClick={e => e.stopPropagation()}>
                          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* QR Code Container */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm max-w-[180px] flex-shrink-0 flex flex-col items-center mx-auto md:mx-0">
                              <img src={qrCode} alt="GPay QR Code" className="w-full h-auto rounded" />
                              <span className="text-[10px] text-slate-400 font-semibold mt-2">Scan with any UPI App</span>
                            </div>
                            {/* Details Container */}
                            <div className="flex-1 space-y-3 w-full">
                              <div>
                                <p className="text-xs text-muted-foreground">UPI ID</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-sm md:text-base font-bold text-primary">{UPI_ID}</p>
                                  <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => copyToClipboard(UPI_ID, "UPI ID")}>
                                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground">Payee Name</p>
                                  <p className="font-semibold text-foreground">DEVENDER SHARMA</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Business Name</p>
                                  <p className="font-semibold text-foreground truncate">Indotech Electronic Weighing</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground border-t border-border pt-3">
                            After payment, upload the screenshot and enter the UTR/Transaction number below.
                          </p>
                        </div>
                      )}
                    </button>

                    {/* Bank Transfer */}
                    <button onClick={() => setPaymentMethod("bank_transfer")}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === "bank_transfer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${paymentMethod === "bank_transfer" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <Building className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Bank Transfer</p>
                          <p className="text-xs text-muted-foreground">Pay via NEFT, RTGS, IMPS or net banking</p>
                        </div>
                      </div>
                      {paymentMethod === "bank_transfer" && (
                        <div className="mt-4 p-4 rounded-lg bg-card border border-border animate-fade-in-up space-y-3" onClick={e => e.stopPropagation()}>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bank Account Details</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">Bank Name</p>
                              <p className="font-semibold text-foreground">Kotak Mahindra Bank</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Branch</p>
                              <p className="font-semibold text-foreground">Ashok Vihar</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground">Account Name</p>
                              <p className="font-semibold text-foreground">Indotech Electronic Weighing Systems</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Account Number</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <p className="font-bold text-primary">6411245870</p>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard("6411245870", "Account Number")}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">IFSC Code</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <p className="font-bold text-primary">KKBK0000215</p>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard("KKBK0000215", "IFSC Code")}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground border-t border-border pt-3">
                            After payment, upload the screenshot and enter the UTR/Reference number below.
                          </p>
                        </div>
                      )}
                    </button>

                    {/* COD */}
                    <button
                      onClick={() => total <= COD_LIMIT && setPaymentMethod("cod")}
                      disabled={total > COD_LIMIT}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        total > COD_LIMIT ? "opacity-50 cursor-not-allowed border-border" :
                        paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${paymentMethod === "cod" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <Truck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Pay on Delivery</p>
                          <p className="text-xs text-muted-foreground">
                            {total > COD_LIMIT ? `Not available for orders above ${formatPrice(COD_LIMIT)}` : "Pay cash at the time of delivery"}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Payment proof upload (bank / UPI only) */}
                  {paymentMethod !== "cod" && (
                    <div className="space-y-4 pt-2 border-t border-border animate-fade-in-up">
                      <div>
                        <Label htmlFor="utr">Transaction ID / UTR Number *</Label>
                        <Input id="utr" placeholder="e.g. UTR123456789012" value={transactionId}
                          onChange={e => setTransactionId(e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label>Payment Screenshot *</Label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className={`mt-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                            paymentProof ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                          {paymentProof ? (
                            <div className="space-y-2">
                              <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
                              <p className="text-sm font-medium text-primary">{paymentProofName}</p>
                              <p className="text-xs text-muted-foreground">Click to change</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                              <p className="text-sm text-muted-foreground">Click to upload payment screenshot</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button className="flex-1" size="lg" onClick={handlePlaceOrder} disabled={placing}>
                      {placing ? "Placing Order..." : "Place Order"}
                      {!placing && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                        {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                        <div className="flex justify-between mt-0.5">
                          <span className="text-xs text-muted-foreground">× {item.quantity}</span>
                          <span className="text-xs font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="mb-3" />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>GST (18%)</span><span>{formatPrice(gst)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(shipping)}</span></div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-primary">{formatPrice(total)}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
