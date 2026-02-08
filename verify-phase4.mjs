


const BASE_URL = 'http://localhost:3000';

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
    console.log('Starting Phase 4 verification...');

    // 1. Setup a test farmer
    const timestamp = Date.now();
    const email = `farmer_p4_${timestamp}@test.com`;
    console.log(`\n1. Registering Farmer: ${email}`);
    const reg = await request(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Phase 4 Farmer',
            email,
            password: 'password123',
            role: 'farmer'
        })
    });

    if (!reg.ok) throw new Error(`Registration failed: ${JSON.stringify(reg.data || reg.error)}`);
    const farmerId = reg.data.id;
    console.log(`Farmer created: ${farmerId}`);

    // 2. Add properties to Create Farm (Implicitly via batch creation as per current API)
    // Actually /api/batches POST creates farm if missing.
    // Need a productId. Get first product.
    console.log('\n2. Fetching products...');
    const prodRes = await request(`${BASE_URL}/api/products`);
    if (!prodRes.ok || prodRes.data.length === 0) throw new Error('No products found');
    const productId = prodRes.data[0].id;

    console.log('\n3. Creating Harvest Batch...');
    const batchRes = await request(`${BASE_URL}/api/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: farmerId,
            productId,
            quantityKg: 100,
            price: 50,
            harvestDate: new Date().toISOString()
        })
    });

    if (!batchRes.ok) throw new Error(`Batch creation failed: ${JSON.stringify(batchRes.data)}`);
    console.log(`Batch created: ${batchRes.data.id}`);

    // 4. Admin listing farmers
    console.log('\n4. Admin fetching farmers...');
    const farmersRes = await request(`${BASE_URL}/api/farmers`);
    if (!farmersRes.ok) throw new Error('Failed to fetch farmers');
    const farm = farmersRes.data.find(f => f.userId === farmerId);
    if (!farm) throw new Error('Farmer not found in admin list');
    console.log(`Found farm in admin list: ${farm.name} (Verified: ${farm.isVerified})`);

    // 5. Admin approving farmer
    console.log('\n5. Admin approving farmer...');
    const approveRes = await request(`${BASE_URL}/api/farmers`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            farmId: farm.id,
            isVerified: true
        })
    });

    if (!approveRes.ok || !approveRes.data.isVerified) throw new Error('Failed to approve farmer');
    console.log('Farmer approved successfully.');

    console.log('\nPhase 4 Verification Passed!');
}

verify().catch(e => {
    console.error('Verification failed:', e);
    process.exit(1);
});
