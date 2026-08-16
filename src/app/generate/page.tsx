"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GeneratedSection } from "@/components/generate/GeneratedSection";
import { ClipboardCheck, BarChart2, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useTypePekerjaanStore, useJenisUnitStore, useCuacaStore, useKondisiStore, useTemplateStore } from "@/lib/store";
import { TemplateWithRelations } from "@/lib/api/templates";

export default function GeneratePage() {
  // Zustand Stores (Local Cache)
  const { data: typePekerjaanRaw, sync: syncTypePekerjaan } = useTypePekerjaanStore();
  const { data: jenisUnitRaw, sync: syncJenisUnit } = useJenisUnitStore();
  const { data: cuacaRaw, sync: syncCuaca } = useCuacaStore();
  const { data: kondisiRaw, sync: syncKondisi } = useKondisiStore();
  const { data: templates, sync: syncTemplates } = useTemplateStore();

  const typePekerjaan = typePekerjaanRaw.filter(t => t.is_active);
  const jenisUnit = jenisUnitRaw.filter(u => u.is_active);
  const cuaca = cuacaRaw.filter(c => c.is_active);
  const kondisi = kondisiRaw.filter(k => k.is_active);

  // Selected Params
  const [selectedType, setSelectedType] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCuaca, setSelectedCuaca] = useState("");
  const [selectedKondisi, setSelectedKondisi] = useState("");

  // Result
  const [generatedData, setGeneratedData] = useState<TemplateWithRelations | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Background Sync on Mount
  useEffect(() => {
    syncTypePekerjaan();
    syncJenisUnit();
    syncCuaca();
    syncKondisi();
    syncTemplates();
  }, [syncTypePekerjaan, syncJenisUnit, syncCuaca, syncKondisi, syncTemplates]);

  async function handleGenerate() {
    if (!selectedType || !selectedUnit || !selectedCuaca || !selectedKondisi) {
      toast.error("Silakan pilih semua parameter terlebih dahulu!");
      return;
    }

    setIsGenerating(true);
    setGeneratedData(null); // Reset
    
    // Instead of fetching from DB, we filter from the offline-first templates store
    // This allows instant generation even when offline
    setTimeout(() => {
      const result = templates.find(t => 
        t.type_pekerjaan_id === selectedType &&
        t.jenis_unit_id === selectedUnit &&
        t.cuaca_id === selectedCuaca &&
        t.kondisi_id === selectedKondisi &&
        t.is_active
      );

      if (result) {
        setGeneratedData(result);
        toast.success("Berhasil meng-generate data dari cache!");
      } else {
        toast("Template tidak ditemukan", {
          description: "Admin belum membuat template untuk kombinasi parameter ini.",
          action: {
            label: "Tutup",
            onClick: () => console.log("Tutup"),
          },
        });
      }
      setIsGenerating(false);
    }, 300); // tiny delay for visual feedback
  }

  const pemeriksaanAreaFields = generatedData ? [
    { label: "Hasil pemeriksaan area", value: generatedData.hasil_pemeriksaan_area },
    { label: "Rekomendasi area", value: generatedData.rekomendasi_area },
    { label: "Hasil pemeriksaan area 360", value: generatedData.hasil_pemeriksaan_area_360 },
    { label: "Rekomendasi area 360", value: generatedData.rekomendasi_area_360 },
    { label: "Hasil pemeriksaan energi berbahaya", value: generatedData.hasil_energi_berbahaya },
    { label: "Rekomendasi energi berbahaya", value: generatedData.rekomendasi_energi_berbahaya },
    { label: "Hasil informasi penanggung jawab", value: generatedData.hasil_penanggung_jawab },
    { label: "Rekomendasi penanggung jawab", value: generatedData.rekomendasi_penanggung_jawab },
  ] : [];

  const jsaFields = generatedData ? [
    { label: "Urutan langkah kerja", value: generatedData.urutan_langkah_kerja },
    { label: "Potensi bahaya/resiko", value: generatedData.potensi_bahaya },
    { label: "Kontrol resiko", value: generatedData.kontrol_resiko },
  ] : [];

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-24">
      <Header />
      
      <main className="max-w-lg mx-auto w-full p-4 space-y-6">
        
        {/* Context Bar Selector */}
        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-2">Pilih Parameter Observasi</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">Pekerjaan</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                <SelectContent>
                  {typePekerjaan.map(t => <SelectItem key={t.id} value={t.id}>{t.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">Unit</label>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                <SelectContent>
                  {jenisUnit.map(u => <SelectItem key={u.id} value={u.id}>{u.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">Cuaca</label>
              <Select value={selectedCuaca} onValueChange={setSelectedCuaca}>
                <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                <SelectContent>
                  {cuaca.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase">Kondisi</label>
              <Select value={selectedKondisi} onValueChange={setSelectedKondisi}>
                <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                <SelectContent>
                  {kondisi.map(k => <SelectItem key={k.id} value={k.id}>{k.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-base font-semibold bg-[#2D7A5F] hover:bg-[#1F5C47] rounded-xl text-white shadow-sm transition-all" 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Rocket className="mr-2 h-5 w-5" />
            {isGenerating ? "Mencari Template..." : "GENERATE DATA"}
          </Button>
        </div>

        {/* Generated Content Sections */}
        {generatedData && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GeneratedSection 
              title="Pemeriksaan Area"
              icon={<ClipboardCheck className="h-5 w-5" />}
              fields={pemeriksaanAreaFields}
            />
            
            <GeneratedSection 
              title="Job Safety Analysis (JSA)"
              icon={<BarChart2 className="h-5 w-5" />}
              fields={jsaFields}
            />
            
            <div className="text-center pt-4 pb-8">
              <p className="text-sm text-gray-500">
                Silakan copy setiap field yang diperlukan dan paste ke aplikasi MKN Smart Anda.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
