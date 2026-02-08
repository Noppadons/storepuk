'use client';

import { Product, HarvestBatch } from '@/types';
import { calculateFreshness, formatThaiDate, formatPrice, cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product, batch: HarvestBatch, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);

    // Support both 'activeBatches' (mock data style) and 'batches' (Prisma style)
    const batches = product.batches || product.activeBatches || [];
    const activeBatch = batches[0];

    if (!activeBatch) return null;

    const harvestDate = new Date(activeBatch.harvestDate);
    const freshness = calculateFreshness(harvestDate);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        onAddToCart?.(product, activeBatch, 1);

        toast.success(`${product.nameTh} เพิ่มลงในตะกร้าแล้ว`, {
            description: `จาก ${activeBatch.farm?.name || 'เกษตรกรไทย'}`,
            icon: <ShoppingCart size={16} />,
        });

        setTimeout(() => setIsAdding(false), 800);
    };

    const getFreshnessBar = () => {
        switch (freshness.level) {
            case 'very_fresh': return { width: '100%', color: 'var(--primary)' };
            case 'fresh': return { width: '75%', color: 'var(--primary-light)' };
            case 'normal': return { width: '50%', color: 'var(--accent)' };
            case 'expiring': return { width: '25%', color: 'var(--warning)' };
            default: return { width: '50%', color: 'var(--secondary-light)' };
        }
    };

    const bar = getFreshnessBar();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="card-premium group cursor-pointer relative overflow-hidden"
        >
            <Link href={`/product/${product.slug}`} className="block">
                {/* Product Image */}
                <div className="product-image mb-4 relative aspect-square rounded-2xl overflow-hidden bg-surface">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl lg:text-8xl transition-transform duration-500 select-none overflow-hidden">
                        {product.category.icon}
                    </div>

                    {/* Freshness Badge */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm"
                        style={{ backgroundColor: freshness.bgColor, color: freshness.color }}
                    >
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: freshness.color }}></div>
                        {freshness.labelTh}
                    </motion.div>

                    {/* Farm Badge */}
                    {(activeBatch.farm?.isVerified || activeBatch.farmer?.farm?.isVerified) && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/90 glass-premium text-[10px] font-bold text-primary">
                            <Check size={12} strokeWidth={3} /> GAP
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                    {/* Freshness Bar */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                                ความสดใหม่ (Freshness)
                            </span>
                            <span className="text-[10px] font-bold text-primary">
                                {freshness.daysFromHarvest === 0 ? 'เก็บวันนี้' : `${freshness.daysFromHarvest} วันที่แล้ว`}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: bar.width }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: bar.color }}
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <h3 className="font-bold text-lg mb-0.5 group-hover:text-primary transition-colors line-clamp-1">
                            {product.nameTh}
                        </h3>
                        <p className="text-xs text-foreground/50 flex items-center gap-1">
                            {activeBatch.farm?.name || activeBatch.farmer?.farm?.name || 'เกษตรกรไทย'} • {activeBatch.farm?.province || 'TH'}
                        </p>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-primary leading-tight">
                                {formatPrice(activeBatch.pricePerKg)}
                            </span>
                            <span className="text-[10px] text-foreground/30 font-bold uppercase">/{product.unit}</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddToCart}
                            disabled={isAdding || activeBatch.remainingKg <= 0}
                            className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md active:shadow-inner",
                                activeBatch.remainingKg <= 0
                                    ? "bg-foreground/5 text-foreground/20 cursor-not-allowed"
                                    : isAdding
                                        ? "bg-green-500 text-white"
                                        : "bg-primary text-white hover:bg-primary-dark"
                            )}
                        >
                            {isAdding ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <Check size={20} />
                                </motion.div>
                            ) : activeBatch.remainingKg <= 0 ? (
                                <span className="text-[10px] font-bold">หมด</span>
                            ) : (
                                <Plus size={20} />
                            )}
                        </motion.button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
