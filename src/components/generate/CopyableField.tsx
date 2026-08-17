"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyableFieldProps {
  label: string;
  value: string;
}

export function CopyableField({ label, value }: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) {
      toast("Tidak ada data untuk dicopy");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} disalin ke clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Gagal menyalin text");
      console.error(err);
    }
  };

  return (
    <div className="space-y-1.5 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors duration-[2500ms]">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          onClick={handleCopy}
          title={`Copy ${label}`}
        >
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy</span>
        </Button>
      </div>
      <div className="text-sm text-foreground/80 whitespace-pre-wrap min-h-[1.25rem] transition-colors duration-[2500ms]">
        {value || <span className="text-muted-foreground italic">Data kosong</span>}
      </div>
    </div>
  );
}
