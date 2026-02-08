'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("animate-skeleton rounded-md bg-foreground/5", className)}
            {...props}
        />
    );
}

export function ProductSkeleton() {
    return (
        <div className="card-premium h-[400px] flex flex-col space-y-4">
            <Skeleton className="w-full aspect-square rounded-xl" />
            <div className="space-y-2 px-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="pt-4 flex justify-between items-center">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
