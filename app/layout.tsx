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
  title: "Tether Platform",
  description: "Crypto platform UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Background layer */}
        <div className="min-h-screen bg-[#070A12] text-slate-100">
          <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.10),transparent_55%)]">
            <div className="min-h-screen">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
