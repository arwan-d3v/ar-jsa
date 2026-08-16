-- Type Pekerjaan
CREATE TABLE type_pekerjaan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Jenis Unit
CREATE TABLE jenis_unit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kode VARCHAR(50) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cuaca
CREATE TABLE cuaca (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Kondisi
CREATE TABLE kondisi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  severity INT DEFAULT 0,
  color VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Template konten
CREATE TABLE template_observasi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Kombinasi parameter (FK)
  type_pekerjaan_id UUID REFERENCES type_pekerjaan(id),
  jenis_unit_id UUID REFERENCES jenis_unit(id),
  cuaca_id UUID REFERENCES cuaca(id),
  kondisi_id UUID REFERENCES kondisi(id),
  
  -- Pemeriksaan Area
  hasil_pemeriksaan_area TEXT,
  rekomendasi_area TEXT,
  hasil_pemeriksaan_area_360 TEXT,
  rekomendasi_area_360 TEXT,
  hasil_energi_berbahaya TEXT,
  rekomendasi_energi_berbahaya TEXT,
  hasil_penanggung_jawab TEXT,
  rekomendasi_penanggung_jawab TEXT,
  
  -- JSA
  urutan_langkah_kerja TEXT,
  potensi_bahaya TEXT,
  kontrol_resiko TEXT,
  
  -- Meta
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Unique constraint
  UNIQUE(type_pekerjaan_id, jenis_unit_id, cuaca_id, kondisi_id)
);
