import React, { createContext, useContext, ReactNode } from "react";
import { CartItem } from "./CartContext";
import { supabase } from "@/lib/supabase";

export type OrderStatus =
  | "pending_verification"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "rejected";

export type PaymentMethod = "bank_transfer" | "upi" | "cod";

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  companyName?: string;
  gstNumber?: string;
}

export interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  addressType: "home" | "office" | "factory";
}

export interface PaymentDetails {
  method: PaymentMethod;
  transactionId?: string;
  paymentProof?: string; // URL to Supabase Storage
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface Order {
  orderId: string;
  items: CartItem[];
  customer: CustomerDetails;
  shippingAddress: ShippingAddress;
  payment: PaymentDetails;
  status: OrderStatus;
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  adminNotes?: string;
}

interface OrderContextType {
  createOrder: (orderData: Omit<Order, "orderId" | "createdAt" | "updatedAt">) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNotes?: string) => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  fetchAllOrders: () => Promise<Order[]>;
  fetchOrdersByPhone: (phone: string) => Promise<Order[]>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

function generateOrderId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ITW-${date}-${random}`;
}

function mapDbToOrder(dbRow: any): Order {
  return {
    orderId: dbRow.order_id,
    items: dbRow.items,
    customer: dbRow.customer,
    shippingAddress: dbRow.shipping_address,
    payment: dbRow.payment,
    status: dbRow.status,
    subtotal: dbRow.subtotal,
    gst: dbRow.gst,
    shipping: dbRow.shipping,
    total: dbRow.total,
    notes: dbRow.notes,
    adminNotes: dbRow.admin_notes,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const createOrder = async (orderData: Omit<Order, "orderId" | "createdAt" | "updatedAt">): Promise<Order> => {
    const orderId = generateOrderId();
    const newOrder = {
      order_id: orderId,
      status: orderData.status,
      customer: orderData.customer,
      shipping_address: orderData.shippingAddress,
      items: orderData.items,
      payment: orderData.payment,
      subtotal: orderData.subtotal,
      gst: orderData.gst,
      shipping: orderData.shipping,
      total: orderData.total,
      notes: orderData.notes,
      admin_notes: orderData.adminNotes,
    };

    const { data, error } = await supabase.from("orders").insert([newOrder]).select().single();

    if (error) {
      console.error("Error creating order:", error);
      throw error;
    }

    return mapDbToOrder(data);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, adminNotes?: string) => {
    const updateData: any = { status };
    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes;
    }
    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("order_id", orderId);

    if (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching order:", error);
      throw error;
    }

    if (!data) return null;
    return mapDbToOrder(data);
  };

  const fetchAllOrders = async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }

    return (data || []).map(mapDbToOrder);
  };

  const fetchOrdersByPhone = async (phone: string): Promise<Order[]> => {
    // Note: This relies on Supabase ability to query inside JSONB
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer->>phone", phone)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders by phone:", error);
      throw error;
    }

    return (data || []).map(mapDbToOrder);
  };

  return (
    <OrderContext.Provider
      value={{
        createOrder,
        updateOrderStatus,
        getOrderById,
        fetchAllOrders,
        fetchOrdersByPhone,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
