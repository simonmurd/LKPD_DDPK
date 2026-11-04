import React, { useState } from 'react';
import { KalenderAkademik } from '../types';
import { KALENDER_DEFAULT } from '../data/defaultData';
import { Calendar as CalendarIcon, Clock, Bell, Download, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AcademicCalendar: React.FC = () => {
  const [events] = useState<KalenderAkademik[]>(KALENDER_DEFAULT);
  const [notifStatus, setNotifStatus] = useState<string | null>(null);

  // Download iCal (.ics) file for seamless calendar import
  const handleDownloadICS = (item: KalenderAkademik) => {
    const formattedDate = item.tanggal.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//E-Learning KJD//Kalender Akademik SMK//ID',
      'BEGIN:VEVENT',
      `UID:${item.id}-${Date.now()}@elearning-kjd.edu`,
      `DTSTAMP:${formattedDate}T000000Z`,
      `DTSTART:${formattedDate}T010000Z`,
      `DTEND:${formattedDate}T030000Z`,
      `SUMMARY:${item.judul}`,
      `DESCRIPTION:${item.deskripsi} (Waktu: ${item.waktu})`,
      'LOCATION:Laboratorium Komputer & Jaringan Dasar SMK',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.judul.replace(/\s+/g, '_')}.ics`;
    link.click();
    URL.revokeObjectURL(url);

    setNotifStatus(`✓ Berhasil mengunduh berkas kalender .ics untuk "${item.judul}". Siap diimpor ke Google Calendar / Outlook!`);
  };

  // Direct Google Calendar Web URL
  const handleAddToGoogleCalendar = (item: KalenderAkademik) => {
    const startIso = item.tanggal.replace(/-/g, '') + 'T010000Z';
    const endIso = item.tanggal.replace(/-/g, '') + 'T030000Z';
    const title = encodeURIComponent(item.judul);
    const details = encodeURIComponent(`${item.deskripsi}\nWaktu: ${item.waktu}\nPlatform: E-Learning KJD SMK`);
    const location = encodeURIComponent('Lab Komputer SMK');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
  };

  // Push notification alert trigger
  const handleTestPushNotification = async (item: KalenderAkademik) => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(`🔔 Pengingat Ujian KJD: ${item.judul}`, {
          body: `Jadwal: ${item.tanggal} (${item.waktu}). Persiapkan materi dan modul Anda!`,
          icon: '/favicon.ico'
        });
        setNotifStatus(`🔔 Notifikasi push browser berhasil dikirim untuk jadwal "${item.judul}"!`);
        return;
      }
    }

    // In-app fallback toast
    setNotifStatus(`🔔 Peringatan Instan Ujian: ${item.judul} pada ${item.tanggal} (${item.waktu}). Segera pelajari modul!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            Kalender Akademik &amp; Jadwal Ujian KJD
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sinkronisasi jadwal evaluasi, praktikum laboratorium, dan tenggat waktu tugas dengan kalender pribadi Anda.
          </p>
        </div>
      </div>

      {notifStatus && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs sm:text-sm text-blue-900 dark:text-blue-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <span>{notifStatus}</span>
          </div>
          <button
            onClick={() => setNotifStatus(null)}
            className="text-xs font-bold text-blue-600 hover:underline shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  evt.kategori === 'Ujian'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {evt.kategori}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{evt.waktu}</span>
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {evt.judul}
              </h4>

              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
                <CalendarIcon className="w-4 h-4" />
                <span>Tanggal: {new Date(evt.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {evt.deskripsi}
              </p>
            </div>

            {/* Sync & Notification Action Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
              <button
                onClick={() => handleAddToGoogleCalendar(evt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Google Calendar
              </button>

              <button
                onClick={() => handleDownloadICS(evt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                title="Unduh berkas iCalendar (.ics)"
              >
                <Download className="w-3.5 h-3.5" /> Unduh .iCS
              </button>

              <button
                onClick={() => handleTestPushNotification(evt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition ml-auto"
                title="Kirim pengingat instan"
              >
                <Bell className="w-3.5 h-3.5 text-amber-500" /> Pengingat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
