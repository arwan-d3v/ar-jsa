export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      type_pekerjaan: {
        Row: {
          id: string
          nama: string
          deskripsi: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama: string
          deskripsi?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama?: string
          deskripsi?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      jenis_unit: {
        Row: {
          id: string
          kode: string
          nama: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kode: string
          nama: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kode?: string
          nama?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cuaca: {
        Row: {
          id: string
          nama: string
          icon: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama: string
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama?: string
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      kondisi: {
        Row: {
          id: string
          nama: string
          severity: number
          color: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama: string
          severity?: number
          color?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama?: string
          severity?: number
          color?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      template_observasi: {
        Row: {
          id: string
          type_pekerjaan_id: string
          jenis_unit_id: string
          cuaca_id: string
          kondisi_id: string
          hasil_pemeriksaan_area: string | null
          rekomendasi_area: string | null
          hasil_pemeriksaan_area_360: string | null
          rekomendasi_area_360: string | null
          hasil_energi_berbahaya: string | null
          rekomendasi_energi_berbahaya: string | null
          hasil_penanggung_jawab: string | null
          rekomendasi_penanggung_jawab: string | null
          urutan_langkah_kerja: string | null
          potensi_bahaya: string | null
          kontrol_resiko: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type_pekerjaan_id: string
          jenis_unit_id: string
          cuaca_id: string
          kondisi_id: string
          hasil_pemeriksaan_area?: string | null
          rekomendasi_area?: string | null
          hasil_pemeriksaan_area_360?: string | null
          rekomendasi_area_360?: string | null
          hasil_energi_berbahaya?: string | null
          rekomendasi_energi_berbahaya?: string | null
          hasil_penanggung_jawab?: string | null
          rekomendasi_penanggung_jawab?: string | null
          urutan_langkah_kerja?: string | null
          potensi_bahaya?: string | null
          kontrol_resiko?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type_pekerjaan_id?: string
          jenis_unit_id?: string
          cuaca_id?: string
          kondisi_id?: string
          hasil_pemeriksaan_area?: string | null
          rekomendasi_area?: string | null
          hasil_pemeriksaan_area_360?: string | null
          rekomendasi_area_360?: string | null
          hasil_energi_berbahaya?: string | null
          rekomendasi_energi_berbahaya?: string | null
          hasil_penanggung_jawab?: string | null
          rekomendasi_penanggung_jawab?: string | null
          urutan_langkah_kerja?: string | null
          potensi_bahaya?: string | null
          kontrol_resiko?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
