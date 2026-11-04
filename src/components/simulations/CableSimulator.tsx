import React, { useState } from 'react';
import { Network, CheckCircle2, AlertTriangle, RotateCcw, Play, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WireColor {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  stripe?: boolean;
}

const ALL_WIRES: WireColor[] = [
  { id: 'wo', name: 'Putih Oranye', bgColor: '#ffedd5', textColor: '#c2410c', stripe: true },
  { id: 'o', name: 'Oranye', bgColor: '#ea580c', textColor: '#ffffff' },
  { id: 'wg', name: 'Putih Hijau', bgColor: '#dcfce7', textColor: '#15803d', stripe: true },
  { id: 'b', name: 'Biru', bgColor: '#2563eb', textColor: '#ffffff' },
  { id: 'wb', name: 'Putih Biru', bgColor: '#dbeafe', textColor: '#1d4ed8', stripe: true },
  { id: 'g', name: 'Hijau', bgColor: '#16a34a', textColor: '#ffffff' },
  { id: 'wbr', name: 'Putih Cokelat', bgColor: '#f5ebe0', textColor: '#78350f', stripe: true },
  { id: 'br', name: 'Cokelat', bgColor: '#78350f', textColor: '#ffffff' },
];

const CORRECT_T568B = ['wo', 'o', 'wg', 'b', 'wb', 'g', 'wbr', 'br'];
const CORRECT_T568A = ['wg', 'g', 'wo', 'b', 'wb', 'o', 'wbr', 'br'];

export const CableSimulator: React.FC = () => {
  const [standard, setStandard] = useState<'T568B' | 'T568A'>('T568B');
  const [pins, setPins] = useState<(WireColor | null)[]>([null, null, null, null, null, null, null, null]);
  const [isCrimped, setIsCrimped] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; activeLed?: number } | null>(null);
  const [testingLed, setTestingLed] = useState<number | null>(null);

  const targetArr = standard === 'T568B' ? CORRECT_T568B : CORRECT_T568A;

  const handleSelectWireForSlot = (wire: WireColor, slotIdx: number) => {
    if (isCrimped) return;
    const next = [...pins];
    next[slotIdx] = wire;
    setPins(next);
    setTestResult(null);
  };

  const handleAutoArrange = () => {
    setIsCrimped(false);
    setTestResult(null);
    const arranged = targetArr.map(id => ALL_WIRES.find(w => w.id === id) || null);
    setPins(arranged);
  };

  const handleReset = () => {
    setPins([null, null, null, null, null, null, null, null]);
    setIsCrimped(false);
    setTestResult(null);
    setTestingLed(null);
  };

  const handleCrimp = () => {
    if (pins.some(p => p === null)) {
      setTestResult({
        success: false,
        message: '⚠️ Semua 8 pin harus terisi kawat tembaga sebelum menekan tang crimping!'
      });
      return;
    }
    setIsCrimped(true);
    setTestResult({
      success: true,
      message: '✓ Konektor RJ-45 berhasil dikunci dengan tang crimping! Lanjutkan dengan pengujian LAN Tester.'
    });
  };

  const handleRunTester = () => {
    if (!isCrimped) {
      setTestResult({
        success: false,
        message: '⚠️ Lakukan crimping terlebih dahulu pada konektor RJ-45!'
      });
      return;
    }

    // Check accuracy
    const isCorrect = pins.every((p, idx) => p?.id === targetArr[idx]);

    // Animate LED 1 to 8
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setTestingLed(currentStep);

      if (currentStep >= 8) {
        clearInterval(interval);
        setTimeout(() => {
          setTestingLed(null);
          if (isCorrect) {
            setTestResult({
              success: true,
              message: `🎉 KABEL LULUS UJI! Semua pin 1 s/d 8 terhubung lurus sesuai standar ${standard}. Kecepatan link: 1.0 Gbps Gigabit!`
            });
            confetti({ particleCount: 90, spread: 70 });
          } else {
            setTestResult({
              success: false,
              message: `❌ KABEL GAGAL UJI (MISWIRED)! Terdapat urutan pin yang salah atau tertukar. Cek kembali standar ${standard}.`
            });
          }
        }, 400);
      }
    }, 200);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
              SIMULASI LAB 3
            </span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Simulasi Pengkabelan UTP & Crimping RJ-45</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Susun urutan 8 kawat tembaga kabel UTP, lakukan crimping, dan uji kontinuitas sinyal dengan LAN Cable Tester.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex gap-1 text-xs font-bold">
            <button
              onClick={() => { setStandard('T568B'); handleReset(); }}
              className={`px-3 py-1.5 rounded-md transition ${standard === 'T568B' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
            >
              Standar T568B
            </button>
            <button
              onClick={() => { setStandard('T568A'); handleReset(); }}
              className={`px-3 py-1.5 rounded-md transition ${standard === 'T568A' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
            >
              Standar T568A
            </button>
          </div>

          <button
            onClick={handleAutoArrange}
            className="px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-lg hover:bg-blue-100 transition"
          >
            Auto Susun Benar
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Reset Pin"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RJ-45 Connector Visual */}
        <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Konektor Modular RJ-45 (Tampak Atas - Pin 1 s/d 8)
              </span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${isCrimped ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
              {isCrimped ? 'TERKUNCI (CRIMPED)' : 'BELUM DICRIMP'}
            </span>
          </div>

          {/* Transparent Plastic RJ45 Body with 8 Copper Slots */}
          <div className="bg-slate-200 dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-inner relative">
            {/* 8 Pin Slots */}
            <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
              {pins.map((pin, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 mb-1">
                    #{idx + 1}
                  </span>

                  {/* Wire Channel */}
                  <div
                    onClick={() => {
                      if (!isCrimped && pin) {
                        const next = [...pins];
                        next[idx] = null;
                        setPins(next);
                      }
                    }}
                    className={`w-full h-36 sm:h-44 rounded-lg border-2 flex flex-col justify-end p-1 transition cursor-pointer relative overflow-hidden ${
                      pin
                        ? 'border-slate-400 dark:border-slate-600 shadow-md'
                        : 'border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-white/50 dark:bg-slate-800/40'
                    }`}
                    style={
                      pin
                        ? {
                            backgroundColor: pin.bgColor,
                            color: pin.textColor,
                            backgroundImage: pin.stripe
                              ? `repeating-linear-gradient(45deg, ${pin.bgColor}, ${pin.bgColor} 10px, ${pin.textColor} 10px, ${pin.textColor} 20px)`
                              : undefined
                          }
                        : undefined
                    }
                  >
                    {/* Golden Contact Teeth at top */}
                    <div className="absolute top-1 inset-x-2 h-4 bg-amber-400 rounded-sm border border-amber-600 opacity-90"></div>

                    {pin ? (
                      <div className="bg-black/60 text-white rounded p-1 text-center text-[9px] sm:text-[10px] font-bold z-10">
                        {pin.name.split(' ')[0]}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 text-center my-auto">
                        Klik Kawat
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-xs text-slate-500">
              Standar target saat ini: <b className="text-blue-600 dark:text-blue-400">{standard}</b> ({standard === 'T568B' ? 'Putih Oranye, Oranye, Putih Hijau, Biru...' : 'Putih Hijau, Hijau, Putih Oranye, Biru...'})
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 mt-6">
            <button
              onClick={handleCrimp}
              disabled={isCrimped}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition ${
                isCrimped
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              Tang Crimping (Kunci Pin)
            </button>
            <button
              onClick={handleRunTester}
              disabled={!isCrimped || testingLed !== null}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition ${
                !isCrimped || testingLed !== null
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Play className="w-4 h-4" /> Uji dengan LAN Tester
            </button>
          </div>
        </div>

        {/* Wire Palette & Cable Tester Display */}
        <div className="lg:col-span-4 space-y-4">
          {/* Wire Selection Box */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Pilihan Kawat UTP (Pilih untuk mengisi pin kosong)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {ALL_WIRES.map((wire) => (
                <button
                  key={wire.id}
                  onClick={() => {
                    const firstEmpty = pins.findIndex(p => p === null);
                    if (firstEmpty !== -1) {
                      handleSelectWireForSlot(wire, firstEmpty);
                    }
                  }}
                  className="p-2 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 text-left hover:scale-[1.02] transition shadow-xs flex items-center gap-2"
                  style={{
                    backgroundColor: wire.bgColor,
                    color: wire.textColor
                  }}
                >
                  <span className="w-3 h-3 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: wire.textColor }}></span>
                  <span className="truncate">{wire.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* LAN Cable Tester Visual */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-mono text-xs text-yellow-400 font-bold">NETWORK CABLE TESTER NS-468</span>
              <span className="text-[10px] text-slate-400">Master & Remote</span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
              {/* Master Unit LEDs */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 text-center mb-2">MASTER</div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <div key={num} className="flex flex-col items-center">
                      <div className={`w-3.5 h-3.5 rounded-full transition-all ${testingLed === num ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-800'}`}></div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">{num}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remote Unit LEDs */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 text-center mb-2">REMOTE</div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => {
                    const isLit = testingLed === num;
                    return (
                      <div key={num} className="flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-full transition-all ${isLit ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-800'}`}></div>
                        <span className="text-[10px] font-mono text-slate-400 mt-1">{num}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl text-xs font-medium border ${testResult.success ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-red-950/60 border-red-800 text-red-300'}`}>
                {testResult.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
