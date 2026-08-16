import { supabase } from "../supabase";
import type { Database } from "../types";
import { getTypePekerjaan, TypePekerjaan } from "./type-pekerjaan";
import { getJenisUnit, JenisUnit } from "./jenis-unit";
import { getCuaca, Cuaca } from "./cuaca";
import { getKondisi, Kondisi } from "./kondisi";

export type TemplateObservasi = Database["public"]["Tables"]["template_observasi"]["Row"];

// A combined type for the table view
export type TemplateWithRelations = TemplateObservasi & {
  type_pekerjaan?: TypePekerjaan;
  jenis_unit?: JenisUnit;
  cuaca?: Cuaca;
  kondisi?: Kondisi;
};

export async function getTemplates() {
  const { data, error } = await supabase
    .from("template_observasi")
    .select(`
      *,
      type_pekerjaan:type_pekerjaan_id(*),
      jenis_unit:jenis_unit_id(*),
      cuaca:cuaca_id(*),
      kondisi:kondisi_id(*)
    `)
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data as any as TemplateWithRelations[];
}

export async function getTemplateByParams(
  typePekerjaanId: string, 
  jenisUnitId: string, 
  cuacaId: string, 
  kondisiId: string
) {
  const { data, error } = await supabase
    .from("template_observasi")
    .select("*")
    .eq("type_pekerjaan_id", typePekerjaanId)
    .eq("jenis_unit_id", jenisUnitId)
    .eq("cuaca_id", cuacaId)
    .eq("kondisi_id", kondisiId)
    .eq("is_active", true)
    .maybeSingle();
    
  if (error) throw error;
  return data;
}

export async function createTemplate(templateData: Omit<TemplateObservasi, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from("template_observasi")
    .insert([templateData as any])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateTemplate(id: string, templateData: Partial<TemplateObservasi>) {
  const { data, error } = await supabase
    .from("template_observasi")
    .update(templateData as any)
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteTemplate(id: string) {
  const { data, error } = await supabase
    .from("template_observasi")
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
