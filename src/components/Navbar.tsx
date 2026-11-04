import React from 'react';
import { UserSession } from '../types';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  Award, 
  Shield, 
  Moon, 
  Sun, 
  LogOut,
  User
} from 'lucide-react';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserSession | null;
  onLogout: () => void;
  onOpenAdmin: () => void;
  isAdminActive: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  pendingGradingCount: number;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  user,
  onLogout,
  onOpenAdmin,
  isAdminActive,
  isDarkMode,
  onToggleDarkMode,
  pendingGradingCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectTab('materi')}
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                E-Learning<span className="text-blue-600 dark:text-blue-400">KJD</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                SMK
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-none -mt-0.5 hidden sm:block">
              Komputer &amp; Jaringan Dasar
            </p>
          </div>
        </div>

        {/* Middle Navigation Tabs (visible when user logged in) */}
        {user && !isAdminActive && (
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold">
            {[
              { id: 'materi', label: 'Materi & Lab', icon: BookOpen },
              { id: 'diskusi', label: 'Forum Diskusi', icon: MessageSquare },
              { id: 'kalender', label: 'Kalender Ujian', icon: CalendarIcon },
              { id: 'nilai', label: 'Riwayat Nilai', icon: Award },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin Toggle Button */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              isAdminActive
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portal Guru</span>
            {pendingGradingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-mono">
                {pendingGradingCount}
              </span>
            )}
          </button>

          {/* User Profile Badge */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                  {user.nama}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                  {user.kelas} {user.sekolah ? `• ${user.sekolah.includes('MUDITA') ? 'SMK Mudita' : 'SMKN 1 SKW'}` : ''}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="Keluar (Logout)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
