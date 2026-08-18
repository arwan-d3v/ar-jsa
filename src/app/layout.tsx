import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { ThemeProvider } from "next-themes";

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
    <html lang="en" suppressHydrationWarning className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col transition-colors duration-[2500ms]">
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <footer className="py-4 text-center text-xs text-muted-foreground border-t bg-card/80 backdrop-blur-md">
            Made with ❤️ by Arwan | Property Of AR-D3V
          </footer>
          <Toaster />
          <PwaInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
