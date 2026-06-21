import React, { useState } from 'react';
import { User, Assessment, AssessmentResponse } from '../types';
import { ASSESSMENT_QUESTIONS, getAppDatabase, saveAppDatabase } from '../data/mockData';
import { ClipboardCheck, Sparkles, AlertCircle, HeartHandshake, CheckCircle2, RefreshCw } from 'lucide-react';

interface StudentAsesmenProps {
  currentUser: User;
  onRefreshDatabase: () => void;
}

export default function StudentAsesmen({ currentUser, onRefreshDatabase }: StudentAsesmenProps) {
  const [responses, setResponses] = useState<AssessmentResponse[]>(
    ASSESSMENT_QUESTIONS.map(q => ({ questionId: q.id, score: 0 }))
  );
  
  const [successInfo, setSuccessInfo] = useState<Assessment | null>(null);

  // Load existing assessment if available
  const db = getAppDatabase();
  const existingAssessment = db.assessments.find(a => a.studentId === currentUser.id);

  const handleScoreChange = (qId: string, value: number) => {
    setResponses(prev => 
      prev.map(r => r.questionId === qId ? { ...r, score: value } : r)
    );
  };

  const scoreLabels = [
    { value: 0, label: 'Tidak Pernah', desc: 'Tidak mengalami kendala ini' },
    { value: 1, label: 'Jarang', desc: 'Sesekali terjadi dalam sebulan' },
    { value: 2, label: 'Sering', desc: 'Sering terjadi setiap minggunya' },
    { value: 3, label: 'Sangat Sering', desc: 'Hampir setiap hari mengalaminya' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate category scores
    const categoryScores: { [category: string]: number } = {};
    let totalScore = 0;
    const maxScore = ASSESSMENT_QUESTIONS.length * 3;

    responses.forEach(r => {
      totalScore += r.score;
      const question = ASSESSMENT_QUESTIONS.find(q => q.id === r.questionId);
      if (question) {
        const cat = question.category;
        categoryScores[cat] = (categoryScores[cat] || 0) + r.score;
      }
    });

    // Risk calculation
    // Max is 24 (since 8 questions). Let's define:
    // Total < 6: Rendah, 6 - 12: Sedang, > 12: Tinggi
    let riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' = 'Rendah';
    if (totalScore > 12) {
      riskLevel = 'Tinggi';
    } else if (totalScore >= 6) {
      riskLevel = 'Sedang';
    }

    const newAssessment: Assessment = {
      id: `asm_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.nama,
      studentKelas: currentUser.kelas || 'Umum',
      date: new Date().toISOString().split('T')[0],
      responses,
      totalScore,
      maxScore,
      riskLevel,
      categoryScores,
      notes: riskLevel === 'Tinggi' 
        ? 'Asesmen ini diisi secara langsung oleh siswa dan berada di kategori risiko Tinggi. Sangat direkomendasikan untuk melakukan tindak lanjut berupa sesi konseling online/tatap muka.' 
        : 'Siswa berada dalam kelompok pengawasan normal. Tetap pantau materi edukasi.'
    };

    // Save to Database
    const currentDb = getAppDatabase();
    // Overwrite existing or add new
    const filteredAssessments = currentDb.assessments.filter(a => a.studentId !== currentUser.id);
    currentDb.assessments = [newAssessment, ...filteredAssessments];
    
    // Automatically trigger/update CaseMonitoring if risk heightens
    if (riskLevel === 'Tinggi' || riskLevel === 'Sedang') {
      const existingMon = currentDb.monitoring.find(m => m.studentId === currentUser.id);
      if (!existingMon) {
        currentDb.monitoring.unshift({
          id: `mon_${Date.now()}`,
          studentId: currentUser.id,
          studentName: currentUser.nama,
          studentKelas: currentUser.kelas || '',
          caseType: riskLevel === 'Tinggi' ? 'Tindak Lanjut Asesmen Berisiko Tinggi' : 'Tindak Lanjut Asesmen Berisiko Sedang',
          assessmentSummary: `Skor asesmen mandiri bernilai ${totalScore}/${maxScore}. Deteksi risiko ${riskLevel}.`,
          actionTaken: 'Menjadwalkan bimbingan/pemanggilan ramah bersama siswa.',
          counselingOutcome: 'Sedang dikondisikan.',
          progressStatus: 'Dalam Sesi',
          planFollowUp: 'Menghubungi siswa lewat chat E-Counseling.',
          lastUpdated: new Date().toISOString().split('T')[0]
        });
      }
    }

    saveAppDatabase(currentDb);
    setSuccessInfo(newAssessment);
    onRefreshDatabase();
  };

  return (
    <div className="space-y-6" id="asesmen-section">
      {/* Header card with contextual illustrations */}
      <div className="poster-gradient rounded-2xl p-6 sm:p-8 text-white shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            Asesmen Kebutuhan Mandiri
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" id="asesmen-header-title">Kenali Dirimu Melalui Asesmen Kebutuhan</h2>
          <p className="mt-2 text-blue-50 text-sm max-w-2xl">
            Instrumen ini dirancang agar guru BK memahami berbagai hal penting, stres akademik, cyberbullying, atau kebingungan karier yang sedang kamu hadapi secara objektif. Jawabanmu sepenuhnya terlindungi secara rahasia.
          </p>
        </div>
      </div>

      {successInfo ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-6" id="asesmen-success-card">
          <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Asesmen Kebutuhan Berhasil Dikirim!</h3>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              Terima kasih, <strong>{currentUser.nama}</strong>. Skor kesehatan dan kebutuhan psikologismu telah disimpan secara aman. Guru BK di sekolah akan menjadikannya panduan menyusun media bantuan edukasi atau penjadwalan konseling yang nyaman bagi kamu.
            </p>
          </div>

          {/* Render immediate feedback statistics */}
          <div className="max-w-md mx-auto bg-slate-50/50 rounded-2xl p-5 border border-slate-250 text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Metrik Hasil</span>
              <span className="text-xs text-slate-500 font-mono">{successInfo.date}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">Skor Akumulasi:</span>
              <span className="text-sm font-bold text-blue-600">{successInfo.totalScore} / {successInfo.maxScore}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">Tingkat Deteksi Risiko:</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                successInfo.riskLevel === 'Tinggi' ? 'bg-red-50 text-red-700 border border-red-200' :
                successInfo.riskLevel === 'Sedang' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {successInfo.riskLevel}
              </span>
            </div>

            {successInfo.riskLevel === 'Tinggi' && (
              <div className="p-3.5 bg-red-50/70 border border-red-100 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-800 leading-relaxed">
                  Wah, tampaknya kamu memiliki tingkat kecemasan atau hambatan yang cukup tinggi di beberapa bagian. Jangan sungkan untuk berdiskusi langsung di menu <strong>E-Counseling</strong> ya. Guru BK selalu siap menyambutmu tanpa menghakimi.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setSuccessInfo(null)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-100 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Isi Ulang Asesmen
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {existingAssessment && (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">Riwayat Temuan</h4>
                <p className="text-xs text-amber-700 leading-relaxed mt-0.5">
                  Kamu telah mengisi asesmen kebutuhan pada tanggal <strong>{existingAssessment.date}</strong> dengan tingkat risiko <strong>{existingAssessment.riskLevel}</strong>. Mengisi ulang asesmen di bawah akan memperbarui data terbarumu pada sistem bimbingan Guru BK.
                </p>
              </div>
            </div>
          )}

          {/* Questions Container */}
          <div className="space-y-4">
            {ASSESSMENT_QUESTIONS.map((question, index) => {
              const currentVal = responses.find(r => r.questionId === question.id)?.score ?? 0;
              return (
                <div 
                  key={question.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 hover:border-slate-300 transition-colors space-y-4"
                  id={`q-card-${question.id}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-500 font-mono text-[10px] font-bold uppercase rounded-md">
                        Kategori: {question.categoryLabel}
                      </span>
                      <h4 className="text-sm sm:text-base font-semibold text-slate-800 leading-normal">
                        {index + 1}. {question.text}
                      </h4>
                    </div>
                  </div>

                  {/* Radio buttons layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2">
                    {scoreLabels.map((label) => (
                      <label 
                        key={label.value}
                        className={`flex flex-col p-3 rounded-xl border text-center cursor-pointer transition ${
                          currentVal === label.value 
                            ? 'bg-blue-50/50 border-blue-500 text-blue-900 ring-1 ring-blue-500 font-semibold' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`response-${question.id}`}
                          value={label.value}
                          checked={currentVal === label.value}
                          onChange={() => handleScoreChange(question.id, label.value)}
                          className="sr-only"
                        />
                        <span className="text-xs font-bold">{label.label}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">{label.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5 text-xs text-slate-500 max-w-sm">
              <HeartHandshake className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Dengan mengirimkan asesmen, data akan terkonsolidasi dengan pengawasan ramah bimbingan konseling BK.</span>
            </div>
            
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-100 transition cursor-pointer"
              id="submit-asesmen-button"
            >
              <ClipboardCheck className="w-4 h-4" />
              Kirim Asesmen Kebutuhan
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
