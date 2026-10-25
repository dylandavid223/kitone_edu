import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kitone Edu · Multi-Institutional Learning Platform",
  description:
    "Kitone Edu — a multi-institutional learning platform for the Kenyan education system (PP1/PP2 → Primary → JSS → Senior Secondary → TVET → University). CBC-aligned, M-PESA-ready, DPA 2019 compliant.",
  keywords: [
    "Kitone Edu",
    "Kenya education",
    "CBC",
    "EdTech Kenya",
    "School Management System",
    "M-PESA fees",
    "Next.js",
  ],
  authors: [{ name: "Kitone Edu Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Kitone Edu · Multi-Institutional Learning Platform",
    description:
      "CBC-aligned, M-PESA-ready school management for Kenyan institutions.",
    siteName: "Kitone Edu",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitone Edu",
    description:
      "CBC-aligned, M-PESA-ready school management for Kenyan institutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
