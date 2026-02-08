
const baseUrl = 'http://localhost:3000/api';

async function request(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    let json;
    try {
        json = JSON.parse(text);
    } catch (e) {
        return { ok: false, status: res.status, error: text, parseError: e };
    }
    return { ok: res.ok, status: res.status, data: json };
}

async function verify() {
    console.log('Starting Admin/Farmer verification...');

    // 1. Register Farmer
    const farmerEmail = `farmer${Date.now()}@test.com`;
    const farmerPhone = `08${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
    console.log(`\n1. Registering Farmer: ${farmerEmail}`);

    let res = await request(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Lung Mee',
            email: farmerEmail,
            password: 'password123',
            phone: farmerPhone
        })
    });

    if (!res.ok) {
        throw new Error(`Farmer reg failed: ${JSON.stringify(res)}`);
    }
    const farmer = res.data;
    console.log(`Farmer created: ${farmer.id}`);

    // 2. Fetch/Create Batch
    console.log('\n2. Creating Harvest Batch...');
    // Get product ID
    res = await request(`${baseUrl}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const products = res.data;
    const productId = products[0]?.id;
    if (!productId) throw new Error('No products found');

    const batchRes = await request(`${baseUrl}/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: farmer.id,
            productId,
            quantityKg: 100,
            price: 50, // pricePerKg
            harvestDate: new Date().toISOString()
        })
    });
    if (!batchRes.ok) throw new Error(`Batch creation failed: ${JSON.stringify(batchRes)}`);
    const batch = batchRes.data;
    console.log(`Batch created: ${batch.id}`);

    // 3. Verify Farmer Batches
    console.log('\n3. Verifying Farmer Batches...');
    const batchesRes = await request(`${baseUrl}/batches?userId=${farmer.id}`);
    const batches = batchesRes.data;
    console.log(`Found ${batches.length} batches.`);
    if (batches.length === 0) throw new Error('No batches found');

    // 4. Register Buyer & Add Address
    const buyerEmail = `buyer${Date.now()}@test.com`;
    const buyerPhone = `08${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
    console.log(`\n4. Registering Buyer: ${buyerEmail}`);

    const buyerRes = await request(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Khun Mam',
            email: buyerEmail,
            password: 'password123',
            phone: buyerPhone
        })
    });
    if (!buyerRes.ok) throw new Error(`Buyer reg failed: ${JSON.stringify(buyerRes)}`);
    const buyer = buyerRes.data;

    // Create address
    console.log('Adding address for buyer...');
    // We need to fetch current user to simulate "update profile" flow correctly or just use PUT /api/user
    // My script previously simulated `addresses` update in PUT /api/user
    const addressRes = await request(`${baseUrl}/user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: buyer.id,
            addresses: [{
                label: 'Home',
                fullName: 'Khun Mam',
                phone: buyerPhone,
                address: '123 Test St',
                subdistrict: 'Test',
                district: 'Test',
                province: 'Bangkok',
                postalCode: '10110',
                isDefault: true
            }]
        })
    });
    if (!addressRes.ok) throw new Error(`Address addition failed: ${JSON.stringify(addressRes)}`);

    // Get address ID
    const userRes = await request(`${baseUrl}/user?userId=${buyer.id}`);
    const buyerWithAddr = userRes.data;
    const addressId = buyerWithAddr.addresses && buyerWithAddr.addresses[0] ? buyerWithAddr.addresses[0].id : null;
    if (!addressId) throw new Error('Address creation failed (no ID returned)');

    // 5. Create Order
    console.log('\n5. Buyer placing order...');
    const orderRes = await request(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: buyer.id,
            addressId,
            items: [{
                batchId: batch.id,
                quantityKg: 2,
                unitPrice: 50,
                totalPrice: 100
            }],
            total: 100,
            deliveryFee: 0,
            paymentMethod: 'cod'
        })
    });
    if (!orderRes.ok) throw new Error(`Order failed: ${JSON.stringify(orderRes)}`);
    const order = orderRes.data;
    console.log(`Order created: ${order.orderNumber}`);

    // 6. Verify Farmer Orders
    console.log('\n6. Checking Farmer Orders...');
    const farmerOrdersRes = await request(`${baseUrl}/orders?farmerId=${farmer.id}`);
    const farmerOrders = farmerOrdersRes.data;
    console.log(`Farmer sees ${farmerOrders.length} orders.`);
    if (farmerOrders.length === 0) throw new Error('Farmer did not see the order');
    if (farmerOrders[0].orderNumber !== order.orderNumber) throw new Error('Order number mismatch');

    // 7. Verify Admin Orders (Status Update)
    console.log('\n7. Admin updating status...');
    const updateRes = await request(`${baseUrl}/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: order.id,
            status: 'shipping'
        })
    });
    if (!updateRes.ok) throw new Error(`Update failed: ${JSON.stringify(updateRes)}`);
    const updatedOrder = updateRes.data;
    console.log(`Status updated to: ${updatedOrder.status}`);
}

verify().catch(e => {
    console.error('VERIFICATION FAILED:', e);
    process.exit(1);
});
