import React, { useState } from 'react';
import { Monitor, ArrowUp, ArrowDown, Save, RotateCcw, AlertCircle, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BiosSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'main' | 'advanced' | 'boot' | 'exit'>('main');
  const [bootOrder, setBootOrder] = useState<string[]>([
    'NVMe Samsung 980 PRO 1TB (Windows Boot Manager)',
    'USB Flashdisk Sandisk Ultra 32GB (Installer OS)',
    'Realtek PCIe GBE Family Controller (PXE Network Boot)',
    'Disabled'
  ]);
  const [selectedBootIdx, setSelectedBootIdx] = useState<number>(0);
  const [systemDate, setSystemDate] = useState<string>('03/11/2026');
  const [systemTime, setSystemTime] = useState<string>('08:30:00');
  const [cpuTemp] = useState<number>(38);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [isRebooting, setIsRebooting] = useState<boolean>(false);

  const moveBootUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...bootOrder];
    const temp = next[idx - 1];
    next[idx - 1] = next[idx];
    next[idx] = temp;
    setBootOrder(next);
    setSelectedBootIdx(idx - 1);
  };

  const moveBootDown = (idx: number) => {
    if (idx === bootOrder.length - 1) return;
    const next = [...bootOrder];
    const temp = next[idx + 1];
    next[idx + 1] = next[idx];
    next[idx] = temp;
    setBootOrder(next);
    setSelectedBootIdx(idx + 1);
  };

  const handleSaveAndExit = () => {
    setSavedStatus('Menyimpan konfigurasi NVRAM CMOS & Memulai ulang sistem...');
    setIsRebooting(true);

    const isUsbFirst = bootOrder[0].includes('USB');
    setTimeout(() => {
      setIsRebooting(false);
      setSavedStatus(
        isUsbFirst
          ? '✓ SUKSES: Booting dari USB Flashdisk Installer! Anda siap memulai instalasi OS Windows/Linux.'
          : '✓ SUKSES: Konfigurasi disimpan. Booting dari NVMe internal SSD.'
      );
      confetti({ particleCount: 80, spread: 70 });
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
              SIMULASI LAB 2
            </span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Aptio Setup Utility (BIOS / UEFI Simulator)</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulasi konfigurasi firmware BIOS/UEFI: atur Boot Priority order untuk instalasi OS dan pantau suhu prosesor.
          </p>
        </div>

        <button
          onClick={() => {
            setBootOrder([
              'NVMe Samsung 980 PRO 1TB (Windows Boot Manager)',
              'USB Flashdisk Sandisk Ultra 32GB (Installer OS)',
              'Realtek PCIe GBE Family Controller (PXE Network Boot)',
              'Disabled'
            ]);
            setSavedStatus(null);
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <RotateCcw className="w-4 h-4" /> Load Setup Defaults
        </button>
      </div>

      {/* Screen Monitor Container */}
      <div className="bg-[#000084] text-white font-mono rounded-xl p-4 sm:p-6 border-4 border-slate-800 shadow-2xl relative overflow-hidden min-h-[460px] flex flex-col justify-between">
        {/* Top Header */}
        <div>
          <div className="text-center font-bold tracking-widest text-yellow-300 text-sm sm:text-base border-b-2 border-slate-300/40 pb-2 mb-3">
            Aptio Setup Utility - Copyright (C) Megatrends Inc. / KJD Lab
          </div>

          {/* Menu Tabs */}
          <div className="flex border-b border-slate-300/40 pb-1 gap-2 sm:gap-6 text-xs sm:text-sm">
            {(['main', 'advanced', 'boot', 'exit'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 uppercase tracking-wider font-bold transition ${
                  activeTab === tab
                    ? 'bg-slate-200 text-[#000084]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                [{tab}]
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="my-4 py-2 border-y border-dashed border-slate-400/30 flex-1 text-xs sm:text-sm leading-relaxed">
          {isRebooting ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
              <div className="animate-spin w-8 h-8 border-4 border-yellow-300 border-t-transparent rounded-full"></div>
              <p className="text-yellow-300 font-bold text-base">POST System Rebooting...</p>
              <p className="text-slate-300 text-xs">Checking hardware checksum and boot devices...</p>
            </div>
          ) : activeTab === 'main' ? (
            <div className="space-y-3">
              <div className="text-yellow-300 font-bold">System Information:</div>
              <div className="grid grid-cols-2 gap-y-1 text-slate-200">
                <span>BIOS Version:</span>
                <span className="text-white">KJD-SMK-2026.04</span>
                <span>Processor Type:</span>
                <span className="text-white">Intel(R) Core(TM) i5-13400 @ 2.50GHz</span>
                <span>Total Installed Memory:</span>
                <span className="text-white">16384 MB (DDR4 3200MHz Dual Channel)</span>
                <span>System Date:</span>
                <span className="text-yellow-200 font-bold">[{systemDate}]</span>
                <span>System Time:</span>
                <span className="text-yellow-200 font-bold">[{systemTime}]</span>
              </div>
              <div className="mt-4 p-2 bg-blue-950/70 border border-blue-400/40 text-[11px] text-cyan-200">
                Tip: Pengaturan tanggal dan waktu tersimpan di NVRAM CMOS dengan pasokan baterai koin CR2032 3V.
              </div>
            </div>
          ) : activeTab === 'advanced' ? (
            <div className="space-y-3">
              <div className="text-yellow-300 font-bold">Hardware Health & Monitoring:</div>
              <div className="grid grid-cols-2 gap-y-2 text-slate-200">
                <span>CPU Temperature:</span>
                <span className="text-emerald-300 font-bold">{cpuTemp}°C / 100°F (Normal)</span>
                <span>Motherboard Temp:</span>
                <span className="text-emerald-300 font-bold">31°C</span>
                <span>CPU Fan Speed:</span>
                <span className="text-cyan-300 font-bold">1420 RPM</span>
                <span>VCORE Voltage:</span>
                <span className="text-cyan-300 font-bold">1.184 V</span>
                <span>+12V Rail:</span>
                <span className="text-cyan-300 font-bold">12.096 V</span>
                <span>+5V Rail:</span>
                <span className="text-cyan-300 font-bold">5.040 V</span>
              </div>
            </div>
          ) : activeTab === 'boot' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-yellow-300 font-bold">Boot Option Priorities:</span>
                <span className="text-xs text-cyan-200">Urutan prioritas menentukan media instalasi OS</span>
              </div>

              <div className="space-y-2 bg-blue-950/80 p-3 rounded border border-blue-400/40">
                {bootOrder.map((device, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedBootIdx(idx)}
                    className={`p-2 rounded flex items-center justify-between cursor-pointer transition ${
                      selectedBootIdx === idx
                        ? 'bg-slate-200 text-[#000084] font-bold'
                        : 'hover:bg-blue-900/60 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-blue-900 text-yellow-300 text-[10px] font-mono">
                        Boot #{idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm">{device}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBootUp(idx);
                        }}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-300 rounded disabled:opacity-20 text-[#000084]"
                        title="Naikkan Urutan Boot"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBootDown(idx);
                        }}
                        disabled={idx === bootOrder.length - 1}
                        className="p-1 hover:bg-slate-300 rounded disabled:opacity-20 text-[#000084]"
                        title="Turunkan Urutan Boot"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-cyan-200 bg-blue-900/40 p-2 rounded border border-blue-400/30">
                Petunjuk Siswa: Untuk menginstal OS baru dari Flashdisk, pindahkan <b>"USB Flashdisk Sandisk..."</b> ke <b>Boot #1</b> paling atas, lalu tekan Simpan di tab Exit.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-yellow-300 font-bold">Exit & Save Configuration:</div>
              <div className="space-y-2">
                <button
                  onClick={handleSaveAndExit}
                  className="w-full text-left p-2.5 rounded bg-blue-900/80 hover:bg-emerald-700 transition flex items-center justify-between border border-blue-400/50"
                >
                  <span className="font-bold text-yellow-300">Save Changes and Reset (F10)</span>
                  <span className="text-xs text-slate-300">Simpan perubahan & restart</span>
                </button>
                <button
                  onClick={() => setActiveTab('main')}
                  className="w-full text-left p-2.5 rounded bg-blue-900/40 hover:bg-blue-800 transition flex items-center justify-between border border-blue-400/30"
                >
                  <span>Discard Changes and Exit</span>
                  <span className="text-xs text-slate-400">Batalkan tanpa menyimpan</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Instructions */}
        <div className="border-t border-slate-300/40 pt-2 text-[10px] sm:text-xs flex flex-wrap justify-between text-yellow-200">
          <span>&larr; &rarr;: Select Screen</span>
          <span>&uarr; &darr;: Select Item</span>
          <span>Enter: Select Option</span>
          <span>F10: Save & Exit</span>
        </div>
      </div>

      {savedStatus && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          {savedStatus}
        </div>
      )}
    </div>
  );
};
