import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleClearStorage = () => {
    localStorage.removeItem('elearning_kjd_user');
    sessionStorage.clear();
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              Terjadi Kendala Tampilan
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Sistem mendeteksi kendala pada pemuatan data. Anda dapat memuat ulang halaman atau membersihkan sesi untuk kembali ke halaman utama.
            </p>

            {this.state.error && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-left text-[11px] font-mono text-slate-500 mb-6 max-h-28 overflow-y-auto">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Muat Ulang Halaman
              </button>
              <button
                onClick={this.handleClearStorage}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> Beranda Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
