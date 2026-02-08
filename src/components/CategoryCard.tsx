'use client';

import { Category } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
        >
            <Link
                href={`/category/${category.slug}`}
                className="flex flex-col items-center gap-3 group"
            >
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="category-icon glass-premium ring-1 ring-primary/10 group-hover:shadow-premium group-hover:ring-primary/30 transition-all duration-300"
                >
                    <span className="text-3xl group-hover:scale-125 transition-transform duration-500">
                        {category.icon}
                    </span>
                </motion.div>
                <span className="text-sm font-bold text-foreground/70 group-hover:text-primary transition-colors tracking-wide">
                    {category.nameTh}
                </span>
            </Link>
        </motion.div>
    );
}
