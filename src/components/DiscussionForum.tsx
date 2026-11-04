import React, { useState } from 'react';
import { PesanDiskusi, UserSession, Modul } from '../types';
import { kirimPesanDiskusi } from '../services/firestoreService';
import { MessageSquare, Send, Heart, User, Sparkles, Filter } from 'lucide-react';

interface Props {
  user: UserSession;
  messages: PesanDiskusi[];
  modulList: Modul[];
}

export const DiscussionForum: React.FC<Props> = ({ user, messages, modulList }) => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedModulTag, setSelectedModulTag] = useState<string>('Semua');
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    try {
      await kirimPesanDiskusi({
        pengirim: user.nama,
        role: user.role,
        kelas: user.kelas,
        sekolah: user.sekolah,
        pesan: trimmed,
        modulTerkait: selectedModulTag !== 'Semua' ? selectedModulTag : undefined,
        timestamp: new Date().toISOString(),
        suka: 0
      });
      setInputText('');
    } catch (err) {
      console.error('Failed to send discussion message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    if (selectedModulTag !== 'Semua' && msg.modulTerkait && msg.modulTerkait !== selectedModulTag) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            Forum Diskusi &amp; Tanya Jawab Kelas KJD
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ruang diskusi interaktif kelas KJD: ajukan kendala perakitan, tanya rumus subnetting, atau berbagi solusi troubleshooting jaringan.
          </p>
        </div>

        {/* Filter by Topic */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedModulTag}
            onChange={(e) => setSelectedModulTag(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="Semua">Semua Topik Modul</option>
            {modulList.map((m) => (
              <option key={m.id} value={m.kode}>{m.kode} - {m.judul.split('&')[0]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <form onSubmit={handleSend} className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <User className="w-4 h-4 text-blue-600" />
            <span>Posting sebagai: <b className="text-blue-600">{user.nama}</b> ({user.kelas})</span>
          </div>

          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tuliskan pertanyaan materi KJD, ide diskusi, atau kendala praktikum di sini..."
            className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Sematkan Topik Modul:</span>
              <select
                value={selectedModulTag}
                onChange={(e) => setSelectedModulTag(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              >
                <option value="Semua">Umum / Semua</option>
                {modulList.map((m) => (
                  <option key={m.id} value={m.kode}>{m.kode}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" /> Kirim Postingan
            </button>
          </div>
        </form>
      </div>

      {/* Stream Messages */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
            Belum ada diskusi untuk topik ini. Jadilah yang pertama memulai percakapan!
          </div>
        ) : (
          filteredMessages.map((msg, idx) => {
            const isGuru = msg.role === 'guru';

            return (
              <div
                key={msg.id || idx}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition ${
                  isGuru
                    ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isGuru
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {msg.pengirim.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {msg.pengirim}
                        </span>
                        {isGuru && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                            Guru KJD
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">({msg.kelas})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>

                  {msg.modulTerkait && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {msg.modulTerkait}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed pl-10 whitespace-pre-wrap">
                  {msg.pesan}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
