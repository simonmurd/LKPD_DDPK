import React, { useState } from 'react';
import { Cpu, HardDrive, Zap, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  desc: string;
  installed: boolean;
  order: number;
}

export const PCSimulator: React.FC = () => {
  const [components, setComponents] = useState<ComponentItem[]>([
    { id: 'cpu', name: 'Intel Core i5 (LGA 1700)', category: 'Prosesor', desc: 'Pasang pada soket LGA dengan menyelaraskan tanda segitiga emas', installed: false, order: 1 },
    { id: 'paste', name: 'Thermal Paste (Grease)', category: 'Pendingin', desc: 'Oleskan sebesar butir kacang polong di atas IHS CPU', installed: false, order: 2 },
    { id: 'cooler', name: 'Tower Heatsink Fan Cooler', category: 'Pendingin', desc: 'Kencangkan 4 baut diagonal dan colokkan kabel 4-pin CPU_FAN', installed: false, order: 3 },
    { id: 'ram1', name: 'RAM DDR4 16GB (Slot DIMM 2)', category: 'Memori', desc: 'Buka pengait slot DIMM_A2, tekan hingga berbunyi KLIK', installed: false, order: 4 },
    { id: 'ssd', name: 'SSD M.2 NVMe PCIe Gen4 1TB', category: 'Penyimpanan', desc: 'Masukkan sudut 30 derajat pada slot M.2 dan pasang sekrup penahan', installed: false, order: 5 },
    { id: 'psu', name: 'Power Supply 650W 80+ Bronze', category: 'Daya', desc: 'Pasang di kompartemen bawah dan kencangkan 4 baut casing', installed: false, order: 6 },
    { id: 'cable24', name: 'Kabel Power 24-Pin ATX', category: 'Kabel Daya', desc: 'Sambungkan daya utama 24-pin ke motherboard', installed: false, order: 7 },
    { id: 'gpu', name: 'GPU NVIDIA RTX 3060 12GB', category: 'Kartu Grafis', desc: 'Pasang pada slot PCIe x16 teratas dan sambungkan kabel PCIe 8-pin', installed: false, order: 8 },
  ]);

  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Pilih komponen dari nampan perakitan lalu pasang ke motherboard sesuai urutan K3LH!');
  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(false);
  const [postStatus, setPostStatus] = useState<string>('');

  const installedCount = components.filter(c => c.installed).length;
  const isComplete = installedCount === components.length;

  const handleInstall = (item: ComponentItem) => {
    // Check prerequisites
    if (item.id === 'paste' && !components.find(c => c.id === 'cpu')?.installed) {
      setMessage('⚠️ Peringatan K3LH: Pasang Prosesor terlebih dahulu ke soket sebelum mengoleskan Thermal Paste!');
      return;
    }
    if (item.id === 'cooler' && !components.find(c => c.id === 'paste')?.installed) {
      setMessage('⚠️ Peringatan K3LH: Oleskan Thermal Paste sebelum memasang Heatsink Cooler agar panas tidak overheat!');
      return;
    }
    if (item.id === 'cable24' && !components.find(c => c.id === 'psu')?.installed) {
      setMessage('⚠️ Pasang PSU ke casing terlebih dahulu sebelum mencolokkan kabel 24-pin ATX!');
      return;
    }

    setComponents(prev => prev.map(c => c.id === item.id ? { ...c, installed: true } : c));
    setMessage(`✅ Berhasil memasang: ${item.name}!`);
    setSelectedCompId(null);

    if (installedCount + 1 === components.length) {
      confetti({ particleCount: 70, spread: 60 });
      setMessage('🎉 Perakitan Selesai! Semua komponen hardware terpasang sempurna. Tekan tombol POWER PC untuk POST test!');
    }
  };

  const handlePowerTest = () => {
    if (!isComplete) {
      setMessage('⚠️ PC belum lengkap dirakit! Masih ada komponen yang belum terpasang.');
      return;
    }

    setIsPoweredOn(true);
    setPostStatus('Memulai Power-On Self Test (POST)...');

    setTimeout(() => {
      setPostStatus('BEEP! (1 Beep Pendek) - Sistem Normal. BIOS UEFI terdeteksi.');
      confetti({ particleCount: 100, spread: 80 });
    }, 1200);
  };

  const handleReset = () => {
    setComponents(prev => prev.map(c => ({ ...c, installed: false })));
    setIsPoweredOn(false);
    setPostStatus('');
    setMessage('Simulasi telah direset. Silakan mulai kembali langkah perakitan PC.');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              SIMULASI LAB 1
            </span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Perakitan Komputer & Hardware Lab</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulasikan tahapan perakitan PC desktop standar industri SMK TKJ dengan urutan K3LH yang tepat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset Perakitan
          </button>
          <button
            onClick={handlePowerTest}
            disabled={!isComplete}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg shadow-sm transition ${
              isComplete
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4" /> Nyalakan PC (POST Test)
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{message}</p>
          {postStatus && (
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {postStatus}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Motherboard Visual Canvas */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-6 border-2 border-slate-700 relative overflow-hidden text-white min-h-[420px] flex flex-col justify-between shadow-inner">
          {/* Subtle PCB Grid Lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {/* Header PCB Info */}
          <div className="relative z-10 flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="font-mono text-cyan-400 font-bold">ASUS TUF GAMING B760-PLUS (ATX Form Factor)</span>
            <span className="font-mono">STATUS: {isPoweredOn ? '🟢 POWER ON (12V ACTIVE)' : '⚪ STANDBY'}</span>
          </div>

          {/* Interactive Socket Layout */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 my-auto py-4">
            {/* CPU Socket Area */}
            <div
              onClick={() => {
                const comp = components.find(c => c.id === 'cpu');
                if (comp && !comp.installed) handleInstall(comp);
              }}
              className={`border-2 border-dashed p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
                components.find(c => c.id === 'cpu')?.installed
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                  : 'border-cyan-500/50 hover:border-cyan-400 bg-slate-800/80 hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-8 h-8 mb-2" />
              <div className="text-xs font-bold">Soket LGA 1700</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {components.find(c => c.id === 'cpu')?.installed ? '✓ Intel Core i5 Terpasang' : 'Klik untuk pasang CPU'}
              </div>
            </div>

            {/* Thermal Paste & Cooler */}
            <div
              onClick={() => {
                const paste = components.find(c => c.id === 'paste');
                const cooler = components.find(c => c.id === 'cooler');
                if (paste && !paste.installed) handleInstall(paste);
                else if (cooler && !cooler.installed) handleInstall(cooler);
              }}
              className={`border-2 border-dashed p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
                components.find(c => c.id === 'cooler')?.installed
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                  : components.find(c => c.id === 'paste')?.installed
                  ? 'border-amber-500 bg-amber-950/30 text-amber-300'
                  : 'border-slate-600 hover:border-slate-400 bg-slate-800/80'
              }`}
            >
              <Zap className="w-8 h-8 mb-2" />
              <div className="text-xs font-bold">Pendingin CPU</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {components.find(c => c.id === 'cooler')?.installed
                  ? '✓ Tower Cooler Terpasang'
                  : components.find(c => c.id === 'paste')?.installed
                  ? '✓ Pasta Dioles (Klik pasang Cooler)'
                  : 'Perlu Pasta & Cooler'}
              </div>
            </div>

            {/* RAM DIMM Slot */}
            <div
              onClick={() => {
                const comp = components.find(c => c.id === 'ram1');
                if (comp && !comp.installed) handleInstall(comp);
              }}
              className={`border-2 border-dashed p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
                components.find(c => c.id === 'ram1')?.installed
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                  : 'border-cyan-500/50 hover:border-cyan-400 bg-slate-800/80'
              }`}
            >
              <div className="w-8 h-6 border-b-2 border-cyan-400 flex items-center justify-center font-mono text-xs mb-2">
                DIMM
              </div>
              <div className="text-xs font-bold">Slot RAM DDR4</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {components.find(c => c.id === 'ram1')?.installed ? '✓ 16GB Dual Channel' : 'Klik pasang RAM'}
              </div>
            </div>

            {/* M.2 NVMe Slot */}
            <div
              onClick={() => {
                const comp = components.find(c => c.id === 'ssd');
                if (comp && !comp.installed) handleInstall(comp);
              }}
              className={`border-2 border-dashed p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
                components.find(c => c.id === 'ssd')?.installed
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                  : 'border-slate-600 hover:border-slate-400 bg-slate-800/80'
              }`}
            >
              <HardDrive className="w-8 h-8 mb-2" />
              <div className="text-xs font-bold">Slot M.2 NVMe</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {components.find(c => c.id === 'ssd')?.installed ? '✓ SSD 1TB Terpasang' : 'Klik pasang SSD'}
              </div>
            </div>

            {/* PCIe x16 GPU Slot */}
            <div
              onClick={() => {
                const comp = components.find(c => c.id === 'gpu');
                if (comp && !comp.installed) handleInstall(comp);
              }}
              className={`border-2 border-dashed p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
                components.find(c => c.id === 'gpu')?.installed
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                  : 'border-slate-600 hover:border-slate-400 bg-slate-800/80'
              }`}
            >
              <div className="w-12 h-6 border-2 border-amber-400/80 rounded flex items-center justify-center text-[10px] font-mono mb-2">
                PCIe x16
              </div>
              <div className="text-xs font-bold">Slot Kartu Grafis</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {components.find(c => c.id === 'gpu')?.installed ? '✓ RTX 3060 Terpasang' : 'Klik pasang GPU'}
              </div>
            </div>

            {/* PSU & 24-Pin ATX */}
            <div
              onClick={() => {
                const psu = components.find(c => c.id === 'psu');
                const c24 = components.find(c => c.id === 'cable24');
                if (psu && !psu.installed) handleInstall(psu);
                else if (c24 && !c24.installed) handleInstall(c24);
              }}
              className={`border-2 border-dashed p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
                components.find(c => c.id === 'cable24')?.installed
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                  : components.find(c => c.id === 'psu')?.installed
                  ? 'border-amber-500 bg-amber-950/30 text-amber-300'
                  : 'border-slate-600 hover:border-slate-400 bg-slate-800/80'
              }`}
            >
              <Zap className="w-8 h-8 mb-2 text-yellow-400" />
              <div className="text-xs font-bold">Power Supply & 24P</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {components.find(c => c.id === 'cable24')?.installed
                  ? '✓ Kabel ATX Terhubung'
                  : components.find(c => c.id === 'psu')?.installed
                  ? '✓ PSU Terbaut (Klik sambung 24P)'
                  : 'Klik pasang PSU'}
              </div>
            </div>
          </div>

          {/* Bottom Diagnostics */}
          <div className="relative z-10 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Progres Perakitan: {installedCount} / {components.length} Komponen</span>
            <div className="w-48 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(installedCount / components.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Component Tray / Toolset */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Nampan Komponen ({components.filter(c => !c.installed).length} Tersisa)
            </h4>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {components.map((comp) => (
              <div
                key={comp.id}
                onClick={() => {
                  if (!comp.installed) handleInstall(comp);
                }}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  comp.installed
                    ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 opacity-60'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div className="pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{comp.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                      {comp.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{comp.desc}</p>
                </div>

                <div className="shrink-0">
                  {comp.installed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <button className="text-xs font-semibold px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                      Pasang
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
