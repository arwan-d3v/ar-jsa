"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

export function PwaInstallPrompt() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 z-50 md:bottom-8 md:left-auto md:right-8 md:w-96">
      <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-4 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">Install JSA Observasi</h3>
          <p className="text-xs text-gray-500 mt-1">Add to your home screen for quick access</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleInstallClick} size="sm" className="bg-teal-700 hover:bg-teal-800 text-white rounded-xl">
            <Download className="h-4 w-4 mr-1.5" />
            Install
          </Button>
          <Button onClick={handleClose} variant="ghost" size="icon" className="h-8 w-8 text-gray-500 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
