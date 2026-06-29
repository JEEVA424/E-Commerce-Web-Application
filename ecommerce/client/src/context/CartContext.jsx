// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data.data);
    } catch (err) {
      console.error('Cart fetch error', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const { data } = await cartAPI.add({ productId, quantity });
    setCart(data.data);
    return data;
  }, []);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    const { data } = await cartAPI.update(itemId, { quantity });
    setCart(data.data);
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const { data } = await cartAPI.remove(itemId);
    setCart(data.data);
  }, []);

  const clearCart = useCallback(async () => {
    await cartAPI.clear();
    setCart((prev) => prev ? { ...prev, items: [], subtotal: 0, tax: 0, shipping: 0, grandTotal: 0 } : null);
  }, []);

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeItem, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
