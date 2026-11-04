import {
  db,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from '../firebase';
import { Kelas, Modul, JawabanSiswa, LogAktivitas, PesanDiskusi } from '../types';
import { DEFAULT_KELAS, DEFAULT_MODUL } from '../data/defaultData';
import * as XLSX from 'xlsx';

// Local storage backup keys for offline resilience
const STORAGE_KEYS = {
  KELAS: 'elearning_kjd_kelas_v2',
  MODUL: 'elearning_kjd_modul_v2',
  JAWABAN: 'elearning_kjd_jawaban_v2',
  LOGS: 'elearning_kjd_logs_v2',
  DISKUSI: 'elearning_kjd_diskusi_v2'
};

/* =========================================================================
   KELAS SERVICES
   ========================================================================= */

export async function fetchKelasList(): Promise<Kelas[]> {
  try {
    const colRef = collection(db, 'kelas');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list: Kelas[] = [];
      const legacyDocsToDelete: string[] = [];

      snapshot.forEach((d) => {
        const data = d.data() as Kelas;
        // Check if this class belongs to the user's official classes
        const isOfficial = DEFAULT_KELAS.some(
          k => k.nama.toLowerCase() === (data.nama || '').toLowerCase()
        );
        if (isOfficial) {
          list.push({ ...data, id: d.id });
        } else {
          legacyDocsToDelete.push(d.id);
        }
      });

      // Purge any legacy dummy classes (e.g. old X TKJ 2, X RPL, etc.)
      for (const oldId of legacyDocsToDelete) {
        try {
          await deleteDoc(doc(db, 'kelas', oldId));
        } catch {}
      }

      if (list.length >= DEFAULT_KELAS.length) {
        localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(list));
        return list;
      }
    }

    // Seed official classes to Firestore
    for (const k of DEFAULT_KELAS) {
      await setDoc(doc(db, 'kelas', k.id), {
        id: k.id,
        nama: k.nama,
        sekolah: k.sekolah,
        tingkat: k.tingkat,
        jurusan: k.jurusan,
        totalSiswa: k.totalSiswa || 0,
        createdAt: new Date().toISOString()
      });
    }
    localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(DEFAULT_KELAS));
    return DEFAULT_KELAS;
  } catch (error) {
    console.warn('Firestore fetchKelas failed, using fallback cache:', error);
    localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(DEFAULT_KELAS));
    return DEFAULT_KELAS;
  }
}

export function subscribeKelas(callback: (kelas: Kelas[]) => void): () => void {
  try {
    const colRef = collection(db, 'kelas');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Kelas[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as Kelas;
            // Only keep official classes from the user's data
            const isOfficial = DEFAULT_KELAS.some(
              k => k.nama.toLowerCase() === (data.nama || '').toLowerCase()
            );
            if (isOfficial) {
              list.push({ ...data, id: d.id });
            }
          });

          const result = list.length > 0 ? list : DEFAULT_KELAS;
          localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(result));
          callback(result);
        } else {
          fetchKelasList().then(callback);
        }
      },
      (error) => {
        console.warn('Kelas subscription error:', error);
        callback(DEFAULT_KELAS);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error initiating subscribeKelas:', err);
    callback(DEFAULT_KELAS);
    return () => {};
  }
}

export async function addKelas(
  nama: string,
  sekolah: string = 'SMK NEGERI 1 SINGKAWANG',
  jurusan: string = 'Teknik Jaringan Komputer (TJK)',
  tingkat: string = 'Kelas X'
): Promise<Kelas> {
  const newKelas: Kelas = {
    id: `k-${Date.now()}`,
    nama: nama.trim(),
    sekolah: sekolah.trim(),
    tingkat: tingkat.trim(),
    jurusan: jurusan.trim(),
    totalSiswa: 0,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'kelas', newKelas.id), newKelas);
  } catch (err) {
    console.warn('Firestore addKelas error, saving locally:', err);
  }

  // Update local
  const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.KELAS) || '[]');
  const updated = [...current, newKelas];
  localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(updated));

  await logAktivitas({
    tipe: 'kelas_tambah',
    deskripsi: `Menambahkan kelas baru "${newKelas.nama}" (${newKelas.sekolah})`,
    pelaku: 'Guru KJD',
    role: 'guru',
    timestamp: new Date().toISOString()
  });

  return newKelas;
}

export async function deleteKelas(id: string, namaKelas: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'kelas', id));
  } catch (err) {
    console.warn('Firestore deleteKelas error:', err);
  }

  const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.KELAS) || '[]');
  const updated = current.filter((k: Kelas) => k.id !== id);
  localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(updated));

  await logAktivitas({
    tipe: 'kelas_hapus',
    deskripsi: `Menghapus kelas "${namaKelas}"`,
    pelaku: 'Guru KJD',
    role: 'guru',
    timestamp: new Date().toISOString()
  });
}

/* =========================================================================
   MODUL & BANK SOAL SERVICES
   ========================================================================= */

export async function fetchModulList(): Promise<Modul[]> {
  try {
    const colRef = collection(db, 'modul');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list: Modul[] = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as Modul));
      list.sort((a, b) => a.kode.localeCompare(b.kode));
      localStorage.setItem(STORAGE_KEYS.MODUL, JSON.stringify(list));
      return list;
    } else {
      // Seed default modules
      for (const m of DEFAULT_MODUL) {
        await setDoc(doc(db, 'modul', m.id), m);
      }
      localStorage.setItem(STORAGE_KEYS.MODUL, JSON.stringify(DEFAULT_MODUL));
      return DEFAULT_MODUL;
    }
  } catch (err) {
    console.warn('Firestore fetchModul failed, using default cache:', err);
    const local = localStorage.getItem(STORAGE_KEYS.MODUL);
    return local ? JSON.parse(local) : DEFAULT_MODUL;
  }
}

export function subscribeModul(callback: (modulList: Modul[]) => void): () => void {
  try {
    const colRef = collection(db, 'modul');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Modul[] = [];
          snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as Modul));
          list.sort((a, b) => a.kode.localeCompare(b.kode));
          localStorage.setItem(STORAGE_KEYS.MODUL, JSON.stringify(list));
          callback(list);
        } else {
          fetchModulList().then(callback);
        }
      },
      (error) => {
        console.warn('Modul subscription error:', error);
        fetchModulList().then(callback);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error in subscribeModul:', err);
    fetchModulList().then(callback);
    return () => {};
  }
}

export async function updateModul(modul: Modul): Promise<void> {
  try {
    await setDoc(doc(db, 'modul', modul.id), modul);
  } catch (err) {
    console.warn('Firestore updateModul error, saving to local state:', err);
  }

  const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.MODUL) || JSON.stringify(DEFAULT_MODUL));
  const updated = current.map((m: Modul) => (m.id === modul.id ? modul : m));
  localStorage.setItem(STORAGE_KEYS.MODUL, JSON.stringify(updated));

  await logAktivitas({
    tipe: 'soal_update',
    deskripsi: `Memperbarui bank soal pada modul "${modul.judul}"`,
    pelaku: 'Guru KJD',
    role: 'guru',
    timestamp: new Date().toISOString()
  });
}

export async function resetModulToDefault(): Promise<Modul[]> {
  try {
    for (const m of DEFAULT_MODUL) {
      await setDoc(doc(db, 'modul', m.id), m);
    }
  } catch (err) {
    console.warn('Reset modul to firestore error:', err);
  }
  localStorage.setItem(STORAGE_KEYS.MODUL, JSON.stringify(DEFAULT_MODUL));
  return DEFAULT_MODUL;
}

/* =========================================================================
   JAWABAN SISWA & EVALUASI
   ========================================================================= */

export async function submitJawabanSiswa(data: Omit<JawabanSiswa, 'id'>): Promise<string> {
  let docId = `ans-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  try {
    const colRef = collection(db, 'jawaban_siswa');
    const docRef = await addDoc(colRef, {
      ...data,
      serverTime: new Date().toISOString()
    });
    docId = docRef.id;
  } catch (err) {
    console.warn('Firestore submitJawaban error, saving to local store:', err);
  }

  // Update local cache
  const record: JawabanSiswa = { ...data, id: docId };
  const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.JAWABAN) || '[]');
  current.unshift(record);
  localStorage.setItem(STORAGE_KEYS.JAWABAN, JSON.stringify(current));

  await logAktivitas({
    tipe: 'ujian_selesai',
    deskripsi: `Siswa "${data.siswaNama}" (${data.siswaKelas}) menyelesaikan evaluasi ${data.modulJudul} (Skor PG: ${data.nilaiPG})`,
    pelaku: data.siswaNama,
    role: 'siswa',
    timestamp: new Date().toISOString()
  });

  return docId;
}

export function subscribeJawabanSiswa(callback: (list: JawabanSiswa[]) => void): () => void {
  try {
    const colRef = collection(db, 'jawaban_siswa');
    const q = query(colRef);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: JawabanSiswa[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as JawabanSiswa);
        });
        // Sort descending by submittedAt
        list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        localStorage.setItem(STORAGE_KEYS.JAWABAN, JSON.stringify(list));
        callback(list);
      },
      (error) => {
        console.warn('Subscription error for jawaban_siswa:', error);
        const local = localStorage.getItem(STORAGE_KEYS.JAWABAN);
        callback(local ? JSON.parse(local) : []);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error in subscribeJawabanSiswa:', err);
    const local = localStorage.getItem(STORAGE_KEYS.JAWABAN);
    callback(local ? JSON.parse(local) : []);
    return () => {};
  }
}

export async function beriNilaiGuru(
  submissionId: string,
  nilaiEssay: number,
  catatanGuru: string,
  bobotPG: number = 0.7,
  bobotEssay: number = 0.3,
  nilaiEssayPerSoal?: Record<number, number>
): Promise<void> {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.JAWABAN) || '[]');
  const sub = current.find((s: JawabanSiswa) => s.id === submissionId);
  const pgScore = sub ? sub.nilaiPG : 0;
  
  // Calculate composite score
  const nilaiAkhir = Math.round((pgScore * bobotPG) + (nilaiEssay * bobotEssay));
  const updateData: Record<string, any> = {
    nilaiEssay,
    nilaiAkhir,
    catatanGuru: catatanGuru.trim(),
    status: 'Selesai Dinilai' as const,
    dinilaiOleh: 'Guru KJD',
    dinilaiPada: new Date().toISOString()
  };

  if (nilaiEssayPerSoal) {
    updateData.nilaiEssayPerSoal = nilaiEssayPerSoal;
  }

  try {
    const docRef = doc(db, 'jawaban_siswa', submissionId);
    await updateDoc(docRef, updateData);
  } catch (err) {
    console.warn('Firestore update beriNilaiGuru error:', err);
  }

  // Update local
  const updated = current.map((item: JawabanSiswa) => {
    if (item.id === submissionId) {
      return { ...item, ...updateData };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEYS.JAWABAN, JSON.stringify(updated));

  await logAktivitas({
    tipe: 'penilaian_guru',
    deskripsi: `Memberikan nilai Essay (${nilaiEssay}) untuk ${sub?.siswaNama || 'Siswa'} - Nilai Akhir: ${nilaiAkhir}`,
    pelaku: 'Guru KJD',
    role: 'guru',
    timestamp: new Date().toISOString()
  });
}

/* =========================================================================
   LOG AKTIVITAS & NOTIFIKASI
   ========================================================================= */

export async function logAktivitas(log: LogAktivitas): Promise<void> {
  try {
    const colRef = collection(db, 'log_aktivitas');
    await addDoc(colRef, log);
  } catch {
    // Silently continue for offline
  }

  const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
  current.unshift({ ...log, id: `log-${Date.now()}` });
  if (current.length > 100) current.pop(); // keep last 100
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(current));
}

export function subscribeLogAktivitas(callback: (logs: LogAktivitas[]) => void): () => void {
  try {
    const colRef = collection(db, 'log_aktivitas');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: LogAktivitas[] = [];
        snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as LogAktivitas));
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(list));
        callback(list);
      },
      () => {
        const local = localStorage.getItem(STORAGE_KEYS.LOGS);
        callback(local ? JSON.parse(local) : []);
      }
    );
    return unsubscribe;
  } catch {
    const local = localStorage.getItem(STORAGE_KEYS.LOGS);
    callback(local ? JSON.parse(local) : []);
    return () => {};
  }
}

/* =========================================================================
   FORUM DISKUSI KELAS INTERAKTIF
   ========================================================================= */

export function subscribeDiskusi(callback: (messages: PesanDiskusi[]) => void): () => void {
  try {
    const colRef = collection(db, 'diskusi');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: PesanDiskusi[] = [];
        snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as PesanDiskusi));
        list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        localStorage.setItem(STORAGE_KEYS.DISKUSI, JSON.stringify(list));
        callback(list);
      },
      () => {
        const local = localStorage.getItem(STORAGE_KEYS.DISKUSI);
        callback(local ? JSON.parse(local) : []);
      }
    );
    return unsubscribe;
  } catch {
    const local = localStorage.getItem(STORAGE_KEYS.DISKUSI);
    callback(local ? JSON.parse(local) : []);
    return () => {};
  }
}

export async function kirimPesanDiskusi(pesan: Omit<PesanDiskusi, 'id'>): Promise<void> {
  try {
    const colRef = collection(db, 'diskusi');
    await addDoc(colRef, pesan);
  } catch (err) {
    console.warn('Send discussion message to firestore error:', err);
  }

  const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.DISKUSI) || '[]');
  current.push({ ...pesan, id: `msg-${Date.now()}` });
  localStorage.setItem(STORAGE_KEYS.DISKUSI, JSON.stringify(current));
}

/* =========================================================================
   EXPORT EXCEL & BACKUP FIRESTORE
   ========================================================================= */

export function exportNilaiToExcel(jawabanList: JawabanSiswa[], namaKelasFilter: string = 'Semua Kelas'): void {
  const dataRows = jawabanList.map((item, index) => ({
    'No': index + 1,
    'Nama Siswa': item.siswaNama,
    'Kelas': item.siswaKelas,
    'Modul Pembelajaran': item.modulJudul,
    'Benar PG': `${item.jumlahBenarPG} / ${item.totalSoalPG}`,
    'Nilai PG (0-100)': item.nilaiPG,
    'Nilai Essay (0-100)': item.nilaiEssay !== null ? item.nilaiEssay : 'Belum Dinilai',
    'Nilai Akhir': item.nilaiAkhir,
    'Status Evaluasi': item.status,
    'Pelanggaran Pindah Tab': item.pelanggaranPindahTab ? `${item.pelanggaranPindahTab}x Peringatan` : '0x (Tertib)',
    'Keterangan KKM': item.nilaiAkhir >= 75 ? 'TUNTAS' : 'REMEDIAL',
    'Catatan Guru': item.catatanGuru || '-',
    'Tanggal Pengumpulan': new Date(item.submittedAt).toLocaleString('id-ID')
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekapitulasi Nilai KJD');

  // Auto column width
  const colWidths = [
    { wch: 5 }, { wch: 25 }, { wch: 12 }, { wch: 35 },
    { wch: 12 }, { wch: 15 }, { wch: 18 }, { wch: 12 },
    { wch: 20 }, { wch: 14 }, { wch: 30 }, { wch: 22 }
  ];
  worksheet['!cols'] = colWidths;

  const fileName = `Rekap_Nilai_KJD_${namaKelasFilter.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export async function backupDatabaseToJSON(): Promise<string> {
  const kelas = await fetchKelasList();
  const modul = await fetchModulList();
  const jawaban = JSON.parse(localStorage.getItem(STORAGE_KEYS.JAWABAN) || '[]');
  const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
  const diskusi = JSON.parse(localStorage.getItem(STORAGE_KEYS.DISKUSI) || '[]');

  const fullBackup = {
    exportedAt: new Date().toISOString(),
    appName: 'E-Learning Komputer & Jaringan Dasar',
    databaseVersion: '2.0',
    data: {
      kelas,
      modul,
      jawaban_siswa: jawaban,
      log_aktivitas: logs,
      diskusi
    }
  };

  const jsonString = JSON.stringify(fullBackup, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Backup_Elearning_KJD_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);

  await logAktivitas({
    tipe: 'backup',
    deskripsi: 'Melakukan pencadangan (backup) seluruh data sistem ke file JSON',
    pelaku: 'Guru KJD',
    role: 'guru',
    timestamp: new Date().toISOString()
  });

  return jsonString;
}

export async function restoreDatabaseFromJSON(jsonContent: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonContent);
    if (!parsed.data) throw new Error('Format file backup tidak valid');

    const { kelas, modul, jawaban_siswa, diskusi } = parsed.data;

    // Restore Kelas
    if (Array.isArray(kelas)) {
      for (const k of kelas) {
        await setDoc(doc(db, 'kelas', k.id), k);
      }
      localStorage.setItem(STORAGE_KEYS.KELAS, JSON.stringify(kelas));
    }

    // Restore Modul
    if (Array.isArray(modul)) {
      for (const m of modul) {
        await setDoc(doc(db, 'modul', m.id), m);
      }
      localStorage.setItem(STORAGE_KEYS.MODUL, JSON.stringify(modul));
    }

    // Restore Jawaban Siswa
    if (Array.isArray(jawaban_siswa)) {
      for (const j of jawaban_siswa) {
        if (j.id) {
          await setDoc(doc(db, 'jawaban_siswa', j.id), j);
        }
      }
      localStorage.setItem(STORAGE_KEYS.JAWABAN, JSON.stringify(jawaban_siswa));
    }

    if (Array.isArray(diskusi)) {
      localStorage.setItem(STORAGE_KEYS.DISKUSI, JSON.stringify(diskusi));
    }

    await logAktivitas({
      tipe: 'backup',
      deskripsi: 'Memulihkan data sistem dari file backup JSON',
      pelaku: 'Guru KJD',
      role: 'guru',
      timestamp: new Date().toISOString()
    });

    return true;
  } catch (err) {
    console.error('Failed to restore backup:', err);
    return false;
  }
}
