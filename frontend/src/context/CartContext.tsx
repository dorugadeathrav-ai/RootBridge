import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL, getAuthHeaders } from '../utils/api';

type CartItem = {
  product: { _id: string; name: string; price: number; image?: string };
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCartLocally: () => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'customer') {
      fetchCart();
    } else {
      setItems([]); // clear if logged out
    }
  }, [isAuthenticated, currentUser]);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error('Failed to fetch cart', e);
    }
    setIsLoading(false);
  };

  const addToCart = async (productId: string, quantity: number) => {
    if (!isAuthenticated) return alert('Please login as a customer to add to cart.');
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity })
      });
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      } else {
        alert(data.message || 'Could not add to cart.');
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      } else {
        alert(data.message || 'Could not update quantity.');
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };
  
  const clearCartLocally = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, clearCartLocally, isLoading }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
