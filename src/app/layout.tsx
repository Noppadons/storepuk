import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "มาซื้อผักกันเถอะ - ผักสดจากไร่ ถึงมือคุณ",
  description: "แพลตฟอร์มซื้อขายผักสดจากฟาร์มถึงบ้านคุณ สดใหม่ทุกวัน ติดตามความสดได้ ส่งตรงจากเกษตรกรไทย",
  keywords: ["ผักสด", "ผักออร์แกนิค", "ฟาร์ม", "เกษตรกร", "ผักสดจากไร่", "มาซื้อผักกันเถอะ"],
  authors: [{ name: "มาซื้อผักกันเถอะ Team" }],
  openGraph: {
    title: "มาซื้อผักกันเถอะ - ผักสดจากไร่ ถึงมือคุณ",
    description: "แพลตฟอร์มซื้อขายผักสดจากฟาร์มถึงบ้านคุณ สดใหม่ทุกวัน",
    locale: "th_TH",
    type: "website",
  },
};

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={prompt.className}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
