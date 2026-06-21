import React, { useState } from 'react';
import { User } from '../types';
import { getAppDatabase, saveAppDatabase } from '../data/mockData';
import { 
  User as UserIcon, 
  Mail, 
  School, 
  Camera, 
  Save, 
  RotateCcw, 
  Check, 
  Upload, 
  Sparkles,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

interface SettingsProfilProps {
  currentUser: User;
  onRefreshDatabase: (updatedUser: User) => void;
}

// Beautiful default avatars list for instant choice
const DEFAULT_AVATARS = [
  {
    id: 'avatar_student_boy',
    label: 'Siswa Laki-Laki',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    role: 'siswa'
  },
  {
    id: 'avatar_student_girl',
    label: 'Siswi Perempuan',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    role: 'siswa'
  },
  {
    id: 'avatar_student_young',
    label: 'Siswa Casual',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    role: 'siswa'
  },
  {
    id: 'avatar_teacher_female',
    label: 'Konselor Wanita',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    role: 'gurubk'
  },
  {
    id: 'avatar_teacher_male',
    label: 'Konselor Pria',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
    role: 'gurubk'
  },
  {
    id: 'avatar_neutral_slate',
    label: 'Default Klasik',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    role: 'all'
  }
];

export default function SettingsProfil({ currentUser, onRefreshDatabase }: SettingsProfilProps) {
  const [nama, setNama] = useState(currentUser.nama);
  const [email, setEmail] = useState(currentUser.email || '');
  const [kelas, setKelas] = useState(currentUser.kelas || '');
  const [fotoUrl, setFotoUrl] = useState(currentUser.fotoUrl || '');
  
  // File upload and drag states
  const [isDragging, setIsDragging] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isSiswa = currentUser.role === 'siswa';

  // Handle local picture upload (Drag and drop / file picker)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Switch to one of the beautiful pre-defined defaults
  const handleSelectDefaultAvatar = (url: string) => {
    setFotoUrl(url);
  };

  // Restore completely default profile settings
  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan profil ini ke pengaturan default bawaan sistem?')) {
      if (currentUser.role === 'gurubk') {
        setNama('Siti Rahmawati, S.Psi., M.Pd');
        setEmail('siti.rahmawati@school.sch.id');
        setKelas('');
        setFotoUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200');
      } else {
        // Default student templates depending on the username/id
        if (currentUser.username === 'siswa2') {
          setNama('Bunga Citra Lestari');
          setEmail('bunga.citra@school.sch.id');
          setKelas('X IPS 1');
          setFotoUrl('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200');
        } else {
          setNama('Ahmad Rafli Fauzi');
          setEmail('ahmad.rafli@school.sch.id');
          setKelas('XI MIPA 2');
          setFotoUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200');
        }
      }
      
      // Temporary Success notification
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      alert('Nama Lengkap tidak boleh kosong!');
      return;
    }

    const db = getAppDatabase();
    
    // Create copy of current user updated fields
    const updatedUser: User = {
      ...currentUser,
      nama: nama.trim(),
      email: email.trim(),
      kelas: isSiswa ? kelas.trim() : undefined,
      fotoUrl: fotoUrl.trim()
    };

    // Update in users database list
    db.users = db.users.map(u => u.id === currentUser.id ? updatedUser : u);
    
    // Update active currentUser session
    db.currentUser = updatedUser;
    
    // Save to LocalStorage
    saveAppDatabase(db);
    
    // Refresh parent state
    onRefreshDatabase(updatedUser);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6" id="settings-profil-root">
      {/* Decorative Header banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pengaturan Profil Pengguna</h2>
          <p className="text-xs text-slate-500">Konfigurasi info akun pribadi Anda, ganti foto avatar, atau kembalikan ke default bawaan sekolah.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Set Default Profil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* Left column: Visual Avatar Selection Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2 text-center pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Foto Profil Anda</h3>
            <p className="text-[11px] text-slate-400">Pratinjau visual foto yang akan dipasang pada akun bimbingan konseling.</p>
          </div>

          {/* Current Avatar Circle View with Camera badge overlay */}
          <div className="relative w-32 h-32 mx-auto group">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white ring-4 ring-blue-50 bg-slate-50 shadow-md">
              {fotoUrl ? (
                <img 
                  src={fotoUrl} 
                  alt={nama} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 text-slate-400 flex items-center justify-center font-black text-2xl uppercase">
                  {nama.slice(0, 2)}
                </div>
              )}
            </div>
            {/* Visual Icon */}
            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center p-1 shadow-md border-2 border-white cursor-pointer hover:bg-blue-700 transition"
                 onClick={() => document.getElementById('settings-avatar-picker')?.click()}>
              <Camera className="w-4 h-4" />
            </div>
          </div>

          {/* Choice of predefined modern avatars */}
          <div className="space-y-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-center">
              Pilih dari Default Avatars Terpilih
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEFAULT_AVATARS.filter(av => av.role === 'all' || av.role === currentUser.role).map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => handleSelectDefaultAvatar(av.url)}
                  className={`p-1.5 rounded-xl border transition text-center flex flex-col items-center justify-center gap-1 group cursor-pointer ${
                    fotoUrl === av.url 
                      ? 'border-blue-500 bg-blue-50/20' 
                      : 'border-slate-150 hover:bg-slate-50'
                  }`}
                  title={av.label}
                >
                  <img 
                    src={av.url} 
                    alt={av.label} 
                    className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[9px] font-bold text-slate-500 truncate max-w-full">
                    {av.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop File Upload Pattern */}
          <div className="space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-center">
              Atau Unggah Custom Foto
            </p>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('settings-avatar-picker')?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-1.5 ${
                isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-350 bg-slate-50/50'
              }`}
            >
              <input
                id="settings-avatar-picker"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-[11px] font-bold text-slate-705">Tarik foto baru ke sini</p>
                <p className="text-[9px] text-slate-400">atau Klik untuk milih berkas di galerimu</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Form details edited */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Detail Informasi Akun</h3>
              <p className="text-[11px] text-slate-400">Silakan ubah data bimbingan di bawah ini. ID Akun & Username bersifat terkunci.</p>
            </div>

            {/* Success message popup */}
            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pengaturan profil berhasil disinkronkan dan disimpan di data StudentCare!</span>
              </div>
            )}

            {/* Read-only Username info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">ID Pengguna</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.id}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-450 rounded-xl text-xs cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Username Login</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.username}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-450 rounded-xl text-xs cursor-not-allowed font-semibold"
                />
              </div>
            </div>

            {/* Editable Field: Full Name */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap Anda *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap Anda"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Editable Field: Email address */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">Alamat Email Akademik</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="Masukkan alamat email (contoh: budi@school.sch.id)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Editable Field: Class / Grade (If student) */}
            {isSiswa && (
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">Kelas / Jurusan Belajar</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <School className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Contoh: XI MIPA 2"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Security Note Alert card */}
            <div className="p-4 bg-blue-50/50 border border-blue-150 rounded-2xl flex gap-3 text-left">
              <UserCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                  Integrasi Akun StudentCare
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Perubahan profil di atas akan secara otomatis diterapkan ke semua form, surat laporan pengaduan, sertifikat/lembar hasil asesmen kebutuhan, serta ruang obrolan E-Counseling.
                </p>
              </div>
            </div>

            {/* Form actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                Atur Ulang
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-blue-105 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Perubahan
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
