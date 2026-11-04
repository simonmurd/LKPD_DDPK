import React, { useState, useMemo } from 'react';
import { Calculator, Award, CheckCircle2, XCircle, HelpCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SubnetCalculator: React.FC = () => {
  const [ipInput, setIpInput] = useState<string>('192.168.10.45');
  const [prefix, setPrefix] = useState<number>(26);

  // Mini-Quiz State
  const [quizQuestion, setQuizQuestion] = useState<{
    ip: string;
    cidr: number;
    target: 'network' | 'broadcast' | 'hosts';
    answer: string;
    explanation: string;
  }>({
    ip: '192.168.1.50',
    cidr: 26,
    target: 'network',
    answer: '192.168.1.0',
    explanation: 'Pada /26 (mask 255.255.255.192), blok subnet berkelipatan 64 (0, 64, 128, 192). IP 192.168.1.50 berada di subnet 192.168.1.0.'
  });
  const [userQuizAns, setUserQuizAns] = useState<string>('');
  const [quizFeedback, setQuizFeedback] = useState<{ correct: boolean; msg: string } | null>(null);

  // Calculate subnet parameters
  const subnetDetails = useMemo(() => {
    try {
      const parts = ipInput.trim().split('.').map(p => parseInt(p, 10));
      if (parts.length !== 4 || parts.some(n => isNaN(n) || n < 0 || n > 255)) {
        return null;
      }

      const ipInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
      const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix));
      const networkInt = (ipInt & maskInt) >>> 0;
      const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

      const intToIp = (num: number) => {
        return [
          (num >>> 24) & 255,
          (num >>> 16) & 255,
          (num >>> 8) & 255,
          num & 255
        ].join('.');
      };

      const maskIp = intToIp(maskInt >>> 0);
      const networkIp = intToIp(networkInt);
      const broadcastIp = intToIp(broadcastInt);

      const totalHosts = Math.pow(2, 32 - prefix);
      const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

      const firstHostIp = prefix >= 31 ? networkIp : intToIp(networkInt + 1);
      const lastHostIp = prefix >= 31 ? broadcastIp : intToIp(broadcastInt - 1);

      // Binary mask string
      const binaryMask = (maskInt >>> 0).toString(2).padStart(32, '0').match(/.{1,8}/g)?.join('.') || '';

      // IP Class & Type
      let ipClass = 'Kelas C';
      if (parts[0] <= 126) ipClass = 'Kelas A';
      else if (parts[0] === 127) ipClass = 'Loopback (127.0.0.0/8)';
      else if (parts[0] <= 191) ipClass = 'Kelas B';
      else if (parts[0] <= 223) ipClass = 'Kelas C';
      else if (parts[0] <= 239) ipClass = 'Kelas D (Multicast)';
      else ipClass = 'Kelas E (Eksperimen)';

      const isPrivate =
        (parts[0] === 10) ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168);

      return {
        maskIp,
        binaryMask,
        networkIp,
        broadcastIp,
        usableHosts,
        firstHostIp,
        lastHostIp,
        ipClass,
        scope: isPrivate ? 'IP Privat (LAN Lokal)' : 'IP Publik (Internet)'
      };
    } catch {
      return null;
    }
  }, [ipInput, prefix]);

  const generateNewQuiz = () => {
    const octet3 = Math.floor(Math.random() * 20);
    const hostNum = Math.floor(Math.random() * 200) + 1;
    const cidrList = [25, 26, 27, 28];
    const pickedCidr = cidrList[Math.floor(Math.random() * cidrList.length)];
    const blockSize = Math.pow(2, 32 - pickedCidr);
    const subIdx = Math.floor(hostNum / blockSize);
    const netLast = subIdx * blockSize;
    const bcastLast = netLast + blockSize - 1;

    const testType = Math.random() > 0.5 ? 'network' : 'broadcast';
    const ans = testType === 'network'
      ? `192.168.${octet3}.${netLast}`
      : `192.168.${octet3}.${bcastLast}`;

    setQuizQuestion({
      ip: `192.168.${octet3}.${hostNum}`,
      cidr: pickedCidr,
      target: testType,
      answer: ans,
      explanation: `Prefix /${pickedCidr} memiliki blok subnet ${blockSize}. Subnet berawal dari .${netLast} hingga broadcast .${bcastLast}.`
    });
    setUserQuizAns('');
    setQuizFeedback(null);
  };

  const handleCheckQuiz = () => {
    const cleaned = userQuizAns.trim();
    if (cleaned === quizQuestion.answer) {
      setQuizFeedback({
        correct: true,
        msg: `🎉 TEPAT SEKALI! Jawaban: ${quizQuestion.answer}. ${quizQuestion.explanation}`
      });
      confetti({ particleCount: 60, spread: 50 });
    } else {
      setQuizFeedback({
        correct: false,
        msg: `Kurang tepat. Jawaban seharusnya adalah ${quizQuestion.answer}. (${quizQuestion.explanation})`
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
              SIMULASI LAB 4
            </span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Kalkulator Subnetting IPv4 & Laboratorium CIDR</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hitung Network ID, Broadcast ID, Subnet Mask Biner/Desimal, dan jumlah usable host secara real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs & Results */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat IPv4
              </label>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="misal 192.168.10.1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Prefix CIDR
              </label>
              <select
                value={prefix}
                onChange={(e) => setPrefix(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[8, 16, 24, 25, 26, 27, 28, 29, 30].map(p => (
                  <option key={p} value={p}>/{p}</option>
                ))}
              </select>
            </div>
          </div>

          {subnetDetails ? (
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                  Hasil Perhitungan Subnet
                </span>
                <div className="flex gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    {subnetDetails.ipClass}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {subnetDetails.scope}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs sm:text-sm font-mono">
                <div>
                  <span className="text-slate-400 block text-[11px] font-sans">Subnet Mask Desimal</span>
                  <span className="font-bold text-slate-800 dark:text-white">{subnetDetails.maskIp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-sans">Jumlah Usable Host</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{subnetDetails.usableHosts} Host</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] font-sans">Network ID (Alamat Awal)</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{subnetDetails.networkIp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-sans">Broadcast ID (Alamat Terakhir)</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{subnetDetails.broadcastIp}</span>
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[11px] font-sans">Rentang Host Valid (Min - Max)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {subnetDetails.firstHostIp} &mdash; {subnetDetails.lastHostIp}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-400 block text-[11px] font-sans">Representasi Biner Subnet Mask</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 break-all">{subnetDetails.binaryMask}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs">
              Format IP tidak valid. Harap gunakan format IPv4 standar (misal: 192.168.1.1).
            </div>
          )}
        </div>

        {/* Right Mini Quiz Challenge */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-purple-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-sm">
                <Award className="w-4 h-4" /> Tantangan Kuis Subnetting
              </div>
              <button
                onClick={generateNewQuiz}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition"
                title="Ganti Soal Baru"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Diberikan sebuah host IP <b className="font-mono text-purple-700 dark:text-purple-400">{quizQuestion.ip}/{quizQuestion.cidr}</b>.
            </p>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-purple-200 dark:border-slate-700 mb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Berapakah {quizQuestion.target === 'network' ? 'Network ID' : 'Broadcast ID'} untuk subnet host tersebut?
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={userQuizAns}
                onChange={(e) => setUserQuizAns(e.target.value)}
                placeholder="misal: 192.168.1.0"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-mono text-xs focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleCheckQuiz}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                Cek Jawaban Kuis
              </button>
            </div>
          </div>

          {quizFeedback && (
            <div className={`mt-4 p-3 rounded-xl text-xs font-medium border ${quizFeedback.correct ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-300'}`}>
              {quizFeedback.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
