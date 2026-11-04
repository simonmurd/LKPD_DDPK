import React, { useState, useMemo } from 'react';
import { Kelas, UserSession, SiswaRoster } from '../types';
import { DEFAULT_SISWA } from '../data/defaultData';
import { logAktivitas } from '../services/firestoreService';
import { 
  GraduationCap, 
  User, 
  Building2, 
  Shield, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface Props {
  kelasList: Kelas[];
  onLoginSiswa: (session: UserSession) => void;
  onOpenAdminLogin: () => void;
}

export const LoginModal: React.FC<Props> = ({ kelasList, onLoginSiswa, onOpenAdminLogin }) => {
  // Only use the classes that exist in DEFAULT_SISWA
  const validClasses = useMemo(() => {
    return kelasList.filter(k => 
      DEFAULT_SISWA.some(s => s.kelas.toLowerCase() === k.nama.toLowerCase())
    );
  }, [kelasList]);

  const [selectedKelasId, setSelectedKelasId] = useState<string>(
    validClasses[0]?.id || 'k-smkn1-x-tjk'
  );

  const activeKelas = validClasses.find(k => k.id === selectedKelasId) || validClasses[0];

  // Get only the exact students belonging to this chosen class from the user's data
  const classStudents = useMemo(() => {
    if (!activeKelas) return [];
    return DEFAULT_SISWA.filter(s => {
      const matchSchool = !s.sekolah || s.sekolah.toLowerCase() === (activeKelas.sekolah || '').toLowerCase();
      const matchClass = s.kelas.toLowerCase() === activeKelas.nama.toLowerCase();
      return matchSchool && matchClass;
    });
  }, [activeKelas]);

  // Selected student id in the combo box
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const selectedStudent = useMemo(() => {
    return classStudents.find(s => s.id === selectedStudentId) || null;
  }, [classStudents, selectedStudentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !activeKelas) return;

    const session: UserSession = {
      nama: selectedStudent.namaTampilan, // e.g. "01 ALVINO"
      kelas: activeKelas.nama,
      sekolah: activeKelas.sekolah,
      nomorAbsen: selectedStudent.nomorAbsen,
      role: 'siswa'
    };

    localStorage.setItem('elearning_kjd_user', JSON.stringify(session));

    await logAktivitas({
      tipe: 'login',
      deskripsi: `Siswa "${session.nama}" (${session.kelas} - ${session.sekolah}) masuk ke sistem`,
      pelaku: session.nama,
      role: 'siswa',
      timestamp: new Date().toISOString()
    });

    onLoginSiswa(session);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Gradient Accent */}
        <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"></div>

        {/* Brand Icon & Heading */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            E-Learning KJD
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Komputer &amp; Jaringan Dasar &bull; Portal Siswa
          </p>
        </div>

        {/* Student Login Form with ONLY COMBO BOXES */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Combo Box 1: Sekolah & Rombel Kelas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>PILIH SEKOLAH &amp; ROMBEL KELAS</span>
            </label>
            <select
              value={selectedKelasId}
              onChange={(e) => {
                setSelectedKelasId(e.target.value);
                setSelectedStudentId('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              {validClasses.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.sekolah} - {k.nama} ({k.totalSiswa || classStudents.length} Siswa)
                </option>
              ))}
            </select>
          </div>

          {/* Combo Box 2: Nama Siswa */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>PILIH NAMA SISWA ({classStudents.length} TERDAFTAR)</span>
            </label>
            <select
              required
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              <option value="">-- Pilih Nama Siswa ({classStudents.length} Siswa) --</option>
              {classStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.namaTampilan}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Preview Badge */}
          {selectedStudent && (
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Absen <b>{selectedStudent.nomorAbsen}</b> &bull; <b>{selectedStudent.nama}</b></span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-800 font-bold">
                {activeKelas?.nama}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedStudent}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Masuk ke Kelas KJD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Admin Link */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={onOpenAdminLogin}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold transition"
          >
            <Shield className="w-3.5 h-3.5" /> Portal Guru / Pengajar
          </button>
        </div>
      </div>
    </div>
  );
};
