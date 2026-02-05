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
  metadataBase: new URL('https://scam-prevention-mvp.vercel.app'),
  title: "탐정 안속아 - 피싱/스캠 예방 퀴즈",
  description: "실제 사례로 배우는 사기 예방 교육. 나의 사기 탐지 능력은? 70+ 실제 사기 사례로 테스트해보세요!",
  keywords: ["피싱", "스캠", "사기 예방", "퀴즈", "MZ세대", "안전", "보이스피싱", "스미싱"],
  openGraph: {
    title: "탐정 안속아 - 피싱/스캠 예방 퀴즈",
    description: "실제 사례로 배우는 사기 예방 교육. 나의 사기 탐지 능력은?",
    url: "https://scam-prevention-mvp.vercel.app",
    siteName: "탐정 안속아",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "탐정 안속아 - 피싱/스캠 예방 퀴즈",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "탐정 안속아 - 피싱/스캠 예방 퀴즈",
    description: "실제 사례로 배우는 사기 예방 교육. 나의 사기 탐지 능력은?",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
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
