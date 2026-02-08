
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Create Order (Checkout)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, items, addressId, total, deliveryFee, discount, paymentMethod } = body;

        // Validate
        if (!userId || !items || !items.length || !addressId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate Order Number (VEG-YYYYMMDD-XXXX)
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const count = await prisma.order.count();
        const orderNumber = `VEG-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

        // Prepare items creation
        // Note: Prices should ideally be re-fetched from DB to prevent tampering.
        // For MVP, trusting payload but verifying batch availability.

        // Check stock availability
        for (const item of items) {
            const batch = await prisma.harvestBatch.findUnique({ where: { id: item.batchId } });
            if (!batch) throw new Error(`Batch ${item.batchId} not found`);
            if (batch.remainingKg < item.quantityKg) {
                throw new Error(`Insufficient stock for batch ${item.batchId}`);
            }
        }

        // Transaction to ensure stock reduction
        const result = await prisma.$transaction(async (tx) => {
            // Create Order
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    addressId,
                    status: 'pending',
                    total,
                    deliveryFee: deliveryFee || 0,
                    discount: discount || 0,
                    subtotal: total - (deliveryFee || 0) + (discount || 0),
                    items: {
                        create: items.map((item: any) => ({
                            batchId: item.batchId,
                            quantityKg: item.quantityKg,
                            unitPrice: item.unitPrice,
                            totalPrice: item.totalPrice
                        }))
                    }
                }
            });

            // Update Stock
            for (const item of items) {
                await tx.harvestBatch.update({
                    where: { id: item.batchId },
                    data: {
                        remainingKg: { decrement: item.quantityKg }
                        // Status update logic requires conditional check, skipping for simple update
                    }
                });
            }

            return order;
        });

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
    }
}

// Get Orders (User or Admin)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const farmerId = searchParams.get('farmerId');

    try {
        // If userId provided, fetch for that user. If farmerId, fetch for farmer. If neither, fetch ALL (Admin mode)
        const where: any = {};

        if (userId) {
            where.userId = userId;
        } else if (farmerId) {
            // Find orders containing items from this farmer's farm
            where.items = {
                some: {
                    batch: {
                        farm: {
                            userId: farmerId
                        }
                    }
                }
            };
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                user: { select: { name: true, email: true, phone: true } }, // Include user info for Admin
                items: {
                    include: {
                        batch: {
                            include: {
                                product: true
                            }
                        }
                    }
                },
                address: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// Update Order Status (Admin)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing order ID or status' }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
