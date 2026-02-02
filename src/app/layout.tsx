import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "탐정 안속아 - 피싱/스캠 예방 퀴즈",
  description: "MZ세대를 위한 피싱/스캠 예방 퀴즈 서비스. 실제 사례로 배우는 사기 예방 교육.",
  keywords: ["피싱", "스캠", "사기 예방", "퀴즈", "MZ세대", "안전"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
