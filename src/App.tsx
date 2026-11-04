import React, { useState, useEffect } from 'react';
import { 
  Kelas, 
  Modul, 
  JawabanSiswa, 
  LogAktivitas, 
  PesanDiskusi, 
  UserSession 
} from './types';
import { 
  subscribeKelas, 
  subscribeModul, 
  subscribeJawabanSiswa, 
  subscribeLogAktivitas, 
  subscribeDiskusi 
} from './services/firestoreService';
import { DEFAULT_KELAS, DEFAULT_MODUL } from './data/defaultData';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ModuleView } from './components/ModuleView';
import { EvaluationExam } from './components/EvaluationExam';
import { ResultModal } from './components/ResultModal';
import { StudentGradeHistory } from './components/StudentGradeHistory';
import { DiscussionForum } from './components/DiscussionForum';
import { AcademicCalendar } from './components/AcademicCalendar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Bell, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  // App state
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('elearning_kjd_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only keep if matching one of the official classes
        const isValid = DEFAULT_KELAS.some(k => k.nama.toLowerCase() === (parsed.kelas || '').toLowerCase());
        return isValid ? parsed : null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [kelasList, setKelasList] = useState<Kelas[]>(DEFAULT_KELAS);
  const [modulList, setModulList] = useState<Modul[]>(DEFAULT_MODUL);
  const [jawabanList, setJawabanList] = useState<JawabanSiswa[]>([]);
  const [logList, setLogList] = useState<LogAktivitas[]>([]);
  const [diskusiList, setDiskusiList] = useState<PesanDiskusi[]>([]);

  // Navigation & UI state
  const [currentTab, setCurrentTab] = useState<string>('materi');
  const [isAdminActive, setIsAdminActive] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [activeExamModul, setActiveExamModul] = useState<Modul | null>(null);
  const [lastExamResult, setLastExamResult] = useState<JawabanSiswa | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('elearning_kjd_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('elearning_kjd_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('elearning_kjd_theme', 'light');
    }
  }, [isDarkMode]);

  // Subscribe to Firestore Real-Time collections
  useEffect(() => {
    const unsubKelas = subscribeKelas((kelas) => setKelasList(kelas));
    const unsubModul = subscribeModul((moduls) => setModulList(moduls));
    const unsubJawaban = subscribeJawabanSiswa((jawaban) => {
      setJawabanList((prev) => {
        // If a new submission arrived, alert the user/teacher
        if (prev.length > 0 && jawaban.length > prev.length) {
          const newest = jawaban[0];
          setToastNotification(`📢 Evaluasi Baru Masuk: "${newest.siswaNama}" (${newest.siswaKelas}) telah menyelesaikan ${newest.modulJudul}!`);
        }
        return jawaban;
      });
    });
    const unsubLogs = subscribeLogAktivitas((logs) => setLogList(logs));
    const unsubDiskusi = subscribeDiskusi((messages) => setDiskusiList(messages));

    return () => {
      unsubKelas();
      unsubModul();
      unsubJawaban();
      unsubLogs();
      unsubDiskusi();
    };
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('elearning_kjd_user');
    setCurrentUser(null);
    setIsAdminActive(false);
    setActiveExamModul(null);
  };

  const pendingGradingCount = jawabanList.filter(j => j.status === 'Menunggu Penilaian').length;

  // Render Full Screen Exam if active
  if (activeExamModul && currentUser) {
    return (
      <EvaluationExam
        modul={activeExamModul}
        user={currentUser}
        onFinish={(result) => {
          setActiveExamModul(null);
          setLastExamResult(result);
          setCurrentTab('nilai');
        }}
        onCancel={() => setActiveExamModul(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsAdminActive(false);
        }}
        user={currentUser}
        onLogout={handleLogout}
        onOpenAdmin={() => {
          if (isAdminActive) {
            setIsAdminActive(false);
          } else {
            setIsAdminModalOpen(true);
          }
        }}
        isAdminActive={isAdminActive}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        pendingGradingCount={pendingGradingCount}
      />

      {/* Floating Real-time Toast Notification Banner */}
      {toastNotification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 w-full">
          <div className="p-3.5 rounded-2xl bg-blue-600 text-white text-xs sm:text-sm font-semibold shadow-lg flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-yellow-300 animate-bounce shrink-0" />
              <span>{toastNotification}</span>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-xs px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition shrink-0"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!currentUser && !isAdminActive ? (
          <LoginModal
            kelasList={kelasList}
            onLoginSiswa={(session) => {
              setCurrentUser(session);
              setCurrentTab('materi');
            }}
            onOpenAdminLogin={() => setIsAdminModalOpen(true)}
          />
        ) : isAdminActive ? (
          <AdminDashboard
            kelasList={kelasList}
            modulList={modulList}
            jawabanList={jawabanList}
            logList={logList}
            onCloseAdmin={() => setIsAdminActive(false)}
          />
        ) : (
          <div>
            {currentTab === 'materi' && (
              <ModuleView
                modulList={modulList}
                user={currentUser!}
                onStartEvaluation={(modul) => setActiveExamModul(modul)}
              />
            )}

            {currentTab === 'diskusi' && (
              <DiscussionForum
                user={currentUser!}
                messages={diskusiList}
                modulList={modulList}
              />
            )}

            {currentTab === 'kalender' && (
              <AcademicCalendar />
            )}

            {currentTab === 'nilai' && (
              <StudentGradeHistory
                user={currentUser!}
                submissions={jawabanList}
              />
            )}
          </div>
        )}
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => {
          setIsAdminModalOpen(false);
          setIsAdminActive(true);
        }}
      />

      {/* Result Modal after Exam Submission */}
      {lastExamResult && (
        <ResultModal
          result={lastExamResult}
          onClose={() => setLastExamResult(null)}
          onOpenSimulasi={() => {
            setLastExamResult(null);
            setCurrentTab('materi');
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">E-Learning Komputer &amp; Jaringan Dasar</span>
            <span>&bull;</span>
            <span>SMK Negeri 1 Singkawang &amp; SMK Mudita Singkawang</span>
          </div>
          <div className="text-[11px]">
            Terintegrasi dengan Firebase Cloud Firestore &amp; Single Page Application Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
