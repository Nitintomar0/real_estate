import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollFix from "@/components/ScrollFix";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
import GlobalPopupWrapper from "@/components/GlobalPopupWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paramshiv Estate",
  description: "Luxury Real Estate Website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
  <html lang="en">
    <body className="bg-[#0B0B0B] text-white">

      <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5332951542845234"
          crossOrigin="anonymous"
        />
      <ScrollFix />
      <SmoothScroll />

      {children}

      <GlobalPopupWrapper />

    </body>
  </html>
);
}
