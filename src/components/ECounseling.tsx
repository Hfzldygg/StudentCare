import React, { useState, useEffect, useRef } from 'react';
import { User, CounselingAppointment, ChatMessage } from '../types';
import { getAppDatabase, saveAppDatabase } from '../data/mockData';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Video, 
  User as UserIcon, 
  Send, 
  Check, 
  X, 
  AlertCircle, 
  HelpCircle, 
  Compass, 
  ArrowRight 
} from 'lucide-react';

interface ECounselingProps {
  currentUser: User;
  onRefreshDatabase: () => void;
}

export default function ECounseling({ currentUser, onRefreshDatabase }: ECounselingProps) {
  const [counselorId, setCounselorId] = useState('user_guru_1');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<'Online' | 'Tatap Muka'>('Online');
  const [reason, setReason] = useState('');
  const [notif, setNotif] = useState('');
  
  // Chatting State
  const [activeAppointmentId, setActiveAppointmentId] = useState<string>('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load state from local storage database
  const db = getAppDatabase();
  const allAppointments = db.appointments;
  const isSiswa = currentUser.role === 'siswa';

  // Filter appointments
  const appointments = isSiswa 
    ? allAppointments.filter(a => a.studentId === currentUser.id)
    : allAppointments;

  const counselors = db.users.filter(u => u.role === 'gurubk');

  // Trigger loading relevant chats when activeAppointment changes
  useEffect(() => {
    if (activeAppointmentId) {
      const currentDb = getAppDatabase();
      const relevantChats = currentDb.chats.filter(c => c.appointmentId === activeAppointmentId);
      setChatList(relevantChats.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    }
  }, [activeAppointmentId]);

  // Scroll to bottom on chats
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatList, isTyping]);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !reason.trim()) {
      setNotif('Silakan tentukan tanggal dan alasan konseling.');
      return;
    }

    const counselor = db.users.find(u => u.id === counselorId);
    if (!counselor) return;

    const newApt: CounselingAppointment = {
      id: `apt_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.nama,
      studentKelas: currentUser.kelas || 'Umum',
      counselorId: counselor.id,
      counselorName: counselor.nama,
      date,
      time,
      status: 'Menunggu',
      type,
      reason,
      notes: ''
    };

    const currentDb = getAppDatabase();
    currentDb.appointments.push(newApt);
    saveAppDatabase(currentDb);

    setNotif('Permohonan konseling berhasil diajukan! Menunggu konfirmasi Guru BK.');
    setDate('');
    setReason('');
    
    setTimeout(() => setNotif(''), 6000);
    onRefreshDatabase();
  };

  const handleUpdateStatus = (aptId: string, status: CounselingAppointment['status']) => {
    const currentDb = getAppDatabase();
    currentDb.appointments = currentDb.appointments.map(a => 
      a.id === aptId ? { ...a, status } : a
    );
    saveAppDatabase(currentDb);
    onRefreshDatabase();
  };

  // Chat message sending & simulation
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeAppointmentId) return;

    const currentDb = getAppDatabase();
    const currentApt = currentDb.appointments.find(a => a.id === activeAppointmentId);
    if (!currentApt) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      appointmentId: activeAppointmentId,
      senderId: currentUser.id,
      senderRole: currentUser.role,
      message: chatMessage.trim(),
      timestamp: new Date().toISOString()
    };

    currentDb.chats.push(userMessage);
    saveAppDatabase(currentDb);
    
    // Update local state chat quickly
    setChatList(prev => [...prev, userMessage]);
    setChatMessage('');
    
    // Auto-respond simulating character if other role
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const answerDb = getAppDatabase();
      let responseText = '';

      if (isSiswa) {
        // Teacher responses automatically with comforting answers
        const promptInput = userMessage.message.toLowerCase();
        if (promptInput.includes('halo') || promptInput.includes('pagi') || promptInput.includes('siang')) {
          responseText = `Halo ${currentUser.nama.split(' ')[0]}! Senang sekali kamu menyapa Ibu di sini. Bagaimana kabarmu hari ini? Apa ada keluhan terbaru yang ingin dibagikan?`;
        } else if (promptInput.includes('cyber') || promptInput.includes('bully') || promptInput.includes('diejek') || promptInput.includes('lapor')) {
          responseText = `Ibu sangat tanggap dengan kendalamu terkait perlakuan buruk siber itu. Ketahuilah bahwa sekolah berpihak padamu. Besok Ibu akan koordinasi mengusut akun tersebut. Tetap sabar ya sayang, kamu aman sekarang.`;
        } else if (promptInput.includes('stres') || promptInput.includes('tugas') || promptInput.includes('cemas') || promptInput.includes('lelah')) {
          responseText = `Wajar sekali merasa lelah di fase akademik padat seperti sekarang. Jangan dipaksakan terus-menerus. Coba malam ini istirahat total, lakukan pernapasan sadar, dan besok siang kita tatap muka sebentar ya.`;
        } else {
          responseText = `Terima kasih atas tanggapanmu. Ibu mengerti dengan kondisi ini. Ibu sedang mencatat kronologinya agar kita dapat merevisi solusi penanganan demi kebaikan belajarmu selanjutnya.`;
        }
      } else {
        // Patient student responses automatically with descriptive concerns
        const studentObj = answerDb.users.find(u => u.id === currentApt.studentId) || currentUser;
        responseText = `Terima kasih masukannya Bu, saya merasa jauh lebih dihargai dan tenang setelah menceritakannya ke Ibu. Saya siap mengikuti bimbingan atau mediasi selanjutnya agar suasana belajar kembali nyaman.`;
      }

      const botMessage: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        appointmentId: activeAppointmentId,
        senderId: isSiswa ? 'user_guru_1' : currentApt.studentId,
        senderRole: isSiswa ? 'gurubk' : 'siswa',
        message: responseText,
        timestamp: new Date().toISOString()
      };

      answerDb.chats.push(botMessage);
      saveAppDatabase(answerDb);
      
      setChatList(prev => [...prev, botMessage]);
    }, 2000);
  };

  // Preset quick message assistance
  const sendFastPhrase = (phrase: string) => {
    setChatMessage(phrase);
  };

  return (
    <div className="space-y-6" id="ecounseling-container">
      {/* Upper header */}
      <div className="poster-gradient rounded-2xl p-6 sm:p-8 text-white shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-blue-200 animate-spin" />
            Layanan E-Counseling Modern
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" id="ecounseling-title">Konseling Pribadi Bebas Hambatan (Online & Meet)</h2>
          <p className="mt-2 text-sm max-w-2xl text-blue-50">
            Fasilitas ruang rahasia digital untuk bimbingan langsung satu arah antara siswa dengan Guru BK yang profesional. Hubungi gurumu kapan saja dari mana saja.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="ecounseling-grid">
        {/* Left Side: Scheduling or List Case */}
        <div className="lg:col-span-4 space-y-6">
          {isSiswa ? (
            /* Student Booking Form */
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Ajukan Sesi Konseling Baru
              </h3>

              {notif && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {notif}
                </div>
              )}

              <form onSubmit={handleCreateAppointment} className="space-y-4" id="booking-form">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="counselor-select">
                    Pilih Guru Bimbingan (BK)
                  </label>
                  <select
                    id="counselor-select"
                    value={counselorId}
                    onChange={(e) => setCounselorId(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-205 bg-white rounded-xl text-xs text-slate-705 outline-none focus:ring-1 focus:ring-blue-555"
                  >
                    {counselors.map((c) => (
                      <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="date-input">
                      Tanggal
                    </label>
                    <input
                      id="date-input"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-205 bg-white rounded-xl text-xs text-slate-705 outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="time-input">
                      Pukul Jam
                    </label>
                    <select
                      id="time-input"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-205 bg-white rounded-xl text-xs text-slate-705 outline-none focus:ring-1 focus:ring-blue-550"
                    >
                      <option value="08:00">08:00 WIB</option>
                      <option value="09:00">09:00 WIB</option>
                      <option value="10:30">10:30 WIB</option>
                      <option value="11:00">11:00 WIB</option>
                      <option value="13:00">13:00 WIB</option>
                      <option value="14:00">14:00 WIB</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Format Komunikasi
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType('Online')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${type === 'Online' ? 'bg-blue-50/20 text-blue-700 border-blue-300' : 'bg-white text-slate-600 border-slate-205'}`}
                    >
                      Online Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('Tatap Muka')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${type === 'Tatap Muka' ? 'bg-blue-50/20 text-blue-700 border-blue-300' : 'bg-white text-slate-600 border-slate-205'}`}
                    >
                      Tatap Muka
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="reason-textarea">
                    Keluhan Utama / Alasan Sesi
                  </label>
                  <textarea
                    id="reason-textarea"
                    rows={3}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Contoh: Saya butuh mediasi cyberbullying di grup medsos, atau ingin tanya minat kuliah..."
                    className="w-full px-3.5 py-2 border border-slate-205 rounded-xl text-xs text-slate-705 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Ajukan Jadwal Sesi
                </button>
              </form>
            </div>
          ) : (
            /* Counselor Intake requests view */
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                Konfirmasi Jadwal Layanan ({appointments.filter(a => a.status === 'Menunggu').length})
              </h3>

              {appointments.filter(a => a.status === 'Menunggu').length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Tidak ada permohonan antrean baru saat ini.</p>
              ) : (
                <div className="space-y-3">
                  {appointments.filter(a => a.status === 'Menunggu').map((apt) => (
                    <div key={apt.id} className="p-3.5 border border-slate-205 bg-slate-50/50 rounded-xl space-y-2 text-left">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-normal">{apt.studentName}</p>
                          <p className="text-[10px] text-slate-500 font-mono font-semibold">{apt.studentKelas} • {apt.type}</p>
                        </div>
                        <span className="text-[10px] bg-blue-50 text-blue-850 font-bold px-2 py-0.5 rounded">{apt.time} WIB</span>
                      </div>
                      <p className="text-[11px] text-slate-600 bg-white p-2 border border-slate-100 rounded-lg">"{apt.reason}"</p>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'Disetujui')}
                          className="flex-1 py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'Dibatalkan')}
                          className="py-1 px-2.5 bg-red-50 text-red-650 hover:bg-red-100 font-bold text-[10px] rounded-lg transition cursor-pointer"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Appointments list */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-left">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Riwayat Jadwal & Ruang Chat
            </h3>

            {appointments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Ayo ajukan bimbingan pertama kamu!</p>
            ) : (
              <div className="space-y-2.5">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => {
                      if (apt.status === 'Disetujui') {
                        setActiveAppointmentId(apt.id);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition text-left cursor-pointer ${
                      activeAppointmentId === apt.id
                        ? 'border-blue-500 bg-blue-50/10'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2 mb-1.5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{apt.date}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                        apt.status === 'Disetujui' ? 'bg-emerald-55 text-emerald-800' :
                        apt.status === 'Menunggu' ? 'bg-orange-55 text-orange-850' :
                        'bg-rose-55 text-rose-850'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800">
                      {isSiswa ? `Ibu ${apt.counselorName.split(',')[0]}` : `Siswa: ${apt.studentName}`}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{apt.type} • {apt.time} WIB</p>
                    
                    {apt.status === 'Disetujui' && (
                      <div className="mt-2.5 flex items-center justify-between text-[10px] font-bold text-blue-600 bg-blue-50/20 p-2 rounded-lg">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" /> Ruang Chat Aktif
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Immersive Live Chat UI */}
        <div className="lg:col-span-8">
          {activeAppointmentId ? (
            /* Active chatting interface screen design */
            <div className="bg-white rounded-2xl shadow-sm border border-slate-205 flex flex-col h-[520px]" id="chat-stage">
              {/* Header inside chat */}
              <div className="p-4 border-b border-slate-205 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {isSiswa ? 'GBK' : 'SIS'}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-850 leading-normal">
                      {isSiswa 
                        ? allAppointments.find(a => a.id === activeAppointmentId)?.counselorName
                        : allAppointments.find(a => a.id === activeAppointmentId)?.studentName
                      }
                    </h4>
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Aktif dalam obrolan bimbingan
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="hidden sm:inline-flex items-center gap-1 py-1 px-2.5 bg-blue-50/20 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100">
                    <Video className="w-3 h-3" /> Integrasi Meet Online
                  </span>
                </div>
              </div>

              {/* Chat messages stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/10" id="chat-history-viewport">
                {chatList.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div 
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} text-left animate-fade-in`}
                    >
                      <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                      }`}>
                        <p>{msg.message}</p>
                        <p className={`text-[8px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-slate-400'} font-semibold font-mono`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start text-left">
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none text-slate-500 text-xs flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Bottom message form write */}
              <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl space-y-3">
                {/* Quick Assistance Phrases helper for demo interactive simplicity */}
                <div className="flex flex-wrap gap-1.5">
                  {(isSiswa ? [
                    'Saya merasa sangat cemas Bu.',
                    'Bagaimana cara memulihkan stres tugas?',
                    'Terima kasih bimbingannya Bu!'
                  ] : [
                    'Mari kita diskusikan solusinya.',
                    'Ibu jamin rahasia kamu aman.',
                    'Apakah besok pagi bisa tatap muka?'
                  ]).map((phrase, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendFastPhrase(phrase)}
                      className="px-2.5 py-1 hover:bg-slate-50 border border-slate-200 rounded-lg text-[9px] text-slate-500 font-semibold cursor-pointer"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ketik balasan atau pesan bantuan konseling..."
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-705"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition cursor-pointer flex items-center justify-center text-white border-none"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Dormant chat help desk representation view */
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 sm:p-12 text-center flex flex-col justify-center items-center space-y-4 h-[520px]">
              <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center text-blue-650">
                <MessageSquare className="w-8 h-8 stroke-1" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-base font-bold text-slate-900">Ruang Konseling Digital Rahasia</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ada sesi bimbingan yang aktif? Klik tombol <strong>Ruang Chat Aktif</strong> pada daftar riwayat jadwal di sebelah kiri untuk berdialog langsung secara interaktif.
                </p>
              </div>

              <div className="px-3 py-1.5 bg-blue-50/20 text-blue-800 rounded-lg border border-blue-100 flex items-center gap-1.5 text-[10px] font-bold">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span>Tekan tombol demo user switcher untuk melihat simulasi antarpengguna</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
