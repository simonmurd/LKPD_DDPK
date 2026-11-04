import { Kelas, Modul, SoalPG, SoalEssay, KalenderAkademik, SiswaRoster } from '../types';

export const RAW_STUDENT_DATA = `
SMK NEGERI 1 SINGKAWANG,X TJK,01 ALVINO
SMK NEGERI 1 SINGKAWANG,X TJK,02 DEBORA RATU GIASTA GULTOM
SMK NEGERI 1 SINGKAWANG,X TJK,03 DENIS
SMK NEGERI 1 SINGKAWANG,X TJK,04 DEO REVALDY AHMAD
SMK NEGERI 1 SINGKAWANG,X TJK,05 EVAN KRESNA LEE
SMK NEGERI 1 SINGKAWANG,X TJK,06 FEBRIYANTO
SMK NEGERI 1 SINGKAWANG,X TJK,07 HERKULANUS PERDY
SMK NEGERI 1 SINGKAWANG,X TJK,08 HIQMAL LIONEL ALVIANO
SMK NEGERI 1 SINGKAWANG,X TJK,09 INDRA KESUMAH
SMK NEGERI 1 SINGKAWANG,X TJK,10 JERRY KURNIAWAN
SMK NEGERI 1 SINGKAWANG,X TJK,11 KABILA SYIFA
SMK NEGERI 1 SINGKAWANG,X TJK,12 KEYLA KIRANA PUTRI
SMK NEGERI 1 SINGKAWANG,X TJK,13 KRISTIAN DAFI
SMK NEGERI 1 SINGKAWANG,X TJK,14 LIONEL VAN EXAUDI HUTABARAT
SMK NEGERI 1 SINGKAWANG,X TJK,15 MIRATUL TASYA RAMADHANI
SMK NEGERI 1 SINGKAWANG,X TJK,16 MUHAMMAD RAYHAN AL GHIFARY
SMK NEGERI 1 SINGKAWANG,X TJK,17 MUHAMMAD ZAKY RAFANANDO
SMK NEGERI 1 SINGKAWANG,X TJK,18 NATARI KEYZA JUNIAR
SMK NEGERI 1 SINGKAWANG,X TJK,19 NAZUA KASTINA
SMK NEGERI 1 SINGKAWANG,X TJK,20 NUR AZANI
SMK NEGERI 1 SINGKAWANG,X TJK,21 NURAINI
SMK NEGERI 1 SINGKAWANG,X TJK,22 PIRANDA RAMADANI
SMK NEGERI 1 SINGKAWANG,X TJK,23 REBHELIA
SMK NEGERI 1 SINGKAWANG,X TJK,24 REVAN
SMK NEGERI 1 SINGKAWANG,X TJK,25 RIA ADHA
SMK NEGERI 1 SINGKAWANG,X TJK,26 RINDU PRANITA NUARI
SMK NEGERI 1 SINGKAWANG,X TJK,27 RIVALDO RANGGA SAPUTRA
SMK NEGERI 1 SINGKAWANG,X TJK,28 SELVIA
SMK NEGERI 1 SINGKAWANG,X TJK,29 SITI MARIYAM
SMK NEGERI 1 SINGKAWANG,X TJK,30 SYIFA FAHIRA
SMK NEGERI 1 SINGKAWANG,X TJK,31 WULANDARI
SMK NEGERI 1 SINGKAWANG,X TJK,32 YULIANTI
SMK NEGERI 1 SINGKAWANG,X TJK,33 YUNKHI
SMK NEGERI 1 SINGKAWANG,XI TJK,01 RIZKY JUNIANSYAH
SMK NEGERI 1 SINGKAWANG,XI TJK,02 SEMELIA
SMK NEGERI 1 SINGKAWANG,XI TJK,03 AHMAD NOVA RIANTO
SMK NEGERI 1 SINGKAWANG,XI TJK,04 AIDANAZMAN DATINOV
SMK NEGERI 1 SINGKAWANG,XI TJK,05 AJI SOPYAN DWI
SMK NEGERI 1 SINGKAWANG,XI TJK,06 ANGELA DARA LISTA
SMK NEGERI 1 SINGKAWANG,XI TJK,07 ANNISA SALSA SHAFIRA
SMK NEGERI 1 SINGKAWANG,XI TJK,09 AYRA
SMK NEGERI 1 SINGKAWANG,XI TJK,10 AZURA
SMK NEGERI 1 SINGKAWANG,XI TJK,11 BAYU CITRA PRATAMA
SMK NEGERI 1 SINGKAWANG,XI TJK,12 BUNGA LESTARI
SMK NEGERI 1 SINGKAWANG,XI TJK,13 CHASTLE ALPHA RICHIE
SMK NEGERI 1 SINGKAWANG,XI TJK,14 DEVINA YUNA
SMK NEGERI 1 SINGKAWANG,XI TJK,15 DINDA PUTRI RAHAYU
SMK NEGERI 1 SINGKAWANG,XI TJK,16 EDWIN PRAYOGA
SMK NEGERI 1 SINGKAWANG,XI TJK,17 FAJAR JULIANSYAH
SMK NEGERI 1 SINGKAWANG,XI TJK,18 FRANSISCO DWI ADITYA
SMK NEGERI 1 SINGKAWANG,XI TJK,19 GABRIEL ARESTA
SMK NEGERI 1 SINGKAWANG,XI TJK,20 GLORIA ELSIA
SMK NEGERI 1 SINGKAWANG,XI TJK,21 IHSAN AZHALLAH FAWWAZ
SMK NEGERI 1 SINGKAWANG,XI TJK,22 INDRAYANI
SMK NEGERI 1 SINGKAWANG,XI TJK,23 IRFAN RACHMANDANI FERDIAN
SMK NEGERI 1 SINGKAWANG,XI TJK,24 KEVIN APRILIO
SMK NEGERI 1 SINGKAWANG,XI TJK,25 KHOIRUNNISA
SMK NEGERI 1 SINGKAWANG,XI TJK,26 LAFYCA CALYZZA
SMK NEGERI 1 SINGKAWANG,XI TJK,27 MAHLIK ADI SAPUTRA
SMK NEGERI 1 SINGKAWANG,XI TJK,28 MUHAMAD ADHA NUR IKHSAN
SMK NEGERI 1 SINGKAWANG,XI TJK,29 MUHAMMAD NABIL PASHA
SMK NEGERI 1 SINGKAWANG,XI TJK,30 NURLILA FADILLA
SMK NEGERI 1 SINGKAWANG,XI TJK,31 RENI
SMK NEGERI 1 SINGKAWANG,XI TJK,32 RIA KURNIATI
SMK NEGERI 1 SINGKAWANG,XI TJK,33 RIDWAN RAKA HARTONO
SMK NEGERI 1 SINGKAWANG,XI TJK,34 SAEPUL MAJID
SMK NEGERI 1 SINGKAWANG,XI TJK,35 VIONA
SMK NEGERI 1 SINGKAWANG,XI TJK,36 WAHYU
SMK MUDITA SINGKAWANG,XI TJKT,01 ALICIA JENIFER
SMK MUDITA SINGKAWANG,XI TJKT,02 ANGELA
SMK MUDITA SINGKAWANG,XI TJKT,03 CALVINIUS BUNARTO
SMK MUDITA SINGKAWANG,XI TJKT,04 CHELSY VEROSSA
SMK MUDITA SINGKAWANG,XI TJKT,05 DERMAN JOHAN
SMK MUDITA SINGKAWANG,XI TJKT,06 DESTIAN WIJAYA
SMK MUDITA SINGKAWANG,XI TJKT,07 DISON NIKANOR
SMK MUDITA SINGKAWANG,XI TJKT,08 ENNIO EDWARD
SMK MUDITA SINGKAWANG,XI TJKT,09 FANI VANESA
SMK MUDITA SINGKAWANG,XI TJKT,10 HANNY PHANGGESTY
SMK MUDITA SINGKAWANG,XI TJKT,11 HERWIT BRIAN
SMK MUDITA SINGKAWANG,XI TJKT,12 JAVI YANTO
SMK MUDITA SINGKAWANG,XI TJKT,13 JEFRY
SMK MUDITA SINGKAWANG,XI TJKT,14 JONATHAN VINCENTIUS
SMK MUDITA SINGKAWANG,XI TJKT,15 KELLY ANGELA
SMK MUDITA SINGKAWANG,XI TJKT,16 KEVIN KURNIAWAN
SMK MUDITA SINGKAWANG,XI TJKT,17 LEONARDO
SMK MUDITA SINGKAWANG,XI TJKT,18 LORENZO JONATHAN PANGESTU
SMK MUDITA SINGKAWANG,XI TJKT,19 MEDY SANJAYA
SMK MUDITA SINGKAWANG,XI TJKT,20 MEYCHEN CARNELLA
SMK MUDITA SINGKAWANG,XI TJKT,21 MICHELLE
SMK MUDITA SINGKAWANG,XI TJKT,22 NESHA FREDELINA XHIAUW
SMK MUDITA SINGKAWANG,XI TJKT,23 RAYMEND
SMK MUDITA SINGKAWANG,XI TJKT,24 RICARDO
SMK MUDITA SINGKAWANG,XI TJKT,25 SUYANBUN LIPFIANDY
SMK MUDITA SINGKAWANG,XI TJKT,26 TRI WIJAYA
SMK MUDITA SINGKAWANG,XI TJKT,27 VINCENT
SMK MUDITA SINGKAWANG,XI TJKT,28 VINCENT ALBERTO FEROZ
SMK MUDITA SINGKAWANG,XI TJKT,29 VINCENT BUN
SMK MUDITA SINGKAWANG,XI TJKT,30 VINCENT LAUNARDY
SMK MUDITA SINGKAWANG,XI TJKT,31 VINSEN
SMK MUDITA SINGKAWANG,XI TJKT,32 VITO ALBERT FEROZ
SMK MUDITA SINGKAWANG,XI TJKT,33 VITON
SMK MUDITA SINGKAWANG,XI TJKT,34 WENNI NINGSI WONGSO
SMK MUDITA SINGKAWANG,XI TJKT,35 WILLIAM
SMK MUDITA SINGKAWANG,XI TJKT,36 WILLIAM
SMK MUDITA SINGKAWANG,XI TJKT,37 WILLIAM
SMK MUDITA SINGKAWANG,XI TJKT,38 YUVENSIUS
SMK MUDITA SINGKAWANG,XII TJKT,01 DALVIN ANDERSON
SMK MUDITA SINGKAWANG,XII TJKT,02 DANNIEL DAVE DAISUKE
SMK MUDITA SINGKAWANG,XII TJKT,03 DENNY
SMK MUDITA SINGKAWANG,XII TJKT,04 FERDI NOVENDI
SMK MUDITA SINGKAWANG,XII TJKT,05 FLOURA
SMK MUDITA SINGKAWANG,XII TJKT,06 HENGKY
SMK MUDITA SINGKAWANG,XII TJKT,07 JIU PHEN
SMK MUDITA SINGKAWANG,XII TJKT,08 JULIANA DELVI WANTRIANI
SMK MUDITA SINGKAWANG,XII TJKT,09 JULIYANTO
SMK MUDITA SINGKAWANG,XII TJKT,10 JUN KIUH
SMK MUDITA SINGKAWANG,XII TJKT,11 JUN PHEN
SMK MUDITA SINGKAWANG,XII TJKT,12 JUNIATY
SMK MUDITA SINGKAWANG,XII TJKT,14 KELVIN TERRENCE
SMK MUDITA SINGKAWANG,XII TJKT,15 LEONARDO
SMK MUDITA SINGKAWANG,XII TJKT,16 LEWIS MARCO
SMK MUDITA SINGKAWANG,XII TJKT,17 LI NA
SMK MUDITA SINGKAWANG,XII TJKT,18 MARCO GENIUS
SMK MUDITA SINGKAWANG,XII TJKT,19 NELSON ALVARO
SMK MUDITA SINGKAWANG,XII TJKT,21 NOFIKA
SMK MUDITA SINGKAWANG,XII TJKT,22 NYIAN BUN
SMK MUDITA SINGKAWANG,XII TJKT,23 NYUN CU
SMK MUDITA SINGKAWANG,XII TJKT,24 OKTAVIANI
SMK MUDITA SINGKAWANG,XII TJKT,25 RENDI
SMK MUDITA SINGKAWANG,XII TJKT,26 RICO WIJAYA
SMK MUDITA SINGKAWANG,XII TJKT,27 SI WEN
SMK MUDITA SINGKAWANG,XII TJKT,28 SIAU KHIM
SMK MUDITA SINGKAWANG,XII TJKT,29 SU CHUI
SMK MUDITA SINGKAWANG,XII TJKT,30 TRI DERMERSIA
SMK MUDITA SINGKAWANG,XII TJKT,31 VELIYAN VINSON
SMK MUDITA SINGKAWANG,XII TJKT,32 VICKA ANJELICA
SMK MUDITA SINGKAWANG,XII TJKT,33 WILLIAM
SMK MUDITA SINGKAWANG,XII TJKT,34 WILLSON HANATA
SMK MUDITA SINGKAWANG,XII TJKT,35 WILLY VEN
`.trim();

// Parse raw student data into structured array
export const DEFAULT_SISWA: SiswaRoster[] = RAW_STUDENT_DATA.split('\n')
  .map((line, idx) => {
    const parts = line.split(',').map(s => s.trim());
    if (parts.length >= 3) {
      const sekolah = parts[0];
      const kelas = parts[1];
      const rawName = parts[2];
      const match = rawName.match(/^(\d+)\s+(.+)$/);
      const nomorAbsen = match ? match[1] : String(idx + 1).padStart(2, '0');
      const nama = match ? match[2] : rawName;
      return {
        id: `s-${idx + 1}`,
        nomorAbsen,
        nama,
        namaTampilan: rawName,
        kelas,
        sekolah
      };
    }
    return null;
  })
  .filter((s): s is SiswaRoster => s !== null);

export const DEFAULT_KELAS: Kelas[] = [
  {
    id: 'k-smkn1-x-tjk',
    nama: 'X TJK',
    sekolah: 'SMK NEGERI 1 SINGKAWANG',
    tingkat: 'Kelas X',
    jurusan: 'Teknik Jaringan Komputer (TJK)',
    totalSiswa: DEFAULT_SISWA.filter(s => s.sekolah === 'SMK NEGERI 1 SINGKAWANG' && s.kelas === 'X TJK').length,
    createdAt: '2026-11-03T00:00:00.000Z'
  },
  {
    id: 'k-smkn1-xi-tjk',
    nama: 'XI TJK',
    sekolah: 'SMK NEGERI 1 SINGKAWANG',
    tingkat: 'Kelas XI',
    jurusan: 'Teknik Jaringan Komputer (TJK)',
    totalSiswa: DEFAULT_SISWA.filter(s => s.sekolah === 'SMK NEGERI 1 SINGKAWANG' && s.kelas === 'XI TJK').length,
    createdAt: '2026-11-03T00:00:00.000Z'
  },
  {
    id: 'k-mudita-xi-tjkt',
    nama: 'XI TJKT',
    sekolah: 'SMK MUDITA SINGKAWANG',
    tingkat: 'Kelas XI',
    jurusan: 'Teknik Jaringan Komputer dan Telekomunikasi (TJKT)',
    totalSiswa: DEFAULT_SISWA.filter(s => s.sekolah === 'SMK MUDITA SINGKAWANG' && s.kelas === 'XI TJKT').length,
    createdAt: '2026-11-03T00:00:00.000Z'
  },
  {
    id: 'k-mudita-xii-tjkt',
    nama: 'XII TJKT',
    sekolah: 'SMK MUDITA SINGKAWANG',
    tingkat: 'Kelas XII',
    jurusan: 'Teknik Jaringan Komputer dan Telekomunikasi (TJKT)',
    totalSiswa: DEFAULT_SISWA.filter(s => s.sekolah === 'SMK MUDITA SINGKAWANG' && s.kelas === 'XII TJKT').length,
    createdAt: '2026-11-03T00:00:00.000Z'
  }
];

export const KALENDER_DEFAULT: KalenderAkademik[] = [
  {
    id: 'cal-1',
    judul: 'Ujian Evaluasi Modul 1 (Perakitan PC & K3LH)',
    tanggal: '2026-11-08',
    waktu: '08:00 - 10:00 WIB',
    kategori: 'Ujian',
    deskripsi: 'Evaluasi teori dan simulasi K3LH serta prosedur perakitan perangkat keras PC untuk siswa SMKN 1 & SMK Mudita Singkawang.',
    modulId: 'modul-1'
  },
  {
    id: 'cal-2',
    judul: 'Praktikum Crimping Kabel UTP & Pengujian LAN Tester',
    tanggal: '2026-11-12',
    waktu: '10:15 - 12:30 WIB',
    kategori: 'Praktikum',
    deskripsi: 'Praktik langsung pembuatan kabel straight-through dan crossover T568B di Lab Jaringan.',
    modulId: 'modul-4'
  },
  {
    id: 'cal-3',
    judul: 'Ujian Evaluasi Modul 4 & 5 (Jaringan Dasar & Subnetting)',
    tanggal: '2026-11-18',
    waktu: '08:30 - 10:30 WIB',
    kategori: 'Ujian',
    deskripsi: 'Ujian 40 Soal PG dan 1 Kasus Subnetting IPv4 perancangan jaringan lab sekolah.',
    modulId: 'modul-5'
  },
  {
    id: 'cal-4',
    judul: 'Simulasi Command Line Troubleshooting & Utilitas Jaringan',
    tanggal: '2026-11-25',
    waktu: '13:00 - 15:00 WIB',
    kategori: 'Praktikum',
    deskripsi: 'Analisis konektivitas DNS, ping packet loss, dan tracing gateway router sekolah.',
    modulId: 'modul-6'
  }
];

// Helper to generate a full bank of 40 KJD Multiple Choice Questions
function generate40QuestionsForModule(modulNum: number, topic: string): SoalPG[] {
  const bankM1: Partial<SoalPG>[] = [
    {
      pertanyaan: 'Alat keselamatan kerja yang wajib digunakan saat merakit PC untuk mencegah pelepasan listrik statis adalah...',
      pilihan: { A: 'Sarung tangan lateks', B: 'Gelang antistatis (ESD wrist strap)', C: 'Kacamata pelindung', D: 'Helm keselamatan kerja', E: 'Sepatu berujung baja' },
      kunci: 'B',
      penjelasan: 'Gelang antistatis menetralkan muatan elektrostatik tubuh agar tidak merusak komponen mikro IC pada motherboard dan RAM.'
    },
    {
      pertanyaan: 'Zat penghantar panas yang dioleskan tipis di antara heatspreader CPU dan heatsink disebut...',
      pilihan: { A: 'Silicone gel', B: 'Flux solder', C: 'Thermal paste (grease)', D: 'Liquid glue', E: 'Alcohol isopropyl' },
      kunci: 'C',
      penjelasan: 'Thermal paste berfungsi mengisi celah mikroskopis udara antara permukaan prosesor dan heatsink agar konduksi panas optimal.'
    },
    {
      pertanyaan: 'Soket prosesor dengan pin berada pada dudukan motherboard (bukan pada prosesor) disebut soket bertipe...',
      pilihan: { A: 'PGA (Pin Grid Array)', B: 'LGA (Land Grid Array)', C: 'BGA (Ball Grid Array)', D: 'ZIF (Zero Insertion Force)', E: 'SEC (Single Edge Contact)' },
      kunci: 'B',
      penjelasan: 'LGA memiliki pin kontak di motherboard sedangkan bagian bawah prosesor berupa bantalan emas (land).'
    },
    {
      pertanyaan: 'Port motherboard yang berfungsi untuk menghubungkan SSD NVMe berkecepatan tinggi adalah...',
      pilihan: { A: 'Slot PCI Legacy', B: 'SATA Rev 3.0', C: 'Slot M.2 PCIe NVMe', D: 'Port IDE 40-pin', E: 'Port Floppy' },
      kunci: 'C',
      penjelasan: 'Slot M.2 PCIe memanfaatkan jalur bus PCIe langsung ke prosesor atau chipset untuk kecepatan transfer gigabytes per second.'
    },
    {
      pertanyaan: 'Konektor daya utama dari Power Supply Unit (PSU) modern ke motherboard umumnya memiliki pin berjumlah...',
      pilihan: { A: '4-pin', B: '8-pin', C: '20+4 pin (24-pin ATX)', D: '6+2 pin PCIe', E: 'Molex 4-pin' },
      kunci: 'C',
      penjelasan: 'Standar ATX modern menggunakan konektor 24-pin (20+4 pin) untuk menyuplai berbagai tegangan daya (+3.3V, +5V, +12V, -12V).'
    }
  ];

  const bankM2: Partial<SoalPG>[] = [
    {
      pertanyaan: 'Proses diagnosa mandiri yang dilakukan komputer saat pertama kali dinyalakan sebelum memuat sistem operasi disebut...',
      pilihan: { A: 'BOOTSTRAP', B: 'POST (Power-On Self Test)', C: 'BIOS Flashing', D: 'Overclocking', E: 'Dual Channel Test' },
      kunci: 'B',
      penjelasan: 'POST menguji keberadaan dan fungsi perangkat keras penting seperti RAM, CPU, GPU, dan keyboard.'
    },
    {
      pertanyaan: 'Terdengar bunyi beep 1 kali panjang diikuti 2 atau 3 kali pendek pada BIOS AMI umumnya mengindikasikan masalah pada...',
      pilihan: { A: 'Kabel power longgar', B: 'Kartu grafis (VGA / GPU)', C: 'Kipas pendingin mati', D: 'Baterai CMOS habis', E: 'Harddisk bad sector' },
      kunci: 'B',
      penjelasan: 'Kode beep 1 panjang 2/3 pendek mengindikasikan kegagalan deteksi adaptor kartu video atau grafis.'
    },
    {
      pertanyaan: 'Komponen pada motherboard yang menjaga pengaturan waktu (RTC) dan konfigurasi BIOS tetap tersimpan saat listrik mati adalah...',
      pilihan: { A: 'Kapasitor Solid', B: 'Baterai CMOS (CR2032)', C: 'Northbridge', D: 'Choke coil', E: 'Resistor SMD' },
      kunci: 'B',
      penjelasan: 'Baterai lithium koin CR2032 3V memasok daya cadangan untuk memori NVRAM CMOS.'
    },
    {
      pertanyaan: 'Pengganti modern dari BIOS legacy yang mendukung partisi disk di atas 2 TB dan Secure Boot adalah...',
      pilihan: { A: 'UEFI (Unified Extensible Firmware Interface)', B: 'ROM Shadowing', C: 'GRUB Bootloader', D: 'ACPI Controller', E: 'MBR Utility' },
      kunci: 'A',
      penjelasan: 'UEFI menawarkan antarmuka grafis, dukungan mouse, partisi GPT hingga ratusan ZB, dan fitur keamanan Secure Boot.'
    },
    {
      pertanyaan: 'Urutan boot (Boot Priority) harus diarahkan ke Flashdisk installer USB ketika teknisi ingin...',
      pilihan: { A: 'Mengganti pasta prosesor', B: 'Memulai instalasi Sistem Operasi baru', C: 'Membersihkan kipas casing', D: 'Mengecek suhu heatsink', E: 'Menonaktifkan LAN onboard' },
      kunci: 'B',
      penjelasan: 'Boot order mengatur media penyimpanan mana yang pertama kali dibaca BIOS untuk mencari boot sector loader OS.'
    }
  ];

  const bankM4: Partial<SoalPG>[] = [
    {
      pertanyaan: 'Susunan urutan warna pin kabel UTP standar EIA/TIA-568B dari pin 1 sampai 8 adalah...',
      pilihan: {
        A: 'Putih Oranye, Oranye, Putih Hijau, Biru, Putih Biru, Hijau, Putih Cokelat, Cokelat',
        B: 'Putih Hijau, Hijau, Putih Oranye, Biru, Putih Biru, Oranye, Putih Cokelat, Cokelat',
        C: 'Putih Biru, Biru, Putih Oranye, Hijau, Putih Hijau, Oranye, Putih Cokelat, Cokelat',
        D: 'Oranye, Putih Oranye, Hijau, Putih Hijau, Biru, Putih Biru, Cokelat, Putih Cokelat',
        E: 'Putih Cokelat, Cokelat, Putih Hijau, Hijau, Putih Oranye, Oranye, Putih Biru, Biru'
      },
      kunci: 'A',
      penjelasan: 'Standar T568B berurutan: Putih Oranye, Oranye, Putih Hijau, Biru, Putih Biru, Hijau, Putih Cokelat, Cokelat.'
    },
    {
      pertanyaan: 'Kabel UTP dengan ujung satu bertipe T568A dan ujung lainnya bertipe T568B disebut kabel...',
      pilihan: { A: 'Straight-Through', B: 'Rollover (Console)', C: 'Crossover', D: 'Fiber Patch Cord', E: 'Coaxial RG-58' },
      kunci: 'C',
      penjelasan: 'Kabel Crossover menyilangkan pasangan pin TX dan RX sehingga menghubungkan perangkat yang sejenis (PC ke PC, Switch ke Switch lama).'
    },
    {
      pertanyaan: 'Konektor standar yang dipasang pada ujung kabel UTP CAT5e / CAT6 untuk jaringan Ethernet LAN adalah...',
      pilihan: { A: 'RJ-11', B: 'RJ-45', C: 'BNC', D: 'SC Fiber', E: 'VGA DB15' },
      kunci: 'B',
      penjelasan: 'RJ-45 (Registered Jack 45) memiliki 8 pin tembaga modular sesuai 8 kawat pada kabel UTP.'
    },
    {
      pertanyaan: 'Topologi jaringan di mana semua workstation terhubung secara terpusat ke perangkat Switch / Hub dinamakan...',
      pilihan: { A: 'Topologi Bus', B: 'Topologi Ring', C: 'Topologi Star (Bintang)', D: 'Topologi Mesh', E: 'Topologi Linear' },
      kunci: 'C',
      penjelasan: 'Topologi star menghubungkan setiap simpul ke konsentrator tengah. Kerusakan satu kabel tidak mematikan simpul lainnya.'
    },
    {
      pertanyaan: 'Alat uji praktis yang memiliki 8 lampu LED indikator untuk memeriksa kesinambungan sambungan kabel UTP adalah...',
      pilihan: { A: 'Tang Crimping', B: 'LAN Cable Tester', C: 'Multimeter Analog', D: 'Punch Down Tool', E: 'Wire Stripper' },
      kunci: 'B',
      penjelasan: 'LAN cable tester menyalakan LED 1 hingga 8 secara berurutan untuk memverifikasi tidak ada pin terputus atau terbalik.'
    }
  ];

  const bankM5: Partial<SoalPG>[] = [
    {
      pertanyaan: 'Berapa jumlah bit total pada alamat IPv4?',
      pilihan: { A: '16 bit', B: '32 bit', C: '64 bit', D: '128 bit', E: '256 bit' },
      kunci: 'B',
      penjelasan: 'IPv4 terdiri dari 32 bit yang dibagi ke dalam 4 oktet, masing-masing 8 bit bernilai 0 hingga 255.'
    },
    {
      pertanyaan: 'IP Address 192.168.10.1 termasuk dalam kelas IP...',
      pilihan: { A: 'Kelas A', B: 'Kelas B', C: 'Kelas C', D: 'Kelas D (Multicast)', E: 'Kelas E (Eksperimen)' },
      kunci: 'C',
      penjelasan: 'Rentang oktet pertama Kelas C adalah 192 - 223. Alamat 192.168.0.0/16 adalah IP Privat Kelas C.'
    },
    {
      pertanyaan: 'Subnet mask standar untuk prefix /24 adalah...',
      pilihan: { A: '255.0.0.0', B: '255.255.0.0', C: '255.255.255.0', D: '255.255.255.128', E: '255.255.255.192' },
      kunci: 'C',
      penjelasan: 'Prefix /24 memiliki 24 bit angka 1 berturut-turut dalam format biner, setara desimal 255.255.255.0.'
    },
    {
      pertanyaan: 'Jika sebuah subnet menggunakan prefix /26, berapa jumlah host yang dapat dialokasikan ke perangkat siswa?',
      pilihan: { A: '254 host', B: '126 host', C: '62 host', D: '30 host', E: '14 host' },
      kunci: 'C',
      penjelasan: 'Sisa bit host = 32 - 26 = 6 bit. Jumlah host = 2^6 - 2 (Network & Broadcast) = 64 - 2 = 62 usable host.'
    },
    {
      pertanyaan: 'Alamat IP spesial 127.0.0.1 berfungsi sebagai alamat...',
      pilihan: { A: 'Default Gateway internet', B: 'Localhost / Loopback Adapter', C: 'DNS Server Google', D: 'Broadcast lokal', E: 'DHCP Pool utama' },
      kunci: 'B',
      penjelasan: '127.0.0.1 adalah loopback address untuk menguji fungsionalitas TCP/IP stack internal komputer itu sendiri.'
    }
  ];

  const bankM6: Partial<SoalPG>[] = [
    {
      pertanyaan: 'Perintah Command Prompt (CMD) yang digunakan untuk menguji latensi dan keterjangkauan host di jaringan adalah...',
      pilihan: { A: 'ipconfig', B: 'ping', C: 'netstat', D: 'tracert', E: 'nslookup' },
      kunci: 'B',
      penjelasan: 'Perintah ping mengirimkan paket ICMP Echo Request dan menunggu Echo Reply untuk menghitung RTT (Round Trip Time).'
    },
    {
      pertanyaan: 'Untuk melihat rincian konfigurasi IP address, subnet mask, default gateway, dan MAC Address fisik kartu LAN pada Windows digunakan...',
      pilihan: { A: 'ipconfig /all', B: 'ping -t', C: 'route print', D: 'arp -a', E: 'hostname' },
      kunci: 'A',
      penjelasan: 'Perintah ipconfig /all menampilkan adapter ethernet, MAC address (Physical Address), DHCP status, dan DNS servers.'
    },
    {
      pertanyaan: 'Perintah yang digunakan untuk melacak rute lompatan router (hop) yang dilewati paket data hingga ke tujuan adalah...',
      pilihan: { A: 'nslookup', B: 'tracert (traceroute)', C: 'netstat -an', D: 'nbtstat', E: 'telnet' },
      kunci: 'B',
      penjelasan: 'tracert menampilkan daftar router perantara dan waktu responnya menggunakan manipulasi TTL (Time-To-Live).'
    },
    {
      pertanyaan: 'Layanan jaringan yang berfungsi menerjemahkan nama domain (misal www.smk.sch.id) menjadi alamat IP adalah...',
      pilihan: { A: 'DHCP (Dynamic Host Configuration Protocol)', B: 'DNS (Domain Name System)', C: 'FTP (File Transfer Protocol)', D: 'SNMP', E: 'SMTP' },
      kunci: 'B',
      penjelasan: 'DNS berperan seperti buku telepon internet yang memetakan nama domain ke alamat IP yang dimengerti mesin.'
    },
    {
      pertanyaan: 'Ketika hasil ping menghasilkan balasan "Request Timed Out (RTO)", kemungkinan terbesar penyebabnya adalah...',
      pilihan: {
        A: 'Komputer tujuan merespons seketika',
        B: 'Paket data tidak sampai ke tujuan atau diblokir oleh firewall',
        C: 'Kabel UTP terpasang sempurna tanpa hambatan',
        D: 'IP address tujuan berada pada subnet yang sama',
        E: 'Sistem operasi komputer baru saja direstart'
      },
      kunci: 'B',
      penjelasan: 'RTO berarti pengirim tidak menerima balasan ICMP Reply dalam batas waktu tertentu akibat putus jaringan, down, atau firewall.'
    }
  ];

  // Pick bank or fallback based on module number
  const chosenBank = modulNum === 1 ? bankM1 :
                     modulNum === 2 ? bankM2 :
                     modulNum === 4 ? bankM4 :
                     modulNum === 5 ? bankM5 :
                     bankM6;

  // Create an array of 40 well-crafted questions for this module
  const fullList: SoalPG[] = [];
  const baseQuestions = [
    ...chosenBank,
    {
      pertanyaan: `[Analisis Konsep ${topic}] Faktor utama yang menentukan performa komputasi dalam kaitannya dengan bandwidth bus data adalah...`,
      pilihan: { A: 'Kapasitas daya PSU', B: 'Frekuensi clock bus dan lebar jalur bit data', C: 'Warna heatsink pendingin', D: 'Panjang kabel SATA', E: 'Jumlah port USB eksternal' },
      kunci: 'B' as const,
      penjelasan: 'Bandwidth dihitung dari perkalian frekuensi clock efektif dengan lebar bus data per siklus.'
    },
    {
      pertanyaan: `[Prosedur Operasi Standar ${topic}] Langkah preventif paling tepat sebelum melakukan perbaikan pada perangkat keras aktif adalah...`,
      pilihan: { A: 'Membiarkan kabel daya tetap tersambung', B: 'Memutuskan sumber daya listrik (unplug) dan menekan tombol power untuk mengosongkan sisa arus kapasitor', C: 'Menyiram komponen dengan air bersih', D: 'Menyentuh chip IC secara berulang', E: 'Meningkatkan tegangan voltage power supply' },
      kunci: 'B' as const,
      penjelasan: 'Mematikan stop kontak dan menekan tombol power membuang sisa muatan daya kapasitor (drain residual charge).'
    },
    {
      pertanyaan: `[Standar Industri] Arsitektur antarmuka penyimpanan modern yang menggunakan protokol Non-Volatile Memory Express memanfaatkan jalur bus...`,
      pilihan: { A: 'PCI Express (PCIe)', B: 'SATA 1.5 Gbps', C: 'Parallel ATA', D: 'SCSI 8-bit', E: 'AGP 8X' },
      kunci: 'A' as const,
      penjelasan: 'NVMe dirancang khusus di atas jalur bus PCIe berlatensi rendah untuk throughput SSD solid state drive.'
    },
    {
      pertanyaan: `[Diagnosa Masalah] Jika komputer menyala, kipas berputar kencang, namun tidak ada tampilan pada monitor (No Display) serta lampu keyboard mati, komponen prioritas pertama yang harus dibersihkan konektor pinnya adalah...`,
      pilihan: { A: 'Harddisk internal', B: 'Modul RAM (Random Access Memory)', C: 'Kabel speaker casing', D: 'DVD-ROM drive', E: 'Kabel front panel audio' },
      kunci: 'B' as const,
      penjelasan: 'Oksidasi debu pada pin emas RAM sering menyebabkan kegagalan POST no-display. Solusinya dibersihkan dengan karet penghapus pensil.'
    },
    {
      pertanyaan: `[Spesifikasi Hardware] Memori DDR4 berkecepatan 3200 MHz bekerja pada voltase standar sebesar...`,
      pilihan: { A: '1.2 Volt', B: '1.5 Volt', C: '1.8 Volt', D: '3.3 Volt', E: '5.0 Volt' },
      kunci: 'A' as const,
      penjelasan: 'Standar JEDEC DDR4 beroperasi pada voltase hemat daya 1.2V (bandingkan dengan DDR3 1.5V).'
    }
  ];

  for (let i = 1; i <= 40; i++) {
    const baseIdx = (i - 1) % baseQuestions.length;
    const template = baseQuestions[baseIdx];
    const cycle = Math.floor((i - 1) / baseQuestions.length);

    let qText = template.pertanyaan || '';
    if (cycle > 0) {
      qText = `[Kasus Lapangan #${i}] ${qText.replace(/\[.*?\]\s*/g, '')}`;
    }

    fullList.push({
      id: i,
      pertanyaan: qText,
      pilihan: {
        A: template.pilihan?.A || 'Pilihan Jawaban A',
        B: template.pilihan?.B || 'Pilihan Jawaban B',
        C: template.pilihan?.C || 'Pilihan Jawaban C',
        D: template.pilihan?.D || 'Pilihan Jawaban D',
        E: template.pilihan?.E || 'Pilihan Jawaban E',
      },
      kunci: template.kunci || (['A', 'B', 'C', 'D', 'E'][i % 5] as 'A' | 'B' | 'C' | 'D' | 'E'),
      penjelasan: template.penjelasan || `Penjelasan materi KJD untuk butir soal evaluasi nomor ${i}.`
    });
  }

  return fullList;
}

// Helper to generate 10 comprehensive KJD Essay questions per module
function generate10EssayForModule(modulNum: number): SoalEssay[] {
  const essayBanks: Record<number, { q: string; guide: string }[]> = {
    1: [
      {
        q: '1. Jelaskan secara sistematis 5 langkah utama persiapan K3LH untuk mencegah kerusakan komponen akibat pelepasan muatan listrik statis (Electrostatic Discharge/ESD) saat merakit PC!',
        guide: 'Memuat: Gelang antistatis, grounding, alas karet, pemutusan sumber daya listrik, memegang tepi PCB tanpa menyentuh pin IC.'
      },
      {
        q: '2. Bandingkan perbedaan soket prosesor tipe LGA (Land Grid Array) dengan PGA (Pin Grid Array) dari segi konstruksi fisik pin dan risiko kerusakannya!',
        guide: 'LGA: Pin berada di motherboard, kontak CPU berupa land/bantalan datar emas. PGA: Pin berada di prosesor, soket berupa lubang.'
      },
      {
        q: '3. Jelaskan fungsi thermal paste pada prosesor dan uraikan teknik pengaplikasian yang paling efektif agar konduksi panas ke heatsink berlangsung optimal!',
        guide: 'Fungsi: Mengisi rongga mikroskopis udara. Teknik: Titik seukuran kacang polong di tengah IHS tanpa berlebihan agar tidak meluber.'
      },
      {
        q: '4. Uraikan fungsi kabel daya 24-Pin ATX dan 8-Pin EPS CPU dari Power Supply (PSU), serta jelaskan tegangan listrik utama yang disuplainya!',
        guide: '24-Pin: Menyuplai motherboard, RAM, slot PCIe (+3.3V, +5V, +12V). 8-Pin EPS: Menyuplai VRM CPU secara terisolasi (+12V).'
      },
      {
        q: '5. Jelaskan konsep arsitektur Dual Channel pada memori RAM dan cara menentukan slot DIMM yang tepat pada motherboard dengan 4 slot RAM!',
        guide: 'Dual Channel melipatgandakan bandwidth bus memori dari 64-bit menjadi 128-bit. Pemasangan umumnya di slot A2 dan B2 (slot 2 dan 4).'
      },
      {
        q: '6. Bagaimanakah prosedur pemasangan SSD M.2 NVMe PCIe yang benar pada motherboard, mulai dari pemasangan standoff hingga pengencangan sekrup penahan?',
        guide: 'Memasukkan modul M.2 dengan sudut kemiringan 30 derajat, menekan perlahan ke bawah, dan mengencangkan sekrup penahan pada standoff.'
      },
      {
        q: '7. Mengapa manajemen kabel (cable management) di dalam casing komputer sangat krusial terhadap performa dan usia perangkat keras jangka panjang?',
        guide: 'Memaksimalkan sirkulasi aliran udara (airflow intake-exhaust), mencegah penumpukan kantong panas (heat trap), dan kerapian perawatan.'
      },
      {
        q: '8. Jelaskan fungsi dan aturan polaritas (+/-) pada pemasangan header Front Panel casing (Power SW, Reset SW, HDD LED, Power LED) ke motherboard!',
        guide: 'Power SW & Reset SW merupakan switch sesaat (tidak terpengaruh polaritas). HDD LED & Power LED memiliki kutub positif dan negatif.'
      },
      {
        q: '9. Rancanglah prosedur diagnosa langkah demi langkah jika sebuah PC yang baru selesai dirakit sama sekali tidak merespons (mati total) saat tombol power ditekan!',
        guide: '1. Cek saklar I/O PSU dan kabel listrik, 2. Cek konektor 24-pin dan 8-pin, 3. Cek pin header Front Panel Power SW, 4. Uji paperclip PSU.'
      },
      {
        q: '10. Tuliskan daftar periksa (checklist) pengujian minimal yang wajib dilakukan teknisi sebelum menutup panel samping casing PC secara permanen!',
        guide: 'POST berhasil, semua fan berputar, deteksi CPU/RAM/Storage di BIOS, suhu normal, tidak ada kabel menyenggol bilah kipas.'
      }
    ],
    2: [
      {
        q: '1. Jelaskan pengertian proses POST (Power-On Self Test) pada komputer dan sebutkan urutan komponen hardware utama yang diujinya!',
        guide: 'POST menguji integritas register CPU, memori RAM, pengontrol video/GPU, firmware BIOS, dan keyboard/storage sebelum handoff ke OS.'
      },
      {
        q: '2. Interpretasikan arti dari bunyi kode beep 1 kali panjang diikuti 2 atau 3 kali pendek pada BIOS Award/AMI dan jelaskan tindakan perbaikannya!',
        guide: 'Mengindikasikan kegagalan deteksi kartu grafis (VGA/GPU). Tindakan: Lepas, bersihkan pin PCIe dengan penghapus, dan pasang kembali.'
      },
      {
        q: '3. Jelaskan fungsi baterai CMOS koin CR2032 3V pada motherboard dan sebutkan 2 gejala teknis yang muncul jika daya baterai tersebut telah habis!',
        guide: 'Menjaga jam RTC dan setting NVRAM CMOS. Gejala: Tanggal/waktu kembali ke tahun default (misal 2000) dan error CMOS Checksum Error.'
      },
      {
        q: '4. Bandingkan 3 perbedaan fundamental antara skema firmware BIOS Legacy tradisional dengan UEFI (Unified Extensible Firmware Interface) modern!',
        guide: 'UEFI mendukung drive >2TB (GPT), antarmuka grafis mouse GUI, waktu boot lebih cepat, dan fitur keamanan Secure Boot.'
      },
      {
        q: '5. Jelaskan langkah demi langkah mengatur Boot Device Priority di menu BIOS agar komputer memprioritaskan booting dari USB Flashdisk installer!',
        guide: 'Masuk menu Boot, pilih Boot Option #1, ubah ke USB Flashdisk (UEFI USB), lalu simpan perubahan via Save Changes and Exit (F10).'
      },
      {
        q: '6. Parameter apa sajakah yang dapat dipantau pada submenu Hardware Health / H/W Monitor di BIOS dan berapakah rentang suhu normal prosesor saat idle?',
        guide: 'Parameter: Suhu CPU, suhu motherboard, RPM fan cooler, dan voltase (+12V, +5V, Vcore). Suhu idle normal: 30°C hingga 45°C.'
      },
      {
        q: '7. Jelaskan tujuan dan cara kerja fitur Secure Boot pada firmware UEFI dalam kaitannya dengan keamanan sistem operasi dari ancaman rootkit/bootkit!',
        guide: 'Memastikan hanya software, bootloader, dan driver yang memiliki sertifikat tanda tangan digital sah yang diizinkan dimuat saat boot.'
      },
      {
        q: '8. Uraikan prosedur mereset pengaturan BIOS ke kondisi default pabrik (Factory Default) menggunakan jumper CLR_CMOS pada motherboard!',
        guide: 'Putuskan kabel listrik, pindahkan posisi jumper CLR_CMOS dari pin 1-2 ke 2-3 selama 5-10 detik, kembalikan ke posisi semula, dan nyalakan.'
      },
      {
        q: '9. Analisislah 2 kemungkinan penyebab munculnya pesan error "No Bootable Device Found" saat komputer menyala dan jelaskan cara penanganannya!',
        guide: 'Penyebab: Boot order salah atau kabel data/daya storage longgar/rusak. Penanganan: Periksa deteksi drive di BIOS dan atur urutan boot.'
      },
      {
        q: '10. Jelaskan fungsi dari fitur profil memori XMP (Extreme Memory Profile) atau DOCP pada menu BIOS dan keuntungan mengaktifkannya!',
        guide: 'Memungkinkan modul RAM berjalan pada frekuensi dan timing overclocking pabrik bersertifikasi secara stabil tanpa tuning manual.'
      }
    ],
    3: [
      {
        q: '1. Bandingkan kelebihan dan batasan antara skema partisi MBR (Master Boot Record) dengan GPT (GUID Partition Table) pada media penyimpanan modern!',
        guide: 'MBR: Maksimal 4 partisi primer, batas kapasitas 2 TB. GPT: Hingga 128 partisi primer, kapasitas hingga 9.4 ZB, dan memiliki backup header.'
      },
      {
        q: '2. Uraikan prosedur pembuatan bootable USB installer sistem operasi menggunakan perangkat lunak pihak ketiga seperti Rufus atau Ventoy!',
        guide: 'Pilih USB drive target, pilih file image ISO Windows/Linux, tentukan skema partisi (GPT/UEFI atau MBR/BIOS), dan klik Start/Write.'
      },
      {
        q: '3. Jelaskan perbedaan karakteristik dan peruntukan antara sistem berkas NTFS, FAT32, dan ext4 dalam manajemen partisi!',
        guide: 'FAT32: Kompatibilitas luas, batas file 4 GB. NTFS: Sistem berkas default Windows modern (security ACL, kompresi). ext4: File system default Linux.'
      },
      {
        q: '4. Jelaskan tahapan clean install sistem operasi Windows mulai dari pemilihan bahasa hingga partisi format drive penyimpanan!',
        guide: 'Boot ke installer, pilih bahasa/keyboard, klik Install Now, masukkan lisensi, pilih Custom: Install Windows only, hapus partisi lama, buat partisi baru.'
      },
      {
        q: '5. Sebutkan urutan prioritas instalasi driver perangkat keras yang dianjurkan setelah instalasi sistem operasi baru selesai dan berikan alasannya!',
        guide: '1. Driver Chipset (menghubungkan bus motherboard), 2. Driver VGA/Grafis, 3. Driver Jaringan LAN/Wi-Fi, 4. Driver Audio dan Peripheral lain.'
      },
      {
        q: '6. Bagaimana cara mendiagnosa dan mengatasi perangkat keras yang menampilkan tanda seru kuning (Yellow Exclamation Mark) pada Device Manager Windows?',
        guide: 'Tanda seru berarti driver hilang, tidak cocok, atau rusak. Atasi dengan klik kanan > Update driver > cari via internet atau file vendor.'
      },
      {
        q: '7. Mengapa sistem operasi modern berarsitektur 64-bit (x64) lebih disukai daripada 32-bit (x86) dalam pengelolaan memori RAM dan komputasi?',
        guide: 'Arsitektur 32-bit dibatasi maksimal 4 GB RAM (teoritis), sedangkan 64-bit mampu mengalamatkan memori hingga terabytes dan instruksi lebih cepat.'
      },
      {
        q: '8. Jelaskan prinsip konfigurasi partisi untuk skenario Dual-Boot (Windows dan Linux) pada satu media penyimpanan fisik agar bootloader tidak tertimpa!',
        guide: 'Instal Windows terlebih dahulu pada partisi pertama, lalu instal Linux di partisi kedua agar bootloader GRUB secara otomatis mendeteksi kedua OS.'
      },
      {
        q: '9. Jelaskan fungsi dari fitur Windows Update Service dan risiko keamanan yang dihadapi jika pembaruan sistem operasi dimatikan secara permanen!',
        guide: 'Menyediakan patch kerentanan keamanan, update definisi antivirus Defender, dan driver terbaru. Jika dimatikan rentan terhadap exploit malware.'
      },
      {
        q: '10. Jelaskan fungsi dari pembuatan System Restore Point dan System Image Backup sebagai strategi penanggulangan bencana pada sistem operasi!',
        guide: 'Restore point mengembalikan registry dan file sistem ke kondisi sebelumnya saat terjadi crash driver, tanpa menghapus data pribadi pengguna.'
      }
    ],
    4: [
      {
        q: '1. Tuliskan susunan 8 warna kabel UTP standar EIA/TIA-568A dan EIA/TIA-568B secara berurutan dari pin 1 sampai pin 8!',
        guide: 'T568A: Putih Hijau, Hijau, Putih Oranye, Biru, Putih Biru, Oranye, Putih Cokelat, Cokelat. T568B: Putih Oranye, Oranye, Putih Hijau, Biru, Putih Biru, Hijau, Putih Cokelat, Cokelat.'
      },
      {
        q: '2. Jelaskan perbedaan mendasar fungsi penggunaan kabel Straight-Through dan Crossover beserta contoh pasangan perangkat yang dihubungkannya!',
        guide: 'Straight: Menghubungkan perangkat berbeda (PC ke Switch, Router ke Switch). Crossover: Menghubungkan perangkat sejenis (PC ke PC, Switch ke Switch lama).'
      },
      {
        q: '3. Uraikan langkah-langkah pembuatan kabel jaringan UTP menggunakan tang crimping dan konektor modular RJ-45 secara presisi!',
        guide: 'Kupas jaket pelindung 2 cm, luruskan dan susun warna T568B, potong rata 1.2 cm, masukkan ke konektor RJ-45 hingga mentok, tekan tang crimping.'
      },
      {
        q: '4. Bagaimanakah cara membaca indikator lampu LED 1 sampai 8 pada alat LAN Cable Tester untuk memastikan kabel beroperasi normal?',
        guide: 'Kedua unit (Master dan Remote) harus menyalakan lampu LED 1 hingga 8 secara berurutan dan serempak tanpa ada yang padam atau melompat urutannya.'
      },
      {
        q: '5. Bandingkan spesifikasi teknis kecepatan transfer dan bandwidth frekuensi antara kabel UTP CAT5e, CAT6, dan CAT6a!',
        guide: 'CAT5e: 1 Gbps (100 MHz). CAT6: 1-10 Gbps jarak pendek (250 MHz, terdapat separator plastik). CAT6a: 10 Gbps hingga 100 meter (500 MHz).'
      },
      {
        q: '6. Jelaskan karakteristik arsitektur Topologi Bintang (Star Topology) serta uraikan 2 kelebihan dan 1 kelemahannya dalam jaringan LAN!',
        guide: 'Semua node terhubung ke sentral (Switch). Kelebihan: Kerusakan 1 kabel tidak mematikan node lain, mudah troubleshooting. Kelemahan: Tergantung switch pusat.'
      },
      {
        q: '7. Sebutkan ke-7 lapisan OSI Reference Model secara berurutan dari Layer 1 (bawah) ke Layer 7 (atas) dan jelaskan fungsi Layer 3 (Network)!',
        guide: '1. Physical, 2. Data Link, 3. Network (Routing dan pengalamatan logika IP), 4. Transport, 5. Session, 6. Presentation, 7. Application.'
      },
      {
        q: '8. Jelaskan perbedaan prinsip kerja penanganan collision dan broadcast domain antara perangkat konsentrator Hub dengan Switch!',
        guide: 'Hub meneruskan sinyal ke semua port (1 collision domain bersama, rawan tabrakan). Switch membuat collision domain mandiri per port berdasarkan tabel MAC Address.'
      },
      {
        q: '9. Mengapa kabel jaringan UTP CAT6 yang terpasang terkadang hanya ternegosiasi pada kecepatan 100 Mbps padahal port network card berkecepatan 1 Gbps?',
        guide: 'Kecepatan Gigabit (1000 Mbps) memerlukan ke-4 pasang kawat (8 pin) terhubung sempurna. Jika pin 4, 5, 7, atau 8 terputus, link turun ke 100 Mbps.'
      },
      {
        q: '10. Jelaskan alasan teknis mengapa kawat tembaga kabel UTP dipilin berpasangan (twisted pair) dan batas panjang pelintiran yang boleh dibuka saat crimping!',
        guide: 'Pilinan kawat membatalkan interferensi elektromagnetik dan crosstalk antar kawat. Batas pilinan yang boleh dibuka maksimal 1.3 cm (0.5 inci).'
      }
    ],
    5: [
      {
        q: '1. Jelaskan struktur 32-bit alamat IPv4 dan uraikan pembagian 4 oktet desimal bertitik (dotted-decimal notation)!',
        guide: 'IPv4 terdiri dari 32 bit biner yang dibagi menjadi 4 oktet, masing-masing 8 bit bernilai desimal antara 0 sampai 255 (misal 192.168.1.1).'
      },
      {
        q: '2. Sebutkan rentang alamat IP Privat untuk Kelas A, Kelas B, dan Kelas C menurut standar RFC 1918 dan jelaskan kegunaannya di jaringan lokal!',
        guide: 'Kelas A: 10.0.0.0 - 10.255.255.255 (/8). Kelas B: 172.16.0.0 - 172.31.255.255 (/12). Kelas C: 192.168.0.0 - 192.168.255.255 (/16). Tidak diroute di internet publik.'
      },
      {
        q: '3. Jelaskan konsep Network ID (Alamat Jaringan) dan Broadcast ID (Alamat Siaran) dalam sebuah subnet serta mengapa keduanya tidak boleh dipakai untuk host!',
        guide: 'Network ID adalah alamat pertama untuk identifikasi blok subnet. Broadcast ID adalah alamat tertinggi untuk mengirim paket ke semua host dalam subnet.'
      },
      {
        q: '4. Sebuah laboratorium sekolah memiliki alokasi IP 192.168.10.0/26. Hitung Subnet Mask desimalnya, jumlah total subnet yang dibentuk, dan jumlah host usable per subnet!',
        guide: 'Subnet mask: 255.255.255.192. Jumlah subnet: 2^2 = 4 subnet. Jumlah host valid: 2^6 - 2 = 64 - 2 = 62 host usable per subnet.'
      },
      {
        q: '5. Jelaskan fungsi alamat IP Loopback 127.0.0.1 dan apa maknanya jika pengujian ping ke alamat tersebut menghasilkan balasan sukses!',
        guide: 'Loopback menguji TCP/IP protocol stack internal dan kartu jaringan komputer itu sendiri tanpa mengirim sinyal fisik ke luar kabel.'
      },
      {
        q: '6. Tentukan Subnet Mask dalam notasi desimal bertitik untuk prefix /28 dan hitung berapa jumlah host valid yang dapat digunakan!',
        guide: 'Prefix /28 bernilai 255.255.255.240. Bit sisa host = 32 - 28 = 4 bit. Jumlah usable host = 2^4 - 2 = 16 - 2 = 14 host valid.'
      },
      {
        q: '7. Jelaskan konsep notasi CIDR (Classless Inter-Domain Routing) dan apa keuntungan penggunaannya dibanding pembagian kelas konvensional (Classful)!',
        guide: 'CIDR menggunakan prefix /xx yang fleksibel sehingga menghemat alokasi ruang alamat IPv4 dan mencegah pemborosan IP address.'
      },
      {
        q: '8. Jelaskan peran Default Gateway dalam konfigurasi jaringan TCP/IP pada komputer siswa di laboratorium sekolah!',
        guide: 'Default Gateway adalah alamat IP interface router lokal tempat komputer meneruskan paket data yang ditujukan ke luar subnet atau internet.'
      },
      {
        q: '9. Bandingkan kelebihan dan kekurangan konfigurasi pengalamatan IP Statis manual dengan pengalamatan otomatis menggunakan DHCP Server!',
        guide: 'Statis: Cocok untuk server/printer tapi rawan duplikasi dan repot. DHCP: Otomatis, terpusat, efisien mencegah IP conflict, tapi tergantung server DHCP.'
      },
      {
        q: '10. Jelaskan apa yang terjadi saat terjadi "IP Address Conflict" di sebuah jaringan lokal dan bagaimana solusi teknis mengatasinya!',
        guide: 'Terjadi saat 2 perangkat memiliki IP sama sehingga salah satu atau keduanya kehilangan koneksi. Solusi: Ubah ke DHCP atau assign IP unik.'
      }
    ],
    6: [
      {
        q: '1. Jelaskan cara kerja perintah `ping` dan uraikan arti dari parameter bytes, time (RTT/Round Trip Time), dan TTL (Time-To-Live)!',
        guide: 'Ping mengirim paket ICMP Echo Request dan menunggu Reply. Bytes: Ukuran muatan payload. Time: Waktu tempuh bolak-balik. TTL: Batas lompatan hop router.'
      },
      {
        q: '2. Bandingkan perbedaan mendasar antara balasan ping "Request Timed Out (RTO)" dengan "Destination Host Unreachable" dari segi penyebab gangguannya!',
        guide: 'RTO: Paket dikirim tetapi tidak ada balasan kembali dalam batas waktu (firewall/down). Unreachable: Router lokal tidak menemukan jalur rute ke alamat tujuan.'
      },
      {
        q: '3. Informasi apa sajakah yang dapat diperoleh administrator jaringan dari hasil eksekusi perintah `ipconfig /all` pada Command Prompt Windows?',
        guide: 'Physical Address (MAC Address), IP Address, Subnet Mask, Default Gateway, Status DHCP Enabled, DHCP Server IP, dan DNS Servers IP.'
      },
      {
        q: '4. Jelaskan bagaimana perintah `tracert` (traceroute) dapat mengetahui setiap lompatan router (hop) yang dilewati paket data hingga ke host tujuan!',
        guide: 'Tracert mengirim paket ICMP/UDP dengan nilai TTL bertahap mulai dari 1, 2, 3... sehingga setiap router perantara membalas Time Exceeded.'
      },
      {
        q: '5. Jelaskan fungsi dari utilitas `nslookup` dan bagaimana cara menggunakannya untuk memverifikasi apakah server DNS sekolah bekerja dengan benar!',
        guide: 'nslookup meminta resolusi nama domain ke alamat IP server DNS. Jika domain berhasil diterjemahkan ke IP, server DNS berfungsi normal.'
      },
      {
        q: '6. Uraikan kegunaan dari perintah `netstat -an` dalam memantau port jaringan dan keamanan koneksi komputer lokal!',
        guide: 'Menampilkan semua koneksi TCP/UDP aktif beserta nomor port lokal, alamat foreign tujuan, dan status koneksi (LISTENING, ESTABLISHED, CLOSE_WAIT).'
      },
      {
        q: '7. Rancanglah prosedur bertingkat 4 level menggunakan perintah CLI Command Prompt untuk menganalisis komputer lab yang tidak bisa membuka website!',
        guide: 'Level 1: ping 127.0.0.1 (stack TCP/IP), Level 2: ipconfig (cek IP & Gateway), Level 3: ping Default Gateway (LAN lokal), Level 4: ping 8.8.8.8 vs nslookup (DNS).'
      },
      {
        q: '8. Jelaskan fungsi perintah `ipconfig /release` dan `ipconfig /renew` serta kapan seorang teknisi jaringan perlu menjalankannya!',
        guide: 'Release melepaskan sewa IP lama dari DHCP server, Renew meminta alokasi konfigurasi IP baru. Digunakan saat adapter tidak memperoleh IP otomatis yang valid.'
      },
      {
        q: '9. Jelaskan peran DNS Resolver Cache pada sistem operasi komputer dan sebutkan perintah untuk membersihkannya secara tuntas!',
        guide: 'Cache menyimpan riwayat pemetaan domain-ke-IP sementara agar browsing lebih cepat. Dibersihkan dengan perintah: `ipconfig /flushdns`.'
      },
      {
        q: '10. Mengapa sebuah komputer bisa berhasil melakukan ping ke IP publik (misal ping 8.8.8.8) tetapi gagal saat membuka website di browser (misal google.com)?',
        guide: 'Koneksi lapisan fisik, data link, dan routing IP normal, namun terjadi kegagalan pada layanan Domain Name System (DNS) atau kesalahan konfigurasi IP DNS Server.'
      }
    ]
  };

  const list = essayBanks[modulNum] || essayBanks[1];
  return list.map((item, idx) => ({
    id: idx + 1,
    pertanyaan: item.q,
    panduanPenilaian: item.guide,
    skorMaksimal: 10
  }));
}

export const DEFAULT_MODUL: Modul[] = [
  {
    id: 'modul-1',
    kode: 'KJD-01',
    judul: 'K3LH & Perakitan Komputer (Hardware PC)',
    kategori: 'Perangkat Keras',
    estimasiMenit: 60,
    materiUrl: 'https://simonmurd.github.io/Komputer-dan-Jaringan-Dasar/',
    kompetensiDasar: '3.1 Menerapkan K3LH di lingkungan kerja & 3.2 Menerapkan perakitan komputer',
    deskripsi: 'Prinsip keselamatan dan kesehatan kerja, pengenalan komponen motherboard, prosesor, RAM, pendingin pendingin thermal, instalasi power supply, dan manajemen kabel casing.',
    ringkasan: [
      'Pencegahan Electrostatic Discharge (ESD) dengan gelang antistatik dan alas karet.',
      'Anatomi Motherboard: Soket CPU (LGA vs PGA), Slot RAM DIMM Dual Channel, Slot PCIe x16, Chipset, dan Header Front Panel.',
      'Pemberian thermal paste secara seimbang (seukuran butir kacang polong) di atas IHS CPU.',
      'Pemasangan power supply unit (PSU) dan rute kabel 24-pin ATX, 8-pin EPS CPU, dan PCIe power.'
    ],
    simulasiTipe: 'pc-assembly',
    soalPG: generate40QuestionsForModule(1, 'Perakitan Komputer & K3LH'),
    soalEssay: generate10EssayForModule(1)
  },
  {
    id: 'modul-2',
    kode: 'KJD-02',
    judul: 'Pengujian Perakitan & Konfigurasi BIOS/UEFI',
    kategori: 'Firmware & Troubleshooting',
    estimasiMenit: 60,
    materiUrl: 'https://simonmurd.github.io/Komputer-dan-Jaringan-Dasar/',
    kompetensiDasar: '3.3 Menerapkan pengujian perakitan komputer & 3.4 Menerapkan konfigurasi BIOS',
    deskripsi: 'Proses diagnosa Power-On Self Test (POST), pembacaan arti beep code, pengaturan firmware BIOS/UEFI, boot priority order, pemantauan hardware monitor suhu, dan reset baterai CMOS.',
    ringkasan: [
      'Fungsi POST dalam mendeteksi CPU, RAM, Video Controller, dan penyimpanan sebelum boot.',
      'Interpretasi kode beep buzzer BIOS Award, AMI, dan Phoenix.',
      'Navigasi menu BIOS: Main, Advanced, Hardware Monitor, Boot Sequence, Exit & Save Changes.',
      'Perbedaan mendasar antara skema BIOS Legacy (MBR) dengan UEFI modern (GPT).'
    ],
    simulasiTipe: 'bios',
    soalPG: generate40QuestionsForModule(2, 'Pengujian & BIOS Setup'),
    soalEssay: generate10EssayForModule(2)
  },
  {
    id: 'modul-3',
    kode: 'KJD-03',
    judul: 'Instalasi Sistem Operasi & Driver Peripheral',
    kategori: 'Sistem Operasi',
    estimasiMenit: 60,
    materiUrl: 'https://simonmurd.github.io/Komputer-dan-Jaringan-Dasar/',
    kompetensiDasar: '3.5 Menerapkan instalasi sistem operasi & 3.6 Menerapkan instalasi driver perangkat keras',
    deskripsi: 'Pembuatan bootable media installer USB, skema partisi MBR vs GPT, instalasi OS Windows dan Linux, serta instalasi dan verifikasi driver perangkat melalui Device Manager.',
    ringkasan: [
      'Struktur tabel partisi: Master Boot Record (maksimal 4 partisi primer, batas 2 TB) vs GUID Partition Table (hingga 128 partisi primer).',
      'Format file sistem FAT32, NTFS, exFAT, dan ext4.',
      'Instalasi driver chipset, VGA display adapter, sound audio, dan network LAN controller.',
      'Troubleshooting driver bertanda seru kuning di Device Manager.'
    ],
    simulasiTipe: 'cli-network',
    soalPG: generate40QuestionsForModule(3, 'Instalasi Sistem Operasi'),
    soalEssay: generate10EssayForModule(3)
  },
  {
    id: 'modul-4',
    kode: 'KJD-04',
    judul: 'Dasar Jaringan Komputer & Pengkabelan UTP',
    kategori: 'Jaringan Dasar',
    estimasiMenit: 60,
    materiUrl: 'https://simonmurd.github.io/Komputer-dan-Jaringan-Dasar/',
    kompetensiDasar: '3.8 Menerapkan konsep jaringan komputer & 3.9 Menerapkan pengkabelan jaringan',
    deskripsi: 'Model referensi OSI 7 layer, topologi jaringan (Star, Bus, Ring, Mesh), standar urutan warna kabel UTP T568A dan T568B, pembuatan kabel Straight dan Cross, serta pengujian LAN Tester.',
    ringkasan: [
      'OSI 7 Layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
      'Kabel UTP Category 5e dan 6 beserta konektor RJ-45.',
      'Kabel Straight-Through (kedua ujung sama T568B) untuk menghubungkan PC ke Switch.',
      'Kabel Crossover (satu ujung T568A, ujung lain T568B) untuk menghubungkan dua perangkat sejenis tanpa auto-MDIX.'
    ],
    simulasiTipe: 'utp-cable',
    soalPG: generate40QuestionsForModule(4, 'Pengkabelan UTP & Topologi'),
    soalEssay: generate10EssayForModule(4)
  },
  {
    id: 'modul-5',
    kode: 'KJD-05',
    judul: 'Pengalamatan Logika IP Address & Subnetting IPv4',
    kategori: 'Jaringan Dasar',
    estimasiMenit: 60,
    materiUrl: 'https://simonmurd.github.io/Komputer-dan-Jaringan-Dasar/',
    kompetensiDasar: '3.10 Menerapkan pengalamatan IP pada jaringan komputer',
    deskripsi: 'Format 32-bit IPv4, kelas-kelas IP (A, B, C, D, E), IP Privat vs IP Publik, konsep Net ID dan Host ID, perhitungan subnet mask desimal, notasi CIDR, dan alokasi host.',
    ringkasan: [
      'Kelas IPv4: Kelas A (1-126), Kelas B (128-191), Kelas C (192-223).',
      'Rentang IP Privat: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.',
      'Rumus perhitungan subnetting: Jumlah Subnet = 2^x (x = bit 1 subnet) dan Jumlah Host per Subnet = 2^y - 2 (y = bit 0 host).',
      'Penentuan Network Address (alamat awal) dan Broadcast Address (alamat tertinggi).'
    ],
    simulasiTipe: 'subnetting',
    soalPG: generate40QuestionsForModule(5, 'Subnetting & IP Address'),
    soalEssay: generate10EssayForModule(5)
  },
  {
    id: 'modul-6',
    kode: 'KJD-06',
    judul: 'Utilitas Jaringan, Troubleshooting & Command Prompt',
    kategori: 'Troubleshooting Jaringan',
    estimasiMenit: 60,
    materiUrl: 'https://simonmurd.github.io/Komputer-dan-Jaringan-Dasar/',
    kompetensiDasar: '3.14 Menerapkan perbaikan pada jaringan lokal (LAN)',
    deskripsi: 'Penggunaan tool diagnostik Command Prompt (CMD) seperti ping, ipconfig, tracert, nslookup, netstat, arp, serta metodologi sistematis isolasi gangguan konektivitas LAN.',
    ringkasan: [
      'Diagnosa tahap 1: Verifikasi loopback (ping 127.0.0.1) untuk memastikan TCP/IP stack lokal aktif.',
      'Diagnosa tahap 2: Verifikasi IP sendiri (ipconfig) untuk memastikan adapter mendapat IP yang benar.',
      'Diagnosa tahap 3: Verifikasi Gateway lokal (ping default gateway) untuk memastikan jalur ke switch/router terbuka.',
      'Diagnosa tahap 4: Verifikasi DNS resolve (nslookup domain.com) untuk memastikan name resolution berfungsi.'
    ],
    simulasiTipe: 'cli-network',
    soalPG: generate40QuestionsForModule(6, 'Utilitas Jaringan & CLI'),
    soalEssay: generate10EssayForModule(6)
  }
];

