"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileText, Edit2, Plus, Trash2 } from "lucide-react";
import { createTemplate, updateTemplate, deleteTemplate, TemplateWithRelations } from "@/lib/api/templates";
import { useTemplateStore, useTypePekerjaanStore, useJenisUnitStore, useCuacaStore, useKondisiStore } from "@/lib/store";

export default function TemplatesPage() {
  const { data, sync, isSyncing } = useTemplateStore();
  
  // Options
  const { data: typePekerjaanRaw, sync: syncTypePekerjaan } = useTypePekerjaanStore();
  const { data: jenisUnitRaw, sync: syncJenisUnit } = useJenisUnitStore();
  const { data: cuacaRaw, sync: syncCuaca } = useCuacaStore();
  const { data: kondisiRaw, sync: syncKondisi } = useKondisiStore();

  const typePekerjaan = typePekerjaanRaw.filter(t => t.is_active);
  const jenisUnit = jenisUnitRaw.filter(u => u.is_active);
  const cuaca = cuacaRaw.filter(c => c.is_active);
  const kondisi = kondisiRaw.filter(k => k.is_active);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state - Params
  const [selectedType, setSelectedType] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCuaca, setSelectedCuaca] = useState("");
  const [selectedKondisi, setSelectedKondisi] = useState("");

  // Form state - Pemeriksaan Area
  const [hArea, setHArea] = useState("");
  const [rArea, setRArea] = useState("");
  const [hArea360, setHArea360] = useState("");
  const [rArea360, setRArea360] = useState("");
  const [hEnergi, setHEnergi] = useState("");
  const [rEnergi, setREnergi] = useState("");
  const [hPj, setHPj] = useState("");
  const [rPj, setRPj] = useState("");

  // Form state - JSA
  const [langkah, setLangkah] = useState("");
  const [bahaya, setBahaya] = useState("");
  const [kontrol, setKontrol] = useState("");

  useEffect(() => {
    sync();
    syncTypePekerjaan();
    syncJenisUnit();
    syncCuaca();
    syncKondisi();
  }, [sync, syncTypePekerjaan, syncJenisUnit, syncCuaca, syncKondisi]);

  function handleEdit(item: TemplateWithRelations) {
    setEditingId(item.id);
    setSelectedType(item.type_pekerjaan_id);
    setSelectedUnit(item.jenis_unit_id);
    setSelectedCuaca(item.cuaca_id);
    setSelectedKondisi(item.kondisi_id);
    
    setHArea(item.hasil_pemeriksaan_area || "");
    setRArea(item.rekomendasi_area || "");
    setHArea360(item.hasil_pemeriksaan_area_360 || "");
    setRArea360(item.rekomendasi_area_360 || "");
    setHEnergi(item.hasil_energi_berbahaya || "");
    setREnergi(item.rekomendasi_energi_berbahaya || "");
    setHPj(item.hasil_penanggung_jawab || "");
    setRPj(item.rekomendasi_penanggung_jawab || "");
    
    setLangkah(item.urutan_langkah_kerja || "");
    setBahaya(item.potensi_bahaya || "");
    setKontrol(item.kontrol_resiko || "");
    
    setIsDialogOpen(true);
  }

  function handleOpenDialog() {
    setEditingId(null);
    setSelectedType("");
    setSelectedUnit("");
    setSelectedCuaca("");
    setSelectedKondisi("");
    
    setHArea(""); setRArea(""); setHArea360(""); setRArea360("");
    setHEnergi(""); setREnergi(""); setHPj(""); setRPj("");
    setLangkah(""); setBahaya(""); setKontrol("");
    
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType || !selectedUnit || !selectedCuaca || !selectedKondisi) {
      toast.error("Semua parameter wajib dipilih");
      return;
    }

    const payload = {
      type_pekerjaan_id: selectedType,
      jenis_unit_id: selectedUnit,
      cuaca_id: selectedCuaca,
      kondisi_id: selectedKondisi,
      hasil_pemeriksaan_area: hArea,
      rekomendasi_area: rArea,
      hasil_pemeriksaan_area_360: hArea360,
      rekomendasi_area_360: rArea360,
      hasil_energi_berbahaya: hEnergi,
      rekomendasi_energi_berbahaya: rEnergi,
      hasil_penanggung_jawab: hPj,
      rekomendasi_penanggung_jawab: rPj,
      urutan_langkah_kerja: langkah,
      potensi_bahaya: bahaya,
      kontrol_resiko: kontrol,
      is_active: true
    };

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateTemplate(editingId, payload);
        toast.success("Template berhasil diupdate");
      } else {
        await createTemplate(payload as any);
        toast.success("Template berhasil ditambahkan");
      }
      setIsDialogOpen(false);
      sync();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error("Template untuk kombinasi ini sudah ada!");
      } else {
        toast.error("Terjadi kesalahan");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus template ini?")) return;
    
    try {
      await deleteTemplate(id);
      toast.success("Template berhasil dihapus");
      sync();
    } catch (error) {
      toast.error("Gagal menghapus template");
      console.error(error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Template Observasi</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <Button onClick={handleOpenDialog} className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 flex items-center justify-center p-0 md:static md:w-auto md:h-10 md:rounded-md md:px-4 md:py-2 md:shadow-none bg-primary hover:bg-primary/90 text-primary-foreground" />
            }
          >
            <Plus className="h-6 w-6 md:h-4 md:w-4 md:mr-2" /> <span className="hidden md:inline">Tambah Template</span>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-card border-border">
            <DialogHeader className="p-6 pb-4 border-b border-border bg-muted/30">
              <DialogTitle className="text-xl text-foreground">{editingId ? "Edit Template Observasi" : "Tambah Template Observasi"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col min-h-[50vh]">
              <Tabs defaultValue="parameter" className="w-full flex-1 flex flex-col">
                <div className="px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="parameter">Parameter</TabsTrigger>
                    <TabsTrigger value="area">Pemeriksaan Area</TabsTrigger>
                    <TabsTrigger value="jsa">JSA</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  {/* TAB 1: Parameters */}
                  <TabsContent value="parameter" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Type Pekerjaan</label>
                        <Select value={selectedType} onValueChange={setSelectedType} disabled={!!editingId}>
                          <SelectTrigger className="w-full bg-background border-border"><SelectValue>{selectedType ? typePekerjaan.find(t => t.id === selectedType)?.nama : "Pilih type"}</SelectValue></SelectTrigger>
                          <SelectContent>
                            {typePekerjaan.map(t => <SelectItem key={t.id} value={t.id}>{t.nama}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Jenis Unit</label>
                        <Select value={selectedUnit} onValueChange={setSelectedUnit} disabled={!!editingId}>
                          <SelectTrigger className="w-full bg-background border-border"><SelectValue>{selectedUnit ? jenisUnit.find(u => u.id === selectedUnit)?.nama : "Pilih unit"}</SelectValue></SelectTrigger>
                          <SelectContent>
                            {jenisUnit.map(u => <SelectItem key={u.id} value={u.id}>{u.nama}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Cuaca</label>
                        <Select value={selectedCuaca} onValueChange={setSelectedCuaca} disabled={!!editingId}>
                          <SelectTrigger className="w-full bg-background border-border"><SelectValue>{selectedCuaca ? (() => { const c = cuaca.find(c => c.id === selectedCuaca); return c ? `${c.icon} ${c.nama}` : "Pilih cuaca" })() : "Pilih cuaca"}</SelectValue></SelectTrigger>
                          <SelectContent>
                            {cuaca.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.nama}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Kondisi</label>
                        <Select value={selectedKondisi} onValueChange={setSelectedKondisi} disabled={!!editingId}>
                          <SelectTrigger className="w-full bg-background border-border"><SelectValue>{selectedKondisi ? kondisi.find(k => k.id === selectedKondisi)?.nama : "Pilih kondisi"}</SelectValue></SelectTrigger>
                          <SelectContent>
                            {kondisi.map(k => <SelectItem key={k.id} value={k.id}>{k.nama}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: Pemeriksaan Area */}
                  <TabsContent value="area" className="space-y-5 mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Hasil pemeriksaan area</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={hArea} onChange={e => setHArea(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Rekomendasi area</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={rArea} onChange={e => setRArea(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Hasil pemeriksaan area 360</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={hArea360} onChange={e => setHArea360(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Rekomendasi area 360</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={rArea360} onChange={e => setRArea360(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Hasil energi berbahaya</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={hEnergi} onChange={e => setHEnergi(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Rekomendasi energi berbahaya</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={rEnergi} onChange={e => setREnergi(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Hasil penanggung jawab</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={hPj} onChange={e => setHPj(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Rekomendasi penanggung jawab</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={rPj} onChange={e => setRPj(e.target.value)} />
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 3: JSA */}
                  <TabsContent value="jsa" className="space-y-5 mt-0">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Urutan langkah kerja</label>
                      <Textarea className="resize-none h-24 bg-background border-border" value={langkah} onChange={e => setLangkah(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Potensi bahaya/resiko</label>
                      <Textarea className="resize-none h-24 bg-background border-border" value={bahaya} onChange={e => setBahaya(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Kontrol resiko</label>
                      <Textarea className="resize-none h-24 bg-background border-border" value={kontrol} onChange={e => setKontrol(e.target.value)} />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
              
              <div className="p-6 pt-4 border-t border-border bg-muted/30 mt-auto">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Template"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Cuaca</TableHead>
              <TableHead>Kondisi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSyncing && data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Belum ada data template.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.type_pekerjaan?.nama}</TableCell>
                  <TableCell>{item.jenis_unit?.nama}</TableCell>
                  <TableCell>{item.cuaca?.icon} {item.cuaca?.nama}</TableCell>
                  <TableCell>
                    <Badge variant="outline" style={{ borderColor: item.kondisi?.color, color: item.kondisi?.color }}>
                      {item.kondisi?.nama}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.is_active ? (
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">Nonaktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {item.is_active && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {isSyncing && data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-card rounded-md border border-border">
            Memuat data...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-card rounded-md border border-border">
            Belum ada data template.
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="bg-card p-4 rounded-md border border-border shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold text-muted-foreground bg-muted/20">{item.type_pekerjaan?.nama}</Badge>
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold text-muted-foreground bg-muted/20">{item.jenis_unit?.nama}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm bg-muted/30 px-2 py-0.5 rounded-sm border border-border/50">{item.cuaca?.icon} {item.cuaca?.nama}</span>
                    <Badge variant="outline" className="text-xs" style={{ borderColor: item.kondisi?.color, color: item.kondisi?.color }}>
                      {item.kondisi?.nama}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {item.is_active ? (
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">Aktif</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">Nonaktif</Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-1">
                <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="h-8">
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
                {item.is_active && (
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="h-8 text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-1" /> Hapus
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
