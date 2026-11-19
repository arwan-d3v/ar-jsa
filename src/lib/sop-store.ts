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

const hasilBahayaBiologisPit = `3. Bahaya Biologis (Hewan Liar & Serangga Berbisa):
   • Potensi bahaya biologis dari hewan liar atau serangga berbisa (seperti ular, lebah/tawon, kalajengking, kelabang, atau tikus) yang bersarang atau singgah pada kompartemen kabin, celah sasis, tangga, dan engine bay, terutama pada unit yang lama standby/breakdown atau terparkir di area terbuka/pit.`;

const rekomendasiBahayaBiologisPit = `3. Penanganan Bahaya Biologis (Hewan Liar / Satwa Berbisa):
   • Lakukan inspeksi visual menggunakan alat penerangan (senter) pada celah sasis, tangga, kabin, dan engine bay sebelum memulai pekerjaan; dilarang merogoh area buta (blind spot).
   • Apabila menemukan hewan liar, satwa berbisa (ular/kalajengking), atau sarang serangga berbahaya: SEGERA HENTIKAN PEKERJAAN (Stop Work Authority).
   • Laporkan segera temuan tersebut kepada Pengawas Area atau tim Emergency / Snake Handler untuk penanganan aman.
   • Lakukan demarkasi area (safety cone / barikade) jika dinilai masih aman untuk mengisolasi area bahaya agar rekan kerja lain tidak mendekat.`;

function getTruckAreaObservation(unitName: string) {
  return {
    hasilPemeriksaanArea: `Area parkir Light Vehicle (LV) dan bay unit ${unitName} berada di area Shift Change. Unit dalam kondisi mati, permukaan rata dan stabil, serta tersedia fasilitas area parkir aman (Lighting Plant dan Windrow/tanggul pembatas).`,
    rekomendasiArea: `1. Area Parkir Aman (LV & Unit):
   • Parkir kendaraan LV hanya di tempat yang telah disediakan dengan fasilitas Lighting Plant dan Windrow/tanggul pembatas.
   • Pastikan lokasi parkir berada lebih dari 1.5x ketinggian dinding galian aktif (highwall/lereng).
   • Pastikan lokasi parkir rata, stabil, tidak berada di jalur aliran air, dan tidak berada di permukaan tanah yang lembek/amblas.
2. Koordinasi & Kondisi Unit:
   • Lakukan komunikasi positif dan melapor kepada pengawas area sebelum memasuki bay Shift Change.
   • Pastikan unit dalam kondisi mati, rem parkir/wheel chock terpasang, operator sudah keluar dari kabin, dan aman dari lalu lintas alat berat lain.`,
    hasilPemeriksaanArea360: `1. Aktivitas Area Shift Change (360°):
   • Unit diparkir di area Shift Change yang memiliki aktivitas keluar/masuk bay Shift Change untuk pergantian operator.
   • Terdapat aktivitas perawatan jalan oleh alat support (Small Digger, Grader, dan Dozer) yang beroperasi di sekitar area Shift Change.
2. Kondisi Sekeliling Unit:
   • Area radius 360 derajat di sekitar unit diperiksa bebas dari rintangan dan pekerja lain yang tidak berkepentingan.`,
    rekomendasiArea360: `1. Kewaspadaan & Kontak Positif di Area Shift Change:
   • Tetap waspada terhadap lalu lintas unit keluar/masuk bay Shift Change serta pergerakan alat perawatan jalan (Small Digger, Grader, dan Dozer).
   • Wajib lakukan kontak positif (radio/visual) saat berpindah area dan selama perjalanan memarkir kendaraan LV keluar atau masuk ke area bay untuk menurunkan/menaikkan material.
2. Pengamanan Area Kerja:
   • Pasang barikade atau safety cone di sekitar area kerja/unit untuk membatasi akses dan memberi tanda kepada lalu lintas unit lain.`,
  };
}

function getNonTruckAreaObservation(unitName: string) {
  return {
    hasilPemeriksaanArea: `Unit ${unitName} berada di area kerja pit (Loading Point aktif / Dumping aktif) dalam kondisi mati, attachment (blade/bucket/ripper) sudah diturunkan ke tanah, dan tersedia titik parkir LV yang aman (Lighting Plant dan Windrow/tanggul pembatas).`,
    rekomendasiArea: `1. Komunikasi Positif & Izin Masuk Area Aktif:
   • Wajib melakukan komunikasi positif dengan Pengawas area dan kontak positif dengan Operator unit sebelum memasuki area Loading Point aktif atau Dumping aktif.
   • Pastikan unit dalam kondisi mati, attachment (blade/bucket/ripper) diturunkan ke tanah, dan operator sudah keluar dari kabin sebelum bekerja.
2. Penempatan Parkir Aman di Area Aktif:
   • Parkir kendaraan LV pada tempat aman yang disediakan di dalam area aktivitas loading/dumping dengan fasilitas Lighting Plant dan Windrow/tanggul pembatas.
   • Pastikan lokasi parkir berada lebih dari 1.5x ketinggian dinding galian aktif (highwall/lereng).
   • Pastikan permukaan tempat parkir rata, stabil, tidak berada di jalur aliran air, dan tidak berada di permukaan tanah yang lembek/amblas.`,
    hasilPemeriksaanArea360: `1. Aktivitas Loading Point Aktif / Dumping Aktif (360°):
   • Area kerja dan parkir berada di dalam area Loading Point aktif atau Dumping aktif dengan lalu lintas alat berat yang beroperasi di sekitarnya.
   • Terdapat potensi paparan debu tebal dari aktivitas loading, dumping, maupun pergerakan alat berat sekitar.
2. Kondisi Sekeliling Unit:
   • Kondisi sekeliling unit (360 derajat) diperiksa dari rintangan, blind spot alat berat sekitar, serta potensi longsoran dinding galian.`,
    rekomendasiArea360: `1. Kewaspadaan & Kontak Positif di Area Aktif:
   • Wajib lakukan komunikasi positif dengan Pengawas dan kontak positif dengan Operator sebelum memasuki, berpindah, maupun keluar dari area Loading Point aktif / Dumping aktif.
   • Tetap waspada penuh selama berada di dalam area aktivitas loading dan dumping; jaga jarak aman dari radius manuver/swing alat berat sekitar.
   • Pasang barikade atau safety cone di sekitar unit bila diperlukan untuk menandai area kerja.
2. Pengendalian Paparan Debu:
   • Wajib menggunakan masker debu (sesuai standar) apabila kondisi area berdebu tebal serta kacamata safety.`,
  };
}

const truckPotensiBahayaExtra = `- Tertabrak/terserempet pergerakan unit keluar/masuk bay Shift Change atau alat perawatan jalan (Small Digger, Grader, Dozer).
- Bahaya biologis: gigitan atau sengatan hewan liar/berbisa (ular, tawon/lebah, kalajengking, kelabang, tikus) yang bersarang di celah sasis, tangga, kabin, atau engine bay.`;

const truckKontrolResikoExtra = `- Parkir LV di tempat ber-windrow & lighting plant (>1.5x tinggi dinding galian aktif, bukan jalur air/permukaan lembek); gunakan tas tools/estafet saat naik/turun unit.
- Lakukan kontak positif saat berpindah area dan memarkir kendaraan keluar/masuk bay Shift Change, serta waspadai alat perawatan jalan (Small Digger, Grader, Dozer).
- Lakukan inspeksi visual dengan senter sebelum menyentuh celah unit (hindari blind spot); bila menemukan hewan liar/berbisa segera Stop Pekerjaan (SWA), demarkasi area jika aman, dan lapor Pengawas / Snake Handler.`;

const nonTruckPotensiBahayaExtra = `- Tertabrak/terserempet alat berat di area Loading Point aktif / Dumping aktif serta paparan debu tebal.
- Bahaya biologis: gigitan atau sengatan hewan liar/berbisa (ular, tawon/lebah, kalajengking, kelabang, tikus) yang bersarang di celah sasis, tangga, kabin, atau engine bay.`;

const nonTruckKontrolResikoExtra = `- Parkir LV di tempat ber-windrow & lighting plant (>1.5x tinggi dinding galian aktif, bukan jalur air/permukaan lembek); gunakan tas tools/estafet saat naik/turun unit.
- Wajib komunikasi positif dengan Pengawas & kontak positif dengan Operator sebelum masuk area Loading/Dumping aktif; gunakan masker debu jika debu tebal.
- Lakukan inspeksi visual dengan senter sebelum menyentuh celah unit (hindari blind spot); bila menemukan hewan liar/berbisa segera Stop Pekerjaan (SWA), demarkasi area jika aman, dan lapor Pengawas / Snake Handler.`;

const baseRadioFM: Omit<SopTemplate, 'id' | 'jenisUnit' | 'hasilPemeriksaanArea' | 'rekomendasiArea' | 'hasilPemeriksaanArea360' | 'rekomendasiArea360' | 'potensiBahaya' | 'kontrolResiko'> = {
  typePekerjaan: "Instalasi / Remove Radio FM",
  hasilEnergiBerbahaya: `1. Kelistrikan Unit:
   • Terdapat sumber tegangan listrik 12 VDC dari converter/electrician unit serta risiko arus pendek / short circuit.
2. Energi Mekanikal, Hidrolik & Akses Naik/Turun Unit:
   • Potensi pergerakan unit tak terduga apabila isolasi tidak dilakukan serta bahaya terpeleset/terjatuh saat naik/turun tangga akses yang licin (lumpur/oli/grease) atau membawa peralatan berlebih.
${hasilBahayaBiologisPit}`,
  rekomendasiEnergiBerbahaya: `1. Prosedur Isolasi & Lock Out (LOTO):
   • Lakukan prosedur Isolasi & Lock Out (IK-HSE-08-04). Pasang Padlock dan Personal Danger Tag milik masing-masing.
   • Gunakan fuse blade 10A dan conduit untuk melindungi kabel power 12 VDC dari korsleting.
2. Mitigasi Energi Mekanikal & Akses Naik/Turun Unit:
   • Periksa tangga dan handrail dari ceceran lumpur/oli/grease; terapkan 3 titik tumpu (Three-point contact) saat naik/turun unit.
   • Gunakan tas tools yang sesuai agar tangan bebas dan lakukan pengangkatan estafet/tali untuk material berat.
${rekomendasiBahayaBiologisPit}`,
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const baseRadioFMPotensiBahaya = `- Terjatuh dari alat berat (saat naik/turun unit atau bekerja di ketinggian kabin).
- Tergores benda tajam (cutter saat memotong kabel).
- Terjepit (saat melakukan crimping connector).
- Tersengat listrik (saat menghubungkan power supply 12 VDC).
- Unit bergerak tiba-tiba jika tidak terisolasi dengan benar.`;

const baseRadioFMKontrolResiko = `- Gunakan 3 titik tumpu (Three-point contact) saat naik/turun unit.
- Bekerja di ketinggian <5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard TANPA absorber.
- Bekerja di ketinggian >5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard DAN absorber.
- Hindari sisi tajam cutter dan perhatikan titik jepit saat crimping connector.
- Selalu patuhi prosedur LOTO (Lock Out Tag Out) sebelum memulai intervensi elektrik.
- Wajib menggunakan APD standar (seragam, sepatu safety, helmet, kacamata).`;

const defaultSopTemplate: SopTemplate = {
  ...baseRadioFM,
  ...getNonTruckAreaObservation("Dozer"),
  id: "default-1",
  jenisUnit: "Dozer",
  potensiBahaya: `${baseRadioFMPotensiBahaya}\n${nonTruckPotensiBahayaExtra}`,
  kontrolResiko: `${baseRadioFMKontrolResiko}\n${nonTruckKontrolResikoExtra}`,
};

const defaultSopTemplateHaulTruck: SopTemplate = {
  ...baseRadioFM,
  ...getTruckAreaObservation("Haul Truck"),
  id: "default-2",
  jenisUnit: "Haul Truck",
  potensiBahaya: `${baseRadioFMPotensiBahaya}\n${truckPotensiBahayaExtra}`,
  kontrolResiko: `${baseRadioFMKontrolResiko}\n${truckKontrolResikoExtra}`,
};

const defaultSopTemplateDispatchElectric: SopTemplate = {
  ...getTruckAreaObservation("Electric Truck"),
  id: "default-3",
  typePekerjaan: "Perbaikan Dispatch type PTX",
  jenisUnit: "Electric Truck",
  hasilEnergiBerbahaya: `1. Kelistrikan Unit & Perangkat Dispatch:
   • Terdapat kelistrikan DC pada komponen Dispatch (Goic, Mikrotik, Antenna GPS 3.2V–5V) serta risiko short circuit.
2. Energi Mekanikal, Hidrolik & Akses Naik/Turun Unit:
   • Potensi pergerakan unit tak terduga bila isolasi diabaikan serta bahaya terpeleset/terjatuh saat naik/turun tangga akses yang licin (lumpur/oli/grease) atau membawa peralatan berlebih.
${hasilBahayaBiologisPit}`,
  rekomendasiEnergiBerbahaya: `1. Prosedur Isolasi & Lock Out (LOTO):
   • Lakukan prosedur Isolasi & Lock Out (IK-HSE-08-04). Pasang Padlock dan Personal Danger Tag sebelum melakukan pengecekan hardware/kabel.
2. Mitigasi Energi Mekanikal & Akses Naik/Turun Unit:
   • Periksa tangga dan handrail dari lumpur/oli/grease; wajib terapkan 3 titik tumpu (Three-point contact) saat naik/turun unit.
   • Gunakan tas tools yang sesuai dan metode estafet/tali saat membawa part atau peralatan.
${rekomendasiBahayaBiologisPit}`,
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
- Unit bergerak tiba-tiba jika prosedur Isolasi/LOTO tidak dipatuhi.
${truckPotensiBahayaExtra}`,
  kontrolResiko: `- Gunakan tiga (3) titik tumpu saat naik/turun unit.
- Bekerja di ketinggian <5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard TANPA absorber.
- Bekerja di ketinggian >5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard DAN absorber.
- Hindari titik jepit dan bagian tajam saat menggunakan cutter, crimping tool, tang potong, dan tang lancip.
- Wajib melakukan Isolasi & Lock Out (Padlock & Personal Danger Tag) sebelum bekerja.
- Wajib menggunakan APD lengkap (seragam, sepatu safety, helmet, kacamata).
${truckKontrolResikoExtra}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultSopTemplateDispatchHaul: SopTemplate = {
  ...defaultSopTemplateDispatchElectric,
  ...getTruckAreaObservation("Haul Truck"),
  id: "default-4",
  jenisUnit: "Haul Truck",
};

const baseRadioKomunikasi: Omit<SopTemplate, 'id' | 'jenisUnit' | 'hasilPemeriksaanArea' | 'rekomendasiArea' | 'hasilPemeriksaanArea360' | 'rekomendasiArea360' | 'potensiBahaya' | 'kontrolResiko'> = {
  typePekerjaan: "Perbaikan Radio Komunikasi",
  hasilEnergiBerbahaya: `1. Kelistrikan Unit & Perangkat Radio:
   • Terdapat kelistrikan DC (12V – 24V) pada power converter dan radio serta risiko korsleting / short circuit.
2. Energi Mekanikal, Hidrolik & Akses Naik/Turun Unit:
   • Potensi energi gerak mekanikal/hidrolik (termasuk risiko terjepit area dump body pada Haul Truck/ADT) serta bahaya terpeleset/terjatuh saat naik/turun tangga licin atau membawa material berlebih.
${hasilBahayaBiologisPit}`,
  rekomendasiEnergiBerbahaya: `1. Prosedur Isolasi & Lock Out (LOTO):
   • Wajib melakukan Isolasi & Lock Out (IK-HSE-08-04). Pasang Padlock dan Personal Danger Tag sebelum bekerja pada kelistrikan.
2. Mitigasi Energi Mekanikal & Akses Naik/Turun Unit:
   • Khusus Haul Truck/Dump Truck: WAJIB pasang PIN LOCK jika dump body dinaikkan untuk pengecekan converter di belakang kabin.
   • Periksa kondisi tangga/handrail dari lumpur/oli/grease; terapkan 3 titik tumpu (Three-point contact), gunakan tas tools yang sesuai, dan angkat material berat secara estafet/tali.
${rekomendasiBahayaBiologisPit}`,
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const baseRadioKomunikasiPotensiBahaya = `- Terjatuh dari alat berat (ketinggian di atas kabin atau saat naik/turun).
- Tergores/Terpotong (benda tajam, cutter).
- Terjepit (saat crimping connector atau area dump body pada Haul Truck).
- Tersengat arus pendek kelistrikan unit (12V/24V).`;

const baseRadioKomunikasiKontrolResiko = `- Wajib menggunakan metode 3 titik tumpu saat naik/turun unit.
- Bekerja di ketinggian <5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard TANPA absorber.
- Bekerja di ketinggian >5 meter tanpa platform: gunakan Full Body Harness dengan single lanyard DAN absorber.
- Hindari sisi tajam saat memakai cutter; perhatikan titik jepit saat menggunakan tang/crimping.
- WAJIB pasang PIN LOCK jika berada di bawah dump body Haul Truck yang sedang diangkat.
- Lakukan prosedur LOTO secara disiplin.
- Gunakan APD lengkap (Helmet, kacamata, safety shoes, seragam).`;

function createRadioTemplate(
  id: string,
  jenisUnit: string,
  isTruck: boolean,
  typePekerjaan = "Perbaikan Radio Komunikasi"
): SopTemplate {
  const areaObs = isTruck
    ? getTruckAreaObservation(jenisUnit)
    : getNonTruckAreaObservation(jenisUnit);
  const potensiExtra = isTruck ? truckPotensiBahayaExtra : nonTruckPotensiBahayaExtra;
  const kontrolExtra = isTruck ? truckKontrolResikoExtra : nonTruckKontrolResikoExtra;

  return {
    ...baseRadioKomunikasi,
    ...areaObs,
    id,
    typePekerjaan,
    jenisUnit,
    potensiBahaya: `${baseRadioKomunikasiPotensiBahaya}\n${potensiExtra}`,
    kontrolResiko: `${baseRadioKomunikasiKontrolResiko}\n${kontrolExtra}`,
  };
}

const defaultSopTemplateRadioShovel: SopTemplate = createRadioTemplate(
  "default-5",
  "Shovel / Big Digger",
  false
);

const defaultSopTemplateRadioHaulTruck: SopTemplate = createRadioTemplate(
  "default-6",
  "Haul Truck",
  true
);

const defaultSopTemplateRadioDozer: SopTemplate = createRadioTemplate(
  "default-7",
  "Dozer",
  false
);

const defaultSopTemplateRadioBackhoe: SopTemplate = createRadioTemplate(
  "default-8",
  "Backhoe / Small Digger",
  false
);

const defaultSopTemplateRadioArticulated: SopTemplate = createRadioTemplate(
  "default-9",
  "Articulated Dump Truck",
  true
);

const defaultSopTemplateRadioFMArticulated: SopTemplate = createRadioTemplate(
  "default-10",
  "Articulated Dump Truck",
  true,
  "Perbaikan Radio FM"
);

const defaultSopTemplateRadioFMDozer: SopTemplate = createRadioTemplate(
  "default-11",
  "Dozer",
  false,
  "Perbaikan Radio FM"
);

const defaultSopTemplateTower: SopTemplate = {
  id: "default-12",
  typePekerjaan: "Instalasi / Dismantel Peralatan",
  jenisUnit: "Tower",
  hasilPemeriksaanArea: "Area tower dan sekitarnya aman untuk dilakukan pekerjaan instalasi/dismantel.",
  rekomendasiArea: "Pastikan area kerja di bawah tower diamankan, gunakan barikade jika perlu untuk membatasi area dari orang yang tidak berkepentingan.",
  hasilPemeriksaanArea360: "Kondisi sekeliling tower aman dari rintangan dan bebas dari potensi bahaya di area dasar.",
  rekomendasiArea360: "Pastikan tidak ada pekerja lain yang berada tepat di bawah area pemanjatan untuk menghindari bahaya kejatuhan benda/peralatan (dropped objects).",
  hasilEnergiBerbahaya: `1. Radiasi Antena RF & Kelistrikan Peralatan:
   • Potensi energi berbahaya dari paparan radiasi frekuensi radio (RF) antena aktif serta kelistrikan peralatan/panel telekomunikasi.
2. Energi Gravitasi (Ketinggian & Dropped Objects):
   • Potensi bahaya terjatuh dari ketinggian saat pemanjatan/bekerja di tower serta kejatuhan material/peralatan kerja ke area bawah.
3. Bahaya Biologis (Sarang Serangga & Hewan Liar):
   • Potensi keberadaan sarang lebah/tawon, burung liar, atau kelelawar pada struktur rangka tower, tangga pemanjatan, dan braket/box antena.
   • Potensi hewan liar/berbisa (ular, kalajengking, kelabang, tikus) serta semak/tanaman berduri di area dasar, pagar, shelter, dan jalur kabel pondasi tower.`,
  rekomendasiEnergiBerbahaya: `1. Prosedur Isolasi (LOTO) & Proteksi Radiasi RF:
   • Pastikan peralatan yang akan didismantel atau dikerjakan sudah tidak bertegangan (terapkan LOTO jika diperlukan).
   • Hindari berada langsung di depan pancaran utama antena aktif / area paparan radiasi RF tinggi.
2. Mitigasi Ketinggian & Penanganan Material:
   • Gunakan Full Body Harness dengan Twin Lanyard standar WAH, terapkan 3 titik tumpu, serta gunakan tali pengangkat dan katrol pada anchor point untuk material/tools.
3. Penanganan Bahaya Biologis (Hewan Liar / Sarang Serangga):
   • Lakukan inspeksi visual menyeluruh dari bawah ke struktur tower serta gunakan senter saat memeriksa shelter, box panel, dan area pondasi/semak sebelum memulai pekerjaan; dilarang merogoh area buta (blind spot).
   • Apabila ditemukan sarang lebah/tawon di jalur pemanjatan, ular, atau hewan berbisa lainnya: SEGERA HENTIKAN PEKERJAAN (Stop Work Authority) dan tunda pemanjatan.
   • Laporkan segera temuan kepada Pengawas Area dan tim Emergency / Rescue / Snake Handler untuk penanganan aman.
   • Lakukan demarkasi area (safety cone / barikade) di sekitar dasar tower jika dinilai masih aman untuk mengisolasi area bahaya dari pekerja lain.`,
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
- Tersengat listrik atau terpapar radiasi RF dari peralatan telekomunikasi.
- Bahaya biologis: sengatan sarang lebah/tawon atau gangguan satwa liar (burung/kelelawar) di struktur tower yang dapat memicu panik/jatuh, serta gigitan ular/kalajengking/serangga berbisa di semak, shelter, dan area dasar tower.`,
  kontrolResiko: `- Gunakan Fullbody Harness dengan Twin lanyard, Helm bertali, Sarung tangan, Safety Shoes (Standar WAH for Worker).
- Selalu terapkan teknik pemanjatan 3 titik tumpu (Three-point contact).
- Gunakan tali pengangkat dan katrol yang diikat kuat pada anchor point untuk menaikkan/menurunkan material.
- Pastikan area bawah tower dibarikade/dikosongkan untuk mencegah pekerja lain terkena jatuhan material.
- Perhatikan titik jepit tangan/jari saat memasang peralatan.
- Lakukan Analisa keselamatan kerja (JSA) dan buat rencana keadaan darurat sebelum bekerja.
- Lakukan inspeksi visual struktur tower dan area dasar/shelter (gunakan senter, hindari blind spot) sebelum memanjat; apabila ditemukan sarang tawon/lebah atau hewan liar/berbisa, segera Stop Pekerjaan (SWA), lakukan demarkasi area jika aman, dan lapor Pengawas / Team Rescue / Snake Handler.`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultSopTemplatePMWorkshop: SopTemplate = {
  id: "default-13",
  typePekerjaan: "PM Perangkat Komunikasi (Workshop)",
  jenisUnit: "Heavy Equipment",
  hasilPemeriksaanArea: "Area bay workshop aktif dengan aktivitas perawatan unit bersama mekanik dan kontraktor lain. Terdapat pergerakan unit keluar/masuk bay, alat support (forklift, tyre handler, lube truck) lalu lalang, serta overhead crane yang beroperasi di area atas bay.",
  rekomendasiArea: `1. Akses & Area Parkir Light Vehicle (LV):
   • Parkir kendaraan LV hanya pada area parkir yang telah disediakan di workshop.
   • Pastikan posisi parkir tidak menghalangi jalur evakuasi (walkway), akses darurat, maupun pergerakan unit alat berat lain.
2. Koordinasi & Komunikasi Positif Awal:
   • Melapor dan jalin komunikasi positif dengan Pengawas yang bertanggung jawab atas unit yang akan dikerjakan untuk konfirmasi izin kerja.
   • Koordinasikan detail lingkup pekerjaan pemeliharaan perangkat komunikasi kepada mekanik yang bertugas di bay tersebut.
3. Koordinasi dengan Isolation Officer:
   • Temui dan koordinasikan pekerjaan kepada Isolation Officer unit terkait sebelum memulai intervensi fisik/pekerjaan apa pun.
   • Pastikan prosedur Isolasi & Lock Out (IK-HSE-08-04) telah terverifikasi dan pasang Padlock serta Personal Danger Tag masing-masing pada hasp/lockbox.
4. Kewaspadaan Selama Pekerjaan Berlangsung:
   • Selalu waspadai aktivitas dan dinamika pekerjaan sekitar di bay workshop (pergerakan unit alat berat, overhead crane, forklift, dan hot work/pengelasan).
   • Pertahankan komunikasi 2 arah yang aktif dan kontak visual dengan mekanik/pekerja sekitar.
5. Koordinasi Pekerjaan Simultan (Mitra Kontraktor Lain):
   • Segera laporkan dan lakukan komunikasi langsung jika ada aktivitas pekerjaan yang bersinggungan dengan tim kerja dari mitra kontraktor lain.
   • Lakukan penyelarasan metode kerja agar aktivitas dapat berlangsung simultan secara aman tanpa menimbulkan bahaya silang.`,
  hasilPemeriksaanArea360: "Kondisi sekeliling unit (360 derajat) terdapat aktivitas pekerjaan simultan (SIMOPS): pekerjaan mekanik, pengelasan/hot work, debu gerinda, pergerakan alat bantu workshop, dan lintasan overhead crane di atas.",
  rekomendasiArea360: "Tetap waspada dan jangan berada di radius ayunan/lintasan overhead crane (DILARANG berdiri di bawah beban menggantung / suspended load). Lakukan kontak visual/komunikasi 2 arah dengan operator alat bantu dan pekerja sekitar. Hindari menatap percikan api las dan pasang barrier/welding screen jika diperlukan.",
  hasilEnergiBerbahaya: `1. Kelistrikan Unit:
   • Terdapat sumber kelistrikan DC unit serta risiko arus pendek / short circuit.
2. Energi Mekanikal, Hidrolik & Akses Naik/Turun Unit:
   • Potensi bahaya pelepasan energi gerak mekanikal dan tekanan sisa hidrolik pada unit yang sedang diservis mekanik.
   • Bahaya terpeleset atau terjatuh saat naik/turun tangga akses akibat kondisi pijakan/handrail licin (ceceran oli, grease, atau lumpur) serta risiko kehilangan keseimbangan akibat membawa peralatan/material yang banyak.
3. Bahaya Biologis (Hewan Liar & Hama):
   • Potensi bahaya biologis dari hewan liar atau serangga berbisa (seperti ular, lebah/tawon, kalajengking, kelabang, atau tikus) yang bersarang atau singgah pada kompartemen, celah sasis, tangga, dan engine bay, terutama pada unit yang sudah lama standby / breakdown tanpa beroperasi.`,
  rekomendasiEnergiBerbahaya: `1. Prosedur Isolasi & Lock Out (LOTO):
   • Isolation Officer wajib melakukan Isolasi & Lock Out sesuai prosedur (IK-HSE-08-04) sebelum intervensi dimulai.
   • Setiap teknisi wajib memasang Padlock dan Personal Danger Tag milik masing-masing pada hasp/lockbox (Dilarang keras melepas padlock milik orang lain).
   • Lakukan verifikasi zero energy state (kelistrikan DC dan residual pressure hidrolik/mekanikal).
2. Mitigasi Energi Mekanikal & Akses Naik/Turun Unit:
   • Periksa kondisi tangga dan handrail dari ceceran oli, grease, lumpur, atau air yang licin sebelum dipijak.
   • Wajib menerapkan metode 3 titik tumpu (Three-point contact) saat naik dan turun tangga unit dengan posisi badan selalu menghadap ke unit.
   • Dilarang membawa material/tools secara berlebihan dengan kedua tangan; gunakan tas tools (tool backpack / sling bag) yang sesuai agar kedua tangan bebas bergerak.
   • Lakukan pengangkatan material secara estafet atau menggunakan tali pengangkat (lifting rope) jika membawa part/tools berukuran besar atau berat.
3. Penanganan Bahaya Biologis (Hewan Liar / Satwa Berbisa):
   • Lakukan inspeksi visual menggunakan alat penerangan (senter) pada celah sasis, tangga, kabin, dan engine bay sebelum memulai intervensi; hindari merogoh area buta (blind spot).
   • Apabila menemukan hewan liar, satwa berbisa (ular/kalajengking), atau sarang serangga berbahaya: SEGERA HENTIKAN PEKERJAAN (Stop Work Authority).
   • Laporkan segera temuan tersebut kepada Pengawas Area atau tim Emergency / Snake Handler untuk penanganan aman.
   • Lakukan demarkasi area (safety cone / barikade) jika dinilai masih aman untuk mengisolasi area bahaya agar rekan kerja lain tidak mendekat.`,
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
      name: 'sop-templates-storage-v12',
    }
  )
);
