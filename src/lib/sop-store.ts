import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SopTemplate {
  id: string;
  typePekerjaan: string;
  jenisUnit: string;
  
  // Area
  hasilPemeriksaanArea: string;
  rekomendasiArea: string;
  hasilPemeriksaanArea360: string;
  rekomendasiArea360: string;
  hasilEnergiBerbahaya: string;
  rekomendasiEnergiBerbahaya: string;
  hasilPj: string;
  rekomendasiPj: string;
  
  // JSA
  langkahKerja: string;
  potensiBahaya: string;
  kontrolResiko: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

interface SopStore {
  templates: SopTemplate[];
  addTemplate: (template: Omit<SopTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, template: Partial<Omit<SopTemplate, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTemplate: (id: string) => void;
}

const defaultSopTemplate: SopTemplate = {
  id: "default-1",
  typePekerjaan: "Instalasi / Remove Radio FM",
  jenisUnit: "Dozer",
  hasilPemeriksaanArea: "Area parkir Light Vehicle aman, unit Dozer dalam kondisi mati dan aman untuk dikerjakan.",
  rekomendasiArea: "Pastikan unit diparkir di tempat yang rata, stabil, dan aman dari lalu lintas pergerakan alat berat lain.",
  hasilPemeriksaanArea360: "Kondisi sekeliling unit (360 derajat) bebas dari rintangan dan pekerja lain yang tidak berkepentingan.",
  rekomendasiArea360: "Pasang barikade atau safety cone jika diperlukan untuk membatasi area kerja di sekitar unit.",
  hasilEnergiBerbahaya: "Terdapat sumber tegangan listrik 12 VDC dari converter/electrician unit.",
  rekomendasiEnergiBerbahaya: "Lakukan prosedur Isolasi & Lock Out (LOTO). Pasang Padlock dan Personal Danger Tag. Gunakan fuse blade 10A dan conduit untuk melindungi kabel power.",
  hasilPj: "Penanggung jawab area telah dilapori dan siap memberikan izin kerja.",
  rekomendasiPj: "Lakukan eskalasi dan serahkan Worksheet yang telah diisi kepada pengawas dan Helpdesk MKN setelah pekerjaan instalasi selesai.",
  langkahKerja: `1. Persiapkan tools dan order material ke Warehouse.
2. Datang ke lokasi/workshop dan parkir di area khusus Light Vehicle.
3. Melapor kepada penanggung jawab area.
4. Lakukan Isolasi & Lock Out (IK-HSE-08-04) dan pasang Padlock.
5. Naikkan material ke unit dengan 3 titik tumpu.
6. Lakukan observasi dalam kabin untuk menentukan posisi Radio FM, speaker, dan antenna.
7. Pasang braket antenna, antenna, lalu masukkan kabel ke kabin.
8. Pasang konektor auto plug di ujung kabel antenna.
9. Hubungkan sumber tegangan 12 VDC ke soket power radio FM.
10. Pasang fuse holder (blade 10A) di dekat sumber tegangan dan lindungi dengan conduit.
11. Pasang braket speaker, hubungkan kabel speaker ke soket.
12. Nyalakan Radio FM, scan frekuensi / gunakan flashdisk untuk pengetesan.
13. Jika normal, pasang Radio FM di braket secara permanen.
14. Bersihkan area kerja, turun dengan 3 titik tumpu, lepas Padlock & Tag.`,
  potensiBahaya: `- Terjatuh dari alat berat (saat naik/turun unit atau bekerja di ketinggian kabin).
- Tergores benda tajam (cutter saat memotong kabel).
- Terjepit (saat melakukan crimping connector).
- Tersengat listrik (saat menghubungkan power supply 12 VDC).
- Unit bergerak tiba-tiba jika tidak terisolasi dengan benar.`,
  kontrolResiko: `- Gunakan 3 titik tumpu (Three-point contact) saat naik/turun unit.
- Bekerja di ketinggian <5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard TANPA absorber.
- Bekerja di ketinggian >5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard DAN absorber.
- Hindari sisi tajam cutter dan perhatikan titik jepit saat crimping connector.
- Selalu patuhi prosedur LOTO (Lock Out Tag Out) sebelum memulai intervensi elektrik.
- Wajib menggunakan APD standar (seragam, sepatu safety, helmet, kacamata).`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultSopTemplateHaulTruck: SopTemplate = {
  id: "default-2",
  typePekerjaan: "Instalasi / Remove Radio FM",
  jenisUnit: "Haul Truck",
  hasilPemeriksaanArea: "Area parkir Light Vehicle aman, unit Haul Truck dalam kondisi mati dan aman untuk dikerjakan.",
  rekomendasiArea: "Pastikan unit diparkir di tempat yang rata, stabil, dan aman dari lalu lintas pergerakan alat berat lain.",
  hasilPemeriksaanArea360: "Kondisi sekeliling unit (360 derajat) bebas dari rintangan dan pekerja lain yang tidak berkepentingan.",
  rekomendasiArea360: "Pasang barikade atau safety cone jika diperlukan untuk membatasi area kerja di sekitar unit.",
  hasilEnergiBerbahaya: "Terdapat sumber tegangan listrik 12 VDC dari converter/electrician unit.",
  rekomendasiEnergiBerbahaya: "Lakukan prosedur Isolasi & Lock Out (LOTO). Pasang Padlock dan Personal Danger Tag. Gunakan fuse blade 10A dan conduit untuk melindungi kabel power.",
  hasilPj: "Penanggung jawab area telah dilapori dan siap memberikan izin kerja.",
  rekomendasiPj: "Lakukan eskalasi dan serahkan Worksheet yang telah diisi kepada pengawas dan Helpdesk MKN setelah pekerjaan instalasi selesai.",
  langkahKerja: `1. Persiapkan tools dan order material ke Warehouse.
2. Datang ke lokasi/workshop dan parkir di area khusus Light Vehicle.
3. Melapor kepada penanggung jawab area.
4. Lakukan Isolasi & Lock Out (IK-HSE-08-04) dan pasang Padlock.
5. Naikkan material ke unit dengan 3 titik tumpu.
6. Lakukan observasi dalam kabin untuk menentukan posisi Radio FM, speaker, dan antenna.
7. Pasang braket antenna, antenna, lalu masukkan kabel ke kabin.
8. Pasang konektor auto plug di ujung kabel antenna.
9. Hubungkan sumber tegangan 12 VDC ke soket power radio FM.
10. Pasang fuse holder (blade 10A) di dekat sumber tegangan dan lindungi dengan conduit.
11. Pasang braket speaker, hubungkan kabel speaker ke soket.
12. Nyalakan Radio FM, scan frekuensi / gunakan flashdisk untuk pengetesan.
13. Jika normal, pasang Radio FM di braket secara permanen.
14. Bersihkan area kerja, turun dengan 3 titik tumpu, lepas Padlock & Tag.`,
  potensiBahaya: `- Terjatuh dari alat berat (saat naik/turun unit atau bekerja di ketinggian kabin).
- Tergores benda tajam (cutter saat memotong kabel).
- Terjepit (saat melakukan crimping connector).
- Tersengat listrik (saat menghubungkan power supply 12 VDC).
- Unit bergerak tiba-tiba jika tidak terisolasi dengan benar.`,
  kontrolResiko: `- Gunakan 3 titik tumpu (Three-point contact) saat naik/turun unit.
- Bekerja di ketinggian <5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard TANPA absorber.
- Bekerja di ketinggian >5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard DAN absorber.
- Hindari sisi tajam cutter dan perhatikan titik jepit saat crimping connector.
- Selalu patuhi prosedur LOTO (Lock Out Tag Out) sebelum memulai intervensi elektrik.
- Wajib menggunakan APD standar (seragam, sepatu safety, helmet, kacamata).`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useSopStore = create<SopStore>()(
  persist(
    (set) => ({
      templates: [defaultSopTemplate, defaultSopTemplateHaulTruck],
      addTemplate: (template) => set((state) => ({
        templates: [
          ...state.templates,
          {
            ...template,
            id: `sop-${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ]
      })),
      updateTemplate: (id, templateUpdate) => set((state) => ({
        templates: state.templates.map(t => 
          t.id === id 
            ? { ...t, ...templateUpdate, updatedAt: new Date().toISOString() } 
            : t
        )
      })),
      deleteTemplate: (id) => set((state) => ({
        templates: state.templates.filter(t => t.id !== id)
      }))
    }),
    {
      name: 'sop-templates-storage-v2',
    }
  )
);
