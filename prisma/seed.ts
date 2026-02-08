
import { PrismaClient } from '@prisma/client';
import { categories, farmers, products, harvestBatches, users, orders } from '../src/data/mock-data';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');
    const saltRounds = 10;
    const defaultPasswordHash = await bcrypt.hash('password123', saltRounds);

    // Clear existing data (Order matters because of constraints)
    await prisma.orderItem.deleteMany().catch(() => { });
    await prisma.order.deleteMany().catch(() => { });
    await prisma.harvestBatch.deleteMany().catch(() => { });
    await prisma.product.deleteMany().catch(() => { });
    await prisma.farm.deleteMany().catch(() => { });
    await prisma.address.deleteMany().catch(() => { });
    await prisma.user.deleteMany().catch(() => { });
    await prisma.category.deleteMany().catch(() => { });

    // 1. Categories
    for (const category of categories) {
        await prisma.category.create({
            data: {
                id: category.id,
                nameTh: category.nameTh,
                nameEn: category.nameEn,
                slug: category.slug,
                icon: category.icon,
                sortOrder: category.sortOrder || 0
            }
        });
    }

    // 2. Users & Farms
    for (const farmer of farmers) {
        // Create User for Farmer
        const user = await prisma.user.create({
            data: {
                id: farmer.id,
                name: farmer.name,
                email: `farmer_${farmer.id}@example.com`,
                password: defaultPasswordHash,
                role: 'farmer',
                image: farmer.farm.image
            }
        });

        // Create Farm
        await prisma.farm.create({
            data: {
                id: farmer.farm.id,
                name: farmer.farm.name,
                province: farmer.farm.province,
                isVerified: farmer.farm.isVerified,
                certifications: JSON.stringify(farmer.farm.certifications || []),
                description: farmer.farm.description,
                image: farmer.farm.image,
                userId: user.id
            }
        });
    }

    // 3. Products
    type ProductSeed = {
        id: string;
        nameTh: string;
        nameEn: string;
        slug: string;
        description?: string | null;
        unit?: string;
        basePrice?: number;
        image?: string | null;
        category: { id: string };
    };

    for (const product of products as ProductSeed[]) {
        await prisma.product.create({
            data: {
                id: product.id,
                nameTh: product.nameTh,
                nameEn: product.nameEn,
                slug: product.slug,
                description: product.description,
                unit: product.unit,
                basePrice: product.basePrice || 0,
                image: product.image,
                categoryId: product.category.id,
            }
        });
    }

    // 4. Batches
    for (const batch of harvestBatches) {
        const farmId = batch.farmer?.farm?.id || batch.farmer?.id || (batch as any).farmId;
        if (!farmId) {
            console.warn(`Skipping batch ${batch.id}: missing farm/farmer reference`);
            continue;
        }

        await prisma.harvestBatch.create({
            data: {
                id: batch.id,
                harvestDate: new Date(batch.harvestDate),
                quantityKg: batch.quantityKg,
                remainingKg: batch.remainingKg,
                pricePerKg: batch.pricePerKg,
                qualityGrade: batch.qualityGrade,
                status: batch.status,
                farmId,
                productId: batch.productId
            }
        });
    }

    // 5. Users (Customers)
    for (const user of users) {
        const hashedPassword = user.password ? await bcrypt.hash(user.password, saltRounds) : defaultPasswordHash;
        const dbUser = await prisma.user.create({
            data: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role || 'customer',
                password: hashedPassword,
                loyaltyPoints: user.loyaltyPoints
            }
        });

        if (user.addresses) {
            for (const addr of user.addresses) {
                await prisma.address.create({
                    data: {
                        id: addr.id,
                        label: addr.label,
                        fullName: addr.fullName,
                        phone: addr.phone,
                        address: addr.address,
                        subdistrict: addr.subdistrict,
                        district: addr.district,
                        province: addr.province,
                        postalCode: addr.postalCode,
                        isDefault: addr.isDefault,
                        userId: dbUser.id
                    }
                });
            }
        }
    }

    // 6. Orders
    for (const order of orders) {
        await prisma.order.create({
            data: {
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                total: order.total,
                subtotal: order.subtotal,
                deliveryFee: order.deliveryFee,
                discount: order.discount,
                deliveryDate: order.deliveryDate,
                timeSlot: order.timeSlot,
                userId: order.user.id,
                addressId: order.address?.id, // Optional linkage
                items: {
                    create: order.items.map(item => ({
                        id: item.id,
                        quantityKg: item.quantityKg,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                        batchId: item.batch.id
                    }))
                }
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
