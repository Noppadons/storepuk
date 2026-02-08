'use client';

import { Product, HarvestBatch } from '@/types';
import { calculateFreshness, formatThaiDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product, batch: HarvestBatch, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);

    // Get the freshest batch (FIFO - oldest harvest first for sales)
    // Get the freshest batch (FIFO - oldest harvest first for sales)
    // Support both 'activeBatches' (mock data style) and 'batches' (Prisma style)
    const batches = product.batches || product.activeBatches || [];
    const activeBatch = batches[0];

    if (!activeBatch) return null;

    // Handle date string vs Date object
    const harvestDate = new Date(activeBatch.harvestDate);
    const freshness = calculateFreshness(harvestDate);

    const handleAddToCart = () => {
        setIsAdding(true);
        onAddToCart?.(product, activeBatch, 1);
        setTimeout(() => setIsAdding(false), 500);
    };

    const getFreshnessBar = () => {
        switch (freshness.level) {
            case 'very_fresh':
                return { width: '100%', color: 'bg-green-500' };
            case 'fresh':
                return { width: '75%', color: 'bg-lime-500' };
            case 'normal':
                return { width: '50%', color: 'bg-yellow-500' };
            case 'expiring':
                return { width: '25%', color: 'bg-orange-500' };
            default:
                return { width: '50%', color: 'bg-gray-400' };
        }
    };

    const bar = getFreshnessBar();

    return (
        <div className="card overflow-hidden group">
            {/* Product Image */}
            <Link href={`/product/${product.slug}`}>
                <div className="product-image relative">
                    {/* Placeholder vegetable illustration */}
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-80">
                        {product.category.icon}
                    </div>

                    {/* Freshness Badge */}
                    <div
                        className="absolute top-3 left-3 badge"
                        style={{ backgroundColor: freshness.bgColor, color: freshness.color }}
                    >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: freshness.color }}></span>
                        {freshness.labelTh}
                    </div>

                    {/* Farm Badge */}
                    {(activeBatch.farm?.isVerified || activeBatch.farmer?.farm?.isVerified) && (
                        <div className="absolute top-3 right-3 badge bg-white/90 text-foreground-muted">
                            ✓ GAP
                        </div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-4">
                {/* Freshness Bar */}
                <div className="mb-3">
                    <div className="freshness-bar">
                        <div
                            className={`freshness-bar-fill ${bar.color}`}
                            style={{ width: bar.width }}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-foreground-muted">
                            {freshness.daysFromHarvest === 0 ? 'วันนี้' : `${freshness.daysFromHarvest} วัน`}
                        </span>
                        <span className="text-xs text-foreground-muted">
                            {formatThaiDate(activeBatch.harvestDate)}
                        </span>
                    </div>
                </div>

                {/* Product Name */}
                <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {product.nameTh}
                    </h3>
                </Link>

                {/* Farm Info - Handle nested relation safely */}
                <p className="text-sm text-foreground-muted mb-3">
                    {activeBatch.farm?.name || activeBatch.farmer?.farm?.name || 'Unknown Farm'}, {activeBatch.farm?.province || activeBatch.farmer?.farm?.province || 'TH'}
                </p>

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xl font-bold text-primary">
                            {formatPrice(activeBatch.pricePerKg)}
                        </span>
                        <span className="text-sm text-foreground-muted">/{product.unit}</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || activeBatch.remainingKg <= 0}
                        className={`btn btn-primary px-4 py-2 text-sm ${isAdding ? 'animate-pulse-soft' : ''
                            } ${activeBatch.remainingKg <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isAdding ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : activeBatch.remainingKg <= 0 ? (
                            'หมด'
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                เพิ่ม
                            </>
                        )}
                    </button>
                </div>

                {/* Stock Warning */}
                {activeBatch.remainingKg > 0 && activeBatch.remainingKg < 5 && (
                    <p className="text-xs text-warning mt-2">
                        ⚠️ เหลือเพียง {activeBatch.remainingKg} {product.unit}
                    </p>
                )}
            </div>
        </div>
    );
}
