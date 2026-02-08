
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, HarvestBatch } from '@/types';

export interface CartItem {
    id: string; // Unique ID for cart item (e.g. batchId)
    product: Product;
    batch: HarvestBatch;
    quantityKg: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, batch: HarvestBatch, quantityKg: number) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantityKg: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addItem: () => { },
    removeItem: () => { },
    updateQuantity: () => { },
    clearCart: () => { },
    total: 0,
    itemCount: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from local storage
    useEffect(() => {
        const storedCart = localStorage.getItem('sodsai_cart');
        if (storedCart) {
            try {
                setItems(JSON.parse(storedCart));
            } catch (e) {
                console.error('Failed to parse cart');
                localStorage.removeItem('sodsai_cart');
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('sodsai_cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product: Product, batch: HarvestBatch, quantityKg: number) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === batch.id);
            if (existing) {
                return prev.map(item =>
                    item.id === batch.id
                        ? { ...item, quantityKg: item.quantityKg + quantityKg }
                        : item
                );
            }
            return [...prev, { id: batch.id, product, batch, quantityKg }];
        });
    };

    const removeItem = (itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantityKg: number) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, quantityKg } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + (item.batch.pricePerKg * item.quantityKg), 0);
    const itemCount = items.length;

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
