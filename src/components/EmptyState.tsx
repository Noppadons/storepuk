'use client';

import { motion } from 'framer-motion';
import { SearchX, ShoppingBag, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: 'search' | 'cart' | 'folder';
    action?: {
        label: string;
        href: string;
    };
    className?: string;
}

export function EmptyState({ title, description, icon = 'folder', action, className }: EmptyStateProps) {
    const Icon = {
        search: SearchX,
        cart: ShoppingBag,
        folder: FolderOpen,
    }[icon];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "flex flex-col items-center justify-center py-20 px-4 text-center glass-premium rounded-3xl border border-primary/5",
                className
            )}
        >
            <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center text-primary/40 mb-6">
                <Icon size={40} strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-black text-foreground mb-2">{title}</h3>
            <p className="text-foreground/40 text-sm max-w-xs mb-8">{description}</p>

            {action && (
                <Link href={action.href} className="btn btn-primary !rounded-xl px-8 shadow-lg shadow-primary/20">
                    {action.label}
                </Link>
            )}
        </motion.div>
    );
}
