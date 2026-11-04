import React, { useState } from 'react';
import { Shield, KeyRound, Lock, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 123456 or guru-kjd or simon79
    if (pin === '123456' || pin === 'guru-kjd' || pin === 'admin' || pin === 'simon79') {
      setErrorMsg('');
      setPin('');
      onSuccess();
    } else {
      setErrorMsg('PIN / Kata Sandi Pengajar salah! (Gunakan default: 123456)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Autentikasi Guru KJD
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Masukkan PIN/Password untuk mengakses pusat penilaian dan bank soal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              PIN / Sandi Pengajar (Default: 123456)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan PIN 123456..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">{errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
          >
            Buka Dashboard Guru
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={() => setPin('123456')}
            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Isi Otomatis PIN Default (123456)
          </button>
        </div>
      </div>
    </div>
  );
};
