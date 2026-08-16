import { supabase } from "../supabase";
import type { Database } from "../types";

export type JenisUnit = Database["public"]["Tables"]["jenis_unit"]["Row"];

export async function getJenisUnit() {
  const { data, error } = await supabase
    .from("jenis_unit")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function createJenisUnit(kode: string, nama: string) {
  const { data, error } = await supabase
    .from("jenis_unit")
    .insert([{ kode, nama }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateJenisUnit(id: string, kode: string, nama: string, isActive?: boolean) {
  const updates: any = { kode, nama };
  if (isActive !== undefined) updates.is_active = isActive;
  
  const { data, error } = await supabase
    .from("jenis_unit")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteJenisUnit(id: string) {
  const { data, error } = await supabase
    .from("jenis_unit")
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
