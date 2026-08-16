"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Cloud, Edit2, Plus, Trash2 } from "lucide-react";
import { getCuaca, createCuaca, updateCuaca, deleteCuaca, Cuaca } from "@/lib/api/cuaca";

export default function CuacaPage() {
  const [data, setData] = useState<Cuaca[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [nama, setNama] = useState("");
  const [icon, setIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const result = await getCuaca();
      setData(result || []);
    } catch (error) {
      toast.error("Gagal memuat data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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
      fetchData();
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
      fetchData();
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
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="bg-teal-700 hover:bg-teal-800">
              <Plus className="mr-2 h-4 w-4" /> Tambah Cuaca
            </Button>
          </DialogTrigger>
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

      <div className="rounded-md border bg-white">
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
            {loading ? (
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
    </div>
  );
}
