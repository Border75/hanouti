import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, DurationOption, OrderItem } from '../types.ts';

export interface CartItem {
  id: string; // unique item id in cart (productId + duration)
  product: Product;
  duration: DurationOption;
  price: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, duration?: DurationOption) => void;
  removeFromCart: (cartItemId: string) => void;
  updateItemDuration: (cartItemId: string, duration: DurationOption) => void;
  clearCart: () => void;
  totalAmount: number;
  totalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  directCheckoutItem: CartItem | null;
  startDirectCheckout: (product: Product, duration?: DurationOption) => void;
  closeCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hanout_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('hanout_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product, duration: DurationOption = 12) => {
    const selectedDuration = product.availableDurations.includes(duration) 
      ? duration 
      : product.availableDurations[0] || 12;

    const price = product.pricing?.[selectedDuration] ?? product.basePrice;
    const cartItemId = `${product.id}-${selectedDuration}`;

    setCart(prev => {
      const exists = prev.find(item => item.id === cartItemId);
      if (exists) {
        return prev;
      }
      return [...prev, { id: cartItemId, product, duration: selectedDuration, price }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateItemDuration = (cartItemId: string, newDuration: DurationOption) => {
    setCart(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const newPrice = item.product.pricing?.[newDuration] ?? item.product.basePrice;
        return {
          ...item,
          id: `${item.product.id}-${newDuration}`,
          duration: newDuration,
          price: newPrice
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const startDirectCheckout = (product: Product, duration: DurationOption = 12) => {
    const selectedDuration = product.availableDurations.includes(duration) 
      ? duration 
      : product.availableDurations[0] || 12;
    const price = product.pricing?.[selectedDuration] ?? product.basePrice;

    setDirectCheckoutItem({
      id: `${product.id}-${selectedDuration}`,
      product,
      duration: selectedDuration,
      price
    });
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setDirectCheckoutItem(null);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  const totalCount = cart.length;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateItemDuration,
      clearCart,
      totalAmount,
      totalCount,
      isCartOpen,
      setIsCartOpen,
      selectedProductForDetail,
      setSelectedProductForDetail,
      isCheckoutOpen,
      setIsCheckoutOpen,
      directCheckoutItem,
      startDirectCheckout,
      closeCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
