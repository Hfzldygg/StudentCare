import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Heart, 
  ArrowRight, 
  Play, 
  Calendar, 
  Lock, 
  ClipboardCheck, 
  AlertTriangle, 
  MessageSquare, 
  BookOpen, 
  Users, 
  CheckCircle, 
  School,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSelectRole: (role: string) => void;
}

export default function LandingPage({ onGetStarted, onSelectRole }: LandingPageProps) {
  // Smooth scroll helper for landing sections
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900" id="landing-root">
      
      {/* 1. Header/Navbar Section */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Group */}
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => scrollToSection('hero-section')}>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Student<span className="text-blue-600">Care</span>
              </span>
            </div>

            {/* Middle Nav Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
              <a href="#hero-section" onClick={(e) => { e.preventDefault(); scrollToSection('hero-section'); }} className="text-blue-600 hover:text-blue-700 transition">Beranda</a>
              <a href="#tentang" onClick={(e) => { e.preventDefault(); scrollToSection('tentang'); }} className="hover:text-slate-900 transition">Tentang</a>
              <a href="#layanan" onClick={(e) => { e.preventDefault(); scrollToSection('layanan'); }} className="hover:text-slate-900 transition">Layanan</a>
              <a href="#poster-edukasi" onClick={(e) => { e.preventDefault(); scrollToSection('layanan'); }} className="hover:text-slate-900 transition">Poster Edukasi</a>
              <a href="#statistics" onClick={(e) => { e.preventDefault(); scrollToSection('statistics'); }} className="hover:text-slate-900 transition">Untuk Guru BK</a>
              <a href="#kontak" onClick={(e) => { e.preventDefault(); scrollToSection('kontak'); }} className="hover:text-slate-900 transition font-medium text-slate-400">Kontak</a>
            </nav>

            {/* Header CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={onGetStarted}
                className="text-slate-600 hover:text-slate-900 font-bold text-sm px-4 py-2 transition cursor-pointer"
              >
                Masuk
              </button>
              <button 
                onClick={onGetStarted}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-blue-100/60 cursor-pointer flex items-center gap-1.5"
              >
                Daftar / Login
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="hero-section" className="relative pt-12 pb-20 overflow-hidden">
        {/* Soft floating ambient background ornaments */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-150/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-100/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content Column */}
            <div className="lg:col-span-5 text-left space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100/60 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Sistem Layanan Bimbingan & Konseling
              </div>

              {/* Spectacular Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] relative">
                  Student<span className="text-blue-600">Care</span>
                  <span className="inline-block text-red-500 animate-pulse ml-2">❤️</span>
                </h1>
                
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
                  Konseling mudah, aman, dan terpercaya untuk masa depan yang lebih baik.
                </h2>
              </div>

              {/* Description */}
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
                Platform digital untuk mendukung siswa dalam mengatasi permasalahan, meningkatkan kesehatan mental, dan meraih potensi terbaik bersama guru BK sekolah.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition cursor-pointer flex items-center justify-center gap-2 group text-sm sm:text-base"
                >
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  onClick={() => scrollToSection('layanan')}
                  className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm"
                >
                  <Play className="w-4 h-4 fill-slate-800 stroke-0" />
                  Pelajari Lebih Lanjut
                </button>
              </div>

            </div>

            {/* Hero Right Media Column - Beautifully replicates the mockup blob image and overlays */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-end">
              
              {/* Organic blob framing image path */}
              <div className="relative w-full max-w-[550px] aspect-square rounded-[40px] lg:rounded-[60px] overflow-hidden shadow-2xl border-4 border-white transform hover:rotate-1 transition-transform duration-500" id="hero-img-blob">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200" 
                  alt="Siswa StudentCare" 
                  className="w-full h-full object-cover object-center scale-102"
                  referrerPolicy="no-referrer"
                />
                {/* Visual Glass Tint Layer */}
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
              </div>

              {/* FLOATING BADGE 1: Konseling Online (Bottom-Left) */}
              <div className="absolute bottom-4 left-0 sm:-left-6 max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-xl flex items-start gap-3.5 text-left transform -translate-y-2 translate-x-2 sm:translate-x-0" id="badge-konseling">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Konseling Online</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Terhubung dengan guru BK kapan saja sesuai jadwal.</p>
                  <span className="inline-flex items-center gap-1.5 mt-1.5 text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                    Jadwal Tersedia
                  </span>
                </div>
              </div>

              {/* FLOATING BADGE 2: Aman & Rahasia (Top-Right) */}
              <div className="absolute top-4 right-0 sm:-right-6 bg-white/95 backdrop-blur-md py-3 px-4 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3 text-left transform translate-y-2 -translate-x-2 sm:translate-x-0" id="badge-privasu">
                <div className="w-8 h-8 rounded-full bg-blue-105 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-extrabold text-slate-900">Aman & Rahasia</h4>
                  <p className="text-[9px] text-slate-500 leading-tight">Data Anda terlindungi dengan sistem keamanan terbaik.</p>
                </div>
              </div>

              {/* FLOATING BADGE 3: Layanan Unggulan List (Bottom-Right) */}
              <div className="absolute bottom-8 right-0 sm:-right-8 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-slate-100 shadow-2xl text-left hidden sm:block w-56" id="badge-layanan-list">
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">Layanan Unggulan</h4>
                <div className="space-y-2">
                  {[
                    { title: 'Asesmen Kebutuhan', color: 'text-emerald-500 bg-emerald-50' },
                    { title: 'Lapor Permasalahan', color: 'text-red-500 bg-red-50' },
                    { title: 'E-Counseling', color: 'text-blue-500 bg-blue-50' },
                    { title: 'Poster Edukasi', color: 'text-amber-500 bg-amber-50' }
                  ].map((srv, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 group cursor-pointer hover:translate-x-1 transition-transform">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-red-500' : idx === 2 ? 'bg-blue-500' : 'bg-amber-400'}`}></span>
                        <span className="text-[11px] font-bold text-slate-700">{srv.title}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Features Row Component (Centric Grid) */}
      <section id="layanan" className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1: Asesmen */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-5 hover:bg-slate-50 rounded-2xl transition duration-300 border border-transparent hover:border-slate-100 text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900">Asesmen Kebutuhan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Kenali diri dan kebutuhanmu melalui tes/asesmen yang valid dan terpercaya.</p>
              </div>
            </div>

            {/* Feature 2: Lapor */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-5 hover:bg-slate-50 rounded-2xl transition duration-300 border border-transparent hover:border-slate-100 text-left">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900">Lapor Permasalahan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Laporkan segala masalah, perundungan, atau cyberbullying secara aman rahasia.</p>
              </div>
            </div>

            {/* Feature 3: E-Counseling */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-5 hover:bg-slate-50 rounded-2xl transition duration-300 border border-transparent hover:border-slate-100 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900">E-Counseling</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Saluran konseling chat online yang interaktif, mudah, fleksibel, dan nyaman.</p>
              </div>
            </div>

            {/* Feature 4: Poster Edukasi */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-5 hover:bg-slate-50 rounded-2xl transition duration-300 border border-transparent hover:border-slate-100 text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900">Poster Edukasi</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Akses berbagai poster infografis edukasi berkaitan dengan pertumbuhan sosial & karir.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. About & Value Section */}
      <section id="tentang" className="py-20 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Value Visual Left Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800" 
                  alt="Konselor Guru BK mengajar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Value Text Right Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="p-1.5 px-3 bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase rounded-lg">KUALITAS DAN PRIVASI SEUTUHNYA</span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Kami Siap Mendengar & Membimbing Langkahmu</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Di StudentCare, kami menjunjung tinggi kode etik bimbingan konseling. Seluruh laporan bersifat private, terenkripsi, dan hanya dapat dilihat oleh Anda dan Guru BK bersangkutan. Ruang diskusi dirancang ramah untuk memfasilitasi kebutuhan emosional siswa.
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  'Setiap pengaduan dijamin 100% aman tanpa kebocoran data di luar bimbingan konseling.',
                  'Akses materi psikologi, tips belajar mandiri, dan tes asesmen valid secara gratis.',
                  'Layanan interaksi chat terjadwal langsung bersama ibu Siti Rahmawati, S.Psi., M.Pd.'
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">{point}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={onGetStarted}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Masuk Simulasi Sekarang
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Statistics Wave Banner (Replicated majestic bar layout) */}
      <section id="statistics" className="py-8 bg-[#FAFBFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative bg-blue-600 rounded-[32px] text-white p-8 sm:p-10 lg:p-12 overflow-hidden shadow-xl shadow-blue-150">
            {/* Wave Grid Aesthetic background vectors */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 text-center items-center divide-y lg:divide-y-0 lg:divide-x divide-white/20">
              
              {/* Stat 1 */}
              <div className="space-y-1 lg:px-4">
                <div className="flex justify-center"><Users className="w-6 h-6 opacity-80" /></div>
                <div className="text-2xl sm:text-3xl font-black">1.250+</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-bold uppercase tracking-wider">Siswa Terdaftar</div>
              </div>

              {/* Stat 2 */}
              <div className="space-y-1 pt-6 lg:pt-0 lg:px-4">
                <div className="flex justify-center"><CheckCircle className="w-6 h-6 opacity-80" /></div>
                <div className="text-2xl sm:text-3xl font-black">320+</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-bold uppercase tracking-wider">Konseling Selesai</div>
              </div>

              {/* Stat 3 */}
              <div className="space-y-1 pt-6 lg:pt-0 lg:px-4">
                <div className="flex justify-center"><Users className="w-6 h-6 opacity-80" /></div>
                <div className="text-2xl sm:text-3xl font-black">98%</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-bold uppercase tracking-wider">Kepuasan Pengguna</div>
              </div>

              {/* Stat 4 */}
              <div className="space-y-1 pt-6 lg:pt-0 lg:px-4">
                <div className="flex justify-center"><School className="w-6 h-6 opacity-80" /></div>
                <div className="text-2xl sm:text-3xl font-black">25+</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-bold uppercase tracking-wider">Sekolah Terpercaya</div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. Footer Line with heart symbol */}
      <footer id="kontak" className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex justify-center items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-600">
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>StudentCare hadir untuk mendukung setiap langkahmu menuju masa depan yang lebih baik.</span>
          </div>
          <div className="text-[11px] text-slate-400">
            StudentCare &copy; 2026 Admin bimbingan konseling sekolah. Seluruh hak cipta terlindungi secara penuh.
          </div>
        </div>
      </footer>

    </div>
  );
}
