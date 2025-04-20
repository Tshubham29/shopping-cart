import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Product = {
  _id: string;
  name: string;
  price: number;
};

type CartItem = {
  _id: string;
  productId: Product;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchCart: () => void;
  addToCart: (product: Product) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeItem: (id: string) => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_APP_API_URL}${process.env.REACT_APP_CART}`);
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_APP_API_URL}${process.env.REACT_APP_PRODUCT}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      const exists = cart.find(item => item.productId._id === product._id);
      if (exists) {
        await increment(exists._id);
      } else {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_APP_API_URL}${process.env.REACT_APP_CART}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product._id, quantity: 1 }),
        });
        const newItem: CartItem = await res.json();
        setCart(prev => [...prev, newItem]);
      }
    } catch (err) {
      console.error('Add to cart failed:', err);
      setError('Failed to add item to cart.');
    }
  };

  const increment = async (id: string) => {
    try {
      const item = cart.find(p => p._id === id);
      if (!item) return;

      const res = await fetch(`${process.env.REACT_APP_BACKEND_APP_API_URL}${process.env.REACT_APP_CART}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      });
      const updated: CartItem = await res.json();
      setCart(prev => prev.map(p => p._id === id ? updated : p));
    } catch (err) {
      console.error('Increment failed:', err);
      setError('Failed to update quantity.');
    }
  };

  const decrement = async (id: string) => {
    try {
      const item = cart.find(p => p._id === id);
      if (!item) return;
      if (item.quantity <= 1) {
        await removeItem(id);
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_BACKEND_APP_API_URL}${process.env.REACT_APP_CART}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: item.quantity - 1 }),
      });
      const updated: CartItem = await res.json();
      setCart(prev => prev.map(p => p._id === id ? updated : p));
    } catch (err) {
      console.error('Decrement failed:', err);
      setError('Failed to update quantity.');
    }
  };

  const removeItem = async (id: string) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_APP_API_URL}${process.env.REACT_APP_CART}/${id}`, {
        method: 'DELETE',
      });
      setCart(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Remove item failed:', err);
      setError('Failed to remove item.');
    }
  };

  const total = cart.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, products, loading, error, fetchCart, addToCart, increment, decrement, removeItem, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

