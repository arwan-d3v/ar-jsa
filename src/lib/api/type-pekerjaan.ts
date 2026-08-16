import { supabase } from "../supabase";
import type { Database } from "../types";

export type TypePekerjaan = Database["public"]["Tables"]["type_pekerjaan"]["Row"];

export async function getTypePekerjaan() {
  const { data, error } = await supabase
    .from("type_pekerjaan")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function createTypePekerjaan(nama: string, deskripsi?: string) {
  const { data, error } = await supabase
    .from("type_pekerjaan")
    .insert([{ nama, deskripsi }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateTypePekerjaan(id: string, nama: string, deskripsi?: string, isActive?: boolean) {
  const updates: any = { nama, deskripsi };
  if (isActive !== undefined) updates.is_active = isActive;
  
  const { data, error } = await supabase
    .from("type_pekerjaan")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteTypePekerjaan(id: string) {
  // Soft delete by setting is_active to false
  const { data, error } = await supabase
    .from("type_pekerjaan")
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
