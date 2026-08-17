"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSopStore, SopTemplate } from "@/lib/sop-store";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SopTemplatePage() {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useSopStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  // Form states
  const [typePekerjaan, setTypePekerjaan] = useState("");
  const [jenisUnit, setJenisUnit] = useState("");
  const [hasilPemeriksaanArea, setHasilPemeriksaanArea] = useState("");
  const [rekomendasiArea, setRekomendasiArea] = useState("");
  const [hasilPemeriksaanArea360, setHasilPemeriksaanArea360] = useState("");
  const [rekomendasiArea360, setRekomendasiArea360] = useState("");
  const [hasilEnergiBerbahaya, setHasilEnergiBerbahaya] = useState("");
  const [rekomendasiEnergiBerbahaya, setRekomendasiEnergiBerbahaya] = useState("");
  const [hasilPj, setHasilPj] = useState("");
  const [rekomendasiPj, setRekomendasiPj] = useState("");
  const [langkahKerja, setLangkahKerja] = useState("");
  const [potensiBahaya, setPotensiBahaya] = useState("");
  const [kontrolResiko, setKontrolResiko] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTypePekerjaan("");
    setJenisUnit("");
    setHasilPemeriksaanArea("");
    setRekomendasiArea("");
    setHasilPemeriksaanArea360("");
    setRekomendasiArea360("");
    setHasilEnergiBerbahaya("");
    setRekomendasiEnergiBerbahaya("");
    setHasilPj("");
    setRekomendasiPj("");
    setLangkahKerja("");
    setPotensiBahaya("");
    setKontrolResiko("");
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (template: SopTemplate) => {
    setEditingId(template.id);
    setTypePekerjaan(template.typePekerjaan);
    setJenisUnit(template.jenisUnit);
    setHasilPemeriksaanArea(template.hasilPemeriksaanArea);
    setRekomendasiArea(template.rekomendasiArea);
    setHasilPemeriksaanArea360(template.hasilPemeriksaanArea360);
    setRekomendasiArea360(template.rekomendasiArea360);
    setHasilEnergiBerbahaya(template.hasilEnergiBerbahaya);
    setRekomendasiEnergiBerbahaya(template.rekomendasiEnergiBerbahaya);
    setHasilPj(template.hasilPj);
    setRekomendasiPj(template.rekomendasiPj);
    setLangkahKerja(template.langkahKerja);
    setPotensiBahaya(template.potensiBahaya);
    setKontrolResiko(template.kontrolResiko);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus SOP ini?")) {
      deleteTemplate(id);
      toast.success("SOP berhasil dihapus");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typePekerjaan || !jenisUnit) {
      toast.error("Type Pekerjaan dan Jenis Unit wajib diisi");
      return;
    }

    const templateData = {
      typePekerjaan,
      jenisUnit,
      hasilPemeriksaanArea,
      rekomendasiArea,
      hasilPemeriksaanArea360,
      rekomendasiArea360,
      hasilEnergiBerbahaya,
      rekomendasiEnergiBerbahaya,
      hasilPj,
      rekomendasiPj,
      langkahKerja,
      potensiBahaya,
      kontrolResiko,
    };

    if (editingId) {
      updateTemplate(editingId, templateData);
      toast.success("SOP berhasil diupdate");
    } else {
      addTemplate(templateData);
      toast.success("SOP berhasil ditambahkan");
    }

    setIsDialogOpen(false);
  };

  const filteredTemplates = templates.filter(t => 
    t.typePekerjaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.jenisUnit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">SOP Template</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger 
            render={<Button onClick={handleOpenDialog} className="bg-primary hover:bg-primary/90 text-primary-foreground" />}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah SOP
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-card border-border">
            <DialogHeader className="p-6 pb-4 border-b border-border bg-muted/30">
              <DialogTitle className="text-xl text-foreground">
                {editingId ? "Edit SOP Template" : "Tambah SOP Template"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col min-h-[50vh]">
              <Tabs defaultValue="umum" className="w-full flex-1 flex flex-col">
                <div className="px-6 border-b border-border">
                  <TabsList className="bg-transparent h-12 w-full justify-start space-x-2">
                    <TabsTrigger value="umum" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary rounded-b-none px-4">Informasi Umum</TabsTrigger>
                    <TabsTrigger value="area" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary rounded-b-none px-4">Pemeriksaan Area</TabsTrigger>
                    <TabsTrigger value="jsa" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary rounded-b-none px-4">JSA</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  {/* TAB 1: UMUM */}
                  <TabsContent value="umum" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Type Pekerjaan / Judul SOP <span className="text-destructive">*</span></label>
                        <Input 
                          placeholder="Contoh: Instalasi Radio FM" 
                          value={typePekerjaan} 
                          onChange={e => setTypePekerjaan(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Jenis Unit Target <span className="text-destructive">*</span></label>
                        <Input 
                          placeholder="Contoh: Dozer" 
                          value={jenisUnit} 
                          onChange={e => setJenisUnit(e.target.value)} 
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: AREA */}
                  <TabsContent value="area" className="space-y-5 mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Hasil pemeriksaan area</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={hasilPemeriksaanArea} onChange={e => setHasilPemeriksaanArea(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Rekomendasi area</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={rekomendasiArea} onChange={e => setRekomendasiArea(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Hasil pemeriksaan area 360</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={hasilPemeriksaanArea360} onChange={e => setHasilPemeriksaanArea360(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Rekomendasi area 360</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={rekomendasiArea360} onChange={e => setRekomendasiArea360(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Hasil energi berbahaya</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={hasilEnergiBerbahaya} onChange={e => setHasilEnergiBerbahaya(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Rekomendasi energi berbahaya</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={rekomendasiEnergiBerbahaya} onChange={e => setRekomendasiEnergiBerbahaya(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Hasil penanggung jawab</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={hasilPj} onChange={e => setHasilPj(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Rekomendasi penanggung jawab</label>
                        <Textarea className="resize-none h-20 bg-background border-border" value={rekomendasiPj} onChange={e => setRekomendasiPj(e.target.value)} />
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 3: JSA */}
                  <TabsContent value="jsa" className="space-y-5 mt-0">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Urutan langkah kerja</label>
                      <Textarea className="resize-none h-32 bg-background border-border" value={langkahKerja} onChange={e => setLangkahKerja(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Potensi bahaya/resiko</label>
                      <Textarea className="resize-none h-32 bg-background border-border" value={potensiBahaya} onChange={e => setPotensiBahaya(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Kontrol resiko</label>
                      <Textarea className="resize-none h-32 bg-background border-border" value={kontrolResiko} onChange={e => setKontrolResiko(e.target.value)} />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
              
              <div className="p-6 pt-4 border-t border-border bg-muted/30 mt-auto">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11">
                  Simpan SOP
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari SOP..."
            className="pl-9 bg-card border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Type Pekerjaan</TableHead>
              <TableHead>Jenis Unit</TableHead>
              <TableHead>Diupdate</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Tidak ada SOP yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{item.typePekerjaan}</TableCell>
                  <TableCell>{item.jenisUnit}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(item.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4 text-primary" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Hapus</span>
                      </Button>
                    </div>
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
