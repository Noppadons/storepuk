
import prisma from '@/lib/prisma';
import ProductsClient from './ProductsClient';

// Force dynamic
export const dynamic = 'force-dynamic';

async function getProducts() {
    return await prisma.product.findMany({
        include: {
            category: true,
            batches: {
                where: { status: 'available', remainingKg: { gt: 0 } },
                orderBy: { harvestDate: 'desc' },
                include: { farm: true }
            }
        },
        orderBy: { id: 'desc' }
    });
}

async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' }
    });
}

export default async function ProductsValidPage() {
    const products = await getProducts();
    const categories = await getCategories();

    return <ProductsClient initialProducts={products} categories={categories} />;
}
