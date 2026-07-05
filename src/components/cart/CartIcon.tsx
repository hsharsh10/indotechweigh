import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartIcon() {
  const { toggleCart, getCartCount } = useCart();
  const count = getCartCount();

  return (
    <button
      id="cart-icon-btn"
      onClick={toggleCart}
      className="relative p-2 rounded-md text-foreground hover:bg-muted transition-colors"
      aria-label={`Shopping cart, ${count} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span
          key={count}
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-cart-badge"
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
