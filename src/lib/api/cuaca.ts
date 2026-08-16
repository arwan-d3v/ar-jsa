import { supabase } from "../supabase";
import type { Database } from "../types";

export type Cuaca = Database["public"]["Tables"]["cuaca"]["Row"];

export async function getCuaca() {
  const { data, error } = await supabase
    .from("cuaca")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function createCuaca(nama: string, icon?: string) {
  const { data, error } = await supabase
    .from("cuaca")
    .insert([{ nama, icon }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateCuaca(id: string, nama: string, icon?: string, isActive?: boolean) {
  const updates: any = { nama, icon };
  if (isActive !== undefined) updates.is_active = isActive;
  
  const { data, error } = await supabase
    .from("cuaca")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteCuaca(id: string) {
  const { data, error } = await supabase
    .from("cuaca")
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
