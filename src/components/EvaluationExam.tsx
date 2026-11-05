import React, { useState, useEffect, useRef } from 'react';
import { Modul, UserSession, JawabanSiswa } from '../types';
import { submitJawabanSiswa } from '../services/firestoreService';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Flag, 
  Send, 
  HelpCircle, 
  FileText, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  modul: Modul;
  user: UserSession;
  onFinish: (result: JawabanSiswa) => void;
  onCancel: () => void;
}

// Suara peringatan synthesizer Web Audio API (tanpa file eksternal)
function playWarningAlarm() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Bunyi alarm 2 nada (E5 -> A5)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
    
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Abaikan jika browser membatasi autoplay audio
  }
}

export const EvaluationExam: React.FC<Props> = ({ modul, user, onFinish, onCancel }) => {
  // 40 PG + 10 Essay = 50 items
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(modul.estimasiMenit * 60 || 3600); // in seconds
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Anti-Cheat: Pelanggaran Pindah Tab / Jendela
  const MAX_ALLOWED_VIOLATIONS = 3;
  const [violationCount, setViolationCount] = useState<number>(0);
  const [showTabWarningModal, setShowTabWarningModal] = useState<boolean>(false);
  const lastViolationTimeRef = useRef<number>(0);
  const violationCountRef = useRef<number>(0);
  violationCountRef.current = violationCount;

  // Deteksi Berpindah Tab atau Membuka Jendela Lain
  useEffect(() => {
    if (isSubmitting) return;

    const recordTabViolation = () => {
      const now = Date.now();
      // Debounce 1.5 detik agar event visibilitychange & blur tidak terhitung ganda
      if (now - lastViolationTimeRef.current < 1500) return;
      lastViolationTimeRef.current = now;

      const nextViolation = violationCountRef.current + 1;
      setViolationCount(nextViolation);
      setShowTabWarningModal(true);
      playWarningAlarm();

      // Jika pelanggaran mencapai batas maksimal (3x), kumpulkan ujian paksa
      if (nextViolation >= MAX_ALLOWED_VIOLATIONS) {
        setTimeout(() => {
          handleSubmitFinal(nextViolation);
        }, 2500);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordTabViolation();
      }
    };

    const handleWindowBlur = () => {
      recordTabViolation();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isSubmitting]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitFinal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const soalPGList = modul.soalPG || [];
  const soalEssayList = modul.soalEssay || [];

  const totalEssay = soalEssayList.length || 10;
  const totalQuestions = soalPGList.length + totalEssay; // 40 + 10 = 50
  const answeredEssayCount = Object.values(essayAnswers).filter(a => a && a.trim().length > 0).length;
  const answeredCount = Object.keys(selectedAnswers).length + answeredEssayCount;

  const isCurrentEssay = currentIdx >= soalPGList.length;
  const currentPGQuestion = !isCurrentEssay ? soalPGList[currentIdx] : null;

  const currentEssayIdx = isCurrentEssay ? currentIdx - soalPGList.length : 0;
  const currentEssayQuestion = isCurrentEssay ? (soalEssayList[currentEssayIdx] || {
    id: currentEssayIdx + 1,
    pertanyaan: `Soal Essay ${currentEssayIdx + 1}`,
    skorMaksimal: 10
  }) : null;

  const handleSelectOption = (optKey: string) => {
    if (!currentPGQuestion) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentPGQuestion.id]: optKey
    }));
  };

  const handleUpdateEssayAnswer = (val: string) => {
    if (!currentEssayQuestion) return;
    setEssayAnswers(prev => ({
      ...prev,
      [currentEssayQuestion.id]: val
    }));
  };

  const toggleFlag = (idx: number) => {
    setFlagged(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSubmitFinal = async (overrideViolations?: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const recordedViolations = overrideViolations !== undefined ? overrideViolations : violationCount;

    // Calculate score for PG
    let correctCount = 0;
    modul.soalPG.forEach(soal => {
      if (selectedAnswers[soal.id] === soal.kunci) {
        correctCount++;
      }
    });

    const nilaiPG = Math.round((correctCount / modul.soalPG.length) * 100);
    const durasiPengerjaan = (modul.estimasiMenit * 60) - timeLeft;

    const payload: Omit<JawabanSiswa, 'id'> = {
      siswaNama: user.nama,
      siswaKelas: user.kelas,
      siswaSekolah: user.sekolah,
      nomorAbsen: user.nomorAbsen,
      modulId: modul.id,
      modulJudul: modul.judul,
      jawabanPG: selectedAnswers,
      jawabanEssay: essayAnswers, // All 10 essay answers
      jumlahBenarPG: correctCount,
      totalSoalPG: modul.soalPG.length,
      nilaiPG: nilaiPG,
      nilaiEssay: null, // to be manually graded by teacher (10 essays)
      nilaiAkhir: nilaiPG, // temporary score until graded
      status: 'Menunggu Penilaian',
      submittedAt: new Date().toISOString(),
      durasiPengerjaanDetik: Math.max(1, durasiPengerjaan),
      pelanggaranPindahTab: recordedViolations,
      catatanGuru: recordedViolations >= MAX_ALLOWED_VIOLATIONS 
        ? `[DISKRIPSI CBT] Dikumpulkan otomatis karena mencapai batas maksimal ${recordedViolations}x pindah tab!`
        : (recordedViolations > 0 ? `[PERINGATAN CBT] Siswa terdeteksi ${recordedViolations}x pindah tab selama ujian.` : undefined)
    };

    try {
      const docId = await submitJawabanSiswa(payload);
      confetti({ particleCount: 120, spread: 80 });
      onFinish({ ...payload, id: docId });
    } catch (err) {
      console.error('Error submitting exam:', err);
      // Fallback finish
      onFinish({ ...payload, id: `local-${Date.now()}` });
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
      setShowTabWarningModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16">
      {/* Top Sticky Test Bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {modul.kode}
              </span>
              <h2 className="text-base sm:text-lg font-bold truncate max-w-md">
                Evaluasi: {modul.judul}
              </h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Peserta: <span className="font-semibold text-slate-800 dark:text-white">{user.nama}</span> &bull; Kelas: <span className="font-semibold text-slate-800 dark:text-white">{user.kelas}</span> ({user.sekolah})
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Anti-Cheat CBT Status Badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              violationCount === 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : violationCount === 1
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 animate-pulse'
            }`}>
              {violationCount === 0 ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-bounce" />
              )}
              <span>Pindah Tab: <b className="font-mono">{violationCount}</b>/{MAX_ALLOWED_VIOLATIONS}</span>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border shadow-xs ${
              timeLeft < 300
                ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800 animate-pulse'
                : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition"
            >
              <Send className="w-4 h-4" /> Selesai &amp; Kirim
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question Viewer (Left) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[460px] flex flex-col justify-between">
              <div>
                {/* Header Soal */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {isCurrentEssay ? `Soal Essay #${currentEssayIdx + 1} (No. ${currentIdx + 1})` : `Soal Nomor ${currentIdx + 1}`}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                      {isCurrentEssay ? '10 Poin Essay' : 'Pilihan Ganda (A-E)'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFlag(currentIdx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      flagged[currentIdx]
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flagged[currentIdx] ? 'Ditandai Ragu' : 'Tandai Ragu-ragu'}</span>
                  </button>
                </div>

                {/* Question Body */}
                {!isCurrentEssay && currentPGQuestion ? (
                  <div>
                    <h3 className="text-base sm:text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-100 mb-6">
                      {currentPGQuestion.pertanyaan}
                    </h3>

                    {/* Options A - E */}
                    <div className="space-y-3">
                      {(['A', 'B', 'C', 'D', 'E'] as const).map((optKey) => {
                        const optText = currentPGQuestion.pilihan[optKey];
                        const isSelected = selectedAnswers[currentPGQuestion.id] === optKey;

                        return (
                          <div
                            key={optKey}
                            onClick={() => handleSelectOption(optKey)}
                            className={`p-3.5 sm:p-4 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 shadow-xs'
                                : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              {optKey}
                            </span>
                            <span className="text-sm font-normal pt-0.5 leading-relaxed">{optText}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : currentEssayQuestion ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      <FileText className="w-4 h-4" /> Soal Essay {currentEssayIdx + 1} dari 10
                    </div>
                    <h3 className="text-base sm:text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-100 mb-4">
                      {currentEssayQuestion.pertanyaan}
                    </h3>

                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 mb-4">
                      Tuliskan analisis teknis dan penjelasan Anda secara jelas dan lengkap. Jawaban ini akan dikoreksi dan dinilai langsung oleh Guru mata pelajaran.
                    </div>

                    <div>
                      <textarea
                        rows={7}
                        value={essayAnswers[currentEssayQuestion.id] || ''}
                        onChange={(e) => handleUpdateEssayAnswer(e.target.value)}
                        placeholder={`Ketik uraian jawaban untuk soal essay nomor ${currentEssayIdx + 1} di sini...`}
                        className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                      />
                      <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                        <span>Panjang karakter: {(essayAnswers[currentEssayQuestion.id] || '').length}</span>
                        <span>{(essayAnswers[currentEssayQuestion.id] || '').trim().split(/\s+/).filter(Boolean).length} kata</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Bottom Nav Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 mt-8">
                <button
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Sebelumnya
                </button>

                <div className="text-xs text-slate-400">
                  {currentIdx + 1} dari {totalQuestions} Soal
                </div>

                {currentIdx < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition"
                  >
                    Selanjutnya <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition"
                  >
                    Kumpulkan Ujian <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Grid Navigator (Right) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Navigasi Soal Evaluasi
                </h4>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {answeredCount} / {totalQuestions} Terisi
                </span>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span> Dijawab
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-amber-400"></span> Ragu-ragu
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700"></span> Belum
                </span>
              </div>

              {/* 40 PG Question Buttons */}
              <div className="text-xs font-semibold text-slate-400 mb-2">Pilihan Ganda ({soalPGList.length} Soal):</div>
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 mb-4">
                {soalPGList.map((soal, idx) => {
                  const isAnswered = Boolean(selectedAnswers[soal.id]);
                  const isFlag = Boolean(flagged[idx]);
                  const isCurrent = currentIdx === idx;

                  let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                  if (isFlag) {
                    bgClass = 'bg-amber-400 text-slate-900 border-amber-500 font-bold';
                  } else if (isAnswered) {
                    bgClass = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                  }

                  return (
                    <button
                      key={soal.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-9 rounded-lg text-xs font-mono border transition flex items-center justify-center relative ${bgClass} ${
                        isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* 10 Essay Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-400">Soal Uraian / Essay ({soalEssayList.length} Soal):</span>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {answeredEssayCount} / {totalEssay} Terisi
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {soalEssayList.map((essay, eIdx) => {
                    const globalIdx = soalPGList.length + eIdx;
                    const isAnswered = Boolean(essayAnswers[essay.id] && essayAnswers[essay.id].trim().length > 0);
                    const isFlag = Boolean(flagged[globalIdx]);
                    const isCurrent = currentIdx === globalIdx;

                    let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                    if (isFlag) {
                      bgClass = 'bg-amber-400 text-slate-900 border-amber-500 font-bold';
                    } else if (isAnswered) {
                      bgClass = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                    }

                    return (
                      <button
                        key={essay.id}
                        onClick={() => setCurrentIdx(globalIdx)}
                        className={`h-9 rounded-lg text-xs font-mono font-bold border transition flex items-center justify-center relative ${bgClass} ${
                          isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10' : ''
                        }`}
                        title={`Buka Soal Essay #${eIdx + 1}`}
                      >
                        E{eIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition text-center"
            >
              Keluar dari Ujian (Batal)
            </button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Kumpulkan Lembar Jawaban Ujian?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Anda telah menjawab <b className="text-blue-600">{answeredCount}</b> dari <b className="text-slate-900 dark:text-white">{totalQuestions}</b> butir soal (40 PG + 10 Essay).
              {answeredCount < totalQuestions && (
                <span className="block text-amber-600 dark:text-amber-400 font-semibold mt-1">
                  ⚠️ Peringatan: Masih terdapat {totalQuestions - answeredCount} butir soal yang belum Anda isi!
                </span>
              )}
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400 mb-6 space-y-1">
              <div>&bull; Nilai 40 Soal Pilihan Ganda (PG) dihitung otomatis oleh sistem.</div>
              <div>&bull; Ke-10 lembar jawaban Essay tersimpan aman di Firestore untuk dikoreksi guru.</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Periksa Kembali
              </button>
              <button
                onClick={() => handleSubmitFinal()}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? 'Mengirim ke Server...' : 'Ya, Kumpulkan Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CBT TAB SWITCHING WARNING MODAL (ANTI-CHEAT) */}
      {showTabWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-rose-500 dark:border-rose-600 text-center relative overflow-hidden">
            {/* Top Warning Strip */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 animate-pulse"></div>

            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-4 shadow-inner">
              <AlertTriangle className="w-9 h-9 animate-bounce" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 uppercase tracking-wider mb-2">
              🚨 Peringatan Integritas CBT
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              Dilarang Berpindah Tab / Jendela!
            </h3>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 text-slate-800 dark:text-slate-200 text-sm mb-5 leading-relaxed text-left">
              <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2 mb-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Pelanggaran Terdeteksi: Ke-{violationCount} dari Maksimal {MAX_ALLOWED_VIOLATIONS} Kali</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Anda terdeteksi meninggalkan halaman kuis ujian (membuka tab baru, jendela peramban lain, atau meminimalkan aplikasi). Setiap tindakan ini dicatat ke dalam database dan dilaporkan ke Guru Pengawas.
              </p>
            </div>

            {violationCount >= MAX_ALLOWED_VIOLATIONS ? (
              <div className="p-3.5 bg-red-600 text-white rounded-xl text-xs font-bold mb-4 animate-pulse">
                🚨 Batas toleransi telah habis ({MAX_ALLOWED_VIOLATIONS}/{MAX_ALLOWED_VIOLATIONS} kali)! Lembar jawaban Anda sedang otomatis dikumpulkan oleh sistem.
              </div>
            ) : (
              <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-6">
                Sisa kesempatan: <b>{MAX_ALLOWED_VIOLATIONS - violationCount} kali</b> lagi sebelum ujian didiskualifikasi dan dikumpulkan paksa.
              </p>
            )}

            {violationCount < MAX_ALLOWED_VIOLATIONS ? (
              <button
                onClick={() => setShowTabWarningModal(false)}
                className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-sm font-bold shadow-lg transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Saya Mengerti &amp; Lanjutkan Ujian
              </button>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono animate-pulse">
                Mengirim lembar jawaban ke server guru...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
