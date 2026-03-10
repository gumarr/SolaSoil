import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Đặc Sản Việt — Hương Vị Đất Việt Thuần Khiết",
  description:
    "Nền tảng đặc sản vùng miền uy tín — tuyển chọn và mang đến những đặc sản thuần khiết nhất từ khắp mọi miền đất nước Việt Nam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
