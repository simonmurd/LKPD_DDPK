import React, { useState, useMemo } from 'react';
import { 
  Kelas, 
  Modul, 
  JawabanSiswa, 
  LogAktivitas, 
  SoalPG, 
  SoalEssay 
} from '../../types';
import { DEFAULT_SISWA } from '../../data/defaultData';
import { 
  addKelas, 
  deleteKelas, 
  beriNilaiGuru, 
  updateModul, 
  resetModulToDefault, 
  exportNilaiToExcel, 
  backupDatabaseToJSON, 
  restoreDatabaseFromJSON 
} from '../../services/firestoreService';
import { 
  Users, 
  BookOpen, 
  CheckSquare, 
  BarChart3, 
  Activity, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Edit3, 
  Sliders, 
  Building2,
  AlertTriangle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';

interface Props {
  kelasList: Kelas[];
  modulList: Modul[];
  jawabanList: JawabanSiswa[];
  logList: LogAktivitas[];
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  kelasList,
  modulList,
  jawabanList,
  logList,
  onCloseAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'penilaian' | 'kelas' | 'roster' | 'bank_soal' | 'analitik' | 'logs'>('penilaian');

  // Pusat Penilaian states
  const [selectedSubForGrading, setSelectedSubForGrading] = useState<JawabanSiswa | null>(null);
  const [essayScoreInput, setEssayScoreInput] = useState<number>(85);
  const [catatanInput, setCatatanInput] = useState<string>('Analisis studi kasus sudah sangat baik dan sistematis.');
  const [bobotPG, setBobotPG] = useState<number>(0.7);
  const [bobotEssay, setBobotEssay] = useState<number>(0.3);
  const [filterKelas, setFilterKelas] = useState<string>('Semua');
  const [filterSekolah, setFilterSekolah] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSavingGrade, setIsSavingGrade] = useState<boolean>(false);

  // Kelola Kelas states
  const [newKelasName, setNewKelasName] = useState<string>('');
  const [newSekolahName, setNewSekolahName] = useState<string>('SMK NEGERI 1 SINGKAWANG');
  const [newJurusanName, setNewJurusanName] = useState<string>('Teknik Jaringan Komputer (TJK)');
  const [newTingkatName, setNewTingkatName] = useState<string>('Kelas X');

  // Roster Siswa states
  const [rosterClassFilter, setRosterClassFilter] = useState<string>('Semua');
  const [rosterSearch, setRosterSearch] = useState<string>('');

  // Bank Soal states
  const [selectedModulForEdit, setSelectedModulForEdit] = useState<string>(modulList[0]?.id || 'modul-1');
  const [activeQuestionEditIdx, setActiveQuestionEditIdx] = useState<number>(0);
  const [activeEssayEditIdx, setActiveEssayEditIdx] = useState<number>(0);
  const [isEditingEssay, setIsEditingEssay] = useState<boolean>(false);
  const [perEssayScores, setPerEssayScores] = useState<Record<number, number>>({});

  // Backup & Restore states
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const activeModul = modulList.find(m => m.id === selectedModulForEdit) || modulList[0];

  /* =======================================================================
     GRADING ACTIONS
     ======================================================================= */
  const handleOpenGradingModal = (sub: JawabanSiswa) => {
    setSelectedSubForGrading(sub);
    setEssayScoreInput(sub.nilaiEssay !== null ? sub.nilaiEssay : 80);
    setCatatanInput(sub.catatanGuru || 'Pengerjaan baik, pertahankan pemahaman pada poin K3LH dan jaringan.');

    // Initialize per-essay score inputs (1 to 10)
    const initialScores: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) {
      if (sub.nilaiEssayPerSoal && sub.nilaiEssayPerSoal[i] !== undefined) {
        initialScores[i] = sub.nilaiEssayPerSoal[i];
      } else if (sub.nilaiEssay !== null) {
        initialScores[i] = Math.round(sub.nilaiEssay / 10);
      } else {
        initialScores[i] = 8;
      }
    }
    setPerEssayScores(initialScores);
  };

  const handleUpdatePerEssayScore = (questionNum: number, score: number) => {
    const val = Math.max(0, Math.min(10, score));
    const nextScores = { ...perEssayScores, [questionNum]: val };
    setPerEssayScores(nextScores);
    const sum = Object.values(nextScores).reduce((a, b) => a + b, 0);
    setEssayScoreInput(sum);
  };

  const handleSaveGrade = async () => {
    if (!selectedSubForGrading || !selectedSubForGrading.id) return;
    setIsSavingGrade(true);
    try {
      await beriNilaiGuru(
        selectedSubForGrading.id,
        essayScoreInput,
        catatanInput,
        bobotPG,
        bobotEssay,
        perEssayScores
      );
      confetti({ particleCount: 70, spread: 60 });
      setSelectedSubForGrading(null);
    } catch (err) {
      console.error('Failed to save grade:', err);
    } finally {
      setIsSavingGrade(false);
    }
  };

  /* =======================================================================
     KELAS ACTIONS
     ======================================================================= */
  const handleAddKelas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKelasName.trim()) return;
    try {
      await addKelas(newKelasName, newSekolahName, newJurusanName, newTingkatName);
      setNewKelasName('');
    } catch (err) {
      console.error('Error adding class:', err);
    }
  };

  const handleDeleteKelas = async (id: string, nama: string) => {
    if (confirm(`Yakin ingin menghapus kelas "${nama}"?`)) {
      await deleteKelas(id, nama);
    }
  };

  /* =======================================================================
     SOAL EDIT ACTIONS
     ======================================================================= */
  const handleUpdateCurrentPG = async (updatedSoal: SoalPG) => {
    const nextList = [...activeModul.soalPG];
    nextList[activeQuestionEditIdx] = updatedSoal;
    const updatedModul: Modul = {
      ...activeModul,
      soalPG: nextList
    };
    await updateModul(updatedModul);
  };

  const handleUpdateEssay = async (idx: number, updatedEssay: SoalEssay) => {
    const nextList = [...activeModul.soalEssay];
    nextList[idx] = updatedEssay;
    const updatedModul: Modul = {
      ...activeModul,
      soalEssay: nextList
    };
    await updateModul(updatedModul);
  };

  /* =======================================================================
     BACKUP & RESTORE ACTIONS
     ======================================================================= */
  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      const success = await restoreDatabaseFromJSON(content);
      if (success) {
        setRestoreStatus('✓ Basis data berhasil dipulihkan dari file backup!');
        confetti({ particleCount: 60, spread: 50 });
      } else {
        setRestoreStatus('❌ Gagal memulihkan basis data. Format file tidak sesuai.');
      }
    };
    reader.readAsText(file);
  };

  /* =======================================================================
     EXPORT ROSTER EXCEL
     ======================================================================= */
  const handleExportRosterToExcel = () => {
    const rows = filteredRoster.map((s, idx) => {
      // Find submission status
      const sub = jawabanList.find(j => 
        j.siswaNama.toLowerCase().includes(s.nama.toLowerCase()) &&
        j.siswaKelas === s.kelas
      );

      return {
        'No': idx + 1,
        'Nomor Absen': s.nomorAbsen,
        'Nama Lengkap': s.nama,
        'Kelas': s.kelas,
        'Sekolah': s.sekolah,
        'Status Ujian': sub ? `Sudah Mengerjakan (${sub.modulJudul})` : 'Belum Ujian',
        'Nilai Akhir': sub ? sub.nilaiAkhir : '-'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Siswa KJD');
    XLSX.writeFile(workbook, `Daftar_Siswa_KJD_Singkawang_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  /* =======================================================================
     FILTERED SUBMISSIONS FOR PENILAIAN
     ======================================================================= */
  const filteredSubmissions = jawabanList.filter(item => {
    if (filterKelas !== 'Semua' && item.siswaKelas !== filterKelas) return false;
    if (filterSekolah !== 'Semua' && item.siswaSekolah && item.siswaSekolah !== filterSekolah) return false;
    if (filterStatus !== 'Semua' && item.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.siswaNama.toLowerCase().includes(q) ||
        item.siswaKelas.toLowerCase().includes(q) ||
        item.modulJudul.toLowerCase().includes(q)
      );
    }
    return true;
  });

  /* =======================================================================
     FILTERED ROSTER
     ======================================================================= */
  const filteredRoster = useMemo(() => {
    return DEFAULT_SISWA.filter(s => {
      if (rosterClassFilter !== 'Semua' && s.kelas !== rosterClassFilter) return false;
      if (rosterSearch) {
        const q = rosterSearch.toLowerCase();
        return (
          s.namaTampilan.toLowerCase().includes(q) ||
          s.nama.toLowerCase().includes(q) ||
          s.nomorAbsen.includes(q) ||
          s.sekolah.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rosterClassFilter, rosterSearch]);

  /* =======================================================================
     ANALYTICS CALCULATIONS
     ======================================================================= */
  const totalSubmissions = jawabanList.length;
  const avgFinalScore = totalSubmissions > 0
    ? Math.round(jawabanList.reduce((acc, curr) => acc + curr.nilaiAkhir, 0) / totalSubmissions)
    : 0;
  const passCount = jawabanList.filter(j => j.nilaiAkhir >= 75).length;
  const passRate = totalSubmissions > 0 ? Math.round((passCount / totalSubmissions) * 100) : 0;
  const pendingGradingCount = jawabanList.filter(j => j.status === 'Menunggu Penilaian').length;

  return (
    <div className="space-y-6">
      {/* Admin Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-600 text-white">
              PORTAL GURU
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Dashboard Guru &amp; Pusat Penilaian KJD
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            SMK Negeri 1 Singkawang &amp; SMK Mudita Singkawang &bull; 140 Siswa Terdaftar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportNilaiToExcel(jawabanList, filterKelas)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Ekspor Rekap Nilai (.xlsx)
          </button>

          <button
            onClick={onCloseAdmin}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Tutup Mode Guru
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'penilaian', label: `Pusat Penilaian (${pendingGradingCount} Antrian)`, icon: CheckSquare },
          { id: 'roster', label: `Daftar Rombel Siswa (${DEFAULT_SISWA.length} Siswa)`, icon: Users },
          { id: 'kelas', label: `Kelola Rombel Kelas (${kelasList.length})`, icon: Building2 },
          { id: 'bank_soal', label: 'Bank Soal 40 PG & Essay', icon: BookOpen },
          { id: 'analitik', label: 'Dashboard Analitik', icon: BarChart3 },
          { id: 'logs', label: 'Audit Log & Backup', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PUSAT PENILAIAN */}
      {activeTab === 'penilaian' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama siswa atau modul..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Sekolah:</span>
                <select
                  value={filterSekolah}
                  onChange={(e) => setFilterSekolah(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value="Semua">Semua Sekolah</option>
                  <option value="SMK NEGERI 1 SINGKAWANG">SMKN 1 Singkawang</option>
                  <option value="SMK MUDITA SINGKAWANG">SMK Mudita Singkawang</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Kelas:</span>
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value="Semua">Semua Kelas</option>
                  {kelasList.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Menunggu Penilaian">Menunggu Penilaian</option>
                  <option value="Selesai Dinilai">Selesai Dinilai</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Menampilkan <b>{filteredSubmissions.length}</b> pengumpulan</span>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Siswa</th>
                    <th className="py-3.5 px-4">Rombel &amp; Sekolah</th>
                    <th className="py-3.5 px-4">Modul</th>
                    <th className="py-3.5 px-4 text-center">Skor PG (40)</th>
                    <th className="py-3.5 px-4 text-center">Skor Essay</th>
                    <th className="py-3.5 px-4 text-center">Nilai Akhir</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        Tidak ada berkas evaluasi siswa yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => {
                      const isGraded = sub.status === 'Selesai Dinilai';
                      const isLulus = sub.nilaiAkhir >= 75;

                      return (
                        <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            {sub.siswaNama}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold">
                              {sub.siswaKelas}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-0.5 truncate max-w-[160px]">
                              {sub.siswaSekolah || 'Singkawang'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium max-w-[200px] truncate text-slate-700 dark:text-slate-300">
                            {sub.modulJudul}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                            {sub.nilaiPG} ({sub.jumlahBenarPG}/{sub.totalSoalPG})
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold">
                            {sub.nilaiEssay !== null ? sub.nilaiEssay : (
                              <span className="text-amber-600 font-sans text-[11px]">Belum Dinilai</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`font-mono font-black text-sm ${isLulus ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              {sub.nilaiAkhir}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isGraded
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleOpenGradingModal(sub)}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition text-[11px]"
                            >
                              {isGraded ? 'Edit Nilai' : 'Koreksi Essay'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAFTAR ROMBEL SISWA (140 SISWA) */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  placeholder="Cari nama, absen, atau sekolah..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Filter Kelas:</span>
                <select
                  value={rosterClassFilter}
                  onChange={(e) => setRosterClassFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="Semua">Semua Rombel (140 Siswa)</option>
                  <option value="X TJK">SMKN 1 Singkawang - X TJK (33 Siswa)</option>
                  <option value="XI TJK">SMKN 1 Singkawang - XI TJK (35 Siswa)</option>
                  <option value="XI TJKT">SMK Mudita Singkawang - XI TJKT (38 Siswa)</option>
                  <option value="XII TJKT">SMK Mudita Singkawang - XII TJKT (34 Siswa)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleExportRosterToExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" /> Ekspor Roster Excel
            </button>
          </div>

          {/* Roster Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4 w-16">No</th>
                    <th className="py-3.5 px-4 w-20">Absen</th>
                    <th className="py-3.5 px-4">Nama Siswa</th>
                    <th className="py-3.5 px-4">Kelas</th>
                    <th className="py-3.5 px-4">Sekolah</th>
                    <th className="py-3.5 px-4 text-center">Status Ujian KJD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRoster.map((s, idx) => {
                    const sub = jawabanList.find(j => 
                      j.siswaNama.toLowerCase().includes(s.nama.toLowerCase()) &&
                      j.siswaKelas === s.kelas
                    );

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{s.nomorAbsen}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{s.nama}</td>
                        <td className="py-3 px-4 font-mono font-semibold">{s.kelas}</td>
                        <td className="py-3 px-4 text-slate-500">{s.sekolah}</td>
                        <td className="py-3 px-4 text-center">
                          {sub ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              Sudah Tes (Nilai: {sub.nilaiAkhir})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400">
                              Belum Mengikuti Ujian
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KELOLA KELAS */}
      {activeTab === 'kelas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Class Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs h-fit">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">
              Tambah Rombel Kelas Baru
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nama kelas yang ditambahkan di sini akan langsung muncul pada pilihan dropdown (Combo Box) login siswa di Firestore.
            </p>

            <form onSubmit={handleAddKelas} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sekolah Asal
                </label>
                <select
                  value={newSekolahName}
                  onChange={(e) => setNewSekolahName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="SMK NEGERI 1 SINGKAWANG">SMK NEGERI 1 SINGKAWANG</option>
                  <option value="SMK MUDITA SINGKAWANG">SMK MUDITA SINGKAWANG</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Kelas (contoh: X TJK 2, XII TJKT)
                </label>
                <input
                  type="text"
                  required
                  value={newKelasName}
                  onChange={(e) => setNewKelasName(e.target.value)}
                  placeholder="X TJK 2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tingkat
                  </label>
                  <select
                    value={newTingkatName}
                    onChange={(e) => setNewTingkatName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Kelas X">Kelas X</option>
                    <option value="Kelas XI">Kelas XI</option>
                    <option value="Kelas XII">Kelas XII</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jurusan
                  </label>
                  <input
                    type="text"
                    value={newJurusanName}
                    onChange={(e) => setNewJurusanName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Simpan Kelas ke Firestore
              </button>
            </form>
          </div>

          {/* Existing Class List */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
              Daftar Rombel Kelas Aktif ({kelasList.length})
            </h3>

            <div className="space-y-3">
              {kelasList.map((k) => (
                <div
                  key={k.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between transition hover:border-slate-300"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{k.nama}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {k.totalSiswa || 0} Siswa
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {k.sekolah} &bull; {k.jurusan}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteKelas(k.id, k.nama)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    title="Hapus Kelas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BANK SOAL (40 PG + 10 ESSAY PER MODUL) */}
      {activeTab === 'bank_soal' && (
        <div className="space-y-6">
          {/* Module Selector & Preset Reset */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Modul Soal:</span>
              <select
                value={selectedModulForEdit}
                onChange={(e) => {
                  setSelectedModulForEdit(e.target.value);
                  setActiveQuestionEditIdx(0);
                  setActiveEssayEditIdx(0);
                  setIsEditingEssay(false);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              >
                {modulList.map((m) => (
                  <option key={m.id} value={m.id}>{m.kode} - {m.judul}</option>
                ))}
              </select>
            </div>

            <button
              onClick={async () => {
                if (confirm('Muat ulang 40 Soal PG & 10 Soal Essay standar kurikulum KJD ke Firestore?')) {
                  await resetModulToDefault();
                  alert('Bank Soal KJD (40 PG + 10 Essay) berhasil direset ke standar kurikulum!');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-xl hover:bg-amber-100 transition border border-amber-200 dark:border-amber-800"
            >
              <RefreshCw className="w-4 h-4" /> Reset ke 40 PG + 10 Essay Standar KJD
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Question List Navigator */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Daftar Butir Soal
                </span>
                <span className="text-xs text-blue-600 font-bold">40 PG + 10 Essay</span>
              </div>

              {/* PG Section */}
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Soal Pilihan Ganda</span>
                <span className="font-mono text-blue-600">40 Butir</span>
              </div>
              <div className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto pr-1 mb-4">
                {activeModul.soalPG.map((soal, idx) => (
                  <button
                    key={soal.id}
                    onClick={() => {
                      setActiveQuestionEditIdx(idx);
                      setIsEditingEssay(false);
                    }}
                    className={`h-9 rounded-lg text-xs font-mono font-bold transition border ${
                      !isEditingEssay && activeQuestionEditIdx === idx
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>

              {/* Essay Section */}
              <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Soal Essay Kasus</span>
                <span className="font-mono">10 Butir</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {(activeModul.soalEssay || []).map((essay, idx) => (
                  <button
                    key={essay.id || idx}
                    onClick={() => {
                      setActiveEssayEditIdx(idx);
                      setIsEditingEssay(true);
                    }}
                    className={`h-9 rounded-lg text-xs font-mono font-bold transition border ${
                      isEditingEssay && activeEssayEditIdx === idx
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900'
                    }`}
                  >
                    E{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor Form */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
              {!isEditingEssay ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Edit Butir Soal PG Nomor {activeQuestionEditIdx + 1}
                    </h4>
                    <span className="text-xs px-2.5 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                      Kunci: {activeModul.soalPG[activeQuestionEditIdx]?.kunci}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Pertanyaan Soal
                    </label>
                    <textarea
                      rows={3}
                      value={activeModul.soalPG[activeQuestionEditIdx]?.pertanyaan || ''}
                      onChange={(e) => {
                        const copy = { ...activeModul.soalPG[activeQuestionEditIdx], pertanyaan: e.target.value };
                        handleUpdateCurrentPG(copy);
                      }}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Options A - E */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pilihan Jawaban (A - E) &amp; Kunci:
                    </label>
                    {(['A', 'B', 'C', 'D', 'E'] as const).map((opt) => (
                      <div key={opt} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const copy = { ...activeModul.soalPG[activeQuestionEditIdx], kunci: opt };
                            handleUpdateCurrentPG(copy);
                          }}
                          className={`w-8 h-8 rounded-lg font-bold text-xs shrink-0 transition ${
                            activeModul.soalPG[activeQuestionEditIdx]?.kunci === opt
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={`Jadikan ${opt} sebagai Kunci Jawaban`}
                        >
                          {opt}
                        </button>
                        <input
                          type="text"
                          value={activeModul.soalPG[activeQuestionEditIdx]?.pilihan[opt] || ''}
                          onChange={(e) => {
                            const currentPilihan = { ...activeModul.soalPG[activeQuestionEditIdx].pilihan, [opt]: e.target.value };
                            const copy = { ...activeModul.soalPG[activeQuestionEditIdx], pilihan: currentPilihan };
                            handleUpdateCurrentPG(copy);
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Penjelasan / Pembahasan Soal
                    </label>
                    <input
                      type="text"
                      value={activeModul.soalPG[activeQuestionEditIdx]?.penjelasan || ''}
                      onChange={(e) => {
                        const copy = { ...activeModul.soalPG[activeQuestionEditIdx], penjelasan: e.target.value };
                        handleUpdateCurrentPG(copy);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Edit Butir Soal Essay Nomor {activeEssayEditIdx + 1} (Bobot 10 Poin)
                    </h4>
                    <span className="text-xs px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold font-mono">
                      Essay #{activeEssayEditIdx + 1} dari 10
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Deskripsi / Pertanyaan Soal Essay #{activeEssayEditIdx + 1}
                    </label>
                    <textarea
                      rows={5}
                      value={activeModul.soalEssay?.[activeEssayEditIdx]?.pertanyaan || ''}
                      onChange={(e) => {
                        const targetEssay = activeModul.soalEssay[activeEssayEditIdx];
                        if (targetEssay) {
                          handleUpdateEssay(activeEssayEditIdx, { ...targetEssay, pertanyaan: e.target.value });
                        }
                      }}
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Rubrik / Panduan Penilaian Guru (Kriteria &amp; Jawaban Ideal)
                    </label>
                    <textarea
                      rows={3}
                      value={activeModul.soalEssay?.[activeEssayEditIdx]?.panduanPenilaian || ''}
                      onChange={(e) => {
                        const targetEssay = activeModul.soalEssay[activeEssayEditIdx];
                        if (targetEssay) {
                          handleUpdateEssay(activeEssayEditIdx, { ...targetEssay, panduanPenilaian: e.target.value });
                        }
                      }}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANALITIK VISUAL */}
      {activeTab === 'analitik' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500">Total Pengumpulan</span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {totalSubmissions}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500">Rata-rata Nilai Siswa</span>
              <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
                {avgFinalScore} / 100
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500">Kelulusan KKM (&ge;75)</span>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {passRate}%
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500">Antrian Essay Guru</span>
              <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
                {pendingGradingCount}
              </div>
            </div>
          </div>

          {/* Breakdown per Class Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Performa Rata-rata Nilai Per Rombel Kelas
            </h3>

            <div className="space-y-4">
              {kelasList.map((k) => {
                const subsInClass = jawabanList.filter(j => j.siswaKelas === k.nama);
                const classAvg = subsInClass.length > 0
                  ? Math.round(subsInClass.reduce((a, b) => a + b.nilaiAkhir, 0) / subsInClass.length)
                  : 0;

                return (
                  <div key={k.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-800 dark:text-slate-200">
                        {k.sekolah} &bull; {k.nama} ({subsInClass.length} dari {k.totalSiswa || 0} siswa sudah tes)
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono">{classAvg} / 100</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          classAvg >= 75 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, classAvg)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS & BACKUP RESTORE */}
      {activeTab === 'logs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Logs */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Sistem Log Aktivitas Pengguna Real-Time ({logList.length})
            </h3>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
              {logList.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">Belum ada riwayat aktivitas yang tercatat.</div>
              ) : (
                logList.map((log, idx) => (
                  <div
                    key={log.id || idx}
                    className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs flex items-start gap-3"
                  >
                    <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-800 dark:text-white">{log.pelaku}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{log.deskripsi}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Backup & Restore Panel */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5 h-fit">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Pencadangan Basis Data
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Simpan cadangan lokal seluruh kelas, modul, bank soal, dan jawaban siswa ke berkas JSON.
              </p>
              <button
                onClick={backupDatabaseToJSON}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Unduh Cadangan JSON
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Pemulihan (Restore) Data
              </h4>
              <label className="block w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-center cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300 transition">
                <Upload className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                Pilih Berkas JSON Backup
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileRestore}
                  className="hidden"
                />
              </label>
              {restoreStatus && (
                <p className="text-xs font-semibold mt-2 text-emerald-600">{restoreStatus}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GRADING MODAL (10 SOAL ESSAY) */}
      {selectedSubForGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[94vh] flex flex-col justify-between">
            <div className="overflow-y-auto pr-2 space-y-5">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Koreksi Penilaian Guru &bull; 10 Soal Essay
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {selectedSubForGrading.siswaNama} &bull; {selectedSubForGrading.siswaKelas}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedSubForGrading.modulJudul}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Skor PG (40 Soal):</div>
                  <div className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">
                    {selectedSubForGrading.nilaiPG} / 100
                  </div>
                </div>
              </div>

              {/* 10 Essay Grading List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Rincian Jawaban Siswa &amp; Skor Per Butir (10 Essay):
                  </label>
                  <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                    Total Essay: {essayScoreInput} / 100 Poin
                  </span>
                </div>

                <div className="space-y-3 max-h-[46vh] overflow-y-auto pr-1">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                    const gradedMod = modulList.find(m => m.id === selectedSubForGrading.modulId);
                    const essayDef = gradedMod?.soalEssay?.[num - 1];
                    const answer = typeof selectedSubForGrading.jawabanEssay === 'object' && selectedSubForGrading.jawabanEssay !== null
                      ? (selectedSubForGrading.jawabanEssay as Record<number, string>)[num]
                      : (num === 1 ? (selectedSubForGrading.jawabanEssay as string) : '');
                    const currentScore = perEssayScores[num] ?? 0;

                    return (
                      <div
                        key={num}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                              Essay #{num}
                            </span>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1">
                              {essayDef?.pertanyaan || `Soal Uraian Kasus #${num}`}
                            </p>
                            {essayDef?.panduanPenilaian && (
                              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-lg border border-amber-200 dark:border-amber-900/60">
                                <b>Rubrik Penilaian:</b> {essayDef.panduanPenilaian}
                              </p>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                              Nilai (0-10)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={currentScore}
                              onChange={(e) => handleUpdatePerEssayScore(num, parseInt(e.target.value, 10) || 0)}
                              className="w-16 px-2 py-1 text-center font-mono font-bold text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Jawaban Siswa:
                          </div>
                          <div className="mt-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                            {answer || <span className="italic text-slate-400">(Siswa tidak mengisi jawaban pada butir ini)</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grading Input Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Nilai Essay (0 - 100 Poin)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={essayScoreInput}
                    onChange={(e) => setEssayScoreInput(Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-base font-bold text-blue-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Otomatis dijumlahkan dari nilai 10 butir essay di atas</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kalkulasi Nilai Akhir (PG 70% + Essay 30%)
                  </label>
                  <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 pt-1">
                    {Math.round((selectedSubForGrading.nilaiPG * bobotPG) + (essayScoreInput * bobotEssay))} / 100
                  </div>
                  <span className="text-[10px] text-slate-400">KKM Kelulusan: 75</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Catatan Pembinaan / Feedback Guru
                  </label>
                  <textarea
                    rows={2}
                    value={catatanInput}
                    onChange={(e) => setCatatanInput(e.target.value)}
                    placeholder="Beri apresiasi atau koreksi untuk dipelajari siswa..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedSubForGrading(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveGrade}
                disabled={isSavingGrade}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
              >
                {isSavingGrade ? 'Menyimpan...' : 'Simpan Nilai Akhir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
