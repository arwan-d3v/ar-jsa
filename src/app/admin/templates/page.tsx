"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Edit2, Plus, Trash2 } from "lucide-react";
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, TemplateWithRelations } from "@/lib/api/templates";
import { getTypePekerjaan, TypePekerjaan } from "@/lib/api/type-pekerjaan";
import { getJenisUnit, JenisUnit } from "@/lib/api/jenis-unit";
import { getCuaca, Cuaca } from "@/lib/api/cuaca";
import { getKondisi, Kondisi } from "@/lib/api/kondisi";

export default function TemplatesPage() {
  const [data, setData] = useState<TemplateWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Options
  const [typePekerjaan, setTypePekerjaan] = useState<TypePekerjaan[]>([]);
  const [jenisUnit, setJenisUnit] = useState<JenisUnit[]>([]);
  const [cuaca, setCuaca] = useState<Cuaca[]>([]);
  const [kondisi, setKondisi] = useState<Kondisi[]>([]);

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
    fetchData();
    fetchOptions();
  }, []);

  async function fetchOptions() {
    try {
      const [types, units, weathers, conds] = await Promise.all([
        getTypePekerjaan(),
        getJenisUnit(),
        getCuaca(),
        getKondisi(),
      ]);
      setTypePekerjaan(types?.filter(t => t.is_active) || []);
      setJenisUnit(units?.filter(u => u.is_active) || []);
      setCuaca(weathers?.filter(c => c.is_active) || []);
      setKondisi(conds?.filter(k => k.is_active) || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchData() {
    setLoading(true);
    try {
      const result = await getTemplates();
      setData(result || []);
    } catch (error) {
      toast.error("Gagal memuat data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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
      fetchData();
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
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus template");
      console.error(error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-teal-700" />
          <h1 className="text-3xl font-bold tracking-tight text-teal-900">Template Observasi</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="bg-teal-700 hover:bg-teal-800">
              <Plus className="mr-2 h-4 w-4" /> Tambah Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Template Observasi" : "Tambah Template Observasi"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              
              {/* Parameters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type Pekerjaan</label>
                  <Select value={selectedType} onValueChange={setSelectedType} disabled={!!editingId}>
                    <SelectTrigger><SelectValue placeholder="Pilih type" /></SelectTrigger>
                    <SelectContent>
                      {typePekerjaan.map(t => <SelectItem key={t.id} value={t.id}>{t.nama}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jenis Unit</label>
                  <Select value={selectedUnit} onValueChange={setSelectedUnit} disabled={!!editingId}>
                    <SelectTrigger><SelectValue placeholder="Pilih unit" /></SelectTrigger>
                    <SelectContent>
                      {jenisUnit.map(u => <SelectItem key={u.id} value={u.id}>{u.nama}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cuaca</label>
                  <Select value={selectedCuaca} onValueChange={setSelectedCuaca} disabled={!!editingId}>
                    <SelectTrigger><SelectValue placeholder="Pilih cuaca" /></SelectTrigger>
                    <SelectContent>
                      {cuaca.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.nama}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kondisi</label>
                  <Select value={selectedKondisi} onValueChange={setSelectedKondisi} disabled={!!editingId}>
                    <SelectTrigger><SelectValue placeholder="Pilih kondisi" /></SelectTrigger>
                    <SelectContent>
                      {kondisi.map(k => <SelectItem key={k.id} value={k.id}>{k.nama}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Pemeriksaan Area Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-teal-800 border-b pb-2">Pemeriksaan Area</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hasil pemeriksaan area</label>
                    <Textarea value={hArea} onChange={e => setHArea(e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rekomendasi area</label>
                    <Textarea value={rArea} onChange={e => setRArea(e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hasil pemeriksaan area 360</label>
                    <Textarea value={hArea360} onChange={e => setHArea360(e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rekomendasi area 360</label>
                    <Textarea value={rArea360} onChange={e => setRArea360(e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hasil energi berbahaya</label>
                    <Textarea value={hEnergi} onChange={e => setHEnergi(e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rekomendasi energi berbahaya</label>
                    <Textarea value={rEnergi} onChange={e => setREnergi(e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hasil penanggung jawab</label>
                    <Textarea value={hPj} onChange={e => setHPj(e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rekomendasi penanggung jawab</label>
                    <Textarea value={rPj} onChange={e => setRPj(e.target.value)} rows={2} />
                  </div>
                </div>

                {/* JSA Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-teal-800 border-b pb-2">Job Safety Analysis (JSA)</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Urutan langkah kerja</label>
                    <Textarea value={langkah} onChange={e => setLangkah(e.target.value)} rows={4} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Potensi bahaya/resiko</label>
                    <Textarea value={bahaya} onChange={e => setBahaya(e.target.value)} rows={4} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kontrol resiko</label>
                    <Textarea value={kontrol} onChange={e => setKontrol(e.target.value)} rows={4} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" className="w-full md:w-auto bg-teal-700 hover:bg-teal-800" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Template"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
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
            {loading ? (
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
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary">Nonaktif</Badge>
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
    </div>
  );
}
