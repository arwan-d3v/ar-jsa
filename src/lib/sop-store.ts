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

const defaultSopTemplateDispatchElectric: SopTemplate = {
  id: "default-3",
  typePekerjaan: "Perbaikan Dispatch type PTX",
  jenisUnit: "Electric Truck",
  hasilPemeriksaanArea: "Area parkir Light Vehicle aman, unit Electric Truck dalam kondisi mati dan aman untuk dikerjakan.",
  rekomendasiArea: "Pastikan unit diparkir di tempat yang rata, stabil, dan aman dari lalu lintas pergerakan alat berat lain.",
  hasilPemeriksaanArea360: "Kondisi sekeliling unit (360 derajat) bebas dari rintangan dan pekerja lain yang tidak berkepentingan.",
  rekomendasiArea360: "Pasang barikade atau safety cone jika diperlukan untuk membatasi area kerja di sekitar unit.",
  hasilEnergiBerbahaya: "Terdapat kelistrikan DC pada komponen Dispatch (Goic, Mikrotik, Antenna GPS).",
  rekomendasiEnergiBerbahaya: "Lakukan prosedur Isolasi & Lock Out (LOTO). Pasang Padlock dan Personal Danger Tag sebelum melakukan pengecekan hardware/kabel.",
  hasilPj: "Penanggung jawab area telah dilapori dan mengizinkan perbaikan.",
  rekomendasiPj: "Lakukan eskalasi dan serahkan Worksheet yang telah diisi kepada pengawas dan Helpdesk MKN setelah pekerjaan selesai.",
  langkahKerja: `1. Mempersiapkan Tools dan datang ke lokasi parkir unit (area Light Vehicle).
2. Melapor kepada pengawas atau penanggung jawab area.
3. Lakukan Isolasi & lock out sesuai prosedur (IK-HSE-08-04).
4. Naikan Tool dan part dispatch menggunakan metode 3 titik tumpu.
5. Lakukan Troubleshooting Hardware/Software:
   - Dispatch Stuck: Test menu Goic, jika tidak merespon lakukan reset power/toggle, test network dengan login ID.
   - Tidak Terkoneksi: Cek kabel LMR/Coaxial, konektor "N", RJ45, dan kabel LAN dari Mikrotik. Reset/ganti jika rusak.
   - GPS Stuck/Not Found: Cek wiring terlipat/putus, cek tegangan inner dan ground (3.2V - 5V), ganti konektor jika short, atau reset via software Cygwincell.
   - Boot Mode: Akses via MLINK laptop, reload Hub & Goic, reset power.
   - Goic ter-generic: Lakukan install ulang Goic.
   - Fatique Warning hilang: Cek signal & fisik antenna.
   - Touchscreen / Speaker bermasalah: Kalibrasi ulang atau ganti perangkat.
6. Bersihkan area kerja, pastikan tidak ada tools/material tertinggal.
7. Turunkan tools dengan metode 3 titik tumpu.
8. Lepas Padlock beserta Personal Danger Tag.
9. Informasikan ke pengawas & Helpdesk, serta lengkapi Worksheet.`,
  potensiBahaya: `- Terjatuh dari alat berat (saat naik/turun unit).
- Tersengat listrik (saat mengecek tegangan inner/ground GPS, power Mikrotik, atau Goic).
- Tergores benda tajam / Terjepit (saat memasang connector menggunakan cutter atau crimping tool).
- Unit bergerak tiba-tiba jika prosedur Isolasi/LOTO tidak dipatuhi.`,
  kontrolResiko: `- Gunakan tiga (3) titik tumpu saat naik/turun unit.
- Bekerja di ketinggian <5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard TANPA absorber.
- Bekerja di ketinggian >5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard DAN absorber.
- Hindari titik jepit dan bagian tajam saat menggunakan cutter, crimping tool, tang potong, dan tang lancip.
- Wajib melakukan Isolasi & Lock Out (Padlock & Personal Danger Tag) sebelum bekerja.
- Wajib menggunakan APD lengkap (seragam, sepatu safety, helmet, kacamata).`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultSopTemplateDispatchHaul: SopTemplate = {
  ...defaultSopTemplateDispatchElectric,
  id: "default-4",
  jenisUnit: "Haul Truck",
  hasilPemeriksaanArea: "Area parkir Light Vehicle aman, unit Haul Truck dalam kondisi mati dan aman untuk dikerjakan.",
};

const baseRadioKomunikasi: Omit<SopTemplate, 'id' | 'jenisUnit'> = {
  typePekerjaan: "Perbaikan Radio Komunikasi",
  hasilPemeriksaanArea: "Area parkir Light Vehicle aman, unit dalam kondisi mati dan peralatan kerja (bucket/blade) sudah diturunkan ke tanah.",
  rekomendasiArea: "Pastikan unit diparkir di tempat yang rata, aman dari lalu lintas alat berat. Pastikan operator sudah keluar dari kabin.",
  hasilPemeriksaanArea360: "Kondisi sekeliling unit (360 derajat) aman dan bebas dari alat berat lain yang beroperasi.",
  rekomendasiArea360: "Pasang barikade/safety cone jika area kerja berpotensi dilalui alat berat lain.",
  hasilEnergiBerbahaya: "Terdapat kelistrikan DC (12V - 24V) pada power converter dan radio.",
  rekomendasiEnergiBerbahaya: "Wajib melakukan Isolasi & Lock Out (LOTO). Pasang Padlock dan Personal Danger Tag sebelum bekerja pada kelistrikan.",
  hasilPj: "Penanggung jawab area telah dilapori dan pekerjaan diizinkan.",
  rekomendasiPj: "Lapor ke pengawas atau Oscar base dan Helpdesk setelah pekerjaan selesai, lalu serahkan Worksheet.",
  langkahKerja: `1. Mempersiapkan tools dan datang ke lokasi unit.
2. Melapor ke penanggung jawab area.
3. Parkir LV di tempat yang aman. Lakukan komunikasi positif dengan operator unit untuk mematikan mesin.
4. Pastikan attachment unit diturunkan ke tanah (bucket/blade/ripper). Khusus Haul Truck, jika mengecek converter di belakang kabin, pastikan dump body naik full dan PIN LOCK terpasang.
5. Lakukan Isolasi & lock out sesuai prosedur (IK-HSE-08-04) dengan memasang Padlock dan Personal Danger Tag.
6. Naik/turun unit selalu menggunakan metode 3 titik tumpu.
7. Lakukan pengecekan/perbaikan:
   - Radio Mati Total: Ukur tegangan di konektor power radio (12 - 13.5 VDC). Jika normal, ganti radio. Jika tidak ada tegangan, cek output converter 12V, kabel power, dan fuse 15A. Jika converter 24V ke 12V rusak, lakukan penggantian.
   - Tidak Bisa Mengirim: Cek Microphone (kabel, konektor, PTT). Cek TX indicator. Cek Antena (visual, continuity kabel, SWR maksimal 1.5). Cek power out-put radio (10-20 Watt). Cek program radio. Lakukan test call.
   - Tidak Bisa Menerima: Cek Antena dan kabel seperti langkah di atas. Cek program. Jika semua normal tapi tetap rusak, ganti unit radio.
8. Pekerjaan selesai: Bersihkan area kerja dan kumpulkan tools.
9. Turun dari unit menggunakan 3 titik tumpu.
10. Lepas Padlock dan Personal Danger Tag.
11. Lapor ke pengawas/Oscar base dan Helpdesk MKN.
12. Lengkapi dan serahkan Worksheet.`,
  potensiBahaya: `- Terjatuh dari alat berat (ketinggian di atas kabin atau saat naik/turun).
- Tergores/Terpotong (benda tajam, cutter).
- Terjepit (saat crimping connector atau area dump body pada Haul Truck).
- Tersengat arus pendek kelistrikan unit (12V/24V).`,
  kontrolResiko: `- Wajib menggunakan metode 3 titik tumpu saat naik/turun unit.
- Bekerja di ketinggian <5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard TANPA absorber.
- Bekerja di ketinggian >5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard DAN absorber.
- Hindari sisi tajam saat memakai cutter; perhatikan titik jepit saat menggunakan tang/crimping.
- WAJIB pasang PIN LOCK jika berada di bawah dump body Haul Truck yang sedang diangkat.
- Lakukan prosedur LOTO secara disiplin.
- Gunakan APD lengkap (Helmet, kacamata, safety shoes, seragam).`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultSopTemplateRadioShovel: SopTemplate = {
  ...baseRadioKomunikasi,
  id: "default-5",
  jenisUnit: "Shovel / Big Digger",
};

const defaultSopTemplateRadioHaulTruck: SopTemplate = {
  ...baseRadioKomunikasi,
  id: "default-6",
  jenisUnit: "Haul Truck",
};

const defaultSopTemplateRadioDozer: SopTemplate = {
  ...baseRadioKomunikasi,
  id: "default-7",
  jenisUnit: "Dozer",
};

const defaultSopTemplateRadioBackhoe: SopTemplate = {
  ...baseRadioKomunikasi,
  id: "default-8",
  jenisUnit: "Backhoe / Small Digger",
};

const defaultSopTemplateRadioArticulated: SopTemplate = {
  ...baseRadioKomunikasi,
  id: "default-9",
  jenisUnit: "Articulated Dump Truck",
};

const defaultSopTemplateRadioFMArticulated: SopTemplate = {
  ...baseRadioKomunikasi,
  typePekerjaan: "Perbaikan Radio FM",
  id: "default-10",
  jenisUnit: "Articulated Dump Truck",
};

const defaultSopTemplateRadioFMDozer: SopTemplate = {
  ...baseRadioKomunikasi,
  typePekerjaan: "Perbaikan Radio FM",
  id: "default-11",
  jenisUnit: "Dozer",
};

const defaultSopTemplateTower: SopTemplate = {
  id: "default-12",
  typePekerjaan: "Instalasi / Dismantel Peralatan",
  jenisUnit: "Tower",
  hasilPemeriksaanArea: "Area tower dan sekitarnya aman untuk dilakukan pekerjaan instalasi/dismantel.",
  rekomendasiArea: "Pastikan area kerja di bawah tower diamankan, gunakan barikade jika perlu untuk membatasi area dari orang yang tidak berkepentingan.",
  hasilPemeriksaanArea360: "Kondisi sekeliling tower aman dari rintangan dan bebas dari potensi bahaya di area dasar.",
  rekomendasiArea360: "Pastikan tidak ada pekerja lain yang berada tepat di bawah area pemanjatan untuk menghindari bahaya kejatuhan benda/peralatan (dropped objects).",
  hasilEnergiBerbahaya: "Potensi energi berbahaya dari radiasi antena RF atau kelistrikan peralatan.",
  rekomendasiEnergiBerbahaya: "Pastikan peralatan yang akan didismantel sudah tidak bertegangan (LOTO jika diperlukan). Hindari area paparan radiasi tinggi.",
  hasilPj: "Penanggung jawab area dan Team Rescue telah dilapori dan disetujui.",
  rekomendasiPj: "Wajib lapor kepada pejabat berwenang setempat dan Team rescue sebelum melakukan pemanjatan, dan laporkan kembali setelah pekerjaan selesai.",
  langkahKerja: `1. Persiapkan tools yang sesuai dengan pekerjaan.
2. Wajib melapor kepada penanggung jawab area atau yang ditunjuk saat tiba dilokasi dan sebelum memulai pekerjaan.
3. Lakukan observasi dan Identifikasi bahaya area kerja untuk memastikan pekerjaan aman dilakukan (Isi JSA).
4. Pastikan posisi/ titik peralatan yang akan di install / dismantle.
5. Lapor kepada pejabat berwewenang setempat (responsibility area) dan Team rescue sebelum melakukan pemanjatan.
6. Lakukan teknik pemanjatan dengan benar (tiga titik tumpu), gunakan full body harness dan twin lanyard, serta membawa tali untuk menarik material dari bawah keatas atau sebaliknya.
7. Ikat katrol pada Anchor poin dengan benar dan kuat. Pastikan potensi tangan/ jari terjepit.
8. Pasang tali pengangkat pada katrol. Ikat material yang akan diangkat atau dilepas pada peralatan tersebut.
9. Lepas baut peralatan tersebut jika dismantel.
10. Kencangkan tali pengikat, tarik atau angkat secara bersama-sama dengan komando leader lapangan.
11. Kencangkan baut setelah posisi bracket benar (jika instalasi baru).
12. Pointing antena tersebut jika poin to point wireless / tidak dilakukan pointing jika omni antenna. Cari signal sampai bagus (gunakan multi tester atau notebook).
13. Kencangkan semua baut pada poin instalasi tersebut.
14. Turunkan semua peralatan kerja dengan tali.
15. Bersihkan semua sisa material kerja setelah pekerjaan selesai.
16. Lapor kepada pejabat berwewenang setempat (responsibility area) dan Team rescue setelah pekerjaan selesai.
17. Informasikan kepada helpdesk dan user, serta lengkapi worksheet.`,
  potensiBahaya: `- Terjatuh dari ketinggian saat memanjat atau bekerja di tower.
- Kejatuhan material / tools dari atas tower (Dropped Object).
- Terjepit saat memasang katrol, menarik tali, atau mengencangkan baut.
- Tersengat listrik atau terpapar radiasi RF dari peralatan telekomunikasi.`,
  kontrolResiko: `- Gunakan Fullbody Harness dengan Twin lanyard, Helm bertali, Sarung tangan, Safety Shoes (Standar WAH for Worker).
- Selalu terapkan teknik pemanjatan 3 titik tumpu (Three-point contact).
- Gunakan tali pengangkat dan katrol yang diikat kuat pada anchor point untuk menaikkan/menurunkan material.
- Pastikan area bawah tower dibarikade/dikosongkan untuk mencegah pekerja lain terkena jatuhan material.
- Perhatikan titik jepit tangan/jari saat memasang peralatan.
- Lakukan Analisa keselamatan kerja (JSA) dan buat rencana keadaan darurat sebelum bekerja.`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultSopTemplatePMWorkshop: SopTemplate = {
  id: "default-13",
  typePekerjaan: "PM Perangkat Komunikasi (Workshop)",
  jenisUnit: "Heavy Equipment",
  hasilPemeriksaanArea: "Area bay workshop aktif dengan aktivitas perawatan unit bersama mekanik dan kontraktor lain. Terdapat pergerakan unit keluar/masuk bay, alat support (forklift, tyre handler, lube truck) lalu lalang, serta overhead crane yang beroperasi di area atas bay.",
  rekomendasiArea: "Parkir kendaraan LV di area yang sudah disediakan. Lapor dan koordinasikan pekerjaan ke pengawas workshop serta mekanik/kontraktor sekitar. Pastikan jalur evakuasi tidak terhalang dan selalu jalin komunikasi 2 arah yang aktif.",
  hasilPemeriksaanArea360: "Kondisi sekeliling unit (360 derajat) terdapat aktivitas pekerjaan simultan (SIMOPS): pekerjaan mekanik, pengelasan/hot work, debu gerinda, pergerakan alat bantu workshop, dan lintasan overhead crane di atas.",
  rekomendasiArea360: "Tetap waspada dan jangan berada di radius ayunan/lintasan overhead crane (DILARANG berdiri di bawah beban menggantung / suspended load). Lakukan kontak visual/komunikasi 2 arah dengan operator alat bantu dan pekerja sekitar. Hindari menatap percikan api las dan pasang barrier/welding screen jika diperlukan.",
  hasilEnergiBerbahaya: "Terdapat sumber kelistrikan DC unit, risiko short circuit, serta potensi energi gerak mekanikal/hidrolik unit yang sedang diservis mekanik.",
  rekomendasiEnergiBerbahaya: "Isolation Officer wajib melakukan Isolasi & Lock Out (IK-HSE-08-04). Setiap teknisi wajib memasang Padlock dan Personal Danger Tag milik masing-masing. Dilarang melepas padlock milik orang lain.",
  hasilPj: "Pengawas workshop dan penanggung jawab unit telah dilapori serta pekerjaan telah diizinkan.",
  rekomendasiPj: "Dapatkan izin kerja resmi dari pengawas workshop. Jika menemukan kondisi tidak aman, hentikan pekerjaan (Stop Work Authority) dan lapor ke pengawas. Setelah selesai, informasikan ke pengawas workshop dan lengkapi Worksheet (FM-OPS-01-05).",
  langkahKerja: `1. Supervisi / Helpdesk memberi tugas / job order untuk PM unit Heavy Equipment.
2. Mempersiapkan tools, APD, dan formulir inspeksi (FM-OPS-01-05 rev.04) sesuai pekerjaan.
3. Datang ke lokasi workshop dan parkir kendaraan LV di tempat yang sudah disediakan.
4. Melapor ke pengawas workshop atau penanggung jawab unit untuk koordinasi pekerjaan perawatan bersama dengan mekanik.
5. Bersama tim melakukan analisa keselamatan kerja dan dituangkan dalam Form Observasi Lingkungan Kerja.
6. Isolation Officer melakukan Isolasi & Lock Out sesuai prosedur (IK-HSE-08-04).
7. Semua teknisi memasang Padlock beserta Personal Danger Tag masing-masing pada hasp/lockbox.
8. Lakukan komunikasi 2 arah dengan mekanik, operator overhead crane, dan pekerja lain di sekitar bay sebelum menaiki unit.
9. Pastikan overhead crane tidak sedang melintas membawa beban di atas area bay kerja.
10. Naik ke atas unit dengan metode 3 (tiga) titik tumpu (Three-point contact).
11. Pasang Full Body Harness (single lanyard tanpa absorber untuk ketinggian <5 meter, atau single lanyard dengan absorber jika >5 meter tanpa platform/handrail).
12. Lakukan pengecekan dan pemeliharaan perangkat komunikasi sesuai formulir (FM-OPS-01-05 rev.04).
13. Tuangkan hasil pengecekan dan pemeliharaan ke dalam Formulir (FM-OPS-01-05 rev.04).
14. Apabila ditemukan kerusakan pada kabel/konektor/komponen, lakukan perbaikan atau penggantian.
15. Berhati-hati terhadap sisi tajam cutter saat kupas kabel dan titik jepit crimping saat memasang konektor.
16. Jika pekerjaan selesai, bersihkan area kerja, masukkan tools ke dalam tas tools dan pastikan tidak ada material/perkakas tertinggal di atas unit.
17. Turunkan tools dan turun dari unit menggunakan metode 3 titik tumpu.
18. Lepas Padlock beserta Personal Danger Tag milik sendiri (tidak dibenarkan melepas milik orang lain).
19. Informasikan ke pengawas workshop atau penanggung jawab unit bahwa pemeliharaan perangkat komunikasi sudah selesai.
20. Lengkapi Worksheet (tulis stock code material, serial number radio, panel ID, fleet, firmware) dan serahkan ke supervisor setelah sampai di kantor.`,
  potensiBahaya: `- Tertabrak / terserempet unit alat berat yang keluar/masuk bay atau alat support yang lalu lalang (forklift, tyre handler, lube truck).
- Tertimpa beban menggantung (suspended load) atau benturan dari pergerakan overhead crane yang melintas.
- Terjatuh dari alat berat saat naik/turun unit atau bekerja di atas ketinggian kabin/chassis.
- Bahaya pekerjaan simultan (SIMOPS): percikan api pengelasan (welding flash/hot work), debu gerinda, dan serpihan logam dari pekerjaan mekanik/kontraktor lain.
- Terjepit titik jepit (crimping tool, pintu kompartemen unit, atau komponen bergerak mekanik).
- Tergores sisi tajam cutter saat memotong kabel/conduit.
- Tersengat arus listrik DC atau korsleting saat intervensi kelistrikan perangkat komunikasi.
- Unit bergerak tiba-tiba jika prosedur LOTO diabaikan saat pekerjaan simultan dengan mekanik.`,
  kontrolResiko: `- Wajib menjalin komunikasi 2 arah (verbal, kontak visual, atau radio) dan selalu waspada saat berada di radius kerja orang lain atau alat bantu workshop.
- JANGAN PERNAH berdiri atau melintas di bawah beban yang menggantung (suspended load) pada overhead crane.
- Berjalan di jalur aman pejalan kaki (walkway) dan perhatikan manuver alat support workshop.
- Gunakan APD lengkap: Helmet dengan tali dagu, safety shoes, kacamata safety (dengan pelindung UV jika dekat area las), seragam kerja, dan sarung tangan kerja.
- Bekerja di ketinggian <5m tanpa platform/handrail: gunakan Full Body Harness dengan single lanyard TANPA absorber.
- Bekerja di ketinggian >5m tanpa platform/handrail: gunakan Full Body Harness dengan single lanyard DAN absorber.
- Terapkan 3 titik tumpu saat naik/turun tangga unit; bawa peralatan kerja dalam tas tools.
- Patuhi prosedur Isolasi & Lock Out (IK-HSE-08-04) dengan memasang Padlock dan Personal Danger Tag milik sendiri.
- Pasang welding screen / barrier jika area kerja berdampingan langsung dengan pengelasan untuk melindungi dari bahaya flash.
- Terapkan Stop Work Authority (SWA) bila kondisi dinilai tidak aman dan segera lapor ke pengawas workshop.`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useSopStore = create<SopStore>()(
  persist(
    (set) => ({
      templates: [
        defaultSopTemplate, 
        defaultSopTemplateHaulTruck, 
        defaultSopTemplateDispatchElectric, 
        defaultSopTemplateDispatchHaul, 
        defaultSopTemplateRadioShovel, 
        defaultSopTemplateRadioHaulTruck, 
        defaultSopTemplateRadioDozer, 
        defaultSopTemplateRadioBackhoe, 
        defaultSopTemplateRadioArticulated, 
        defaultSopTemplateRadioFMArticulated, 
        defaultSopTemplateRadioFMDozer, 
        defaultSopTemplateTower,
        defaultSopTemplatePMWorkshop
      ],
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
      name: 'sop-templates-storage-v6',
    }
  )
);
