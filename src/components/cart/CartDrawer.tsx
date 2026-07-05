import { ShoppingCart, Minus, Plus, X, Trash2, ChevronRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export function CartDrawer() {
  const {
    state,
    closeCart,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getGST,
    getShipping,
    getTotal,
  } = useCart();

  const { items, isOpen } = state;
  const subtotal = getSubtotal();
  const gst = getGST();
  const shipping = getShipping();
  const total = getTotal();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-foreground">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Your Cart
              {items.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {items.reduce((s, i) => s + i.quantity, 0)} items
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground mb-1">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add products to your cart to get started
                </p>
              </div>
              <Button asChild onClick={closeCart}>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/20 transition-all duration-200 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Item image placeholder */}
                  <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                  </div>

                  {/* Item details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate leading-tight">
                      {item.name}
                    </p>
                    {item.variant && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{item.variant}</p>
                      </div>
                    )}
                    <p className="text-sm font-semibold text-primary mt-1">
                      {formatPrice(item.price)}
                    </p>
                    {item.originalPrice > item.price && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(item.originalPrice)}
                      </p>
                    )}

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border rounded-md overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="h-6 w-8 flex items-center justify-center text-xs font-medium border-x border-border text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 flex items-center justify-center rounded hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                        aria-label="Remove item"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Price summary + checkout */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-4 space-y-3 bg-card">
            {/* Free shipping banner */}
            {shipping > 0 && (
              <div className="text-xs text-center text-muted-foreground bg-muted rounded-md py-2 px-3">
                🚚 Add {formatPrice(10000 - subtotal)} more for <span className="font-semibold text-primary">FREE shipping</span>
              </div>
            )}
            {shipping === 0 && subtotal > 0 && (
              <div className="text-xs text-center text-green-600 bg-green-50 dark:bg-green-950/20 rounded-md py-2 px-3 font-medium">
                🎉 You qualify for FREE shipping!
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (18%)</span>
                <span>{formatPrice(gst)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base text-foreground">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout button */}
            <Button asChild className="w-full" size="lg" onClick={closeCart}>
              <Link to="/checkout" className="flex items-center justify-center gap-2">
                Proceed to Checkout
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>

            {/* Continue shopping */}
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={closeCart}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
