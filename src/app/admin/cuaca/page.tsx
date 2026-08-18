"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Cloud, Edit2, Plus, Trash2 } from "lucide-react";
import { createCuaca, updateCuaca, deleteCuaca, Cuaca } from "@/lib/api/cuaca";
import { useCuacaStore } from "@/lib/store";

export default function CuacaPage() {
  const { data, sync, isSyncing } = useCuacaStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [nama, setNama] = useState("");
  const [icon, setIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    sync();
  }, [sync]);

  function handleEdit(item: Cuaca) {
    setEditingId(item.id);
    setNama(item.nama);
    setIcon(item.icon || "");
    setIsDialogOpen(true);
  }

  function handleOpenDialog() {
    setEditingId(null);
    setNama("");
    setIcon("");
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
        await updateCuaca(editingId, nama, icon);
        toast.success("Data berhasil diupdate");
      } else {
        await createCuaca(nama, icon);
        toast.success("Data berhasil ditambahkan");
      }
      setIsDialogOpen(false);
      sync();
    } catch (error) {
      toast.error("Terjadi kesalahan");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    
    try {
      await deleteCuaca(id);
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
          <Cloud className="h-6 w-6 text-teal-700" />
          <h1 className="text-3xl font-bold tracking-tight text-teal-900">Cuaca</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button onClick={handleOpenDialog} className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 flex items-center justify-center p-0 md:static md:w-auto md:h-10 md:rounded-md md:px-4 md:py-2 md:shadow-none bg-teal-700 hover:bg-teal-800">
              <Plus className="h-6 w-6 md:h-4 md:w-4 md:mr-2" /> <span className="hidden md:inline">Tambah Cuaca</span>
            </Button>
          } />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Cuaca" : "Tambah Cuaca"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kondisi Cuaca</label>
                <Input 
                  value={nama} 
                  onChange={(e) => setNama(e.target.value)} 
                  placeholder="Contoh: Cerah, Hujan Ringan..." 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon (Emoji atau Teks)</label>
                <Input 
                  value={icon} 
                  onChange={(e) => setIcon(e.target.value)} 
                  placeholder="Contoh: ☀️, 🌧️..." 
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
              <TableHead>Icon</TableHead>
              <TableHead>Kondisi Cuaca</TableHead>
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
                  <TableCell className="text-2xl">{item.icon}</TableCell>
                  <TableCell className="font-medium">{item.nama}</TableCell>
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
                <div className="flex items-center gap-3">
                  <div className="text-3xl bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center border">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.nama}</h3>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
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
