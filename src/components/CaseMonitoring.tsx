import React, { useState } from 'react';
import { CaseMonitoring as CaseMonitoringType, User } from '../types';
import { getAppDatabase, saveAppDatabase } from '../data/mockData';
import { 
  FileText, 
  Plus, 
  RotateCw, 
  CheckCircle, 
  FileSpreadsheet, 
  HeartHandshake, 
  Edit3, 
  Trash2, 
  X, 
  Save,
  BookOpen
} from 'lucide-react';

interface CaseMonitoringProps {
  onRefreshDatabase: () => void;
}

export default function CaseMonitoring({ onRefreshDatabase }: CaseMonitoringProps) {
  const db = getAppDatabase();
  const cases = db.monitoring;

  const [activeCase, setActiveCase] = useState<CaseMonitoringType | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Case States
  const [studentName, setStudentName] = useState('');
  const [studentKelas, setStudentKelas] = useState('XI MIPA 2');
  const [caseType, setCaseType] = useState('');
  const [assessmentSummary, setAssessmentSummary] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [counselingOutcome, setCounselingOutcome] = useState('');
  const [progressStatus, setProgressStatus] = useState<CaseMonitoringType['progressStatus']>('Dalam Sesi');
  const [planFollowUp, setPlanFollowUp] = useState('');

  // Editing Case states inside modal
  const [editCaseType, setEditCaseType] = useState('');
  const [editAssessmentSum, setEditAssessmentSum] = useState('');
  const [editActionTaken, setEditActionTaken] = useState('');
  const [editOutcome, setEditOutcome] = useState('');
  const [editProgressStatus, setEditProgressStatus] = useState<CaseMonitoringType['progressStatus']>('Dalam Sesi');
  const [editFollowUp, setEditFollowUp] = useState('');

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !caseType.trim()) {
      alert('Nama Siswa dan Jenis Kasus wajib diisi.');
      return;
    }

    const newCase: CaseMonitoringType = {
      id: `mon_${Date.now()}`,
      studentId: `siswa_${Date.now()}`,
      studentName,
      studentKelas,
      caseType,
      assessmentSummary: assessmentSummary || 'Berdasarkan pengaduan/konseling individual terdekat.',
      actionTaken: actionTaken || 'Menjadwalkan bimbingan batin.',
      counselingOutcome: counselingOutcome || 'Sedang dievaluasi kelanjutannya.',
      progressStatus,
      planFollowUp: planFollowUp || 'Mengulas perkembangan perilaku siswa pekan depan.',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    const currentDb = getAppDatabase();
    currentDb.monitoring.unshift(newCase);
    saveAppDatabase(currentDb);

    // Reset Form
    setStudentName('');
    setCaseType('');
    setAssessmentSummary('');
    setActionTaken('');
    setCounselingOutcome('');
    setPlanFollowUp('');
    setShowAddForm(false);
    
    onRefreshDatabase();
  };

  const handleOpenEdit = (c: CaseMonitoringType) => {
    setActiveCase(c);
    setEditCaseType(c.caseType);
    setEditAssessmentSum(c.assessmentSummary);
    setEditActionTaken(c.actionTaken);
    setEditOutcome(c.counselingOutcome);
    setEditProgressStatus(c.progressStatus);
    setEditFollowUp(c.planFollowUp);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;

    const currentDb = getAppDatabase();
    currentDb.monitoring = currentDb.monitoring.map(m => {
      if (m.id === activeCase.id) {
        return {
          ...m,
          caseType: editCaseType,
          assessmentSummary: editAssessmentSum,
          actionTaken: editActionTaken,
          counselingOutcome: editOutcome,
          progressStatus: editProgressStatus,
          planFollowUp: editFollowUp,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return m;
    });

    saveAppDatabase(currentDb);
    setActiveCase(null);
    onRefreshDatabase();
  };

  const handleDeleteCase = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumentasi pemantauan kasus ini?')) {
      const currentDb = getAppDatabase();
      currentDb.monitoring = currentDb.monitoring.filter(m => m.id !== id);
      saveAppDatabase(currentDb);
      onRefreshDatabase();
    }
  };

  return (
    <div className="space-y-6 text-left" id="monitoring-root">
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Monitoring Perkembangan Kasus Siswa</h2>
          <p className="text-xs text-slate-500 mt-0.5">Dokumentasi portofolio rekapitulasi, mediasi tindakan, dan tindak lanjut psikologis</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Batal Form' : 'Catat Kasus Baru'}
        </button>
      </div>

      {/* Insert case form */}
      {showAddForm && (
        <form onSubmit={handleCreateCase} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md space-y-4 animate-fade-in" id="add-case-form">
          <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-3">Registrasi Kasus Monitoring Baru</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="student-name-input">Identitas Nama Siswa</label>
              <input
                id="student-name-input"
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Contoh: Muhammad Bobby"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="student-kelas-select">Kelas Siswa</label>
              <select
                id="student-kelas-select"
                value={studentKelas}
                onChange={(e) => setStudentKelas(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="X IPS 1">X IPS 1</option>
                <option value="X MIPA 1">X MIPA 1</option>
                <option value="XI MIPA 2">XI MIPA 2</option>
                <option value="XII IPS 3">XII IPS 3</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="case-type-input">Jenis Kasus Utama</label>
              <input
                id="case-type-input"
                type="text"
                required
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                placeholder="Contoh: Cyberbullying Berulang / Stres Ujian"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="assessment-summary">Hasil Asesmen / Kronologi Masalah</label>
              <textarea
                id="assessment-summary"
                rows={2}
                value={assessmentSummary}
                onChange={(e) => setAssessmentSummary(e.target.value)}
                placeholder="Deskripsi temuan awal..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="action-taken">Tindakan Khusus yang Diberikan</label>
              <textarea
                id="action-taken"
                rows={2}
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="Pembinaan pribadi, mediasi ormas, dsb..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="counseling-outcome">Hasil Layanan Konseling</label>
              <input
                id="counseling-outcome"
                type="text"
                value={counselingOutcome}
                onChange={(e) => setCounselingOutcome(e.target.value)}
                placeholder="Siswa sepakat damai, cermin perlawanan bully rendah..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status Progres Belajar</label>
              <div className="flex gap-2">
                {(['Dalam Sesi', 'Perbaikan Nyata', 'Selesai'] as const).map((stat) => (
                  <button
                    key={stat}
                    type="button"
                    onClick={() => setProgressStatus(stat)}
                    className={`flex-1 py-2 text-[10px] font-bold border rounded-lg transition cursor-pointer ${progressStatus === stat ? 'bg-blue-600 text-white border-blue-650' : 'bg-white hover:bg-slate-50 text-slate-600'}`}
                  >
                    {stat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="plan-follow-up">Rencana Tindak Lanjut</label>
            <input
              id="plan-follow-up"
              type="text"
              value={planFollowUp}
              onChange={(e) => setPlanFollowUp(e.target.value)}
              placeholder="Memantau perkembangan sosmed siswa sebulan ke depan..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-100/50 cursor-pointer justify-center flex items-center"
          >
            Arsipkan Pemantauan Kasus
          </button>
        </form>
      )}

      {/* Monitored Cases list view */}
      {cases.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <FileText className="w-10 h-10 mx-auto stroke-1 text-slate-300" />
          <p className="text-xs">Tidak ada riwayat sengketa atau penanganan kasus aktif.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="monitoring-grid">
          {cases.map((c) => (
            <div 
              key={c.id} 
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-350 transition space-y-4"
              id={`case-card-${c.id}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{c.studentName}</h3>
                  <p className="text-[10px] text-zinc-400 font-mono font-semibold">{c.studentKelas} • Pembaharuan terakhir: {c.lastUpdated}</p>
                </div>

                <span className={`inline-block px-2.5 py-1 text-[10px] font-extrabold rounded-full ${
                  c.progressStatus === 'Selesai' ? 'bg-emerald-50 text-emerald-700' :
                  c.progressStatus === 'Perbaikan Nyata' ? 'bg-amber-50 text-amber-700' :
                  'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {c.progressStatus}
                </span>
              </div>

              {/* Case details box */}
              <div className="space-y-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                <div>
                  <span className="block text-[9px] text-blue-600 font-bold uppercase">Jenis Masalah Konten:</span>
                  <p className="font-bold text-slate-800">{c.caseType}</p>
                </div>

                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase">Evaluasi Asesmen & Dampak:</span>
                  <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">{c.assessmentSummary}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase">Tindakan BK:</span>
                    <p className="font-medium text-slate-700">{c.actionTaken}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase">Hasil Konseling:</span>
                    <p className="font-medium text-slate-700">{c.counselingOutcome}</p>
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] text-amber-600 font-bold uppercase">Strategi Tindak Lanjut:</span>
                  <p className="text-slate-700 font-medium">{c.planFollowUp}</p>
                </div>
              </div>

              {/* Edit / Trash Actions */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="flex items-center gap-1 px-3 py-1.5 hover:bg-blue-50 hover:text-blue-650 rounded-lg text-slate-500 font-bold cursor-pointer transition"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Catat
                </button>
                <button
                  onClick={() => handleDeleteCase(c.id)}
                  className="flex items-center gap-1 px-3 py-1.5 hover:bg-red-50 hover:text-red-650 rounded-lg text-slate-500 font-bold cursor-pointer transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Overlay Modal */}
      {activeCase && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="edit-case-modal">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-4 text-left relative">
            <button
              type="button"
              onClick={() => setActiveCase(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-905 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3.5">
              <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase">UBAH PERKEMBANGAN LAYANAN</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Siswa: {activeCase.studentName}</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[10px] text-slate-500 uppercase mb-1" htmlFor="edit-case-type">Jenis Kasus Utama</label>
                <input
                  id="edit-case-type"
                  type="text"
                  required
                  value={editCaseType}
                  onChange={(e) => setEditCaseType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-[10px] text-slate-500 uppercase mb-1" htmlFor="edit-asm-sum">Evaluasi Asesmen & Dampak</label>
                <textarea
                  id="edit-asm-sum"
                  rows={2}
                  required
                  value={editAssessmentSum}
                  onChange={(e) => setEditAssessmentSum(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[10px] text-slate-500 uppercase mb-1" htmlFor="edit-action">Tindakan BK</label>
                  <input
                    id="edit-action"
                    type="text"
                    required
                    value={editActionTaken}
                    onChange={(e) => setEditActionTaken(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[10px] text-slate-500 uppercase mb-1" htmlFor="edit-outcome">Hasil Konseling</label>
                  <input
                    id="edit-outcome"
                    type="text"
                    required
                    value={editOutcome}
                    onChange={(e) => setEditOutcome(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[10px] text-slate-500 uppercase mb-1">Status Progres Belajar</label>
                <div className="flex gap-2">
                  {(['Dalam Sesi', 'Perbaikan Nyata', 'Selesai'] as const).map((stat) => (
                    <button
                      key={stat}
                      type="button"
                      onClick={() => setEditProgressStatus(stat)}
                      className={`flex-1 py-1.5 text-[10px] font-bold border rounded-lg transition cursor-pointer ${editProgressStatus === stat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[10px] text-slate-500 uppercase mb-1" htmlFor="edit-follow-up">Rencana Tindak Lanjut</label>
                <input
                  id="edit-follow-up"
                  type="text"
                  required
                  value={editFollowUp}
                  onChange={(e) => setEditFollowUp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setActiveCase(null)}
                className="px-4 py-2 hover:bg-slate-105 border text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-100"
              >
                <Save className="w-4 h-4" /> Simpan Revisi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
