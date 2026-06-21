import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getAppDatabase, saveAppDatabase, SYSTEM_USERS } from '../data/mockData';
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
  Compass,
  Check,
  UserPlus
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onBackToLanding: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', // Female student 1
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', // Male student 1
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', // Female student 2
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', // Male student 2
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', // Female 3
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', // Male 3
];

const PRESET_CLASSES = [
  'X MIPA 1', 'X MIPA 2', 'X IPS 1', 'X IPS 2',
  'XI MIPA 1', 'XI MIPA 2', 'XI IPS 1', 'XI IPS 2',
  'XII MIPA 1', 'XII MIPA 2', 'XII IPS 1', 'XII IPS 2'
];

export default function Login({ onLoginSuccess, onBackToLanding }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register states
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regKelas, setRegKelas] = useState('XI MIPA 2');
  const [regEmail, setRegEmail] = useState('');
  const [regAvatar, setRegAvatar] = useState(PRESET_AVATARS[0]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dbUsers, setDbUsers] = useState<User[]>([]);

  // Sync users list from localStorage
  useEffect(() => {
    const db = getAppDatabase();
    setDbUsers(db.users);
  }, [isRegister]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim()) {
      setError('Username dan Password wajib diisi.');
      return;
    }

    const db = getAppDatabase();
    // Search in local dynamic database first, fallback to static if somehow empty
    const matchedUser = db.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase().trim()
    ) || SYSTEM_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase().trim()
    );

    if (matchedUser) {
      // Allow any password in simulation, or simple check
      onLoginSuccess(matchedUser);
    } else {
      setError('Akun tidak ditemukan atau salah rincian. Silakan gunakan tombol daftar atau klik akun cepat di bawah.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regName.trim() || !regUsername.trim() || !regEmail.trim()) {
      setError('Mohon lengkapi semua field pendaftaran.');
      return;
    }

    const db = getAppDatabase();
    const sanitizedUsername = regUsername.toLowerCase().trim();

    // Check if username already exists
    const usernameTaken = db.users.some(u => u.username.toLowerCase() === sanitizedUsername);
    if (usernameTaken) {
      setError(`Username "${regUsername}" sudah digunakan. Silakan pilih username unik lainnya!`);
      return;
    }

    // Create new student
    const newStudent: User = {
      id: `user_siswa_${Date.now()}`,
      username: sanitizedUsername,
      nama: regName.trim(),
      role: 'siswa',
      kelas: regKelas,
      email: regEmail.trim(),
      fotoUrl: regAvatar
    };

    // Save student to local database users lists
    db.users.push(newStudent);
    saveAppDatabase(db);
    
    setSuccess('Pendaftaran berhasil! Mengalihkan ke sistem bimbingan konseling...');
    
    setTimeout(() => {
      onLoginSuccess(newStudent);
    }, 1500);
  };

  const handleDemoLogin = (user: User) => {
    setError('');
    setSuccess('');
    // Automatically match password in demo login
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
          Materi Edukasi & Beranda
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Logo/Icon Container */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-100/60 mx-auto">
          <Shield className="w-8 h-8" id="login-shield-icon" />
        </div>
        
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" id="login-title">
            Student<span className="text-blue-600">Care</span> BK
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium" id="login-subtitle">
            Ruang interaksi rahasia, terenkripsi, bimbingan konseling, dan lapor cyberbullying sekolahan Anda.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Main Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 max-w-sm mx-auto">
          <button
            onClick={() => { setIsRegister(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
              !isRegister ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk Akun BK
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
              isRegister ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Akun Siswa
          </button>
        </div>

        {/* Main Glass Card container */}
        <div className="bg-white/95 backdrop-blur-md py-8 px-5 sm:px-10 border border-slate-200/80 rounded-[32px] shadow-xl shadow-slate-100/80 text-left">
          
          {/* Notification Alerts */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2.5 font-bold leading-relaxed mb-5 animate-shake" id="login-error">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-ping"></span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-start gap-2.5 font-bold leading-relaxed mb-5" id="login-success">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span>{success}</span>
            </div>
          )}

          {!isRegister ? (
            /* Login Form */
            <form className="space-y-5" onSubmit={handleLogin} id="login-form">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Username Akun
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username Anda (contoh: siswa / gurubk / admin)"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-805 text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sandi simulasi (bebas isi apa saja)"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-805 text-sm font-medium transition"
                  />
                </div>
              </div>

              {/* Large trigger submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-100 font-black text-sm text-white bg-blue-600 hover:bg-blue-700 transition duration-155 cursor-pointer"
                >
                  Masuk Sistem Portal BK
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form className="space-y-4" onSubmit={handleRegister} id="register-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Hidayat"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Username Log In *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: rianhidayat (bebas spasi)"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Kelas Sekolah *
                  </label>
                  <select
                    value={regKelas}
                    onChange={(e) => setRegKelas(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-1 focus:ring-blue-500 font-medium transition text-slate-800"
                  >
                    {PRESET_CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Alamat Email Aktif *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: rian@sekolah.sch.id"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-805"
                  />
                </div>
              </div>

              {/* Avatar Selector Panel */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  Pilih Foto Profil Anda
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRegAvatar(avatar)}
                      className={`relative w-11 h-11 rounded-full overflow-hidden transition ring-offset-2 hover:scale-105 cursor-pointer ${
                        regAvatar === avatar ? 'ring-2 ring-blue-600' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={avatar} className="w-full h-full object-cover" alt="Student avatar default" />
                      {regAvatar === avatar && (
                        <div className="absolute inset-0 bg-blue-650/40 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white font-bold" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-2xl shadow-lg shadow-emerald-100/60 font-black text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Selesaikan & Daftar Akun Siswa
                </button>
              </div>
            </form>
          )}

          {/* Majestic Interactive Instant Login Simulasi Panel with Beautiful Badge Layouts */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-4">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Simulasi Cepat Masuk Sebagai Peran</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {/* Load roles in a beautiful badge card format */}
              {[
                {
                  id: 'user_siswa_1',
                  username: 'siswa',
                  nama: 'Ahmad Rafli Fauzi',
                  role: 'siswa',
                  kelas: 'XI MIPA 2',
                  fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
                  badge: 'Peran Siswa'
                },
                {
                  id: 'user_guru_1',
                  username: 'gurubk',
                  nama: 'Siti Rahmawati, S.Psi',
                  role: 'gurubk',
                  badge: 'Konselor Guru BK'
                },
                {
                  id: 'user_admin_1',
                  username: 'admin',
                  nama: 'Dr. H. Hermawan',
                  role: 'admin',
                  badge: 'Admin Utama (Sistem)'
                }
              ].map((demoUser) => (
                <button
                  key={demoUser.id}
                  type="button"
                  onClick={() => {
                    const db = getAppDatabase();
                    // Make sure they exist in the dynamic database
                    const matched = db.users.find(u => u.username === demoUser.username);
                    if (matched) {
                      handleDemoLogin(matched);
                    } else {
                      // fallback to sample object if not found
                      const fallbackUser: User = {
                        id: demoUser.id,
                        username: demoUser.username,
                        nama: demoUser.nama,
                        role: demoUser.role as any,
                        kelas: demoUser.kelas,
                        fotoUrl: demoUser.role === 'admin' 
                          ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' 
                          : demoUser.role === 'gurubk'
                            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
                            : demoUser.fotoUrl,
                        email: `${demoUser.username}@school.sch.id`
                      };
                      // Push to DB
                      db.users.push(fallbackUser);
                      saveAppDatabase(db);
                      handleDemoLogin(fallbackUser);
                    }
                  }}
                  className="flex flex-col items-center p-3 border border-slate-150 hover:border-blue-400 hover:bg-blue-50/10 rounded-2xl text-center transition duration-150 group cursor-pointer bg-slate-50/50"
                  id={`demo-${demoUser.username}`}
                >
                  <img
                    src={
                      demoUser.role === 'admin' 
                        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'
                        : demoUser.role === 'gurubk'
                          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
                          : demoUser.fotoUrl
                    }
                    alt={demoUser.nama}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs group-hover:scale-105 transition mb-2"
                  />
                  <h4 className="text-[11px] font-black text-slate-800 leading-tight group-hover:text-blue-600 transition truncate max-w-[120px]">
                    {demoUser.nama}
                  </h4>
                  <span className={`mt-1.5 px-2 py-0.5 text-[8px] font-extrabold rounded-md uppercase tracking-wider ${
                    demoUser.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : demoUser.role === 'gurubk'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {demoUser.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
        
        {/* Unified footer */}
        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          Keamanan terlindungi. Data diproteksi menggunakan standar enkripsi simpanan lokal.
        </p>
      </div>
    </div>
  );
}
