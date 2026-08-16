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
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      
      <main className="max-w-2xl mx-auto w-full p-4 space-y-8 mt-4 md:mt-8">
        
        {/* Context Bar Selector */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-teal-900/5 border border-teal-100/50 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Parameter Observasi</h2>
              <p className="text-gray-500 text-sm">Tentukan kombinasi parameter untuk mencari template JSA yang sesuai.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-700">Jenis Pekerjaan</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full h-12 rounded-xl bg-gray-50/80 border-gray-200 focus-visible:ring-teal-500/30">
                    <SelectValue>
                      {selectedType ? typePekerjaan.find(t => t.id === selectedType)?.nama : "Pilih Pekerjaan..."}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {typePekerjaan.map(t => <SelectItem key={t.id} value={t.id}>{t.nama}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-700">Unit Operasional</label>
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger className="w-full h-12 rounded-xl bg-gray-50/80 border-gray-200 focus-visible:ring-teal-500/30">
                    <SelectValue>
                      {selectedUnit ? jenisUnit.find(u => u.id === selectedUnit)?.nama : "Pilih Unit..."}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {jenisUnit.map(u => <SelectItem key={u.id} value={u.id}>{u.nama}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-700">Kondisi Cuaca</label>
                <Select value={selectedCuaca} onValueChange={setSelectedCuaca}>
                  <SelectTrigger className="w-full h-12 rounded-xl bg-gray-50/80 border-gray-200 focus-visible:ring-teal-500/30">
                    <SelectValue>
                      {selectedCuaca ? (() => {
                        const c = cuaca.find(c => c.id === selectedCuaca);
                        return c ? `${c.icon} ${c.nama}` : "Pilih Cuaca...";
                      })() : "Pilih Cuaca..."}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {cuaca.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.nama}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-700">Kondisi Lingkungan</label>
                <Select value={selectedKondisi} onValueChange={setSelectedKondisi}>
                  <SelectTrigger className="w-full h-12 rounded-xl bg-gray-50/80 border-gray-200 focus-visible:ring-teal-500/30">
                    <SelectValue>
                      {selectedKondisi ? kondisi.find(k => k.id === selectedKondisi)?.nama : "Pilih Kondisi..."}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {kondisi.map(k => <SelectItem key={k.id} value={k.id}>{k.nama}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full h-14 text-base font-bold bg-teal-700 hover:bg-teal-800 rounded-xl text-white shadow-lg shadow-teal-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <Rocket className="mr-2 h-5 w-5" />
              {isGenerating ? "MENCARI TEMPLATE..." : "TAMPILKAN HASIL OBSERVASI"}
            </Button>
          </div>
        </div>

        {/* Generated Content Sections */}
        {generatedData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <GeneratedSection 
              title="Pemeriksaan Area"
              icon={<ClipboardCheck className="h-6 w-6 text-teal-600" />}
              fields={pemeriksaanAreaFields}
            />
            
            <GeneratedSection 
              title="Job Safety Analysis (JSA)"
              icon={<BarChart2 className="h-6 w-6 text-teal-600" />}
              fields={jsaFields}
            />
            
            <div className="text-center pt-6 pb-12">
              <div className="inline-flex items-center justify-center p-4 bg-teal-50 rounded-2xl border border-teal-100">
                <p className="text-sm font-medium text-teal-800">
                  ✨ Silakan salin setiap isian yang diperlukan dan paste ke aplikasi observasi Anda.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
