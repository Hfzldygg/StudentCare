export type Role = 'siswa' | 'gurubk' | 'admin';

export interface User {
  id: string;
  username: string;
  nama: string;
  role: Role;
  kelas?: string;
  fotoUrl?: string;
  email?: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  category: string;
  categoryLabel: string;
}

export interface AssessmentResponse {
  questionId: string;
  score: number; // 0 = Tidak Pernah, 1 = Pernah/Sarang, 2 = Sering, 3 = Sangat Sering
}

export interface Assessment {
  id: string;
  studentId: string;
  studentName: string;
  studentKelas: string;
  date: string;
  responses: AssessmentResponse[];
  totalScore: number;
  maxScore: number;
  riskLevel: 'Rendah' | 'Sedang' | 'Tinggi';
  categoryScores: { [category: string]: number }; // total score per category
  notes?: string;
}

export interface IncidentReport {
  id: string;
  studentId: string;
  reporterName: string;
  reporterKelas: string;
  date: string;
  incidentDate: string;
  description: string;
  involvees: string;
  evidenceUrl?: string;
  evidenceName?: string;
  status: 'Menunggu' | 'Ditinjau' | 'Selesai';
  feedback?: string;
}

export interface CounselingAppointment {
  id: string;
  studentId: string;
  studentName: string;
  studentKelas: string;
  counselorId: string;
  counselorName: string;
  date: string;
  time: string;
  status: 'Menunggu' | 'Disetujui' | 'Selesai' | 'Dibatalkan';
  type: 'Online' | 'Tatap Muka';
  reason: string;
  notes?: string;
}

export interface CaseMonitoring {
  id: string;
  studentId: string;
  studentName: string;
  studentKelas: string;
  caseType: string;
  assessmentSummary: string;
  actionTaken: string;
  counselingOutcome: string;
  progressStatus: 'Perbaikan Nyata' | 'Dalam Sesi' | 'Selesai';
  planFollowUp: string;
  lastUpdated: string;
}

export interface EducationalPoster {
  id: string;
  title: string;
  category: 'Kesehatan Mental' | 'Pengembangan Diri' | 'Strategi Belajar' | 'Perencanaan Karier' | 'Etika Digital' | 'Pencegahan Bullying';
  description: string;
  contentMarkdown: string;
  author: string;
  readTime: string;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  appointmentId: string;
  senderId: string;
  senderRole: Role;
  message: string;
  timestamp: string;
}
