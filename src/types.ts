export interface SiswaRoster {
  id: string;
  nomorAbsen: string;
  nama: string;
  namaTampilan: string; // e.g. "01 ALVINO"
  kelas: string;        // e.g. "X TJK"
  sekolah: string;      // e.g. "SMK NEGERI 1 SINGKAWANG"
}

export interface Kelas {
  id: string;
  nama: string;
  sekolah: string;
  tingkat: string;
  jurusan: string;
  totalSiswa?: number;
  createdAt?: string;
}

export interface SoalPG {
  id: number;
  pertanyaan: string;
  pilihan: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  kunci: 'A' | 'B' | 'C' | 'D' | 'E';
  penjelasan?: string;
}

export interface SoalEssay {
  id: number;
  pertanyaan: string;
  panduanPenilaian?: string;
  skorMaksimal: number;
}

export interface Modul {
  id: string;
  kode: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  estimasiMenit: number;
  materiUrl: string; // link to https://simonmurd.github.io/Komputer-dan-Jaringan-Dasar/
  ringkasan: string[];
  kompetensiDasar: string;
  simulasiTipe: 'pc-assembly' | 'bios' | 'utp-cable' | 'subnetting' | 'cli-network';
  soalPG: SoalPG[];
  soalEssay: SoalEssay[];
}

export interface JawabanSiswa {
  id?: string;
  siswaNama: string;
  siswaKelas: string;
  siswaSekolah?: string;
  nomorAbsen?: string;
  modulId: string;
  modulJudul: string;
  jawabanPG: Record<number, string>; // { 1: 'A', 2: 'B', ... }
  jawabanEssay: Record<number, string> | string; // { 1: "uraian 1", 2: "uraian 2", ... 10: "uraian 10" }
  nilaiEssayPerSoal?: Record<number, number>; // { 1: 10, 2: 8, ... }
  jumlahBenarPG: number;
  totalSoalPG: number;
  nilaiPG: number; // 0 - 100
  nilaiEssay: number | null; // 0 - 100 or null if not yet graded
  nilaiAkhir: number; // composite score
  status: 'Menunggu Penilaian' | 'Selesai Dinilai';
  catatanGuru?: string;
  dinilaiOleh?: string;
  dinilaiPada?: string;
  submittedAt: string;
  durasiPengerjaanDetik?: number;
}

export interface LogAktivitas {
  id?: string;
  tipe: 'login' | 'ujian_mulai' | 'ujian_selesai' | 'penilaian_guru' | 'kelas_tambah' | 'kelas_hapus' | 'soal_update' | 'backup';
  deskripsi: string;
  pelaku: string;
  role: 'siswa' | 'guru';
  timestamp: string;
}

export interface PesanDiskusi {
  id?: string;
  pengirim: string;
  role: 'siswa' | 'guru';
  kelas: string;
  sekolah?: string;
  pesan: string;
  modulTerkait?: string;
  timestamp: string;
  suka: number;
}

export interface KalenderAkademik {
  id: string;
  judul: string;
  tanggal: string; // YYYY-MM-DD
  waktu: string;
  kategori: 'Ujian' | 'Praktikum' | 'Tugas' | 'Libur';
  deskripsi: string;
  modulId?: string;
}

export interface UserSession {
  nama: string;
  kelas: string;
  sekolah: string;
  nomorAbsen?: string;
  role: 'siswa' | 'guru';
}
