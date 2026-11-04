import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  text: string;
}

export const TerminalSimulator: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'output', text: 'Microsoft Windows [Version 10.0.19045.3803]' },
    { id: '2', type: 'output', text: '(c) Microsoft Corporation. All rights reserved.' },
    { id: '3', type: 'output', text: 'Laboratorium Komputer dan Jaringan Dasar SMK - Simulator CLI v2.4' },
    { id: '4', type: 'output', text: 'Ketik "help" untuk melihat daftar perintah utilitas jaringan yang tersedia.\n' }
  ]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleExecute = (cmdToRun?: string) => {
    const raw = (cmdToRun !== undefined ? cmdToRun : currentInput).trim();
    if (!raw) return;

    // Add input line
    const inputLine: TerminalLine = {
      id: `in-${Date.now()}`,
      type: 'input',
      text: `C:\\Users\\SiswaKJD> ${raw}`
    };

    setHistory(prev => [...prev, raw]);
    setHistoryIdx(-1);
    setCurrentInput('');

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] || '';

    let outText = '';

    if (cmd === 'cls' || cmd === 'clear') {
      setLines([]);
      return;
    } else if (cmd === 'help') {
      outText = `
Daftar Perintah Utilitas Jaringan KJD:
  ipconfig          Menampilkan konfigurasi IP address, subnet mask, dan gateway.
  ipconfig /all     Menampilkan detail menyeluruh termasuk MAC Address fisik dan DNS.
  ping [target]     Menguji konektivitas & latensi ke host (misal: ping 8.8.8.8, ping 127.0.0.1).
  tracert [target]  Melacak rute lompatan (hops) paket data hingga ke tujuan.
  nslookup [domain] Memeriksa resolusi nama domain ke IP (misal: nslookup smk.sch.id).
  netstat -an       Melihat port jaringan yang sedang aktif dan mendengarkan (listening).
  cls               Membersihkan layar terminal.
      `.trim();
    } else if (cmd === 'ipconfig') {
      if (raw.toLowerCase().includes('/all')) {
        outText = `
Windows IP Configuration
   Host Name . . . . . . . . . . . . : LAB-KJD-PC01
   Primary Dns Suffix  . . . . . . . : smk.sch.id
   Node Type . . . . . . . . . . . . : Hybrid
   IP Routing Enabled. . . . . . . . : No

Ethernet adapter Ethernet 0 (LAN Lab):
   Connection-specific DNS Suffix  . : lab.smk.sch.id
   Description . . . . . . . . . . . : Realtek PCIe GbE Family Controller
   Physical Address (MAC)  . . . . . : 3C-7C-3F-9A-12-88
   DHCP Enabled. . . . . . . . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 192.168.10.45(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.10.1
   DHCP Server . . . . . . . . . . . : 192.168.10.1
   DNS Servers . . . . . . . . . . . : 192.168.10.1
                                       8.8.8.8
        `.trim();
      } else {
        outText = `
Windows IP Configuration

Ethernet adapter Ethernet 0:
   Connection-specific DNS Suffix  . : lab.smk.sch.id
   IPv4 Address. . . . . . . . . . . : 192.168.10.45
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.10.1
        `.trim();
      }
    } else if (cmd === 'ping') {
      const target = arg || '127.0.0.1';
      if (target === '127.0.0.1' || target === 'localhost') {
        outText = `
Pinging ${target} with 32 bytes of data:
Reply from ${target}: bytes=32 time<1ms TTL=128
Reply from ${target}: bytes=32 time<1ms TTL=128
Reply from ${target}: bytes=32 time<1ms TTL=128
Reply from ${target}: bytes=32 time<1ms TTL=128

Ping statistics for ${target}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
[Diagnosa: Loopback Adapter TCP/IP stack lokal berfungsi normal!]
        `.trim();
      } else if (target === '192.168.10.1' || target === '8.8.8.8' || target.includes('google') || target.includes('smk')) {
        outText = `
Pinging ${target} with 32 bytes of data:
Reply from ${target}: bytes=32 time=14ms TTL=57
Reply from ${target}: bytes=32 time=12ms TTL=57
Reply from ${target}: bytes=32 time=16ms TTL=57
Reply from ${target}: bytes=32 time=11ms TTL=57

Ping statistics for ${target}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 11ms, Maximum = 16ms, Average = 13ms
        `.trim();
      } else {
        outText = `
Pinging ${target} with 32 bytes of data:
Request timed out.
Reply from 192.168.10.1: Destination host unreachable.
Request timed out.
Request timed out.

Ping statistics for ${target}:
    Packets: Sent = 4, Received = 1, Lost = 3 (75% loss)
        `.trim();
      }
    } else if (cmd === 'tracert') {
      const target = arg || '8.8.8.8';
      outText = `
Tracing route to ${target} over a maximum of 30 hops:

  1     1 ms     1 ms     1 ms  192.168.10.1 (Router Gateway Lab)
  2     4 ms     3 ms     4 ms  10.200.0.1 (Router Utama Sekolah)
  3    12 ms    11 ms    12 ms  180.252.12.1 (ISP Telkom Indihome Gateway)
  4    15 ms    14 ms    15 ms  dns.google [${target}]

Trace complete.
      `.trim();
    } else if (cmd === 'nslookup') {
      const target = arg || 'smk.sch.id';
      outText = `
Server:  dns.google
Address:  8.8.8.8

Non-authoritative answer:
Name:    ${target}
Address: 104.21.45.188
Aliases: www.${target}
      `.trim();
    } else if (cmd === 'netstat') {
      outText = `
Active Connections

  Proto  Local Address          Foreign Address        State
  TCP    192.168.10.45:49682    142.250.196.110:443    ESTABLISHED
  TCP    192.168.10.45:51204    52.114.158.50:443      ESTABLISHED
  TCP    0.0.0.0:80             0.0.0.0:0              LISTENING
  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING
      `.trim();
    } else {
      outText = `'${cmd}' is not recognized as an internal or external command, operable program or batch file. Ketik "help" untuk panduan.`;
    }

    setLines(prev => [
      ...prev,
      inputLine,
      { id: `out-${Date.now()}`, type: 'output', text: outText }
    ]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
              SIMULASI LAB 5
            </span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Virtual Command Prompt & Troubleshooting Jaringan</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Uji perintah diagnosa jaringan Windows (ping, ipconfig, tracert, nslookup, netstat) secara interaktif.
          </p>
        </div>

        <button
          onClick={() => handleExecute('cls')}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <RotateCcw className="w-4 h-4" /> Bersihkan Layar (cls)
        </button>
      </div>

      {/* Quick Command Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pintasan Cepat:</span>
        {[
          'ipconfig /all',
          'ping 127.0.0.1',
          'ping 192.168.10.1',
          'ping 8.8.8.8',
          'tracert 8.8.8.8',
          'nslookup smk.sch.id',
          'netstat -an',
          'help'
        ].map((quick) => (
          <button
            key={quick}
            onClick={() => handleExecute(quick)}
            className="px-2.5 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-600 dark:hover:text-teal-400 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 transition"
          >
            {quick}
          </button>
        ))}
      </div>

      {/* Terminal Window Box */}
      <div className="bg-slate-950 text-emerald-400 font-mono rounded-xl p-4 sm:p-5 border-2 border-slate-800 shadow-2xl min-h-[380px] max-h-[500px] flex flex-col justify-between overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
            <span className="font-sans font-bold text-slate-300 ml-2">Command Prompt - KJD Network Diagnostic Tool</span>
          </div>
        </div>

        {/* Output Stream */}
        <div className="flex-1 overflow-y-auto space-y-2 text-xs sm:text-sm pr-2 leading-relaxed">
          {lines.map((line) => (
            <div key={line.id}>
              {line.type === 'input' ? (
                <div className="text-white font-bold">{line.text}</div>
              ) : (
                <pre className="text-slate-300 font-mono whitespace-pre-wrap">{line.text}</pre>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecute();
          }}
          className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs sm:text-sm"
        >
          <span className="text-white font-bold shrink-0">C:\Users\SiswaKJD&gt;</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="ketik perintah di sini (contoh: ping 8.8.8.8) lalu tekan Enter..."
            className="flex-1 bg-transparent text-emerald-300 font-mono focus:outline-none placeholder-slate-600"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded font-sans text-xs font-bold transition flex items-center gap-1"
          >
            <Play className="w-3 h-3" /> Jalankan
          </button>
        </form>
      </div>
    </div>
  );
};
