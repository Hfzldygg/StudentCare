import React, { useState, useEffect } from 'react';
import { User, IncidentReport, CounselingAppointment, CaseMonitoring, EducationalPoster } from '../types';
import { getAppDatabase, saveAppDatabase } from '../data/mockData';
import { 
  Users, 
  UserCheck, 
  Shield, 
  Plus, 
  Pencil, 
  Trash2, 
  Database, 
  Settings, 
  AlertTriangle, 
  MessageSquare, 
  ClipboardCheck, 
  Sparkles, 
  X, 
  Search,
  Check,
  Building,
  Activity,
  UserX,
  BookOpen
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  onRefreshDatabase: () => void;
}

export default function AdminDashboard({ currentUser, onRefreshDatabase }: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'records' | 'settings'>('users');
  
  // Dynamic database states
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [appointments, setAppointments] = useState<CounselingAppointment[]>([]);
  const [monitoring, setMonitoring] = useState<CaseMonitoring[]>([]);
  const [posters, setPosters] = useState<EducationalPoster[]>([]);

  // Search states
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  // Modal / form states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // User form states
  const [userFormName, setUserFormName] = useState('');
  const [userFormUsername, setUserFormUsername] = useState('');
  const [userFormRole, setUserFormRole] = useState<'siswa' | 'gurubk' | 'admin'>('siswa');
  const [userFormKelas, setUserFormKelas] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPhoto, setUserFormPhoto] = useState('');

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load and refresh records
  const loadDatabase = () => {
    const db = getAppDatabase();
    setUsers(db.users || []);
    setReports(db.reports || []);
    setAppointments(db.appointments || []);
    setMonitoring(db.monitoring || []);
    setPosters(db.posters || []);
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // User operations
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormName || !userFormUsername || !userFormEmail) {
      triggerToast('Mohon lengkapi seluruh kolom wajib!', 'error');
      return;
    }

    const db = getAppDatabase();
    const cleanUsername = userFormUsername.toLowerCase().trim();

    if (db.users.some(u => u.username.toLowerCase() === cleanUsername)) {
      triggerToast('Username sudah dipakai oleh pengguna lain!', 'error');
      return;
    }

    const defaultPhotos = {
      siswa: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      gurubk: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      admin: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'
    };

    const newUser: User = {
      id: `user_${Date.now()}`,
      username: cleanUsername,
      nama: userFormName,
      role: userFormRole,
      kelas: userFormRole === 'siswa' ? (userFormKelas || 'X MIPA 1') : undefined,
      email: userFormEmail,
      fotoUrl: userFormPhoto || defaultPhotos[userFormRole]
    };

    db.users.push(newUser);
    saveAppDatabase(db);
    loadDatabase();
    onRefreshDatabase();
    
    // Clear and close
    setUserFormName('');
    setUserFormUsername('');
    setUserFormRole('siswa');
    setUserFormKelas('');
    setUserFormEmail('');
    setUserFormPhoto('');
    setShowAddUserModal(false);
    triggerToast('Akun pengguna berhasil ditambahkan ke sistem!', 'success');
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormName(user.nama);
    setUserFormUsername(user.username);
    setUserFormRole(user.role);
    setUserFormKelas(user.kelas || '');
    setUserFormEmail(user.email || '');
    setUserFormPhoto(user.fotoUrl || '');
    setShowEditUserModal(true);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!userFormName || !userFormUsername || !userFormEmail) {
      triggerToast('Mohon lengkapi seluruh kolom wajib!', 'error');
      return;
    }

    const db = getAppDatabase();
    const cleanUsername = userFormUsername.toLowerCase().trim();

    // Check conflict (excluding current editing user)
    const usernameConflict = db.users.some(
      u => u.id !== editingUser.id && u.username.toLowerCase() === cleanUsername
    );

    if (usernameConflict) {
      triggerToast('Username tersebut sudah dipakai pengguna lain!', 'error');
      return;
    }

    db.users = db.users.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          nama: userFormName,
          username: cleanUsername,
          role: userFormRole,
          kelas: userFormRole === 'siswa' ? userFormKelas : undefined,
          email: userFormEmail,
          fotoUrl: userFormPhoto
        };
      }
      return u;
    });

    // If current logged in user edited themselves, persist dynamic update
    if (db.currentUser && db.currentUser.id === editingUser.id) {
      db.currentUser = {
        ...db.currentUser,
        nama: userFormName,
        username: cleanUsername,
        role: userFormRole,
        kelas: userFormRole === 'siswa' ? userFormKelas : undefined,
        email: userFormEmail,
        fotoUrl: userFormPhoto
      };
    }

    saveAppDatabase(db);
    loadDatabase();
    onRefreshDatabase();
    setShowEditUserModal(false);
    setEditingUser(null);
    triggerToast('Rincian profil akun berhasil diperbarui!', 'success');
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser.id) {
      triggerToast('Anda tidak dapat menghapus akun Anda sendiri!', 'error');
      return;
    }

    if (confirm('Apakah Anda benar-benar yakin ingin menghapus akun pengguna ini? Semua hak akses akun akan segera dibekukan.')) {
      const db = getAppDatabase();
      db.users = db.users.filter(u => u.id !== id);
      saveAppDatabase(db);
      loadDatabase();
      onRefreshDatabase();
      triggerToast('Hubungan akun pengguna berhasil dihapus dari sistem.', 'success');
    }
  };

  // Record operation helpers
  const handleUpdateReportStatus = (id: string, newStatus: IncidentReport['status']) => {
    const db = getAppDatabase();
    db.reports = db.reports.map(r => {
      if (r.id === id) {
        return { ...r, status: newStatus };
      }
      return r;
    });
    saveAppDatabase(db);
    loadDatabase();
    triggerToast('Status laporan pengaduan berhasil disinkronisasi.', 'success');
  };

  const handleDeleteReport = (id: string) => {
    if (confirm('Hapus laporan pengaduan ini secara permanen dari basis data?')) {
      const db = getAppDatabase();
      db.reports = db.reports.filter(r => r.id !== id);
      saveAppDatabase(db);
      loadDatabase();
      triggerToast('Arsip laporan pengaduan berhasil dihapus.', 'success');
    }
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: CounselingAppointment['status']) => {
    const db = getAppDatabase();
    db.appointments = db.appointments.map(a => {
      if (a.id === id) {
        return { ...a, status: newStatus };
      }
      return a;
    });
    saveAppDatabase(db);
    loadDatabase();
    triggerToast('Jadwal bimbingan siswa berhasil diperbarui.', 'success');
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus sesi bimbingan konseling ini?')) {
      const db = getAppDatabase();
      db.appointments = db.appointments.filter(a => a.id !== id);
      saveAppDatabase(db);
      loadDatabase();
      triggerToast('Sesi janji temu bimbingan berhasil dihapus.', 'success');
    }
  };

  const handleDeletePoster = (id: string) => {
    if (confirm('Hapus poster pengumuman edukasi dari etalase bimbingan konseling?')) {
      const db = getAppDatabase();
      db.posters = db.posters.filter(p => p.id !== id);
      saveAppDatabase(db);
      loadDatabase();
      triggerToast('Materi pengumuman poster edukasi berhasil dihapus.', 'success');
    }
  };

  const handleResetSimulator = () => {
    if (confirm('INGAT: Tindakan ini akan mengosongkan seluruh relasi tabel, chat, dan status yang telah diedit serta mengembalikannya ke setelan pabrik awal. Lanjutkan?')) {
      localStorage.removeItem('studentcare_db_v1');
      window.location.reload();
    }
  };

  // Filtering users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.nama.toLowerCase().includes(searchUserQuery.toLowerCase()) || 
                          u.username.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
                          (u.email && u.email.toLowerCase().includes(searchUserQuery.toLowerCase())) ||
                          (u.kelas && u.kelas.toLowerCase().includes(searchUserQuery.toLowerCase()));
    
    const matchesRole = filterRole === 'all' ? true : u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Simple statistics counters
  const totalSiswa = users.filter(u => u.role === 'siswa').length;
  const totalGuru = users.filter(u => u.role === 'gurubk').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const solvedReports = reports.filter(r => r.status === 'Selesai').length;
  const pendingReports = reports.filter(r => r.status === 'Menunggu').length;

  return (
    <div className="space-y-6 text-left animate-fade-in" id="admin-management-module">
      
      {/* Simulation Banner Info */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl"></div>

        <div className="space-y-4 relative">
          <div className="flex bg-purple-500/20 border border-purple-500/30 text-purple-300 font-extrabold uppercase tracking-wider text-[9px] px-2.5 py-1 rounded-lg w-fit items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Mode Administrator Sistem Utama</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Halo, {currentUser.nama}!
            </h2>
            <p className="text-xs text-slate-350 leading-relaxed max-w-xl">
              Selamat datang di Panel Kontrol Simulasi Manajemen StudentCare. Sebagai Administrator, Anda memiliki otoritas penuh untuk mengatur data akun pengguna, memantau laporan terenkripsi, mengatur sesi guru bimbingan konseling, serta mengaudit pengumpulan basis data.
            </p>
          </div>
          
          <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold">
              <Database className="w-4 h-4 text-purple-400" />
              <span>Diagnostic Basis Data: </span>
              <span className="text-purple-300 font-mono">Simulasi Aktif (LocalStorage)</span>
            </div>
            <button
              onClick={handleResetSimulator}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white border border-purple-500 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-950/20"
            >
              <Database className="w-3.5 h-3.5" />
              Reset & Setel Ulang Sistem
            </button>
          </div>
        </div>
      </div>

      {/* Overview Analytics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-450 tracking-wider">Total Siswa</p>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">{totalSiswa} Siswa</h3>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-450 tracking-wider">Guru BK & Admin</p>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">{totalGuru + totalAdmins} Staf</h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-450 tracking-wider">Aduan Pending</p>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">{pendingReports} Laporan</h3>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-450 tracking-wider">Sesi Konseling</p>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">{appointments.length} Terjadwal</h3>
          </div>
        </div>
      </div>

      {/* Internal Management Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Navigation bar */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 border-t-0 whitespace-nowrap overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'users'
                ? 'bg-purple-650 text-white shadow-md'
                : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <Users className="w-4 h-4" />
            Manajemen Akun Pengguna ({users.length})
          </button>
          <button
            onClick={() => setActiveSubTab('records')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'records'
                ? 'bg-purple-650 text-white shadow-md'
                : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            Moderasi Data Layanan ({reports.length + appointments.length})
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'settings'
                ? 'bg-purple-650 text-white shadow-md'
                : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            Konfigurasi & Telemetri
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="p-6">
          {activeSubTab === 'users' && (
            /* User Management Subtab */
            <div className="space-y-5" id="admin-subtab-users">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900">Pengaturan Hak Akses & Profil Pengguna</h3>
                  <p className="text-[11px] text-slate-400">Arsip database siswa, guru konselor BK sekolahan, serta administrator pengurus sistem.</p>
                </div>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2.5 bg-purple-650 hover:bg-purple-750 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Akun Pengguna
                </button>
              </div>

              {/* Filtering Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Cari user berdasarkan nama, username, kelas, email..."
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-purple-600 transition text-slate-805"
                  />
                </div>

                <div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-purple-600 font-semibold transition text-slate-700"
                  >
                    <option value="all">Semua Peran / Role</option>
                    <option value="siswa">Peran: Siswa</option>
                    <option value="gurubk">Peran: Guru BK</option>
                    <option value="admin">Peran: Admin Sistem</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-4 py-3">Nama Lengkap & Informasi</th>
                        <th className="px-4 py-3">Username</th>
                        <th className="px-4 py-3">Peran (Role)</th>
                        <th className="px-4 py-3">Kelas / Identitas</th>
                        <th className="px-4 py-3 text-right">Tombol Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-450 font-bold">
                            Tidak ditemukan akun yang cocok dengan kata kunci pencarian Anda.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50/50 bg-white">
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={u.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                                  alt={u.nama}
                                  className="w-8 h-8 rounded-full object-cover border"
                                />
                                <div>
                                  <h4 className="font-extrabold text-slate-850">{u.nama}</h4>
                                  <p className="text-[10px] text-slate-400">{u.email || '@sekolah.sch.id'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-600 font-bold">{u.username}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700'
                                  : u.role === 'gurubk'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-[#E3FAF2] text-teal-800'
                              }`}>
                                {u.role === 'admin' ? 'Administrator' : u.role === 'gurubk' ? 'Guru BK' : 'Siswa'}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-550">
                              {u.kelas ? u.kelas : <span className="text-slate-400">-</span>}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditUser(u)}
                                  className="p-1.5 bg-slate-50 text-slate-600 hover:bg-slate-150 rounded-lg transition border border-slate-200 cursor-pointer"
                                  title="Edit Akun"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-1.5 bg-red-50 text-red-650 hover:bg-red-100 rounded-lg transition border border-red-200 cursor-pointer"
                                  title="Hapus Akun"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'records' && (
            /* Record list moderate dashboard */
            <div className="space-y-6" id="admin-subtab-records">
              {/* Complaint Audit */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    Bilik Audit Pengaduan Kasus Cyberbullying Siswa ({reports.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">Semua laporan aduan perundungan, siber, emosional atau intimidasi di sekolah.</p>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        <tr>
                          <th className="px-4 py-2.5">Tgl Melapor</th>
                          <th className="px-4 py-2.5">Pelapor & Kelas</th>
                          <th className="px-4 py-2.5">Rangkuman Aduan</th>
                          <th className="px-4 py-2.5">Status Laporan</th>
                          <th className="px-4 py-2.5 text-right">Aksi Moderasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reports.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-slate-400">Tidak ada pengaduan aktif.</td>
                          </tr>
                        ) : (
                          reports.map(r => (
                            <tr key={r.id} className="hover:bg-slate-50/50 bg-white">
                              <td className="px-4 py-3 font-medium text-slate-500 whitespace-nowrap">{r.date}</td>
                              <td className="px-4 py-3">
                                <span className="font-extrabold text-slate-800">{r.reporterName}</span>
                                <div className="text-[10px] text-slate-400">Kelas {r.reporterKelas}</div>
                              </td>
                              <td className="px-4 py-3 max-w-xs truncate">{r.description}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                  r.status === 'Selesai' 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : r.status === 'Ditinjau' 
                                      ? 'bg-amber-100 text-amber-800' 
                                      : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {r.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <select
                                    value={r.status}
                                    onChange={(e) => handleUpdateReportStatus(r.id, e.target.value as any)}
                                    className="p-1 px-1.5 bg-slate-50 hover:bg-slate-100 border rounded text-[10px] outline-none font-bold text-slate-700 transition cursor-pointer"
                                  >
                                    <option value="Menunggu">Sandi Menunggu</option>
                                    <option value="Ditinjau">Ditinjau</option>
                                    <option value="Selesai">Selesai</option>
                                  </select>
                                  <button
                                    onClick={() => handleDeleteReport(r.id)}
                                    className="p-1 text-red-650 hover:bg-red-50 rounded transition cursor-pointer"
                                    title="Hapus Laporan Permanen"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Consultation Appointment moderator */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="pb-2">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    Manajer Jadwal Bimbingan E-Counseling ({appointments.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">Jadwal konsultasi interaksi siswa secara tatap muka maupun online bersama Guru BK.</p>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        <tr>
                          <th className="px-4 py-2.5">Waktu Janji</th>
                          <th className="px-4 py-2.5">Siswa Pemohon</th>
                          <th className="px-4 py-2.5">Tipe & Tujuan</th>
                          <th className="px-4 py-2.5">Status Janji</th>
                          <th className="px-4 py-2.5 text-right">Sesuaikan / Moderasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {appointments.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-slate-400">Tidak ada janji bimbingan terjadwal.</td>
                          </tr>
                        ) : (
                          appointments.map(a => (
                            <tr key={a.id} className="hover:bg-slate-50/50 bg-white">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="font-extrabold text-slate-800">{a.date}</span>
                                <div className="text-[10px] text-slate-400">Pukul {a.time} WIB</div>
                              </td>
                              <td className="px-4 py-3 text-slate-800">
                                <span className="font-bold">{a.studentName}</span>
                                <div className="text-[10px] text-slate-400">Kelas {a.studentKelas}</div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                  a.type === 'Online' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
                                }`}>
                                  {a.type}
                                </span>
                                <p className="text-[10px] text-slate-500 mt-1 max-w-xxs truncate" title={a.reason}>{a.reason}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                  a.status === 'Selesai' 
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : a.status === 'Disetujui' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : a.status === 'Dibatalkan'
                                        ? 'bg-slate-100 text-slate-500'
                                        : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {a.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <select
                                    value={a.status}
                                    onChange={(e) => handleUpdateAppointmentStatus(a.id, e.target.value as any)}
                                    className="p-1 px-1.5 bg-slate-50 hover:bg-slate-100 border rounded text-[10px] outline-none font-bold text-slate-700 transition cursor-pointer"
                                  >
                                    <option value="Menunggu">Menunggu</option>
                                    <option value="Disetujui">Disetujui</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Dibatalkan">Dibatalkan</option>
                                  </select>
                                  <button
                                    onClick={() => handleDeleteAppointment(a.id)}
                                    className="p-1 text-red-650 hover:bg-red-50 rounded transition cursor-pointer"
                                    title="Hapus Sesi Bimbingan"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Poster Edukasi Admin Audit */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="pb-2">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    Manajemen & Audit Poster Edukasi ({posters.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">Audit atau moderasi seluruh artikel edukatif yang terbit untuk konsumsi siswa di perpustakaan.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {posters.map(p => (
                    <div key={p.id} className="bg-slate-50/50 p-4 rounded-2xl border flex items-start space-x-3 text-xs justify-between group">
                      <div className="flex items-start space-x-3">
                        <img src={p.imageUrl} alt={p.title} className="w-12 h-12 object-cover rounded-lg border bg-slate-100" />
                        <div>
                          <h4 className="font-extrabold text-slate-800 group-hover:text-purple-700 transition leading-tight">{p.title}</h4>
                          <span className="inline-block mt-1 text-[8px] bg-slate-100 text-slate-500 rounded px-1.5 font-bold">{p.category}</span>
                          <p className="text-[10px] text-slate-450 mt-1">Dibuat oleh: {p.author}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePoster(p.id)}
                        className="p-1.5 text-rose-650 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition cursor-pointer self-center"
                        title="Hapus Poster Secara Permanen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'settings' && (
            /* Parameters Telemetri Settings Tab */
            <div className="space-y-5" id="admin-subtab-settings">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900">Konfigurasi Parameter Sistem & Diagnostik</h3>
                <p className="text-[11px] text-slate-400 font-medium">Pengaturan simulasi yang mengontrol nama sekolahan dan melacak metrik di penyimpanan klien.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Branding options */}
                <div className="bg-slate-50/40 border rounded-3xl p-5 space-y-4">
                  <h4 className="text-xs font-black text-slate-850 uppercase tracking-widest text-[#553C9A] flex items-center gap-1.5">
                    <Building className="w-4 h-4" /> Atribut Sekolah
                  </h4>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-550 mb-1">Nama Instansi Sekolah</label>
                      <input 
                        type="text" 
                        readOnly 
                        value="SMA Swasta Nusantara Mandiri" 
                        className="w-full px-3 py-2 bg-white border rounded-xl text-slate-500 outline-none cursor-not-allowed font-medium" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-550 mb-1">Tahun Ajaran / Semester</label>
                      <input 
                        type="text" 
                        readOnly 
                        value="2026/2027 - Ganjil" 
                        className="w-full px-3 py-2 bg-white border rounded-xl text-slate-500 outline-none cursor-not-allowed font-medium" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-550 mb-1">Status Kunci Keamanan</label>
                      <div className="flex items-center space-x-2 text-green-700 font-bold bg-green-50 px-3 py-1.5 rounded-xl border border-green-150 w-fit">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Sistem Sandbox Terenkripsi Aktif</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Telemetry metadata stats */}
                <div className="bg-gradient-to-tr from-slate-900 to-slate-850 text-white rounded-3xl p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-purple-300 flex items-center gap-1.5">
                    <Database className="w-4 h-4" /> Telemetri Penyimpanan Klien
                  </h4>
                  
                  <div className="space-y-3.5 text-xs text-slate-300">
                    <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                      <span className="font-medium text-slate-400">Total Akun Terdaftar:</span>
                      <span className="font-mono text-white font-bold">{users.length} Akun</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                      <span className="font-medium text-slate-400">Siswa Teridentifikasi:</span>
                      <span className="font-mono text-white font-bold">{totalSiswa} Pengguna</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                      <span className="font-medium text-slate-400">Laporan Pengaduan Aktif:</span>
                      <span className="font-mono text-white font-bold">{reports.length} File</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                      <span className="font-medium text-slate-400">Total Sesi Bimbingan BK:</span>
                      <span className="font-mono text-white font-bold">{appointments.length} Janji</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                      <span className="font-medium text-slate-400">Kebutuhan Asesmen Diisi:</span>
                      <span className="font-mono text-white font-bold">12 Total Isian</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                      <span className="font-medium text-slate-400">Penyimpanan Tipe:</span>
                      <span className="font-bold text-purple-300">HTML5 LocalStorage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in" id="add-user-modal">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-left space-y-5">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-450 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Tambah Akun Pengguna Ke Sistem</h3>
              <p className="text-[11px] text-slate-400">Wewenang administrator untuk mendaftarkan Siswa, Guru Konselor BK sekolahan, atau Admin baru.</p>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs font-semibold text-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Gunawan"
                    value={userFormName}
                    onChange={(e) => setUserFormName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 transition text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Username Log In *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: budigunawan"
                    value={userFormUsername}
                    onChange={(e) => setUserFormUsername(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 transition text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Peran Pengguna (Role) *</label>
                  <select
                    value={userFormRole}
                    onChange={(e) => setUserFormRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 font-bold transition text-slate-800"
                  >
                    <option value="siswa">Siswa</option>
                    <option value="gurubk">Guru BK / Konselor</option>
                    <option value="admin">Administratoristem</option>
                  </select>
                </div>

                {userFormRole === 'siswa' && (
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Kelas Sekolah *</label>
                    <input
                      type="text"
                      placeholder="Contoh: XI MIPA 3"
                      value={userFormKelas}
                      onChange={(e) => setUserFormKelas(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 transition text-slate-800"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Alamat Email Pengguna *</label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: budi@sekolah.sch.id"
                  value={userFormEmail}
                  onChange={(e) => setUserFormEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 transition text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Link URL Foto Profil (Opsional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... (atau kosongkan untuk default foto)"
                  value={userFormPhoto}
                  onChange={(e) => setUserFormPhoto(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 transition text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-650 hover:bg-purple-750 text-white rounded-xl shadow transition cursor-pointer font-black"
                >
                  Publish Akun Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in" id="edit-user-modal">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-left space-y-5">
            <button
              onClick={() => { setShowEditUserModal(false); setEditingUser(null); }}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-450 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Pencil className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Ubah Profil Pengguna</h3>
              <p className="text-[11px] text-slate-400">Sunting informasi akun, rincian kelas, peran sistem secara penuh di bawah.</p>
            </div>

            <form onSubmit={handleEditUser} className="space-y-4 text-xs font-semibold text-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={userFormName}
                    onChange={(e) => setUserFormName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 transition text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Username Log In *</label>
                  <input
                    type="text"
                    required
                    value={userFormUsername}
                    onChange={(e) => setUserFormUsername(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 transition text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Peran Pengguna (Role) *</label>
                  <select
                    value={userFormRole}
                    onChange={(e) => setUserFormRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 font-bold transition text-slate-800"
                  >
                    <option value="siswa">Siswa</option>
                    <option value="gurubk">Guru BK / Konselor</option>
                    <option value="admin">Administrator Sistem</option>
                  </select>
                </div>

                {userFormRole === 'siswa' && (
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Kelas Sekolah *</label>
                    <input
                      type="text"
                      placeholder="Contoh: XI MIPA 3"
                      value={userFormKelas}
                      onChange={(e) => setUserFormKelas(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 transition text-slate-800"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Alamat Email Pengguna *</label>
                <input
                  type="email"
                  required
                  value={userFormEmail}
                  onChange={(e) => setUserFormEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 transition text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Link URL Foto Profil</label>
                <input
                  type="text"
                  value={userFormPhoto}
                  onChange={(e) => setUserFormPhoto(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-600 transition text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowEditUserModal(false); setEditingUser(null); }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-650 hover:bg-purple-750 text-white rounded-xl shadow transition cursor-pointer font-black"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real-time Toast alerts */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-55 animate-slide-in">
          <div className={`px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-xs font-bold border text-left ${
            toast.type === 'success' 
              ? 'bg-purple-50 border-purple-200 text-purple-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-3 p-1 hover:bg-black/5 rounded-md transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
