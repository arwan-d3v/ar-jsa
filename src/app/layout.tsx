import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";

const inter = Inter({
  subsets: ["latin"],
});

import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "JSA Observasi",
  description: "Generator Template JSA Observasi",
  manifest: "/manifest.json",
  themeColor: "#0f766e",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased bg-gray-50 overflow-x-hidden`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <footer className="py-4 text-center text-xs text-gray-500 border-t bg-white">
          Made with ❤️ by Arwan | Property Of AR-D3V
        </footer>
        <Toaster />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
