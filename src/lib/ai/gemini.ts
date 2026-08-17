import { TypePekerjaan } from "../api/type-pekerjaan";
import { JenisUnit } from "../api/jenis-unit";
import { Cuaca } from "../api/cuaca";
import { Kondisi } from "../api/kondisi";

export interface ExtractedTemplate {
  type_pekerjaan: string | null;
  jenis_unit: string | null;
  cuaca: string | null;
  kondisi: string | null;
  hasil_pemeriksaan_area: string | null;
  rekomendasi_area: string | null;
  hasil_pemeriksaan_area_360: string | null;
  rekomendasi_area_360: string | null;
  hasil_energi_berbahaya: string | null;
  rekomendasi_energi_berbahaya: string | null;
  hasil_penanggung_jawab: string | null;
  rekomendasi_penanggung_jawab: string | null;
  urutan_langkah_kerja: string | null;
  potensi_bahaya: string | null;
  kontrol_resiko: string | null;
}

export interface MappedTemplate extends ExtractedTemplate {
  mapped_ids: {
    type_pekerjaan_id: string | null;
    jenis_unit_id: string | null;
    cuaca_id: string | null;
    kondisi_id: string | null;
  }
}

interface MasterData {
  typePekerjaan: TypePekerjaan[];
  jenisUnit: JenisUnit[];
  cuaca: Cuaca[];
  kondisi: Kondisi[];
}

// Simple Levenshtein distance for fuzzy matching
function getEditDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  return matrix[b.length][a.length];
}

function findBestMatch<T extends { id: string; nama?: string; kode?: string }>(
  targetText: string | null, 
  items: T[]
): string | null {
  if (!targetText) return null;
  
  const text = targetText.toLowerCase().trim();
  let bestMatchId: string | null = null;
  let minDistance = Infinity;

  for (const item of items) {
    // Check 'nama'
    if (item.nama) {
      const itemName = item.nama.toLowerCase();
      // Exact or includes
      if (itemName === text || itemName.includes(text) || text.includes(itemName)) {
        return item.id;
      }
      const dist = getEditDistance(text, itemName);
      if (dist < minDistance && dist < text.length * 0.4) { // Max 40% difference
        minDistance = dist;
        bestMatchId = item.id;
      }
    }
    // Check 'kode'
    if (item.kode) {
      const itemKode = item.kode.toLowerCase();
      if (itemKode === text || itemKode.includes(text) || text.includes(itemKode)) {
        return item.id;
      }
      const dist = getEditDistance(text, itemKode);
      if (dist < minDistance && dist < 2) { // Kodes are usually short, tolerate 1 typo max
        minDistance = dist;
        bestMatchId = item.id;
      }
    }
  }

  return bestMatchId;
}

export function fuzzyMatchMasterData(
  extracted: ExtractedTemplate, 
  masterData: MasterData
): MappedTemplate {
  return {
    ...extracted,
    mapped_ids: {
      type_pekerjaan_id: findBestMatch(extracted.type_pekerjaan, masterData.typePekerjaan),
      jenis_unit_id: findBestMatch(extracted.jenis_unit, masterData.jenisUnit),
      cuaca_id: findBestMatch(extracted.cuaca, masterData.cuaca),
      kondisi_id: findBestMatch(extracted.kondisi, masterData.kondisi),
    }
  };
}
