"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertTriangle, Edit2, Plus, Trash2 } from "lucide-react";
import { getKondisi, createKondisi, updateKondisi, deleteKondisi, Kondisi } from "@/lib/api/kondisi";

export default function KondisiPage() {
  const [data, setData] = useState<Kondisi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [nama, setNama] = useState("");
  const [severity, setSeverity] = useState("0");
  const [color, setColor] = useState("#10b981"); // Default green
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const result = await getKondisi();
      setData(result || []);
    } catch (error) {
      toast.error("Gagal memuat data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item: Kondisi) {
    setEditingId(item.id);
    setNama(item.nama);
    setSeverity(item.severity.toString());
    setColor(item.color || "#10b981");
    setIsDialogOpen(true);
  }

  function handleOpenDialog() {
    setEditingId(null);
    setNama("");
    setSeverity("0");
    setColor("#10b981");
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
        await updateKondisi(editingId, nama, parseInt(severity), color);
        toast.success("Data berhasil diupdate");
      } else {
        await createKondisi(nama, parseInt(severity), color);
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
      await deleteKondisi(id);
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
          <AlertTriangle className="h-6 w-6 text-teal-700" />
          <h1 className="text-3xl font-bold tracking-tight text-teal-900">Kondisi</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="bg-teal-700 hover:bg-teal-800">
              <Plus className="mr-2 h-4 w-4" /> Tambah Kondisi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Kondisi" : "Tambah Kondisi"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Kondisi</label>
                <Input 
                  value={nama} 
                  onChange={(e) => setNama(e.target.value)} 
                  placeholder="Contoh: Aman, Berbahaya..." 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity (0=Normal, 1=Warning, 2=Danger)</label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 - Normal</SelectItem>
                    <SelectItem value="1">1 - Warning</SelectItem>
                    <SelectItem value="2">2 - Danger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Warna (Hex)</label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)} 
                    className="w-16 p-1 h-10"
                  />
                  <Input 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)} 
                    placeholder="#10b981" 
                    className="flex-1"
                  />
                </div>
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
              <TableHead>Nama Kondisi</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Warna</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Belum ada data.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>
                    {item.severity === 0 && <Badge variant="outline">0 - Normal</Badge>}
                    {item.severity === 1 && <Badge variant="outline" className="border-yellow-500 text-yellow-700">1 - Warning</Badge>}
                    {item.severity === 2 && <Badge variant="outline" className="border-red-500 text-red-700">2 - Danger</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: item.color || '#ccc' }}></div>
                      <span className="text-xs">{item.color}</span>
                    </div>
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
