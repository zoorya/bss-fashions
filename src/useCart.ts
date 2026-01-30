import { useState, useEffect, useMemo } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  // Add other product fields as needed
}

const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

const STORAGE_KEY = "bssfashion_cart_v1";

function cartKeyOf(id: number, size?: string) {
  return `${id}__${size ?? ""}`;
}

export function useCart(initial: CartItem[] = []) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore write errors
    }
  }, [cart]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);

  const addToCart = (product: Product, size?: string) => {
    const key = cartKeyOf(product.id, size);
    setCart((prev) => {
      const existing = prev.find((item) => cartKeyOf(item.id, item.selectedSize) === key);
      if (existing) {
        return prev.map((item) =>
          cartKeyOf(item.id, item.selectedSize) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
  };

  const removeFromCart = (productId: number, size?: string) =>
    setCart((prev) => prev.filter((item) => cartKeyOf(item.id, item.selectedSize) !== cartKeyOf(productId, size)));

  const updateQuantity = (productId: number, size: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        cartKeyOf(item.id, item.selectedSize) === cartKeyOf(productId, size) ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  } as const;
}