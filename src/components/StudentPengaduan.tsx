import React, { useState } from 'react';
import { User, IncidentReport } from '../types';
import { getAppDatabase, saveAppDatabase } from '../data/mockData';
import { 
  Send, 
  MapPin, 
  FileText, 
  Calendar, 
  Users, 
  Image as ImageIcon, 
  CheckCircle2, 
  Hourglass, 
  Eye, 
  X, 
  Upload, 
  FileCheck 
} from 'lucide-react';

interface StudentPengaduanProps {
  currentUser: User;
  onRefreshDatabase: () => void;
}

export default function StudentPengaduan({ currentUser, onRefreshDatabase }: StudentPengaduanProps) {
  const [incidentDate, setIncidentDate] = useState('');
  const [description, setDescription] = useState('');
  const [involvees, setInvolvees] = useState('');
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [reportingType, setReportingType] = useState<'sendiri' | 'anonim'>('sendiri');
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);

  // Load database to find previous reports from this student
  const db = getAppDatabase();
  const reports = db.reports.filter(r => r.studentId === currentUser.id);

  // Handle mock files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectMockEvidence = (preset: { name: string, url: string }) => {
    setEvidenceName(preset.name);
    setEvidenceUrl(preset.url);
  };

  const presetEvidences = [
    { name: 'bukti_screenshot_cyberbullying.png', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400' },
    { name: 'pesan_singkat_kasar.png', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDate || !description.trim() || !involvees.trim()) {
      alert('Mohon lengkapi semua isian formulir utama.');
      return;
    }

    const newReport: IncidentReport = {
      id: `rep_${Date.now()}`,
      studentId: currentUser.id,
      reporterName: reportingType === 'anonim' ? 'Siswa Terlindungi (Anonim)' : currentUser.nama,
      reporterKelas: reportingType === 'anonim' ? '-' : (currentUser.kelas || 'Umum'),
      date: new Date().toISOString().split('T')[0],
      incidentDate,
      description,
      involvees,
      evidenceUrl: evidenceUrl || '',
      evidenceName: evidenceUrl ? (evidenceName || 'screenshot_bukti.png') : undefined,
      status: 'Menunggu'
    };

    const currentDb = getAppDatabase();
    currentDb.reports = [newReport, ...currentDb.reports];
    
    // Also auto insert as case in case list if it is cyberbullying or physical level
    currentDb.monitoring.unshift({
      id: `mon_r_${Date.now()}`,
      studentId: currentUser.id,
      studentName: reportingType === 'anonim' ? 'Siswa Terlindungi (Anonim)' : currentUser.nama,
      studentKelas: reportingType === 'anonim' ? 'Anonim' : (currentUser.kelas || ''),
      caseType: 'Aduan Masuk: ' + description.substring(0, 30) + '...',
      assessmentSummary: `Laporan masuk tanggal ${newReport.date}. Kronologi: ${description.substring(0, 80)}.`,
      actionTaken: 'Meninjau bukti-bukti pendukung yang dilampirkan.',
      counselingOutcome: 'Dalam penelaahan Guru BK.',
      progressStatus: 'Dalam Sesi',
      planFollowUp: 'Melakukan mediasi dengan pihak-pihak terkait.',
      lastUpdated: new Date().toISOString().split('T')[0]
    });

    saveAppDatabase(currentDb);
    
    // Reset state
    setIncidentDate('');
    setDescription('');
    setInvolvees('');
    setEvidenceUrl('');
    setEvidenceName('');
    
    setNotifSuccess(true);
    setTimeout(() => setNotifSuccess(false), 9000);
    onRefreshDatabase();
  };

  const getStatusBadge = (status: IncidentReport['status']) => {
    switch (status) {
      case 'Menunggu':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200"><Hourglass className="w-3 h-3 text-gray-400" /> Menunggu</span>;
      case 'Ditinjau':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Hourglass className="w-3 h-3 text-amber-500 animate-spin" /> Ditinjau</span>;
      case 'Selesai':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Selesai</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="pengaduan-grid">
      {/* Formulir Pengaduan */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Lapor Pengaduan Permasalahan</h2>
              <p className="text-xs text-slate-500 mt-1">Sampaikan temuan pembullyan, cyberbullying, atau rintangan psikologis secara aman</p>
            </div>
            
            {/* Toggle Anonymous */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                type="button"
                onClick={() => setReportingType('sendiri')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${reportingType === 'sendiri' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Gunakan Nama
              </button>
              <button 
                type="button"
                onClick={() => setReportingType('anonim')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${reportingType === 'anonim' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Anonim (Terlindungi)
              </button>
            </div>
          </div>

          {notifSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl flex items-start gap-3 animation-fade-in" id="report-success-notif">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">Laporan Terkirim!</h4>
                <p className="text-xs text-emerald-700 leading-normal mt-0.5">
                  Laporan kamu dengan ID pengaduan unik telah sukses disampaikan langsung kepada Guru BK. Sistem kami menjamin kerahasiaan identitas dan keselamatan pelapor.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="pengaduan-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Nama Pelapor</label>
                <input
                  type="text"
                  disabled
                  value={reportingType === 'anonim' ? 'Siswa Terlindungi (Anonim)' : currentUser.nama}
                  className="w-full px-4 py-2.5 border border-slate-250 rounded-xl bg-slate-50 text-slate-500 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Kelas</label>
                <input
                  type="text"
                  disabled
                  value={reportingType === 'anonim' ? '-' : (currentUser.kelas || 'Umum')}
                  className="w-full px-4 py-2.5 border border-slate-250 rounded-xl bg-slate-50 text-slate-500 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="incident-date">Tanggal Kejadian</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    id="incident-date"
                    type="date"
                    required
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="involvees-input">Pihak Berwenang / Di-infiltrasi (Pihak Terlibat)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Users className="w-4 h-4" />
                  </span>
                  <input
                    id="involvees-input"
                    type="text"
                    required
                    value={involvees}
                    onChange={(e) => setInvolvees(e.target.value)}
                    placeholder="Contoh: Beberapa rekan sekelas, inisial R dan herry"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="kronologi-textarea">Kronologi Kejadian</label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-slate-400">
                  <FileText className="w-4 h-4" />
                </span>
                <textarea
                  id="kronologi-textarea"
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan dengan jelas dan runtut kejadian yang terjadi (apa, siapa, di mana, bagaimana dampaknya)..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                ></textarea>
              </div>
            </div>

            {/* Evidence attachment with dynamic FileReader preview */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Bukti Pendukung (Tangkapan Layar / Dokumen)</label>
              <div className="mt-1 border-2 border-dashed border-slate-250 rounded-2xl p-4 transition-colors hover:border-blue-300">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Upload className="w-8 h-8 text-blue-600" />
                  <div className="text-xs text-slate-500">
                    <label htmlFor="file-upload" className="cursor-pointer font-bold text-blue-600 hover:text-blue-500">
                      Pilih file bukti laporan
                    </label>
                    <span className="text-slate-400"> atau seret ke sini</span>
                    <input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Mendukung format gambar JPEG, PNG (Maks 5MB)</p>
                </div>

                {evidenceUrl && (
                  <div className="mt-4 p-3 bg-blue-50/20 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <img src={evidenceUrl} alt="Preview Bukti" className="w-10 h-10 rounded-lg object-cover bg-white" />
                      <div className="text-left overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 truncate">{evidenceName || 'bukti_tangkapan_layar.png'}</p>
                        <p className="text-[10px] text-blue-600 font-bold">Preview berhasil dimuat</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setEvidenceUrl(''); setEvidenceName(''); }}
                      className="p-1 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Preset Bukti untuk Demo */}
              <div className="mt-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Preset Demo (Tingkatkan Akurasi Simulasi):</p>
                <div className="flex flex-wrap gap-2">
                  {presetEvidences.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectMockEvidence(preset)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50/20 hover:border-blue-300 text-[10px] text-slate-600 font-semibold transition cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Kirim Aduan Pengaduan secara Rahasia
            </button>
          </form>
        </div>
      </div>

      {/* Histori Laporan Pendukung */}
      <div className="space-y-6">
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            Keamanan Pelapor
          </h3>
          <p className="text-xs text-slate-350 mt-2 leading-relaxed">
            StudentCare mengamankan jalur aduan melalui enkripsi data lokal. Setiap aduan yang dikirim tidak dapat dibaca oleh siswa lain di dalam sekolah Anda. Guru BK berwenang penuh melindungi saksi dan memberikan tempat aman bagi psikologi terlapor.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Status Aduan Saya ({reports.length})
          </h3>

          {reports.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs">Belum ada aduan yang kamu ajukan semenjak pendaftaran.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div 
                  key={report.id}
                  className="p-4 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/10 rounded-xl cursor-pointer transition text-left"
                  onClick={() => setSelectedReport(report)}
                  id={`my-report-${report.id}`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <p className="text-[10px] text-slate-400 font-mono font-semibold">Tgl: {report.date}</p>
                    {getStatusBadge(report.status)}
                  </div>
                  
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{report.description}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 truncate">Terlibat: {report.involvees}</p>
                  
                  <div className="mt-2 text-right text-[10px]">
                    <span className="text-blue-600 font-bold flex items-center gap-1 justify-end">
                      <Eye className="w-3" /> Tanggapan Guru BK
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail Aduan */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 sm:p-8 space-y-5 text-left relative">
            <button 
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-150 pb-4">
              <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider block">DETAIL PENGADUAN PERMASALAHAN</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 leading-tight">Konfirmasi Keamanan BK</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Pelapor</p>
                <p className="font-semibold text-slate-700 mt-0.5">{selectedReport.reporterName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Hari Kejadian</p>
                <p className="font-semibold text-slate-700 mt-0.5">{selectedReport.incidentDate}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Kronologi Permasalahan</p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs text-slate-600 leading-relaxed max-h-32 overflow-y-auto">
                {selectedReport.description}
              </div>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Pihak yang Terlibat</p>
              <p className="text-xs font-semibold text-slate-700 mt-1 capitalize bg-blue-50/10 py-1.5 px-3 rounded-lg inline-block text-blue-850 border border-blue-100">
                {selectedReport.involvees}
              </p>
            </div>

            {selectedReport.evidenceUrl && (
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Dokumen Lampiran</p>
                <img 
                  src={selectedReport.evidenceUrl} 
                  alt="Evidence" 
                  className="w-full rounded-xl max-h-48 object-cover border border-slate-200" 
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-100 text-xs text-blue-900">
              <p className="font-bold">Umpan Balik Tindakan Guru BK:</p>
              <p className="text-blue-800 leading-relaxed mt-1">
                {selectedReport.feedback || 'Tim Bimbingan Konseling sedang menganalisis kronologi dan data terlampir. Harap tenang, kami siap melayani secara penuh.'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
