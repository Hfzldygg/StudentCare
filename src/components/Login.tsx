import React, { useState } from 'react';
import { User } from '../types';
import { SYSTEM_USERS } from '../data/mockData';
import { 
  Shield, 
  BookOpen, 
  Key, 
  UserCheck, 
  HelpCircle, 
  ArrowLeft,
  Sparkles,
  Lock,
  ChevronRight,
  User as UserIcon,
  Compass
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onBackToLanding: () => void;
}

export default function Login({ onLoginSuccess, onBackToLanding }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username dan Password wajib diisi.');
      return;
    }

    const matchedUser = SYSTEM_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase().trim()
    );

    if (matchedUser) {
      setError('');
      onLoginSuccess(matchedUser);
    } else {
      setError('Akun tidak ditemukan. Silakan hubungi operator sekolah atau gunakan Akun Simulasi di bawah.');
    }
  };

  const handleDemoLogin = (user: User) => {
    setError('');
    setUsername(user.username);
    setPassword('secret123');
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden" id="login-container">
      
      {/* Soft color splashes inside background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl -z-10"></div>

      {/* Floating Header Actions */}
      <div className="absolute top-6 left-6 sm:left-12">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/60 rounded-2xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          Kelebihan & Beranda
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Logo/Icon Container */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-100/60 mx-auto">
          <Shield className="w-8 h-8" id="login-shield-icon" />
        </div>
        
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" id="login-title">
            Student<span className="text-blue-600">Care</span> Gateway
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium" id="login-subtitle">
            Ruang interaksi rahasia, terenkripsi, dan bimbingan konseling digital sekolah Anda.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Main Glass Card container */}
        <div className="bg-white/95 backdrop-blur-md py-8 px-5 sm:px-10 border border-slate-200/80 rounded-[32px] shadow-xl shadow-slate-100/80">
          
          <form className="space-y-5" onSubmit={handleLogin} id="login-form">
            
            {/* Warning / Error Indicator */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2.5 font-semibold leading-relaxed animate-shake" id="login-error">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Form Input fields formatted cleanly */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="username-input">
                Username Akun
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  id="username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username (contoh: siswa)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800 text-sm font-medium transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="password-input">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi guru/siswa"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800 text-sm font-medium transition"
                />
              </div>
            </div>

            {/* Quick Remember preferences selection */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                />
                <span className="ml-2 text-xs text-slate-500 font-bold">
                  Ingat saya di browser
                </span>
              </label>

              <div className="text-xs">
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Hubungi guru bimbingan konseling di sekolah untuk mereset sandi Anda.'); }} className="font-bold text-blue-600 hover:text-blue-700 transition">
                  Lupa password?
                </a>
              </div>
            </div>

            {/* Large trigger submit button */}
            <div className="pt-2">
              <button
                type="submit"
                id="login-submit-button"
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-100 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition duration-155 cursor-pointer"
              >
                Masuk Sistem StudentCare
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Majestic Interactive Instant Login Simulasi Panel with Beautiful Badge Layouts */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-extrabold uppercase tracking-wide mb-4">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Akses Cepat Akun Simulasi</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SYSTEM_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleDemoLogin(user)}
                  className="flex items-center justify-between p-3.5 border border-slate-150 hover:border-blue-400 hover:bg-blue-50/10 rounded-2xl text-left transition duration-150 group cursor-pointer bg-[#FDFEFF]"
                  id={`demo-login-${user.username}`}
                >
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={user.fotoUrl}
                      alt={user.nama}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs group-hover:scale-105 transition"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-850 group-hover:text-blue-600 leading-tight transition">
                        {user.nama.split(' ')[0]} {user.nama.split(' ')[1] || ''}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold capitalize mt-0.5">
                        {user.role === 'gurubk' ? 'Guru BK' : 'Siswa'} {user.kelas ? `• ${user.kelas}` : ''}
                      </p>
                    </div>
                  </div>
                  <Compass className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:rotate-45 transition-all" />
                </button>
              ))}
            </div>
          </div>

        </div>
        
        {/* Unified footer */}
        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          Keamanan terlindungi. Data diproteksi menggunakan aturan privasi Guru BK.
        </p>
      </div>
    </div>
  );
}
