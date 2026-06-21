import React, { useState } from 'react';
import { User, Assessment, IncidentReport, CounselingAppointment } from '../types';
import { getAppDatabase, saveAppDatabase } from '../data/mockData';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  FileSpreadsheet, 
  CheckCircle, 
  Eye, 
  MessageCircle, 
  Check, 
  X, 
  AlertCircle,
  Clock,
  Briefcase
} from 'lucide-react';

interface CounselorDashboardProps {
  currentUser: User;
  onRefreshDatabase: () => void;
  onNavigateToTab: (tabId: string) => void;
}

export default function CounselorDashboard({ currentUser, onRefreshDatabase, onNavigateToTab }: CounselorDashboardProps) {
  const db = getAppDatabase();
  const assessments = db.assessments;
  const reports = db.reports;
  const appointments = db.appointments;
  const cases = db.monitoring;

  // Selected details
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Count states
  const totalStudents = db.users.filter(u => u.role === 'siswa').length;
  const pendingReports = reports.filter(r => r.status === 'Menunggu').length;
  const upcomingApts = appointments.filter(a => a.status === 'Disetujui').length;
  const activeCases = cases.filter(c => c.progressStatus === 'Dalam Sesi').length;

  // Statistical calculations for visual chart
  const riskHighCount = assessments.filter(a => a.riskLevel === 'Tinggi').length;
  const riskMediumCount = assessments.filter(a => a.riskLevel === 'Sedang').length;
  const riskLowCount = assessments.filter(a => a.riskLevel === 'Rendah').length;

  const handleUpdateReportStatus = (reportId: string, status: IncidentReport['status']) => {
    const currentDb = getAppDatabase();
    currentDb.reports = currentDb.reports.map(r => {
      if (r.id === reportId) {
        return { 
          ...r, 
          status, 
          feedback: feedbackText || r.feedback || 'Tanggapan telah dicantumkan oleh Guru BK.' 
        };
      }
      return r;
    });
    saveAppDatabase(currentDb);
    setSelectedReport(null);
    setFeedbackText('');
    onRefreshDatabase();
  };

  const handleCreateCaseFromAssessment = (asm: Assessment) => {
    const currentDb = getAppDatabase();
    const exists = currentDb.monitoring.find(m => m.studentId === asm.studentId);
    
    if (exists) {
      alert('Siswa ini sudah masuk di halaman program monitoring kasus.');
      return;
    }

    currentDb.monitoring.unshift({
      id: `mon_new_${Date.now()}`,
      studentId: asm.studentId,
      studentName: asm.studentName,
      studentKelas: asm.studentKelas,
      caseType: 'Butuh Bimbingan Individual',
      assessmentSummary: `Skor total ${asm.totalScore} dari instrumen tertanggal ${asm.date}.`,
      actionTaken: 'Merancang jadwal tatap muka langsung.',
      counselingOutcome: 'Sedang berproses membahas alternatif jalan keluar.',
      progressStatus: 'Dalam Sesi',
      planFollowUp: 'Melakukan re-evaluasi kesehatan mental.',
      lastUpdated: new Date().toISOString().split('T')[0]
    });

    saveAppDatabase(currentDb);
    alert('Siswa sukses ditambahkan ke Program Monitoring Perkembangan Kasus!');
    onRefreshDatabase();
  };

  return (
    <div className="space-y-6 text-left" id="counselor-dashboard-root">
      {/* Visual Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-counter-grid">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Siswa Terdaftar</p>
            <p className="text-xl font-extrabold text-slate-800 mt-0.5">{totalStudents} Siswa</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aduan Pending</p>
            <p className="text-xl font-extrabold text-slate-800 mt-0.5">{pendingReports} Laporan</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Konseling Aktif</p>
            <p className="text-xl font-extrabold text-slate-800 mt-0.5">{upcomingApts} Sesi</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kasus Termonitor</p>
            <p className="text-xl font-extrabold text-slate-800 mt-0.5">{activeCases} Kasus</p>
          </div>
        </div>
      </div>

      {/* Visual report analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="analytics-grid">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Laporan Layanan & Kesehatan Mental Siswa</h3>
            <span className="text-[10px] text-zinc-400 font-bold font-mono">Bulan Juni 2026</span>
          </div>

          <div className="space-y-5">
            <p className="text-xs text-slate-500">
              Distribusi kepatuhan dan risiko psikososial siswa berdasarkan instrumen asesmen yang diselesaikan secara mandiri:
            </p>

            {/* CSS-based visually elegant bar chart */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Risiko Tinggi (Butuh Tindakan Cepat)</span>
                  <span className="text-red-650 font-bold">{riskHighCount} Siswa</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(riskHighCount / (assessments.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Risiko Sedang (Pengawasan Normal & Edukasi)</span>
                  <span className="text-amber-600 font-bold">{riskMediumCount} Siswa</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(riskMediumCount / (assessments.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Risiko Rendah (Sehat Psikologis)</span>
                  <span className="text-emerald-600 font-bold">{riskLowCount} Siswa</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(riskLowCount / (assessments.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/20 p-4 rounded-xl border border-blue-100/50 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-blue-900">Perlu re-kapitulasi semester?</p>
                <p className="text-blue-700">Ekspor berkas komprehensif untuk arsip rapat sekolah.</p>
              </div>
              <button 
                onClick={() => { alert('Laporan Layanan Konseling semesteran berhasil diekspor ke Microsoft Excel / PDF!'); }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer transition text-[10px]"
              >
                Unduh PDF
              </button>
            </div>
          </div>
        </div>

        {/* Quick Link panel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Alat Navigasi BK
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sebagai guru pembimbing, Anda memiliki kunci otorisasi penuh membaca data keluhan siswa tanpa terkontaminasi. Gunakan menu di bawah untuk meloncat dengan cepat:
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <button 
              onClick={() => onNavigateToTab('counseling')}
              className="w-full flex items-center justify-between p-3 border border-slate-100 hover:border-blue-400 hover:bg-blue-50/20 text-xs font-bold rounded-xl transition text-left cursor-pointer"
            >
              <span>Buka Chat E-Counseling Sesi</span>
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </button>

            <button 
              onClick={() => onNavigateToTab('monitoring')}
              className="w-full flex items-center justify-between p-3 border border-slate-100 hover:border-blue-400 hover:bg-blue-50/20 text-xs font-bold rounded-xl transition text-left cursor-pointer"
            >
              <span>Buka Program Monitoring Kasus</span>
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main sections: Assessments & Incident List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="management-tables">
        {/* Left: Assessments list */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Hasil Asesmen Kebutuhan Siswa ({assessments.length})
          </h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {assessments.map((asm) => (
              <div 
                key={asm.id}
                className="p-3 border border-slate-100 hover:border-slate-200 rounded-xl flex items-center justify-between text-xs transition text-left"
              >
                <div>
                  <h4 className="font-bold text-slate-800">{asm.studentName}</h4>
                  <p className="text-[10px] text-slate-500 font-mono font-semibold">{asm.studentKelas} • Tgl: {asm.date}</p>
                  <p className="text-[10px] text-blue-600 font-bold mt-1">Skor: {asm.totalScore} / {asm.maxScore}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    asm.riskLevel === 'Tinggi' ? 'bg-red-50 text-red-700' :
                    asm.riskLevel === 'Sedang' ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {asm.riskLevel}
                  </span>

                  <button
                    onClick={() => setSelectedAssessment(asm)}
                    className="p-1 px-2.5 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition cursor-pointer"
                  >
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Incident reports list */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Laporan Pengaduan Kejadian ({reports.length})
          </h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {reports.map((rep) => (
              <div 
                key={rep.id}
                className="p-3 border border-slate-100 hover:border-slate-200 rounded-xl flex items-center justify-between text-xs transition text-left"
              >
                <div>
                  <h4 className="font-bold text-slate-800">{rep.reporterName}</h4>
                  <p className="text-[10px] text-slate-500 font-mono font-semibold">Hari kejadian: {rep.incidentDate}</p>
                  <p className="text-[10px] text-slate-600 truncate max-w-xs">{rep.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    rep.status === 'Menunggu' ? 'bg-gray-50 text-gray-700' :
                    rep.status === 'Ditinjau' ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {rep.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedReport(rep);
                      setFeedbackText(rep.feedback || '');
                    }}
                    className="p-1 px-2.5 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Detail Asesmen */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 sm:p-8 space-y-4 text-left relative">
            <button 
              onClick={() => setSelectedAssessment(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-905 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3.5">
              <span className="text-[10px] text-blue-600 font-bold tracking-wider">REKAPITULASI RESPONS MANDIRI</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Asesmen Kebutuhan: {selectedAssessment.studentName} ({selectedAssessment.studentKelas})</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span>Skor Total Kunci:</span>
                <span className="text-blue-600">{selectedAssessment.totalScore} / {selectedAssessment.maxScore}</span>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Perincian Skor Kategori:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {Object.entries(selectedAssessment.categoryScores).map(([category, val]) => (
                    <div key={category} className="p-2 border border-slate-200 rounded-xl flex justify-between">
                      <span className="text-slate-500">{category}</span>
                      <span className="font-bold text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="font-semibold text-slate-800 text-[11px] mb-1">Catatan Diagnostik BK:</p>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {selectedAssessment.notes || 'Siswa dalam pengamatan pasif.'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <button
                onClick={() => handleCreateCaseFromAssessment(selectedAssessment)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-blue-50"
              >
                Masukkan ke Program Case Monitoring
              </button>
              
              <button
                onClick={() => setSelectedAssessment(null)}
                className="px-4 py-2 hover:bg-slate-105 border text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Review Laporan Pengaduan */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-4 text-left relative">
            <button 
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-905 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3.5">
              <span className="text-[10px] text-rose-600 font-bold tracking-wider">PENINJAUAN PENANGANAN ADUAN KASUS</span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Aduan: {selectedReport.reporterName} ({selectedReport.reporterKelas})</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <p className="font-bold text-slate-500 text-[10px] uppercase">Kronologi Kejadian</p>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed mt-1 text-[11px]">
                  {selectedReport.description}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-500 text-[10px] uppercase">Pihak Berwenang / Terlibat</p>
                <p className="text-slate-800 mt-0.5 font-bold capitalize">{selectedReport.involvees}</p>
              </div>

              {selectedReport.evidenceUrl && (
                <div>
                  <p className="font-bold text-slate-500 text-[10px] uppercase mb-1">Bukti screenshot digital</p>
                  <img src={selectedReport.evidenceUrl} alt="Incident Evidence" className="w-full h-32 object-cover rounded-xl border border-slate-200" referrerPolicy="no-referrer" />
                </div>
              )}

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 text-[10px] uppercase" htmlFor="feedback-input">
                  Tulis Tindak Lanjut / Umpan Balik Siswa
                </label>
                <textarea
                  id="feedback-input"
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Ketik tindakan nyata Anda (misal: memanggil wali kelas, mengagendakan mediasi, dsb)..."
                  className="w-full p-2.5 border rounded-xl text-xs bg-white text-slate-805 outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
                ></textarea>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-2 pt-3 border-t">
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateReportStatus(selectedReport.id, 'Ditinjau')}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Tandai Ditinjau
                </button>
                <button
                  onClick={() => handleUpdateReportStatus(selectedReport.id, 'Selesai')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-blue-50"
                >
                  Selesaikan Kasus
                </button>
              </div>
              
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 hover:bg-slate-105 border text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
