import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-surface border-t border-secondary-light mt-auto">
            <div className="container-app py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🥬</span>
                            <span className="text-xl font-bold text-primary">มาซื้อผักกันเถอะ</span>
                        </Link>
                        <p className="text-foreground-muted text-sm">
                            ผักสดจากไร่ ถึงมือคุณ<br />
                            Fresh from farm to your hands
                        </p>
                        <div className="flex gap-3 mt-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center hover:bg-primary hover:text-white transition-colors" aria-label="Facebook">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center hover:bg-primary hover:text-white transition-colors" aria-label="Line">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center hover:bg-primary hover:text-white transition-colors" aria-label="Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">หมวดหมู่</h4>
                        <ul className="space-y-2 text-sm text-foreground-muted">
                            <li><Link href="/category/leafy-greens" className="hover:text-primary transition-colors">ผักใบเขียว</Link></li>
                            <li><Link href="/category/root-vegetables" className="hover:text-primary transition-colors">ผักหัว</Link></li>
                            <li><Link href="/category/fruit-vegetables" className="hover:text-primary transition-colors">ผักผล</Link></li>
                            <li><Link href="/category/herbs" className="hover:text-primary transition-colors">สมุนไพร</Link></li>
                            <li><Link href="/category/mushrooms" className="hover:text-primary transition-colors">เห็ด</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">ข้อมูล</h4>
                        <ul className="space-y-2 text-sm text-foreground-muted">
                            <li><Link href="/about" className="hover:text-primary transition-colors">เกี่ยวกับเรา</Link></li>
                            <li><Link href="/farmers" className="hover:text-primary transition-colors">ฟาร์มของเรา</Link></li>
                            <li><Link href="/delivery" className="hover:text-primary transition-colors">การจัดส่ง</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">คำถามที่พบบ่อย</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">ติดต่อเรา</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">สำหรับเกษตรกร</h4>
                        <ul className="space-y-2 text-sm text-foreground-muted">
                            <li><Link href="/farmer-register" className="hover:text-primary transition-colors">สมัครเป็นพันธมิตร</Link></li>
                            <li><Link href="/farmer-portal" className="hover:text-primary transition-colors">เข้าสู่ระบบเกษตรกร</Link></li>
                            <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Portal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">ติดต่อ</h4>
                        <ul className="space-y-3 text-sm text-foreground-muted">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>02-xxx-xxxx</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>contact@masuepak.co.th</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>จันทร์-เสาร์ 08:00-18:00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-secondary-light mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-foreground-muted">
                        © 2569 มาซื้อผักกันเถอะ. สงวนลิขสิทธิ์ทั้งหมด
                    </p>
                    <div className="flex gap-4 text-sm text-foreground-muted">
                        <Link href="/privacy" className="hover:text-primary transition-colors">นโยบายความเป็นส่วนตัว</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">ข้อกำหนดการใช้งาน</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
