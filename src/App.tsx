import React, { useState, useEffect } from 'react';
import { User } from './types';
import { getAppDatabase, saveAppDatabase, resetAppDatabase } from './data/mockData';

// Component modules imports
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import StudentAsesmen from './components/StudentAsesmen';
import StudentPengaduan from './components/StudentPengaduan';
import ECounseling from './components/ECounseling';
import PosterEdukasi from './components/PosterEdukasi';
import CounselorDashboard from './components/CounselorDashboard';
import CaseMonitoring from './components/CaseMonitoring';
import SettingsProfil from './components/SettingsProfil';

import { 
  Shield, 
  LayoutDashboard, 
  ClipboardCheck, 
  AlertTriangle, 
  MessageSquare, 
  BookOpen, 
  Users, 
  LogOut, 
  ArrowRight, 
  LifeBuoy, 
  Sparkles, 
  User as UserIcon,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  FolderLock,
  Settings
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [guestView, setGuestView] = useState<'landing' | 'login'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Load user session on start
  useEffect(() => {
    const db = getAppDatabase();
    if (db.currentUser) {
      setCurrentUser(db.currentUser);
    }
    setIsDbLoaded(true);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    
    // Save current user session inside DB
    const db = getAppDatabase();
    db.currentUser = user;
    saveAppDatabase(db);
    
    // Redirect appropriately
    if (user.role === 'gurubk') {
      setActiveTab('dashboard-bk');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    const db = getAppDatabase();
    db.currentUser = null;
    saveAppDatabase(db);
    setCurrentUser(null);
  };

  const handleResetDemo = () => {
    if (confirm('Atur ulang seluruh simulasi basis data StudentCare kembali ke awal?')) {
      const defaultDb = resetAppDatabase();
      setCurrentUser(defaultDb.users[0]); // defaults back to siswa Ahmad
      setActiveTab('dashboard');
      window.location.reload();
    }
  };

  const handleSwapUserDemo = (targetUsername: string) => {
    const db = getAppDatabase();
    const matched = db.users.find(u => u.username === targetUsername);
    if (matched) {
      handleLogin(matched);
    }
  };

  const refreshComponentDb = () => {
    // Triggers a component update to sync shared records
    setIsDbLoaded(prev => !prev);
    setTimeout(() => setIsDbLoaded(true), 50);
  };

  if (!isDbLoaded) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    if (guestView === 'landing') {
      return (
        <LandingPage 
          onGetStarted={() => setGuestView('login')} 
          onSelectRole={() => setGuestView('login')} 
        />
      );
    }
    return (
      <Login 
        onLoginSuccess={handleLogin} 
        onBackToLanding={() => setGuestView('landing')} 
      />
    );
  }

  // Load latest state
  const db = getAppDatabase();
  const isSiswa = currentUser.role === 'siswa';

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900" id="studentcare-app">
      
      {/* Top Main Navbar - Modern Corporate / School Branding */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-xs" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* App Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl shadow-md shadow-blue-100">
                <Shield className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-800">
                  Student<span className="text-blue-600">Care</span>
                </span>
                <span className="hidden sm:inline-block ml-2 px-2.5 py-0.5 text-[8px] font-extrabold bg-blue-50 text-blue-700 rounded-md tracking-wider uppercase font-mono">
                  PORTAL LAYANAN BK
                </span>
              </div>
            </div>
            {/* Middle Logo Spacer to align header elements neutrally */}
            <div className="flex-1"></div>

            {/* Right side Profile controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleResetDemo}
                title="Atur Ulang Sinkronisasi Basis Data"
                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-200">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center space-x-2 text-left hover:opacity-80 transition cursor-pointer"
                  title="Buka Pengaturan Profil Anda"
                >
                  <img
                    src={currentUser.fotoUrl}
                    alt={currentUser.nama}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden sm:block text-left">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                      {currentUser.nama.split(' ')[0]} {currentUser.nama.split(' ')[1] || ''}
                    </h4>
                    <p className="text-[9px] text-blue-600 font-bold capitalize leading-none tracking-wide font-mono mt-0.5 animate-pulse">
                      {currentUser.role === 'gurubk' ? 'Konselor BK' : `Siswa • ${currentUser.kelas}`}
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  title="Keluar"
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="app-body">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side panel menu Navigation tabs selection */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-3 mb-2 text-left">
                Main Navigator
              </p>

              {isSiswa ? (
                /* Siswa Links */
                <nav className="space-y-1" id="siswa-navigation">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'dashboard' 
                        ? 'sidebar-active text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard Utama</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('asesmen')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'asesmen' 
                        ? 'sidebar-active text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Asesmen Kebutuhan</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('pengaduan')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'pengaduan' 
                        ? 'sidebar-active text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Lapor Pengaduan</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('counseling')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'counseling' 
                        ? 'sidebar-active text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>E-Counseling Chat</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('posters')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'posters' 
                        ? 'sidebar-active text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Pusat Poster Edukasi</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'settings' 
                        ? 'sidebar-active text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Pengaturan Profil</span>
                  </button>
                </nav>
              ) : (
                /* Counselor BK links */
                <nav className="space-y-1" id="counselor-navigation">
                  <button
                    onClick={() => setActiveTab('dashboard-bk')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'dashboard-bk' 
                        ? 'sidebar-active text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard Guru BK</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('monitoring')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'monitoring' 
                        ? 'sidebar-active text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FolderLock className="w-4 h-4" />
                    <span>Monitoring Kasus</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('counseling')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'counseling' 
                        ? 'sidebar-active text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Layanan E-Counseling</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('posters')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'posters' 
                        ? 'sidebar-active text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Pusat Poster Edukasi</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'settings' 
                        ? 'sidebar-active text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Pengaturan Profil</span>
                  </button>
                </nav>
              )}
            </div>

            {/* Helper call card */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white text-left space-y-3 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-blue-550/10 rounded-full blur-xl"></div>
              <LifeBuoy className="w-7 h-7 text-blue-400" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold leading-tight">Butuh Konsultasi Mendadak?</h4>
                <p className="text-[10px] text-slate-350 leading-normal">
                  Hubungi Guru BK di E-Counseling atau isi Formulir Pengaduan jika kamu merasa mengalami perlakuan tidak adil di media sosial siber atau di lingkungan sekolah.
                </p>
              </div>
            </div>
          </aside>

          {/* Main content display area */}
          <section className="lg:col-span-9" id="dynamic-content-canvas">
            {activeTab === 'dashboard' && isSiswa && (
              /* Siswa Dashboard view */
              <div className="space-y-6 text-left" id="student-dashboard">
                
                {/* Greeting banner */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                      Selamat Datang Kembali, <span className="text-blue-600 font-bold">{currentUser.nama}</span>
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                      Mari bersama-sama ciptakan lingkungan sekolah aman bebas dari cyberbullying. Kamu bisa mengecek status konselingmu atau membaca poster tips pengembangan diri terbaru.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('asesmen')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-100 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
                    Ambil Asesmen Kebutuhan
                  </button>
                </div>

                {/* Dashboard grid links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Card 1: E counseling shortcut */}
                  <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-48 hover:border-blue-200 transition-colors">
                    <div className="space-y-2">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">Ruangan E-Counseling</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Konsultasi secara privat online dengan Ibu Siti Rahmawati, M.Pd demi kenyamanan bimbingan psikologismu.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('counseling')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-3 cursor-pointer transition-colors"
                    >
                      Mulai Konseling <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 2: Report shortcut */}
                  <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-48 hover:border-blue-200 transition-colors">
                    <div className="space-y-2">
                      <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">Pengaduan Permasalahan</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Alat bantu melaporkan tindakan bully fisik maupun cyberbullying secara anonim aman terlindungi.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('pengaduan')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-3 cursor-pointer transition-colors"
                    >
                      Laporkan Aduan <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Poster promo banner */}
                <div className="poster-gradient rounded-2xl p-6 text-white text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 bg-white/20 rounded text-[9px] font-extrabold uppercase">Tips Edukasi Utama</span>
                    <h3 className="text-base font-bold">Panduan Sopan di Dunia Digital (Netiket)</h3>
                    <p className="text-xs text-blue-50 leading-relaxed max-w-xl">
                      Sadarkah kamu jejak digital di dunia internet bersifat abadi? Cari tahu etika berkomentar sosial media di Pusat Poster Edukasi kami.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('posters')}
                    className="px-4 py-2.5 bg-white text-blue-800 font-bold text-xs rounded-xl shadow hover:bg-slate-50 transition whitespace-nowrap cursor-pointer"
                  >
                    Buka Perpustakaan
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && !isSiswa && (
              /* Fallback routing for BK Dashboard */
              <CounselorDashboard 
                currentUser={currentUser} 
                onRefreshDatabase={refreshComponentDb}
                onNavigateToTab={(tab) => {
                  if (tab === 'counseling' || tab === 'monitoring') {
                    setActiveTab(tab);
                  }
                }}
              />
            )}

            {activeTab === 'dashboard-bk' && (
              <CounselorDashboard 
                currentUser={currentUser} 
                onRefreshDatabase={refreshComponentDb}
                onNavigateToTab={(tab) => {
                  if (tab === 'counseling' || tab === 'monitoring') {
                    setActiveTab(tab);
                  }
                }}
              />
            )}

            {activeTab === 'asesmen' && (
              <StudentAsesmen currentUser={currentUser} onRefreshDatabase={refreshComponentDb} />
            )}

            {activeTab === 'pengaduan' && (
              <StudentPengaduan currentUser={currentUser} onRefreshDatabase={refreshComponentDb} />
            )}

            {activeTab === 'counseling' && (
              <ECounseling currentUser={currentUser} onRefreshDatabase={refreshComponentDb} />
            )}

            {activeTab === 'posters' && (
              <PosterEdukasi currentUser={currentUser} onRefreshDatabase={refreshComponentDb} />
            )}

            {activeTab === 'monitoring' && (
              <CaseMonitoring onRefreshDatabase={refreshComponentDb} />
            )}

            {activeTab === 'settings' && (
              <SettingsProfil 
                currentUser={currentUser} 
                onRefreshDatabase={(updatedUser) => {
                  setCurrentUser(updatedUser);
                  refreshComponentDb();
                }} 
              />
            )}
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400 font-medium">
        StudentCare &copy; 2026 • Sistem Informasi Layanan Bimbingan & Konseling Sekolah Berbasis Digital • Hak Cipta Dilindungi Undang-Undang
      </footer>

    </div>
  );
}
