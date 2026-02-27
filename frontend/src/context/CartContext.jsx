import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!user || user.role === 'admin') return;
        try {
            const { data } = await api.get('/cart');
            setCart(data);
        } catch {
            setCart({ items: [], total: 0 });
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (foodId, quantity = 1) => {
        if (!user) { toast.error('Please login to add items'); return; }
        try {
            setLoading(true);
            const { data } = await api.post('/cart/add', { foodId, quantity });
            setCart(data);
            toast.success('Added to cart! 🛒');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (foodId) => {
        try {
            setLoading(true);
            const { data } = await api.delete(`/cart/remove/${foodId}`);
            setCart(data);
            toast.success('Removed from cart');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove item');
        } finally {
            setLoading(false);
        }
    };

    // Update quantity: if qty <= 0, remove the item
    const updateQuantity = async (foodId, newQty) => {
        if (newQty <= 0) {
            return removeFromCart(foodId);
        }
        try {
            setLoading(true);
            // Optimistically update UI
            setCart(prev => ({
                ...prev,
                items: prev.items.map(item =>
                    item.foodId?._id === foodId ? { ...item, quantity: newQty } : item
                ),
                total: prev.items.reduce((sum, item) =>
                    sum + (item.foodId?._id === foodId ? item.foodId.price * newQty : item.foodId?.price * item.quantity), 0
                ),
            }));
            // Sync with backend by re-adding with new quantity (remove then add)
            await api.delete(`/cart/remove/${foodId}`);
            const { data } = await api.post('/cart/add', { foodId, quantity: newQty });
            setCart(data);
        } catch (err) {
            fetchCart(); // rollback
            toast.error('Failed to update quantity');
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/cart/clear');
            setCart({ items: [], total: 0 });
        } catch { /* ignore */ }
    };

    const cartCount = cart.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
