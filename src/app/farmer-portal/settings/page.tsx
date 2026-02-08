import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0;

export default async function FarmSettingsPage() {
  const session = await getSession();
  if (!session) return null;
  if (session.role !== 'farmer') return null;

  const userId = session.userId as string;
  const farm = await prisma.farm.findUnique({ where: { userId } });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ตั้งค่าร้าน</h1>
      {farm ? (
        <div>
          <p className="text-gray-600 mb-6">แก้ไขข้อมูลฟาร์มของคุณที่นี่</p>
          <form id="farm-form" data-farm-id={farm.id} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ชื่อฟาร์ม</label>
              <input name="name" defaultValue={farm.name ?? ''} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">จังหวัด</label>
              <input name="province" defaultValue={farm.province ?? ''} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">คำอธิบาย</label>
              <textarea name="description" defaultValue={farm.description ?? ''} className="mt-1 block w-full border rounded px-3 py-2" rows={4} />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="save-btn"
                className="btn btn-primary"
                onClick={async () => {
                  // client-side submit handled in script below
                }}
              >
                บันทึกการเปลี่ยนแปลง
              </button>
              <Link href="/farmer-portal" className="text-sm text-gray-500">ยกเลิก</Link>
            </div>
          </form>

          <script dangerouslySetInnerHTML={{ __html: `
            (function(){
              const form = document.getElementById('farm-form');
              const btn = document.getElementById('save-btn');
              btn.addEventListener('click', async ()=>{
                btn.disabled = true;
                const data = Object.fromEntries(new FormData(form));
                const farmId = form.dataset.farmId;
                try {
                  const res = await fetch('/api/farmers/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: farmId, ...data }) });
                  const json = await res.json();
                  if (!res.ok) throw new Error(json?.error || 'Update failed');
                  alert('บันทึกเรียบร้อย');
                  window.location.reload();
                } catch(e){
                  alert('บันทึกไม่สำเร็จ: ' + e.message);
                } finally { btn.disabled = false; }
              });
            })();
          ` }} />
        </div>
      ) : (
        <div>
          <p className="text-gray-600">ยังไม่มีฟาร์มของคุณ</p>
          <Link href="/farmer-portal/inventory/new" className="btn btn-primary mt-4">สร้างฟาร์มและเพิ่มล็อต</Link>
        </div>
      )}
    </div>
  );
}
