"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GeneratedSection } from "@/components/generate/GeneratedSection";
import { ClipboardCheck, BarChart2, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useTypePekerjaanStore, useJenisUnitStore, useCuacaStore, useKondisiStore, useTemplateStore } from "@/lib/store";
import { useSopStore } from "@/lib/sop-store";
import { TemplateWithRelations } from "@/lib/api/templates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GeneratePage() {
  // Zustand Stores (Local Cache)
  const { data: typePekerjaanRaw, sync: syncTypePekerjaan } = useTypePekerjaanStore();
  const { data: jenisUnitRaw, sync: syncJenisUnit } = useJenisUnitStore();
  const { data: cuacaRaw, sync: syncCuaca } = useCuacaStore();
  const { data: kondisiRaw, sync: syncKondisi } = useKondisiStore();
  const { data: templates, sync: syncTemplates } = useTemplateStore();
  const { templates: sopTemplates } = useSopStore();

  const typePekerjaan = typePekerjaanRaw.filter(t => t.is_active);
  const jenisUnit = jenisUnitRaw.filter(u => u.is_active);
  const cuaca = cuacaRaw.filter(c => c.is_active);
  const kondisi = kondisiRaw.filter(k => k.is_active);

  const [activeTab, setActiveTab] = useState("jsa");

  // Selected Params
  const [selectedType, setSelectedType] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCuaca, setSelectedCuaca] = useState("");
  const [selectedKondisi, setSelectedKondisi] = useState("");
  const [selectedSop, setSelectedSop] = useState("");

  // Result
  const [generatedData, setGeneratedData] = useState<any>(null);
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
    setIsGenerating(true);
    setGeneratedData(null); // Reset
    
    setTimeout(() => {
      if (activeTab === "jsa") {
        if (!selectedType || !selectedUnit || !selectedCuaca || !selectedKondisi) {
          toast.error("Silakan pilih semua parameter terlebih dahulu!");
          setIsGenerating(false);
          return;
        }

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
          });
        }
      } else {
        // SOP Tab
        if (!selectedSop) {
          toast.error("Silakan pilih SOP Template terlebih dahulu!");
          setIsGenerating(false);
          return;
        }

        const result = sopTemplates.find(s => s.id === selectedSop);
        if (result) {
          setGeneratedData({
             hasil_pemeriksaan_area: result.hasilPemeriksaanArea,
             rekomendasi_area: result.rekomendasiArea,
             hasil_pemeriksaan_area_360: result.hasilPemeriksaanArea360,
             rekomendasi_area_360: result.rekomendasiArea360,
             hasil_energi_berbahaya: result.hasilEnergiBerbahaya,
             rekomendasi_energi_berbahaya: result.rekomendasiEnergiBerbahaya,
             hasil_penanggung_jawab: result.hasilPj,
             rekomendasi_penanggung_jawab: result.rekomendasiPj,
             urutan_langkah_kerja: result.langkahKerja,
             potensi_bahaya: result.potensiBahaya,
             kontrol_resiko: result.kontrolResiko,
          });
          toast.success("Berhasil menampilkan SOP Template!");
        } else {
          toast.error("SOP Template tidak ditemukan!");
        }
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
    <div className="min-h-screen bg-background transition-colors duration-[2500ms] pb-24">
      <Header />
      
      <main className="max-w-2xl mx-auto w-full p-4 space-y-8 mt-4 md:mt-8">
        
        {/* Context Bar Selector */}
        <div className="bg-card p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 border border-border space-y-8 relative overflow-hidden transition-colors duration-[2500ms]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="jsa" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">JSA Observasi</TabsTrigger>
                <TabsTrigger value="sop" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">SOP Template</TabsTrigger>
              </TabsList>
              
              <TabsContent value="jsa" className="space-y-8 mt-0">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Parameter Observasi</h2>
                  <p className="text-muted-foreground text-sm">Tentukan kombinasi parameter untuk mencari template JSA yang sesuai.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-foreground">Jenis Pekerjaan</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-full h-12 rounded-xl bg-background border-border focus-visible:ring-primary/50 transition-colors">
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
                    <label className="text-sm font-semibold text-foreground">Unit Operasional</label>
                    <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                      <SelectTrigger className="w-full h-12 rounded-xl bg-background border-border focus-visible:ring-primary/50 transition-colors">
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
                    <label className="text-sm font-semibold text-foreground">Kondisi Cuaca</label>
                    <Select value={selectedCuaca} onValueChange={setSelectedCuaca}>
                      <SelectTrigger className="w-full h-12 rounded-xl bg-background border-border focus-visible:ring-primary/50 transition-colors">
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
                    <label className="text-sm font-semibold text-foreground">Kondisi Lingkungan</label>
                    <Select value={selectedKondisi} onValueChange={setSelectedKondisi}>
                      <SelectTrigger className="w-full h-12 rounded-xl bg-background border-border focus-visible:ring-primary/50 transition-colors">
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
              </TabsContent>

              <TabsContent value="sop" className="space-y-8 mt-0">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Pilih SOP Template</h2>
                  <p className="text-muted-foreground text-sm">Pilih standar operasional prosedur yang telah dianalisa oleh AI.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 relative z-10">
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-foreground">SOP Template</label>
                    <Select value={selectedSop} onValueChange={setSelectedSop}>
                      <SelectTrigger className="w-full h-12 rounded-xl bg-background border-border focus-visible:ring-primary/50 transition-colors">
                        <SelectValue>
                          {selectedSop 
                            ? (() => {
                                const s = sopTemplates.find(t => t.id === selectedSop);
                                return s ? `${s.typePekerjaan} - ${s.jenisUnit}` : "Pilih SOP...";
                              })()
                            : "Pilih SOP..."}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {sopTemplates.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">Tidak ada SOP</div>
                        ) : (
                          sopTemplates.map(s => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.typePekerjaan} - {s.jenisUnit}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button 
              className="w-full h-14 mt-8 text-base font-bold bg-primary hover:bg-primary/90 rounded-xl text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 relative z-10 night-glow" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <Rocket className="mr-2 h-5 w-5" />
              {isGenerating ? "MENCARI DATA..." : "TAMPILKAN HASIL"}
            </Button>
          </div>
        </div>

        {/* Generated Content Sections */}
        {generatedData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <GeneratedSection 
              title="Pemeriksaan Area"
              icon={<ClipboardCheck className="h-6 w-6 text-primary" />}
              fields={pemeriksaanAreaFields}
            />
            
            <GeneratedSection 
              title="Job Safety Analysis (JSA)"
              icon={<BarChart2 className="h-6 w-6 text-primary" />}
              fields={jsaFields}
            />
            
            <div className="text-center pt-6 pb-12">
              <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <p className="text-sm font-medium text-primary">
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
