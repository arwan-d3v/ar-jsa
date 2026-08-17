"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { FileDropZone } from "@/components/batch-import/FileDropZone";
import { ExtractedPreview } from "@/components/batch-import/ExtractedPreview";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UploadCloud, CheckCircle2, ArrowRight, Save, Trash2, RefreshCw } from "lucide-react";
import { convertHeicToJpeg, fileToBase64 } from "@/lib/file-utils";
import { ExtractedTemplate, MappedTemplate, fuzzyMatchMasterData } from "@/lib/ai/gemini";
import { useTypePekerjaanStore, useJenisUnitStore, useCuacaStore, useKondisiStore, useTemplateStore } from "@/lib/store";
import { createTemplate } from "@/lib/api/templates";

export default function BatchImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<MappedTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Master Data
  const { data: typePekerjaan, sync: syncTypePekerjaan } = useTypePekerjaanStore();
  const { data: jenisUnit, sync: syncJenisUnit } = useJenisUnitStore();
  const { data: cuaca, sync: syncCuaca } = useCuacaStore();
  const { data: kondisi, sync: syncKondisi } = useKondisiStore();
  const { sync: syncTemplates } = useTemplateStore();

  useEffect(() => {
    syncTypePekerjaan();
    syncJenisUnit();
    syncCuaca();
    syncKondisi();
  }, [syncTypePekerjaan, syncJenisUnit, syncCuaca, syncKondisi]);

  const handleFilesSelected = async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setExtractedData(null);
    
    // Show preview for images
    if (selectedFile.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null); // PDF preview handling is complex, skip for now
    }

    await extractFile(selectedFile);
  };

  const extractFile = async (targetFile: File) => {
    setIsExtracting(true);
    try {
      let fileToProcess = targetFile;
      
      // Convert HEIC if necessary
      if (fileToProcess.name.toLowerCase().endsWith(".heic") || fileToProcess.type === "image/heic") {
        toast.info("Mengonversi file HEIC...");
        const blob = await convertHeicToJpeg(fileToProcess);
        fileToProcess = new File([blob], fileToProcess.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
      }

      // Convert to base64
      const base64Data = await fileToBase64(fileToProcess);

      // Call API
      toast.loading("AI sedang mengekstrak data...", { id: "extract-toast" });
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Data,
          mimeType: fileToProcess.type || "application/pdf"
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghubungi server");
      }

      const { data } = await res.json();
      
      // Map to master data
      const masterData = {
        typePekerjaan: typePekerjaan.filter(x => x.is_active),
        jenisUnit: jenisUnit.filter(x => x.is_active),
        cuaca: cuaca.filter(x => x.is_active),
        kondisi: kondisi.filter(x => x.is_active),
      };
      
      const mappedData = fuzzyMatchMasterData(data, masterData);
      setExtractedData(mappedData);
      
      toast.success("Ekstraksi selesai!", { id: "extract-toast" });
    } catch (error: any) {
      console.error(error);
      toast.error(`Gagal mengekstrak: ${error.message}`, { id: "extract-toast" });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFieldChange = (field: keyof ExtractedTemplate, value: string) => {
    if (extractedData) {
      setExtractedData({ ...extractedData, [field]: value });
    }
  };

  const handleMappingChange = (field: keyof MappedTemplate["mapped_ids"], value: string) => {
    if (extractedData) {
      setExtractedData({
        ...extractedData,
        mapped_ids: {
          ...extractedData.mapped_ids,
          [field]: value
        }
      });
    }
  };

  const handleSave = async () => {
    if (!extractedData) return;
    
    const { mapped_ids, type_pekerjaan, jenis_unit, cuaca: cuacaRaw, kondisi: kondisiRaw, ...fields } = extractedData;
    
    if (!mapped_ids.type_pekerjaan_id || !mapped_ids.jenis_unit_id || !mapped_ids.cuaca_id || !mapped_ids.kondisi_id) {
      toast.error("Pilih semua parameter utama (Type, Unit, Cuaca, Kondisi) terlebih dahulu.");
      return;
    }

    setIsSaving(true);
    try {
      await createTemplate({
        type_pekerjaan_id: mapped_ids.type_pekerjaan_id,
        jenis_unit_id: mapped_ids.jenis_unit_id,
        cuaca_id: mapped_ids.cuaca_id,
        kondisi_id: mapped_ids.kondisi_id,
        ...fields,
        is_active: true
      });
      
      toast.success("Template berhasil disimpan!");
      syncTemplates();
      handleReset();
    } catch (error: any) {
      console.error(error);
      if (error.code === '23505') {
        toast.error("Template untuk kombinasi parameter ini sudah ada.");
      } else {
        toast.error("Gagal menyimpan template.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UploadCloud className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Batch Import (AI)</h1>
      </div>

      <p className="text-muted-foreground text-sm max-w-3xl">
        Upload foto formulir atau dokumen PDF JSA. AI (Gemini 2.0 Flash) akan otomatis mengekstrak teks, 
        mencocokkan dengan master data, dan mengisi form template.
      </p>

      {!file && !isExtracting && (
        <div className="max-w-2xl mt-8">
          <FileDropZone onFilesSelected={handleFilesSelected} />
        </div>
      )}

      {(file || isExtracting) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* LEFT COLUMN: Preview & Status */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground truncate max-w-[200px]" title={file?.name}>
                  {file?.name}
                </h3>
                <div className="flex items-center gap-2">
                  {isExtracting ? (
                    <span className="flex items-center text-xs font-medium text-primary">
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Ekstraksi AI...
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-medium text-emerald-500">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Selesai
                    </span>
                  )}
                </div>
              </div>
              
              <div className="aspect-[3/4] bg-muted/30 rounded-xl overflow-hidden border border-border flex items-center justify-center relative">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-muted-foreground text-sm flex flex-col items-center">
                    <UploadCloud className="h-8 w-8 mb-2 opacity-50" />
                    Preview dokumen tidak tersedia
                  </div>
                )}
                
                {isExtracting && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                    <p className="font-medium text-foreground">AI Sedang Membaca...</p>
                  </div>
                )}
              </div>
              
              {!isExtracting && (
                <Button variant="outline" className="w-full mt-4" onClick={handleReset}>
                  <UploadCloud className="h-4 w-4 mr-2" /> Upload File Lain
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Extracted Data */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {!extractedData && !isExtracting && (
              <div className="glass-card rounded-2xl h-full flex flex-col items-center justify-center p-8 text-center border-dashed">
                <ArrowRight className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">Hasil ekstraksi akan muncul di sini</p>
              </div>
            )}
            
            {extractedData && (
              <>
                <div className="glass-card p-6 rounded-2xl border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.05)]">
                  <h3 className="font-semibold text-foreground mb-4">1. Parameter Utama</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground/80">Type Pekerjaan</label>
                      <Select 
                        value={extractedData.mapped_ids.type_pekerjaan_id || ""} 
                        onValueChange={(val) => handleMappingChange("type_pekerjaan_id", val)}
                      >
                        <SelectTrigger className={`w-full bg-background ${!extractedData.mapped_ids.type_pekerjaan_id ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Pilih Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {typePekerjaan.filter(t => t.is_active).map(t => <SelectItem key={t.id} value={t.id}>{t.nama}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-muted-foreground">Extracted: <span className="font-mono">{extractedData.type_pekerjaan || "-"}</span></p>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground/80">Jenis Unit</label>
                      <Select 
                        value={extractedData.mapped_ids.jenis_unit_id || ""} 
                        onValueChange={(val) => handleMappingChange("jenis_unit_id", val)}
                      >
                        <SelectTrigger className={`w-full bg-background ${!extractedData.mapped_ids.jenis_unit_id ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Pilih Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {jenisUnit.filter(t => t.is_active).map(t => <SelectItem key={t.id} value={t.id}>{t.nama}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-muted-foreground">Extracted: <span className="font-mono">{extractedData.jenis_unit || "-"}</span></p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground/80">Cuaca</label>
                      <Select 
                        value={extractedData.mapped_ids.cuaca_id || ""} 
                        onValueChange={(val) => handleMappingChange("cuaca_id", val)}
                      >
                        <SelectTrigger className={`w-full bg-background ${!extractedData.mapped_ids.cuaca_id ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Pilih Cuaca" />
                        </SelectTrigger>
                        <SelectContent>
                          {cuaca.filter(t => t.is_active).map(t => <SelectItem key={t.id} value={t.id}>{t.icon} {t.nama}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-muted-foreground">Extracted: <span className="font-mono">{extractedData.cuaca || "-"}</span></p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground/80">Kondisi</label>
                      <Select 
                        value={extractedData.mapped_ids.kondisi_id || ""} 
                        onValueChange={(val) => handleMappingChange("kondisi_id", val)}
                      >
                        <SelectTrigger className={`w-full bg-background ${!extractedData.mapped_ids.kondisi_id ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Pilih Kondisi" />
                        </SelectTrigger>
                        <SelectContent>
                          {kondisi.filter(t => t.is_active).map(t => <SelectItem key={t.id} value={t.id}>{t.nama}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-muted-foreground">Extracted: <span className="font-mono">{extractedData.kondisi || "-"}</span></p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-semibold text-foreground mb-4">2. Konten JSA & Pemeriksaan</h3>
                  <ExtractedPreview data={extractedData} onChange={handleFieldChange} />
                </div>
                
                <div className="flex gap-4 sticky bottom-6 z-10 p-4 glass-card rounded-xl">
                  <Button variant="outline" className="flex-1" onClick={handleReset}>
                    <Trash2 className="w-4 h-4 mr-2" /> Batal
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90 night-glow font-bold" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSaving ? "Menyimpan..." : "Simpan Template"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
