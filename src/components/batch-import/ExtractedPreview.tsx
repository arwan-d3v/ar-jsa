"use client";

import { ExtractedTemplate } from "@/lib/ai/gemini";
import { Textarea } from "@/components/ui/textarea";

interface ExtractedPreviewProps {
  data: ExtractedTemplate;
  onChange: (field: keyof ExtractedTemplate, value: string) => void;
}

export function ExtractedPreview({ data, onChange }: ExtractedPreviewProps) {
  const fields: { key: keyof ExtractedTemplate; label: string }[] = [
    { key: "hasil_pemeriksaan_area", label: "Hasil pemeriksaan area" },
    { key: "rekomendasi_area", label: "Rekomendasi area" },
    { key: "hasil_pemeriksaan_area_360", label: "Hasil pemeriksaan area 360" },
    { key: "rekomendasi_area_360", label: "Rekomendasi area 360" },
    { key: "hasil_energi_berbahaya", label: "Hasil energi berbahaya" },
    { key: "rekomendasi_energi_berbahaya", label: "Rekomendasi energi berbahaya" },
    { key: "hasil_penanggung_jawab", label: "Hasil penanggung jawab" },
    { key: "rekomendasi_penanggung_jawab", label: "Rekomendasi penanggung jawab" },
    { key: "urutan_langkah_kerja", label: "Urutan langkah kerja (JSA)" },
    { key: "potensi_bahaya", label: "Potensi bahaya/resiko (JSA)" },
    { key: "kontrol_resiko", label: "Kontrol resiko (JSA)" },
  ];

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {fields.map(({ key, label }) => (
        <div key={key} className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 flex items-center justify-between">
            <span>{label}</span>
            {data[key] === null && (
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-normal">Kosong</span>
            )}
          </label>
          <Textarea
            value={data[key] || ""}
            onChange={(e) => onChange(key, e.target.value)}
            className="text-sm resize-y min-h-[60px] bg-background border-border focus-visible:ring-primary/50"
            placeholder={`Data tidak ditemukan...`}
          />
        </div>
      ))}
    </div>
  );
}
