
import { Header, Footer, ProductCard, CategoryCard, HeroCarousel } from '@/components';
import Link from 'next/link';
import prisma from '@/lib/prisma';

// Helper to transform DB product to Component Product type
// The ProductCard expects generic Product interface.
// Our DB scan returns Prisma types. We might need to map them if they differ.
// But we tailored our Seed & Schema closely.

async function getProducts() {
  // Newest products
  const newArrivals = await prisma.product.findMany({
    take: 6,
    orderBy: { id: 'desc' }, // or createdAt if added
    include: {
      category: true,
      batches: {
        where: { status: 'available', remainingKg: { gt: 0 } },
        orderBy: { harvestDate: 'desc' },
        take: 1
      }
    }
  });

  return newArrivals;
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' }
  });
}

// Force dynamic because we are fetching data
export const dynamic = 'force-dynamic';

export default async function Home() {
  let newArrivals: any[] = [];
  let categories: any[] = [];
  let dbError: string | null = null;

  try {
    newArrivals = await getProducts();
    categories = await getCategories();
  } catch (error: any) {
    console.error('Home page DB error:', error);
    dbError = error.message || 'Unknown database error';
  }

  if (dbError) {
    return (
      <div className="p-8 text-center bg-white min-h-screen">
        <h1 className="text-red-500 font-bold mb-4 text-2xl">Production Database Error</h1>
        <div className="bg-gray-100 p-6 rounded-lg mb-4 overflow-auto max-w-2xl mx-auto text-left">
          <p className="font-mono text-sm whitespace-pre-wrap">{dbError}</p>
        </div>
        <div className="text-gray-600 text-sm space-y-2">
          <p>Please double check your Vercel Environment Variables:</p>
          <ul className="list-disc list-inside inline-block border p-4 rounded bg-blue-50">
            <li>DATABASE_URL (Ensure it matches your Supabase connection string)</li>
            <li>NEXTAUTH_SECRET (Required for Auth context)</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container-app py-6">
          <HeroCarousel />
        </section>

        {/* Categories Section */}
        <section className="container-app py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">หมวดหมู่ยอดนิยม</h2>
            <Link href="/categories" className="text-primary text-sm font-medium hover:underline">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category as any} />
            ))}
          </div>
        </section>

        {/* Fresh Today Section */}
        <section className="container-app py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              <h2 className="text-xl font-bold">สดใหม่วันนี้</h2>
            </div>
            <Link href="/products?filter=fresh" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              ดูทั้งหมด
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-surface py-12 mt-8">
          <div className="container-app">
            <h2 className="text-2xl font-bold text-center mb-10">ทำไมต้องเลือก สดใส?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                  <span className="text-3xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">วันที่เก็บเกี่ยวชัดเจน</h3>
                <p className="text-foreground-muted">
                  ทุกสินค้าแสดงวันที่เก็บเกี่ยว คุณรู้แน่ชัดว่าผักสดแค่ไหน
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-lime-100 flex items-center justify-center">
                  <span className="text-3xl">🚚</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">ส่งตรงจากฟาร์ม</h3>
                <p className="text-foreground-muted">
                  ไม่ผ่านคนกลาง เก็บเช้าส่งบ่าย ถึงมือคุณสดที่สุด
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">รับรองมาตรฐาน GAP</h3>
                <p className="text-foreground-muted">
                  ฟาร์มทุกแห่งผ่านการรับรอง ปลอดภัย ไร้สารตกค้าง
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Products (Reusing New Arrivals for MVP or fetch distinct logic) */}
        {/* Skipping Popular section duplication for brevity, or reuse */}

      </main>

      <Footer />
    </div>
  );
}
