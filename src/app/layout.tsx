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
    icon: "/logo.png",
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

// Inline script: applies the saved theme + accent color BEFORE React hydrates
// so users don't see a white flash on reload in dark mode.
const themeInitScript = `(function(){try{var a=JSON.parse(localStorage.getItem('kitone-appearance')||'{}');var m=a.mode||'system';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');var C={emerald:[158,0.16],teal:[200,0.12],green:[145,0.15],amber:[70,0.16],orange:[55,0.17],rose:[15,0.20],violet:[305,0.18],cyan:[220,0.10]};var c=C[a.colorId]||C.emerald,h=c[0],ch=c[1],L=d?'0.70':'0.60';r.style.setProperty('--primary','oklch('+L+' '+ch+' '+h+')');r.style.setProperty('--primary-foreground',d?'oklch(0.15 0.02 '+h+')':((a.colorId==='amber'||a.colorId==='orange')?'oklch(0.20 0.02 '+h+')':'oklch(0.99 0.005 '+h+')'));r.style.setProperty('--ring','oklch('+L+' '+ch+' '+h+')');r.style.setProperty('--sidebar-primary','oklch('+L+' '+ch+' '+h+')');r.style.setProperty('--sidebar-ring','oklch('+L+' '+ch+' '+h+')');if(a.radius)r.style.setProperty('--radius',a.radius+'rem');if(a.fontScale)r.style.fontSize=Math.round(a.fontScale*100)+'%';}catch(e){}})();`;

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
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}