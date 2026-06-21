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
import AdminDashboard from './components/AdminDashboard';

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
  Settings,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [guestView, setGuestView] = useState<'landing' | 'login'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    if (user.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else if (user.role === 'gurubk') {
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
      
      {/* Mobile Slide-out Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-55 lg:hidden" id="mobile-menu-drawer">
          {/* Background shadow overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer Content Card */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl p-6 flex flex-col space-y-6 overflow-y-auto z-10 text-left animate-slide-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg shadow-xs">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-bold tracking-tight text-slate-800">
                  StudentCare BK
                </span>
              </div>
              
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition cursor-pointer"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile detail preview inside mobile drawer */}
            <div className="bg-slate-50/70 p-4 rounded-xl flex items-center space-x-3 text-left">
              <img
                src={currentUser.fotoUrl}
                alt={currentUser.nama}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {currentUser.nama.split(' ')[0]} {currentUser.nama.split(' ')[1] || ''}
                </h4>
                <p className="text-[9px] text-blue-605 font-bold uppercase tracking-wider mt-0.5">
                  {currentUser.role === 'admin' 
                    ? 'Administrator' 
                    : currentUser.role === 'gurubk' 
                      ? 'Konselor BK' 
                      : `Siswa • ${currentUser.kelas}`}
                </p>
              </div>
            </div>

            {/* Main navigation list */}
            <nav className="flex-1 space-y-1.5" id="mobile-drawer-nav">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest px-2 mb-2">
                Navigasi Menu
              </p>
              
              {(currentUser.role === 'admin' ? [
                { id: 'admin-dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
                { id: 'posters', label: 'Pusat Poster Edukasi', icon: BookOpen },
                { id: 'settings', label: 'Pengaturan Profil', icon: Settings },
              ] : currentUser.role === 'gurubk' ? [
                { id: 'dashboard-bk', label: 'Dashboard Guru BK', icon: LayoutDashboard },
                { id: 'monitoring', label: 'Monitoring Kasus', icon: FolderLock },
                { id: 'counseling', label: 'Layanan E-Counseling', icon: MessageSquare },
                { id: 'posters', label: 'Pusat Poster Edukasi', icon: BookOpen },
                { id: 'settings', label: 'Pengaturan Profil', icon: Settings },
              ] : [
                { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
                { id: 'asesmen', label: 'Asesmen Kebutuhan', icon: ClipboardCheck },
                { id: 'pengaduan', label: 'Lapor Pengaduan', icon: AlertTriangle },
                { id: 'counseling', label: 'E-Counseling Chat', icon: MessageSquare },
                { id: 'posters', label: 'Pusat Poster Edukasi', icon: BookOpen },
                { id: 'settings', label: 'Pengaturan Profil', icon: Settings },
              ]).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 font-extrabold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout drawer item */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Keluar Sesi
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Top Main Navbar - Modern Corporate / School Branding */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-xs" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center">
              {/* Hamburger Toggle Button - only visible on mobile & tablet */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 -ml-1 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition cursor-pointer mr-2"
                title="Buka Menu Navigasi"
              >
                <Menu className="w-5.5 h-5.5" />
              </button>

              {/* App Logo */}
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl shadow-md shadow-blue-100">
                  <Shield className="w-5.5 h-5.5" />
                </div>
                <div className="text-left">
                  <span className="text-base font-bold tracking-tight text-slate-800 block md:inline-block">
                    Student<span className="text-blue-600">Care</span>
                  </span>
                  <span className="hidden xs:inline-block md:ml-2 px-2.5 py-0.5 text-[8px] font-extrabold bg-blue-50 text-blue-700 rounded-md tracking-wider uppercase font-mono">
                    PORTAL BK
                  </span>
                </div>
              </div>
            </div>

            {/* Right side Profile controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleResetDemo}
                title="Atur Ulang Sinkronisasi Basis Data"
                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center space-x-2 text-left hover:opacity-85 transition cursor-pointer"
                  title="Buka Pengaturan Profil Anda"
                >
                  <img
                    src={currentUser.fotoUrl}
                    alt={currentUser.nama}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden md:block text-left">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                      {currentUser.nama.split(' ')[0]} {currentUser.nama.split(' ')[1] || ''}
                    </h4>
                    <p className="text-[9px] text-blue-600 font-bold capitalize leading-none tracking-wide font-mono mt-0.5">
                      {currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'gurubk' ? 'Konselor BK' : `Siswa`}
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6" id="app-body">

        {/* Quick Horizontal Swipeable Sub-Navigator Tabs - Exceptional user-experience on Phone / Tablet */}
        <div className="lg:hidden mb-4 overflow-x-auto pb-2 scrollbar-none" id="mobile-quick-nav">
          <div className="flex space-x-2 whitespace-nowrap px-1">
            {(currentUser.role === 'admin' ? [
              { id: 'admin-dashboard', label: 'Admin', icon: LayoutDashboard },
              { id: 'posters', label: 'Edukasi', icon: BookOpen },
              { id: 'settings', label: 'Profil Saya', icon: Settings },
            ] : currentUser.role === 'gurubk' ? [
              { id: 'dashboard-bk', label: 'Dashboard BK', icon: LayoutDashboard },
              { id: 'monitoring', label: 'Monitoring', icon: FolderLock },
              { id: 'counseling', label: 'Layanan Chat', icon: MessageSquare },
              { id: 'posters', label: 'Edukasi', icon: BookOpen },
              { id: 'settings', label: 'Profil Saya', icon: Settings },
            ] : [
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'asesmen', label: 'Asesmen', icon: ClipboardCheck },
              { id: 'pengaduan', label: 'Lapor', icon: AlertTriangle },
              { id: 'counseling', label: 'Chat BK', icon: MessageSquare },
              { id: 'posters', label: 'Edukasi', icon: BookOpen },
              { id: 'settings', label: 'Profil Saya', icon: Settings },
            ]).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs shadow-blue-50'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Side panel menu Navigation tabs selection */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-3 mb-2 text-left">
                Main Navigator
              </p>

              {currentUser.role === 'admin' ? (
                /* Admin Links */
                <nav className="space-y-1" id="admin-navigation">
                  <button
                    onClick={() => setActiveTab('admin-dashboard')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'admin-dashboard' 
                        ? 'sidebar-active text-purple-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-purple-600" />
                    <span>Dashboard Admin</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('posters')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'posters' 
                        ? 'sidebar-active text-purple-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span>Pusat Poster Edukasi</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                      activeTab === 'settings' 
                        ? 'sidebar-active text-purple-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Settings className="w-4 h-4 text-purple-600" />
                    <span>Pengaturan Profil</span>
                  </button>
                </nav>
              ) : isSiswa ? (
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

            {activeTab === 'admin-dashboard' && currentUser.role === 'admin' && (
              <AdminDashboard 
                currentUser={currentUser} 
                onRefreshDatabase={refreshComponentDb} 
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
