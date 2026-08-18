"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Briefcase, Edit2, Plus, Trash2 } from "lucide-react";
import { createTypePekerjaan, updateTypePekerjaan, deleteTypePekerjaan, TypePekerjaan } from "@/lib/api/type-pekerjaan";
import { useTypePekerjaanStore } from "@/lib/store";

export default function TypePekerjaanPage() {
  const { data, sync, isSyncing } = useTypePekerjaanStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    sync();
  }, [sync]);

  function handleEdit(item: TypePekerjaan) {
    setEditingId(item.id);
    setNama(item.nama);
    setDeskripsi(item.deskripsi || "");
    setIsDialogOpen(true);
  }

  function handleOpenDialog() {
    setEditingId(null);
    setNama("");
    setDeskripsi("");
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) {
      toast.error("Nama wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateTypePekerjaan(editingId, nama, deskripsi);
        toast.success("Data berhasil diupdate");
      } else {
        await createTypePekerjaan(nama, deskripsi);
        toast.success("Data berhasil ditambahkan");
      }
      setIsDialogOpen(false);
      sync();
    } catch (error: any) {
      toast.error("Terjadi kesalahan");
      console.error(error?.message || error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    
    try {
      await deleteTypePekerjaan(id);
      toast.success("Data berhasil dihapus");
      sync();
    } catch (error) {
      toast.error("Gagal menghapus data");
      console.error(error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-teal-700" />
          <h1 className="text-3xl font-bold tracking-tight text-teal-900">Type Pekerjaan</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <Button onClick={handleOpenDialog} className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 flex items-center justify-center p-0 md:static md:w-auto md:h-10 md:rounded-md md:px-4 md:py-2 md:shadow-none bg-teal-700 hover:bg-teal-800" />
            }
          >
            <Plus className="h-6 w-6 md:h-4 md:w-4 md:mr-2" /> <span className="hidden md:inline">Tambah Type</span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Type Pekerjaan" : "Tambah Type Pekerjaan"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Pekerjaan</label>
                <Input 
                  value={nama} 
                  onChange={(e) => setNama(e.target.value)} 
                  placeholder="Contoh: Welding, Grinding..." 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deskripsi (Opsional)</label>
                <Input 
                  value={deskripsi} 
                  onChange={(e) => setDeskripsi(e.target.value)} 
                  placeholder="Keterangan singkat..." 
                />
              </div>
              <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Pekerjaan</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSyncing && data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Belum ada data.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell className="text-muted-foreground">{item.deskripsi || "-"}</TableCell>
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

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {isSyncing && data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-white rounded-md border">
            Memuat data...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-white rounded-md border">
            Belum ada data.
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-md border shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">{item.nama}</h3>
                  {item.deskripsi && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.deskripsi}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {item.is_active ? (
                    <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Aktif</Badge>
                  ) : (
                    <Badge variant="secondary">Nonaktif</Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t mt-1">
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
