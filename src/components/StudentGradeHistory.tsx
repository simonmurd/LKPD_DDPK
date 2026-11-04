import React, { useState } from 'react';
import { JawabanSiswa, UserSession } from '../types';
import { Award, Clock, CheckCircle2, AlertCircle, FileText, Printer, MessageSquare } from 'lucide-react';

interface Props {
  user: UserSession;
  submissions: JawabanSiswa[];
}

export const StudentGradeHistory: React.FC<Props> = ({ user, submissions }) => {
  const [selectedSub, setSelectedSub] = useState<JawabanSiswa | null>(null);

  // Filter submissions for this student
  const mySubmissions = submissions.filter(
    s => s.siswaNama.trim().toLowerCase() === user.nama.trim().toLowerCase() &&
         s.siswaKelas === user.kelas
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            Riwayat Evaluasi &amp; Lembar Penilaian
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau hasil evaluasi modul KJD, koreksi nilai essay, dan catatan pembinaan dari guru.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Total Ujian Diikuti:</span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs">
            {mySubmissions.length} Modul
          </span>
        </div>
      </div>

      {mySubmissions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Belum Ada Riwayat Ujian</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Anda belum mengerjakan evaluasi modul KJD. Silakan buka tab Materi dan klik tombol "Mulai Evaluasi" pada modul yang ingin diuji.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mySubmissions.map((sub) => {
            const isGraded = sub.status === 'Selesai Dinilai';
            const isLulus = sub.nilaiAkhir >= 75;

            return (
              <div
                key={sub.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      isGraded
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {sub.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(sub.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-4">
                    {sub.modulJudul}
                  </h4>

                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 space-y-2 text-xs mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nilai PG (40 Soal):</span>
                      <span className="font-bold text-slate-800 dark:text-white font-mono">{sub.nilaiPG} / 100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nilai Essay Guru:</span>
                      <span className="font-bold font-mono">
                        {sub.nilaiEssay !== null ? `${sub.nilaiEssay} / 100` : <span className="text-amber-600 font-sans">Belum Dinilai</span>}
                      </span>
                    </div>
                    {sub.pelanggaranPindahTab && sub.pelanggaranPindahTab > 0 ? (
                      <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                        <span>Peringatan Pindah Tab:</span>
                        <span>{sub.pelanggaranPindahTab}x Terdeteksi</span>
                      </div>
                    ) : null}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Nilai Akhir:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-black font-mono text-blue-600 dark:text-blue-400">
                          {sub.nilaiAkhir}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isLulus
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {isLulus ? 'TUNTAS' : 'REMEDIAL'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {sub.catatanGuru && (
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 mb-4 flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                      <div>
                        <span className="font-bold block">Catatan Guru:</span>
                        <p className="mt-0.5 italic">{sub.catatanGuru}</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedSub(sub)}
                  className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
                >
                  Lihat Rincian Jawaban
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Submission Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col justify-between">
            <div className="overflow-y-auto pr-2 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Rincian Evaluasi Siswa
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {selectedSub.modulJudul}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dikumpulkan: {new Date(selectedSub.submittedAt).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                    {selectedSub.nilaiAkhir}
                  </div>
                  <span className="text-[10px] text-slate-400">Nilai Akhir (KKM 75)</span>
                </div>
              </div>

              {/* Essay Content */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Jawaban Uraian / Essay Anda (10 Soal Essay):
                </h4>
                {typeof selectedSub.jawabanEssay === 'object' && selectedSub.jawabanEssay !== null ? (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                      const answer = (selectedSub.jawabanEssay as Record<number, string>)[num];
                      const score = selectedSub.nilaiEssayPerSoal?.[num];
                      return (
                        <div
                          key={num}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-mono text-[10px]">
                                E{num}
                              </span>
                              <span>Soal Essay #{num}</span>
                            </span>
                            {score !== undefined && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                                Nilai: {score} / 10
                              </span>
                            )}
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200 pl-6">
                            {answer || <span className="italic text-slate-400">(Tidak diisi)</span>}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedSub.jawabanEssay || '(Tidak ada jawaban essay)'}
                  </div>
                )}
              </div>

              {/* Grading Status */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Skor Pilihan Ganda (40 Soal):</span>
                  <span className="font-bold">{selectedSub.nilaiPG} / 100 ({selectedSub.jumlahBenarPG} benar)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Skor Essay Guru:</span>
                  <span className="font-bold">{selectedSub.nilaiEssay !== null ? `${selectedSub.nilaiEssay} / 100` : 'Menunggu Penilaian'}</span>
                </div>
                {selectedSub.catatanGuru && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Catatan Feedback Guru:</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 italic">{selectedSub.catatanGuru}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                <Printer className="w-4 h-4" /> Cetak Lembar Hasil
              </button>

              <button
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
