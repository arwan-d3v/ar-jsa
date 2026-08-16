import { supabase } from "../supabase";
import type { Database } from "../types";

export type Kondisi = Database["public"]["Tables"]["kondisi"]["Row"];

export async function getKondisi() {
  const { data, error } = await supabase
    .from("kondisi")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function createKondisi(nama: string, severity: number, color?: string) {
  const { data, error } = await supabase
    .from("kondisi")
    .insert([{ nama, severity, color }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateKondisi(id: string, nama: string, severity: number, color?: string, isActive?: boolean) {
  const updates: any = { nama, severity, color };
  if (isActive !== undefined) updates.is_active = isActive;
  
  const { data, error } = await supabase
    .from("kondisi")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteKondisi(id: string) {
  const { data, error } = await supabase
    .from("kondisi")
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
