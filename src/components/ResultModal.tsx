import React from 'react';
import { JawabanSiswa } from '../types';
import { CheckCircle2, Clock, Award, BookOpen, RotateCcw, ShieldCheck } from 'lucide-react';

interface Props {
  result: JawabanSiswa;
  onClose: () => void;
  onOpenSimulasi: () => void;
}

export const ResultModal: React.FC<Props> = ({ result, onClose, onOpenSimulasi }) => {
  const isLulus = result.nilaiPG >= 75;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        {/* Badge Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
          <Award className="w-8 h-8" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Evaluasi Berhasil Dikumpulkan!
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
          Jawaban Anda telah tersimpan aman di basis data Firestore sekolah.
        </p>

        {/* Score Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 mb-6 text-left space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Nama / Kelas:</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{result.siswaNama} ({result.siswaKelas})</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Modul:</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{result.modulJudul}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Benar Pilihan Ganda:</span>
            <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
              {result.jumlahBenarPG} dari {result.totalSoalPG} Soal
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Nilai PG Otomatis (Bobot 70%):</span>
            <span className={`text-base font-black font-mono ${isLulus ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {result.nilaiPG} / 100
            </span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Penilaian Soal Essay:</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Menunggu Penilaian Guru
            </span>
          </div>
        </div>

        {/* Info Note */}
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 text-left mb-6 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <b>Informasi Penilaian Akhir:</b> Guru akan mengoreksi uraian essay Anda melalui Dashboard Penilaian. Nilai akhir gabungan (PG + Essay) akan otomatis diperbarui dan dapat Anda pantau di tab <b>"Riwayat Nilai"</b>.
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenSimulasi}
            className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" /> Buka Simulasi Lab
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
