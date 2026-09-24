'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { brandConfig } from '@/data/brandConfig';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, weightSize?: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedWeight: string) => void;
  updateQuantity: (productId: string, selectedWeight: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'brand_d2c_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart to storage', e);
    }
  }, [cart, isInitialized]);

  // Sync with server cart for authenticated customer on mount
  useEffect(() => {
    async function syncWithServer() {
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.cart && Array.isArray(data.cart.items)) {
            const mappedItems: CartItem[] = data.cart.items.map((it: any) => ({
              id: it.id,
              productId: it.productId,
              slug: it.slug,
              name: it.name,
              localName: it.localName || '',
              category: 'millets' as any,
              image: it.image,
              selectedWeight: it.selectedWeight,
              price: it.unitPrice, // Authoritative price from server
              mrp: it.mrp,
              quantity: it.quantity,
            }));
            setCart(mappedItems);
            try {
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(mappedItems));
            } catch {}
          }
        }
      } catch (err) {
        // Fallback to local storage if offline or not logged in
      }
    }

    if (isInitialized) {
      syncWithServer();
    }
  }, [isInitialized]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, weightSize?: string, quantity = 1) => {
    const selectedWeightOpt = weightSize
      ? product.weights.find((w) => w.size === weightSize) || product.weights[0]
      : product.weights[0];

    const size = selectedWeightOpt.size;
    const price = selectedWeightOpt.price;
    const mrp = selectedWeightOpt.mrp;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedWeight === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            localName: product.localName,
            category: product.category,
            image: product.images[0],
            selectedWeight: size,
            price,
            mrp,
            quantity,
          },
        ];
      }
    });

    setIsCartOpen(true);

    // Sync addition to server for authenticated customer
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        selectedWeight: size,
        quantity,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.cart?.items) {
          setCart(
            data.cart.items.map((it: any) => ({
              id: it.id,
              productId: it.productId,
              slug: it.slug,
              name: it.name,
              localName: it.localName || '',
              category: 'millets' as any,
              image: it.image,
              selectedWeight: it.selectedWeight,
              price: it.unitPrice,
              mrp: it.mrp,
              quantity: it.quantity,
            }))
          );
        }
      })
      .catch(() => {});
  };

  const removeFromCart = (productId: string, selectedWeight: string) => {
    const targetItem = cart.find(
      (item) => item.productId === productId && item.selectedWeight === selectedWeight
    );

    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedWeight === selectedWeight))
    );

    if (targetItem?.id) {
      fetch(`/api/cart?itemId=${targetItem.id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const updateQuantity = (productId: string, selectedWeight: string, delta: number) => {
    const targetItem = cart.find(
      (item) => item.productId === productId && item.selectedWeight === selectedWeight
    );

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.selectedWeight === selectedWeight) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );

    fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: targetItem?.id,
        productId,
        selectedWeight,
        action: delta > 0 ? 'INCREASE' : 'DECREASE',
        delta: Math.abs(delta),
      }),
    }).catch(() => {});
  };

  const clearCart = () => {
    setCart([]);
    fetch('/api/cart?clearAll=true', { method: 'DELETE' }).catch(() => {});
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const freeShippingThreshold = brandConfig.freeShippingThreshold;

  const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : brandConfig.flatShippingRate;

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        shippingFee,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
