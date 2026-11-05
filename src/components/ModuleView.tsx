import React, { useState } from 'react';
import { Modul, UserSession } from '../types';
import { PCSimulator } from './simulations/PCSimulator';
import { BiosSimulator } from './simulations/BiosSimulator';
import { CableSimulator } from './simulations/CableSimulator';
import { SubnetCalculator } from './simulations/SubnetCalculator';
import { TerminalSimulator } from './simulations/TerminalSimulator';
import { 
  BookOpen, 
  ExternalLink, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowRight,
  Code2,
  Cpu,
  Network
} from 'lucide-react';

import { DEFAULT_MODUL } from '../data/defaultData';

interface Props {
  modulList: Modul[];
  user: UserSession;
  onStartEvaluation: (modul: Modul) => void;
}

export const ModuleView: React.FC<Props> = ({ modulList, user, onStartEvaluation }) => {
  const safeModulList = modulList && modulList.length > 0 ? modulList : DEFAULT_MODUL;
  const [selectedModulId, setSelectedModulId] = useState<string>(safeModulList[0]?.id || 'modul-1');
  const [activeTab, setActiveTab] = useState<'materi' | 'simulasi' | 'web-resmi'>('materi');

  const selectedModul = safeModulList.find(m => m.id === selectedModulId) || safeModulList[0] || DEFAULT_MODUL[0];

  const renderSimulation = () => {
    switch (selectedModul.simulasiTipe) {
      case 'pc-assembly':
        return <PCSimulator />;
      case 'bios':
        return <BiosSimulator />;
      case 'utp-cable':
        return <CableSimulator />;
      case 'subnetting':
        return <SubnetCalculator />;
      case 'cli-network':
        return <TerminalSimulator />;
      default:
        return <TerminalSimulator />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-blue-100 backdrop-blur-xs inline-block mb-3">
            Kurikulum SMK TKJ &bull; Kelas X
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Modul Pembelajaran Komputer &amp; Jaringan Dasar
          </h1>
          <p className="text-sm text-blue-100/90 mt-2 leading-relaxed">
            Pelajari teori perangkat keras, bios setup, pengkabelan UTP, pengalamatan IP subnetting, dan utilitas jaringan dengan simulasi lab interaktif.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-5 text-xs text-blue-100">
            <span className="flex items-center gap-1.5 font-semibold">
              <BookOpen className="w-4 h-4" /> 6 Modul Lengkap
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-4 h-4" /> 5 Laboratorium Interaktif
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Layers className="w-4 h-4" /> 40 Soal PG + 10 Essay Tiap Modul
            </span>
          </div>
        </div>

        {/* Decorative graphic */}
        <div className="absolute right-6 -bottom-8 opacity-15 pointer-events-none">
          <Network className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Module Selector Pill Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {modulList.map((m) => {
          const isSelected = m.id === selectedModul.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedModulId(m.id);
                setActiveTab('materi');
              }}
              className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 shadow-sm ring-2 ring-blue-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {m.kode}
                </span>
                <h4 className="text-xs font-bold mt-2 text-slate-800 dark:text-white line-clamp-2 leading-snug">
                  {m.judul}
                </h4>
              </div>

              <div className="text-[10px] text-slate-400 mt-2 font-medium">
                {m.soalPG.length} PG &bull; {m.soalEssay?.length || 10} Essay
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Module Content & Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Module Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {selectedModul.kode}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs text-slate-500 font-semibold">{selectedModul.kategori}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {selectedModul.judul}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Kompetensi Dasar: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedModul.kompetensiDasar}</span>
            </p>
          </div>

          <button
            onClick={() => onStartEvaluation(selectedModul)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition"
          >
            <Play className="w-4 h-4" /> Mulai Evaluasi (40 PG + 10 Essay)
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-800 mt-6 pb-2 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('materi')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'materi'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Ringkasan Materi KJD
          </button>

          <button
            onClick={() => setActiveTab('simulasi')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
              activeTab === 'simulasi'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Area Simulasi Interaktif
          </button>

          <button
            onClick={() => setActiveTab('web-resmi')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
              activeTab === 'web-resmi'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ExternalLink className="w-4 h-4" /> Web Materi Resmi (simonmurd)
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'materi' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">
                  Deskripsi &amp; Ruang Lingkup Materi
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedModul.deskripsi}
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3">
                  Poin Kunci &amp; Prosedur Praktik:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedModul.ringkasan.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Action Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Siap Memulai Uji Kompetensi?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Uji pemahaman Anda dengan 40 butir soal pilihan ganda (A-E) dan 10 butir soal essay uraian analisis studi kasus.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('simulasi')}
                    className="px-4 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-700 rounded-xl hover:shadow-xs transition"
                  >
                    Buka Simulasi Lab Dulu
                  </button>
                  <button
                    onClick={() => onStartEvaluation(selectedModul)}
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition"
                  >
                    Mulai Evaluasi Sekarang &rarr;
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'simulasi' ? (
            <div className="space-y-4">
              {renderSimulation()}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-blue-900 dark:text-blue-200">
                    Modul Kurikulum Resmi: <span className="font-mono font-normal">https://simonmurd.github.io/Komputer-dan-Jaringan-Dasar/</span>
                  </div>
                  <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 mt-0.5">
                    Jika tampilan frame di bawah tidak muncul karena kebijakan keamanan browser, silakan klik tombol di samping.
                  </p>
                </div>
                <a
                  href={selectedModul.materiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                >
                  <ExternalLink className="w-4 h-4" /> Buka di Tab Baru
                </a>
              </div>

              {/* Embedded Frame with Sandbox */}
              <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 shadow-inner">
                <iframe
                  src={selectedModul.materiUrl}
                  title="Web Materi Resmi KJD"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
