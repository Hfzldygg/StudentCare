import { 
  User, 
  AssessmentQuestion, 
  Assessment, 
  IncidentReport, 
  CounselingAppointment, 
  CaseMonitoring, 
  EducationalPoster, 
  ChatMessage 
} from '../types';

export const SYSTEM_USERS: User[] = [
  {
    id: 'user_siswa_1',
    username: 'siswa',
    nama: 'Ahmad Rafli Fauzi',
    role: 'siswa',
    kelas: 'XI MIPA 2',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    email: 'ahmad.rafli@school.sch.id'
  },
  {
    id: 'user_siswa_2',
    username: 'siswa2',
    nama: 'Bunga Citra Lestari',
    role: 'siswa',
    kelas: 'X IPS 1',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    email: 'bunga.citra@school.sch.id'
  },
  {
    id: 'user_guru_1',
    username: 'gurubk',
    nama: 'Siti Rahmawati, S.Psi., M.Pd',
    role: 'gurubk',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    email: 'siti.rahmawati@school.sch.id'
  },
  {
    id: 'user_admin_1',
    username: 'admin',
    nama: 'Dr. H. Hermawan, M.Si',
    role: 'admin',
    fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    email: 'admin.care@school.sch.id'
  }
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    text: 'Saya merasa tidak aman atau cemas ketika berinteraksi di media sosial karena takut dikomentari negatif.',
    category: 'Cyberbullying',
    categoryLabel: 'Pencegahan Bullying & Cyberbullying'
  },
  {
    id: 'q2',
    text: 'Saya merasa kesulitan mengelola emosi atau stres akibat tugas sekolah dan tekanan dari lingkungan.',
    category: 'Kesehatan Mental',
    categoryLabel: 'Kesehatan Mental'
  },
  {
    id: 'q3',
    text: 'Saya menghadapi kendala dalam menentukan arah studi lanjut (perguruan tinggi) atau pilihan karier masa depan.',
    category: 'Perencanaan Karier',
    categoryLabel: 'Perencanaan Karier'
  },
  {
    id: 'q4',
    text: 'Saya sering menunda-nunda pekerjaan rumah (prokrastinasi) dan merasa cara belajar saya kurang efektif.',
    category: 'Strategi Belajar',
    categoryLabel: 'Strategi Belajar'
  },
  {
    id: 'q5',
    text: 'Saya pernah mengunduh/menyebarkan informasi tanpa memastikan kebenaran datanya terlebih dahulu (hoaks).',
    category: 'Etika Digital',
    categoryLabel: 'Etika Digital'
  },
  {
    id: 'q6',
    text: 'Saya kesulitan menolak ajakan teman yang bertentangan dengan prinsip pribadi atau mengganggu waktu belajar.',
    category: 'Pengembangan Diri',
    categoryLabel: 'Pengembangan Diri'
  },
  {
    id: 'q7',
    text: 'Saya merasa dijauhi atau dikucilkan oleh teman sekelas atau kelompok bermain saya akhir-akhir ini.',
    category: 'Pencegahan Bullying',
    categoryLabel: 'Pencegahan Bullying & Cyberbullying'
  },
  {
    id: 'q8',
    text: 'Saya sering mengalami gangguan pola tidur atau merasa lemas sepanjang hari karena kelelahan emosional.',
    category: 'Kesehatan Mental',
    categoryLabel: 'Kesehatan Mental'
  }
];

export const INITIAL_POSTERS: EducationalPoster[] = [
  {
    id: 'poster_1',
    title: 'Ayo Peduli Kesehatan Mental!',
    category: 'Kesehatan Mental',
    description: 'Kenali faktor penyebab, dampak jika terganggu, dan strategi praktis menjaga kesehatan mental remaja.',
    contentMarkdown: `## Ayo Peduli Kesehatan Mental!

### Apa itu Kesehatan Mental?
Kondisi emosi, psikologis, dan sosial kita. Membuat kita berpikir, merasa, dan bertindak dengan baik, serta menghadapi tantangan.

### Faktor Penyebab Mengganggu Kesehatan Mental:
1. **Tekanan Belajar**: Contoh: ujian, beban tugas sekolah, dan tugas rumah.
2. **Bullying & Masalah Pertemanan**: Masalah relasi sosial teman sebaya.
3. **Masalah Keluarga**: Contoh: Orang tua yang penuh tekanan, masalah komunikasi antara orang tua dan anak.
4. **Kurang Istirahat & Penggunaan Medsos Berlebihan**: Terlalu lama menatap layar ponsel mengabaikan dunia nyata.

### Dampak Jika Kesehatan Mental Terganggu:
1. **Perasaan Sedih, Cemas, atau Marah yang Lama**: Berlarut-larut mengganggu produktivitas.
2. **Sulit Berkonsentrasi & Nilai Menurun**: Sering tertidur di meja kelas, nilai akademik anjlok.
3. **Perubahan Pola Tidur & Makan**: Kebiasaan hidup menjadi tidak teratur dan kurang bugar.
4. **Menarik Diri dari Teman & Keluarga**: Mengisolasi diri dan enggan bergaul.

### Strategi Menjaga Kesehatan Mental:
1. **Cerita ke Orang Terpercaya**: Curahkan keluh kesahmu ke Guru BK atau sahabat terdekat.
2. **Istirahat Cukup**: Pola tidur malam yang ideal dan berkualitas secara konsisten.
3. **Olah Raga Ringan & Aktif**: Beraktivitas fisik teratur demi melepas ketegangan mental.
4. **Lakukan Hobi Menyenangkan**: Melakukan ketertarikan rekreatif yang memberi kepuasan batin.
5. **Minimalisir Medsos & Fokus ke Kehidupan Nyata**: Batasi screen time harian Anda demi ketenangan jiwa.`,
    author: 'Siti Rahmawati, S.Psi., M.Pd',
    readTime: '3 Menit Baca',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'poster_2',
    title: 'Ayo Pelajari Strategi Belajar Kita!',
    category: 'Strategi Belajar',
    description: 'Proses mengidentifikasi, mengaplikasikan, dan menyesuaikan metode belajar untuk meningkatkan pemahaman dan memori.',
    contentMarkdown: `## Ayo Pelajari Strategi Belajar Kita!

### Apa itu Strategi Belajar?
Proses mengidentifikasi, mengaplikasikan, dan menyesuaikan metode belajar untuk meningkatkan pemahaman dan memori.

### Faktor Pendukung Strategi Belajar:
1. **Gaya Belajar Personal**: Pahami gaya belajar Anda (Visual, Auditori, atau Kinestetik).
2. **Kesehatan Otak & Fisik**: Cukupi tidur, makan sehat, dan minum air untuk fungsi optimal.
3. **Lingkungan Belajar Kondusif**: Pilih tempat yang tenang, bersih, dan bebas distraksi.
4. **Disiplin Waktu Belajar**: Jadwalkan waktu belajar rutin dan patuhi untuk konsistensi.

### Dampak Positif dari Strategi Belajar:
1. **Pemahaman Lebih Cepat**: Materi rumit menjadi lebih mudah dimengerti dan diingat.
2. **Nilai & Prestasi Meningkat**: Mendapat hasil ujian yang lebih baik dan bangga dengan pencapaian.
3. **Target Akademik Jelas**: Dapat merencanakan dan mencapai tujuan belajar dengan terstruktur.
4. **Kepercayaan Diri Meningkat**: Merasa lebih mampu dan siap menghadapi tantangan akademis.

### Strategi Belajar Efektif:
1. **Pomodoro Technique**: Sesi belajar 25 menit dengan jeda 5 menit.
2. **Pembuatan Peta Pikiran**: Buatlah diagram visual untuk menghubungkan konsep.
3. **Pengulangan Berkala (Spaced Repetition)**: Tinjau materi secara berkala (Sehari, Seminggu, Sebulan).
4. **Latih Soal Mandiri**: Sering berlatih menjawab soal latihan untuk pemahaman mendalam.
5. **Membuat Ringkasan Aktif**: Rangkum materi dalam kata-kata sendiri untuk retensi terbaik.`,
    author: 'Siti Rahmawati, S.Psi., M.Pd',
    readTime: '4 Menit Baca',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'poster_3',
    title: 'Ayo Pelajari Etika Digital Kita!',
    category: 'Etika Digital',
    description: 'Prinsip-prinsip moral dan perilaku yang benar dalam menggunakan teknologi digital dan internet secara bijak.',
    contentMarkdown: `## Ayo Pelajari Etika Digital Kita!

### Apa itu Etika Digital?
Prinsip-prinsip moral dan perilaku yang benar dalam menggunakan teknologi digital dan internet secara sopan santun.

### Faktor Pendukung Etika Digital:
1. **Hormati Privasi & Keamanan**: Pahami pentingnya menjaga data pribadi dan keamanan akun digital Anda.
2. **Membangun Komunikasi Sopan**: Berperilaku ramah, saling menghargai, dan empati dalam interaksi online.
3. **Berpikir Kritis & Cek Fakta**: Verifikasi kebenaran informasi sebelum membagikan untuk mencegah hoaks.
4. **Promosikan Lingkungan Sehat**: Jadilah teladan dalam menyebarkan konten positif dan anti-bullying.

### Dampak Positif dari Etika Digital:
1. **Terbangunnya Komunitas Harmonis**: Ciptakan lingkungan online yang damai, positif, dan saling mendukung.
2. **Kehormatan & Reputasi Baik**: Pertahankan citra diri yang baik dan terhormat di mata publik digital.
3. **Menumbuhkan Kepercayaan (Trust)**: Jalin hubungan online yang solid berdasarkan kejujuran dan integritas.
4. **Peluang Kolaborasi Positif**: Buka peluang baru untuk berkolaborasi dan belajar dari sesama pengguna digital.

### Tahapan Penerapan Etika Digital:
1. **Memahami Aturan & Norma**: Pelajari hukum dan etika yang berlaku di dunia digital.
2. **Pilih Konten Bijak**: Pastikan konten yang dibagikan bermanfaat dan tidak menyakiti orang lain.
3. **Beri Komentar Positif**: Berikan feedback yang konstruktif dan sopan di media sosial.
4. **Bersikap Otentik**: Jadilah diri sendiri yang jujur dan konsisten di setiap platform.
5. **Evaluasi Perilaku Anda**: Tinjau kembali tindakan online Anda secara berkala dan perbaiki jika perlu.`,
    author: 'Kementerian Pendidikan & Literasi Digital',
    readTime: '4 Menit Baca',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'poster_4',
    title: 'Prevensi Bullying: Lindungi Diri & Teman!',
    category: 'Pencegahan Bullying',
    description: 'Kenali jenis perundungan, dampak positif pencegahannya, serta langkah konkret untuk melindungi diri dan lingkungan sekolah.',
    contentMarkdown: `## Prevensi Bullying: Lindungi Diri & Teman!

### Apa itu Bullying?
Tindakan agresif yang dilakukan secara sengaja dan berulang oleh individu atau kelompok terhadap orang lain yang memiliki kekuatan lebih rendah.

### Jenis Bullying & Tandanya:
1. **Fisik**: Memukul, mendorong, merusak barang milik orang lain.
2. **Verbal**: Mengejek, menghina, memberi julukan buruk yang merendahkan.
3. **Sosial**: Mengabaikan, memusuhi, memboikot, menyebarkan rumor jahat.
4. **Cyberbullying**: Komentar kebencian, pesan mengancam siber, menyebarkan foto tanpa izin.

### Dampak Positif dari Pencegahan Bullying:
1. **Kepercayaan Diri Meningkat**: Siswa merasa aman, dihargai, dan percaya diri mengembangkan bakat.
2. **Perkawanan Sehat**: Membangun relasi persahabatan yang kokoh dan penuh ketulusan.
3. **Prestasi Akademik Melejit**: Konsentrasi belajar tanpa rasa cemas, takut, ataupun tertekan.
4. **Kesehatan Mental Terjamin**: Memperoleh mood positif dan mereduksi risiko stres berkelanjutan.

### Langkah-Langkah Prevensi Bullying:
1. **Mengenali Tindakan Bullying**: Pahami jenis bullying agar sanggup bertindak tanggap.
2. **Bicara & Laporkan**: Berani menyuarakan fakta dan melapor ke Guru BK atau Orang Tua.
3. **Dukung Korban**: Berikan simpati dan perlindungan emosional kepada korban bullying.
4. **Jangan Menjadi Pelaku**: Jaga sikap santun dan hindari konformitas bertindak buruk.
5. **Edukasi & Sosialisasi Rutin**: Aktif mengampanyekan kegiatan antirundung di sekolah.`,
    author: 'Tim Bimbingan Konseling',
    readTime: '3 Menit Baca',
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'poster_5',
    title: 'Cegah Cyberbullying: Jaga Diri & Teman di Dunia Digital!',
    category: 'Pencegahan Bullying',
    description: 'Panduan khusus bagi siswa untuk mengantisipasi bahaya pesan kebencian, pencurian identitas, dan penyebaran rumor di internet.',
    contentMarkdown: `## Cegah Cyberbullying: Jaga Diri & Teman di Dunia Digital!

### Apa itu Cyberbullying?
Tindakan perundungan yang dilakukan di media digital seperti smartphone dan internet untuk menyakiti atau mengintimidasi orang lain secara sengaja dan berulang.

### Bentuk Cyberbullying & Tandanya:
1. **Pesan Kebencian**: Kiriman komentar bermuatan hinaan, makian kasar, dan ujaran kebencian di kolom komentar.
2. **Penyebaran Rumor**: Membuat gosip fiktif atau membocorkan rahasia personal korban di ranah publik online.
3. **Komentar Penghinaan**: Memanipulasi visual (meme olok-olok) untuk mempermalukan harga diri korban di jagat internet.
4. **Pencurian Identitas (Impersonation)**: Membuat akun palsu menyerupai korban untuk menyebarkan kekacauan atau berniat memfitnah.

### Dampak Positif dari Pencegahan Cyberbullying:
1. **Kesehatan Mental Terjaga**: Mengurangi tingkat stres, kecemasan sosial, dan depresi berat akibat tekanan warganet.
2. **Interaksi Positif**: Menghadirkan atmosfer media sosial yang saling memotivasi dan ramah.
3. **Fokus Belajar Digital**: Mengoptimalkan pemanfaatan jaringan internet bagi kegiatan akademis konstruktif.
4. **Keamanan Privasi Meningkat**: Lebih waspada terhadap kerawanan eksploitasi data pribadi oleh pihak asing.

### Langkah-Langkah Pencegahan Cyberbullying:
1. **Pahami Bahaya Cyberbullying**: Mengetahui bentuk-bentuk kejahatan siber untuk respons cepat.
2. **Jaga Privasi Anda**: Gunakan setelan privasi ketat, rahasiakan password, dan sandi keamanan.
3. **Latih Empati Online**: Pikirkan emosi orang lain sebelum jempol Anda mengetik opini.
4. **Hentikan Perilaku Menyakiti**: Tolak segala bentukan komplotan perundungan siber (tidak ikut terseret menyukai hal buruk).
5. **Laporkan & Cerita**: Tangkap cuplikan bukti (screenshot), blokir akun pelaku, dan konsultasikan ke Guru BK.`,
    author: 'Siti Rahmawati, S.Psi., M.Pd',
    readTime: '4 Menit Baca',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'poster_6',
    title: 'Ayo Kembangkan Diri Kita!',
    category: 'Pengembangan Diri',
    description: 'Proses meningkatkan kesadaran diri, mengembangkan bakat, serta mencapai potensi maksimal untuk kehidupan yang lebih baik.',
    contentMarkdown: `## Ayo Kembangkan Diri Kita!

### Apa itu Pengembangan Diri?
Proses meningkatkan kesadaran diri, mengasah bakat potensial, serta mengupayakan capaian prestasi optimal guna mempersiapkan kebaikan di masa mendatang.

### Faktor Pendukung Pengembangan Diri:
1. **Mental yang Terbuka (Growth Mindset)**: Terbuka mempelajari wawasan anyar, memandang kegagalan sebagai bentuk koreksi berharga.
2. **Kesehatan Fisik & Mental**: Keseimbangan bugar yang menyinergikan ketahanan raga dan ketenteraman pikiran.
3. **Lingkungan & Pertemanan Positif**: Berada di tengah-tengah relasi kawan produktif yang saling memicu motivasi baik.
4. **Disiplin & Manajemen Waktu**: Keandalan mengatur porsi prioritas harian secara saksama.

### Dampak Positif dari Pengembangan Diri:
1. **Kepercayaan Diri Meningkat**: Lebih yakin sanggup mengatasi rintangan dan bangga terhadap kepribadian positif sendiri.
2. **Keterampilan Baru Terasah**: Makin banyak keahlian yang dikuasai untuk membentangkan peluang karir/akademis.
3. **Pencapaian Target yang Jelas**: Membantu merumuskan ambisi esok dengan langkah-langkah realistis yang kokoh.
4. **Kehidupan Lebih Bahagia**: Kedamaian batin dan kepuasan atas proses menyempurnakan kualitas diri.

### Strategi Menjaga Pertumbuhan Diri:
1. **Belajar Terus Tanpa Henti**: Haus akan ilmu, rajin membaca buku, dan berminat melatih keahlian teknis/non-teknis.
2. **Atur Target yang Jelas & Realistis**: Susun gol jangka menengah berpondasi tolok ukur logis (SMART goals).
3. **Cari Feedback dari Orang Lain**: Membuka diri menerima saran membangun dari guru, sahabat, dan konselor.
4. **Rawat Diri & Meditasi**: Mengambil jeda relaksasi guna menjernihkan pikiran dari beban akademis.
5. **Refleksi Diri Rutin**: Luangkan porsi waktu singkat mengevaluasi perkembangan karakter individual secara berkala.`,
    author: 'Tim Bimbingan Konseling',
    readTime: '3 Menit Baca',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'poster_7',
    title: 'Ayo Rencanakan Karir Kita!',
    category: 'Perencanaan Karier',
    description: 'Proses berkelanjutan untuk mengidentifikasi potensi, menetapkan tujuan karir, dan mengambil langkah strategis mencapainya.',
    contentMarkdown: `## Ayo Rencanakan Karir Kita!

### Apa itu Perencanaan Karir?
Proses berkelanjutan untuk mengidentifikasi potensi, menetapkan tujuan karir, dan mengambil langkah-langkah strategis untuk mencapainya.

### Faktor Pendukung Perencanaan Karir:
1. **Self-Assessment (Pahami Dirimu)**: Pahami nilai-nilai, minat, kepribadian, dan bakat Anda untuk menemukan jalur yang tepat.
2. **Pengembangan Keterampilan (Skills)**: Identifikasi dan pelajari keterampilan baru yang dibutuhkan di industri target Anda.
3. **Membangun Jaringan (Networking)**: Jalin hubungan dengan profesional dan mentor untuk mendapatkan peluang dan wawasan.
4. **Peta Jalan Karir yang Fleksibel**: Rencanakan langkah-langkah realistis dan sesuaikan dengan perubahan pasar kerja.

### Dampak Positif dari Perencanaan Karir:
1. **Tujuan Karir yang Lebih Jelas**: Memiliki visi yang jelas tentang masa depan karir dan langkah-langkah untuk mencapainya.
2. **Kepuasan & Motivasi Kerja**: Merasa lebih termotivasi karena bekerja menuju target yang Anda inginkan.
3. **Peluang Promosi & Pertumbuhan**: Persiapan yang baik membuka jalan untuk kesempatan karir yang lebih baik.
4. **Keseimbangan Kehidupan & Karir**: Rencana yang matang membantu mengelola prioritas dengan lebih baik.

### Tahapan Perencanaan Karir:
1. **Eksplorasi Opsi Karir**: Pelajari berbagai industri dan jenis pekerjaan yang tersedia.
2. **Penetapan Tujuan Karir**: Tentukan tujuan karir jangka pendek dan jangka panjang Anda.
3. **Pengembangan Rencana Aksi**: Buat langkah-langkah konkret untuk mencapai setiap tujuan karir.
4. **Pelaksanaan & Pembelajaran**: Ambil tindakan dan terus pelajari keterampilan baru yang relevan.
5. **Evaluasi & Penyesuaian**: Tinjau kemajuan Anda secara berkala dan sesuaikan rencana jika perlu.`,
    author: 'Tim Bimbingan Konseling',
    readTime: '4 Menit Baca',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm_1',
    studentId: 'user_siswa_2',
    studentName: 'Bunga Citra Lestari',
    studentKelas: 'X IPS 1',
    date: '2026-06-19',
    responses: [
      { questionId: 'q1', score: 3 }, // Sangat sering merasa cemas akibat komentar sosmed
      { questionId: 'q2', score: 2 }, // Sering stres tugas
      { questionId: 'q3', score: 1 }, // Jarang/pernah kendala karir
      { questionId: 'q4', score: 3 }, // Sangat sering prokrastinasi
      { questionId: 'q5', score: 0 }, // Tidak pernah menyebar hoaks
      { questionId: 'q6', score: 2 }, // Sering sulit menolak ajakan teman
      { questionId: 'q7', score: 3 }, // Sangat sering merasa dikucilkan
      { questionId: 'q8', score: 2 }  // Sering kurang tidur
    ],
    totalScore: 16, // total dari responses
    maxScore: 24, // 8 questions * 3 max score
    riskLevel: 'Tinggi', // ambang batas tinggi
    categoryScores: {
      'Cyberbullying': 3,
      'Kesehatan Mental': 4, // q2=2, q8=2
      'Perencanaan Karier': 1,
      'Strategi Belajar': 3,
      'Etika Digital': 0,
      'Pengembangan Diri': 2,
      'Pencegahan Bullying': 3
    },
    notes: 'Siswa mengalami tekanan psikologis akibat dijauhi teman sekelas dan mendapat pesan bertendensi bullying di grup WhatsApp kelas serta sering mengalami gangguan tidur.'
  },
  {
    id: 'asm_2',
    studentId: 'user_siswa_1',
    studentName: 'Ahmad Rafli Fauzi',
    studentKelas: 'XI MIPA 2',
    date: '2026-06-20',
    responses: [
      { questionId: 'q1', score: 1 },
      { questionId: 'q2', score: 1 },
      { questionId: 'q3', score: 2 }, // Ragu rencana karir
      { questionId: 'q4', score: 2 }, // Sering menunda tugas
      { questionId: 'q5', score: 0 },
      { questionId: 'q6', score: 1 },
      { questionId: 'q7', score: 0 },
      { questionId: 'q8', score: 1 }
    ],
    totalScore: 8,
    maxScore: 24,
    riskLevel: 'Sedang',
    categoryScores: {
      'Cyberbullying': 1,
      'Kesehatan Mental': 2,
      'Perencanaan Karier': 2,
      'Strategi Belajar': 2,
      'Etika Digital': 0,
      'Pengembangan Diri': 1,
      'Pencegahan Bullying': 0
    },
    notes: 'Fokus permasalahan pada motivasi belajar dan kebingungan menentukan pilihan prodi SNMPTN jalur prestasi tahun depan.'
  }
];

export const INITIAL_REPORTS: IncidentReport[] = [
  {
    id: 'rep_1',
    studentId: 'user_siswa_2',
    reporterName: 'Bunga Citra Lestari',
    reporterKelas: 'X IPS 1',
    date: '2026-06-20',
    incidentDate: '2026-06-19',
    description: 'Ada sekelompok siswa yang mengirimkan meme mengolok-olok fisik saya di grup WhatsApp khusus angkatan, dan beberapa mengirim pesan pribadi mengejek dengan nada mengancam.',
    involvees: 'Beberapa siswa kelas X IPS 1 (Inisial R, D, dan G)',
    evidenceUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400',
    evidenceName: 'screenshot_grup_wa.png',
    status: 'Menunggu',
    feedback: ''
  },
  {
    id: 'rep_2',
    studentId: 'user_siswa_1',
    reporterName: 'Ahmad Rafli Fauzi',
    reporterKelas: 'XI MIPA 2',
    date: '2026-06-18',
    incidentDate: '2026-06-17',
    description: 'Saya menyaksikan langsung adanya tindakan pemalakan/pemerasan uang saku di area belakang kantin sekolah saat jam istirahat kedua.',
    involvees: 'Siswa kelas XII dan kelas X (Siswa bernama Jefri dikompori siswa luar)',
    evidenceUrl: '',
    status: 'Ditinjau',
    feedback: 'Guru BK sedang memanggil Jefri untuk dimintai klarifikasi mendalam.'
  }
];

export const INITIAL_APPOINTMENTS: CounselingAppointment[] = [
  {
    id: 'apt_1',
    studentId: 'user_siswa_2',
    studentName: 'Bunga Citra Lestari',
    studentKelas: 'X IPS 1',
    counselorId: 'user_guru_1',
    counselorName: 'Siti Rahmawati, S.Psi., M.Pd',
    date: '2026-06-22',
    time: '10:00',
    status: 'Disetujui',
    type: 'Online',
    reason: 'Ingin berdiskusi mengenai penanganan laporan cyberbullying yang siber alami dan meminta bimbingan psikologis untuk memulihkan kecemasan.',
    notes: 'Sesi online akan dilaksanakan via Chat E-Counseling StudentCare.'
  },
  {
    id: 'apt_2',
    studentId: 'user_siswa_1',
    studentName: 'Ahmad Rafli Fauzi',
    studentKelas: 'XI MIPA 2',
    counselorId: 'user_guru_1',
    counselorName: 'Siti Rahmawati, S.Psi., M.Pd',
    date: '2026-06-23',
    time: '13:00',
    status: 'Menunggu',
    type: 'Tatap Muka',
    reason: 'Konsultasi minat bakat dan mendiskusikan hasil asesmen kebutuhan siswa yang bermasalah pada efektivitas belajar.',
    notes: ''
  }
];

export const INITIAL_MONITORING: CaseMonitoring[] = [
  {
    id: 'mon_1',
    studentId: 'user_siswa_2',
    studentName: 'Bunga Citra Lestari',
    studentKelas: 'X IPS 1',
    caseType: 'Cyberbullying & Dikucilkan Teman',
    assessmentSummary: 'Skor Asesmen Kebutuhan berada di taraf Tinggi (16/24), sangat cemas terhadap interaksi online, dan mengalami insomniatik.',
    actionTaken: 'Mediasi dengan wali kelas, pemanggilan siswa inisial R, D, dan G secara bertahap untuk pembinaan karakter, dan merancang sesi terapi katarsis kognitif.',
    counselingOutcome: 'Siswa bersangkutan merasa mendapat dukungan penuh dari sekolah, tingkat kecemasan diredam, dan para pelaku berjanji menghapus materi perundungan.',
    progressStatus: 'Dalam Sesi',
    planFollowUp: 'Evaluasi mingguan bersama wali kelas untuk memastikan tidak ada retaliasi siber atau isolasi sosial susulan.',
    lastUpdated: '2026-06-20'
  },
  {
    id: 'mon_2',
    studentId: 'user_siswa_1',
    studentName: 'Ahmad Rafli Fauzi',
    studentKelas: 'XI MIPA 2',
    caseType: 'Gangguan Konsentrasi Belajar & Kegelisahan Karier',
    assessmentSummary: 'Skor Asesmen berada di taraf Sedang (8/24), dengan sub-indikator strategi belajar dan perencanaan masa depan butuh perhatian.',
    actionTaken: 'Konseling individual, menyusun peta target belajar mingguan menggunakan metode matriks Eisenhower, dan simulasi penjelajahan portal minat karier.',
    counselingOutcome: 'Siswa berhasil menyusun skala prioritas tugas sekolah dan mulai memahami potensi dirinya di bidang teknik komputer.',
    progressStatus: 'Perbaikan Nyata',
    planFollowUp: 'Melakukan re-asesmen bulanan dan diskusi materi persiapan ujian tulis bersama guru bimbingan untuk adaptasi mental.',
    lastUpdated: '2026-06-19'
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg_1',
    appointmentId: 'apt_1',
    senderId: 'user_guru_1',
    senderRole: 'gurubk',
    message: 'Halo Bunga. Ibu sudah membaca laporan pengaduanmu dan hasil asesmen kebutuhan yang kamu isi. Ibu sangat bersimpati dengan apa yang kamu alami. Kita akan diskusikan bersama penyelesaiannya di sini ya.',
    timestamp: '2026-06-21T09:00:00'
  },
  {
    id: 'msg_2',
    appointmentId: 'apt_1',
    senderId: 'user_siswa_2',
    senderRole: 'siswa',
    message: 'Halo, Bu Siti. Terima kasih banyak sudah merespons laporan saya. Saya merasa sangat takut dan tidak berani masuk sekolah karena cacingan komentar di media sosial semakin ramai.',
    timestamp: '2026-06-21T09:02:00'
  },
  {
    id: 'msg_3',
    appointmentId: 'apt_1',
    senderId: 'user_guru_1',
    senderRole: 'gurubk',
    message: 'Sangat dipahami perasaanmu Bunga. Kamu sangat berani melapor ke StudentCare, dan tindakanmu merekam bukti screenshots itu sangat tepat. Ibu sudah mengontak wali kelasmu untuk mengondisikan ketertiban di kelas IPS 1 besok pagi. Pelaku akan Ibu panggil ke ruangan BK secara terpisah untuk diberi pemahaman hukum digital.',
    timestamp: '2026-06-21T09:05:00'
  }
];

// Helper functions for LocalStorage management
export interface AppDatabase {
  users: User[];
  assessments: Assessment[];
  reports: IncidentReport[];
  appointments: CounselingAppointment[];
  monitoring: CaseMonitoring[];
  posters: EducationalPoster[];
  chats: ChatMessage[];
  currentUser: User | null;
}

const STORAGE_KEY = 'studentcare_db_v1';

export function getAppDatabase(): AppDatabase {
  if (typeof window === 'undefined') {
    return {
      users: SYSTEM_USERS,
      assessments: INITIAL_ASSESSMENTS,
      reports: INITIAL_REPORTS,
      appointments: INITIAL_APPOINTMENTS,
      monitoring: INITIAL_MONITORING,
      posters: INITIAL_POSTERS,
      chats: INITIAL_CHAT,
      currentUser: SYSTEM_USERS[0], // default to first student
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaultDb: AppDatabase = {
      users: SYSTEM_USERS,
      assessments: INITIAL_ASSESSMENTS,
      reports: INITIAL_REPORTS,
      appointments: INITIAL_APPOINTMENTS,
      monitoring: INITIAL_MONITORING,
      posters: INITIAL_POSTERS,
      chats: INITIAL_CHAT,
      currentUser: SYSTEM_USERS[0], // default to Siswa 1
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDb));
    return defaultDb;
  }

  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error('Error parsing studentcare database', err);
    return {
      users: SYSTEM_USERS,
      assessments: INITIAL_ASSESSMENTS,
      reports: INITIAL_REPORTS,
      appointments: INITIAL_APPOINTMENTS,
      monitoring: INITIAL_MONITORING,
      posters: INITIAL_POSTERS,
      chats: INITIAL_CHAT,
      currentUser: SYSTEM_USERS[0],
    };
  }
}

export function saveAppDatabase(db: AppDatabase): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}

export function resetAppDatabase(): AppDatabase {
  const defaultDb: AppDatabase = {
    users: SYSTEM_USERS,
    assessments: INITIAL_ASSESSMENTS,
    reports: INITIAL_REPORTS,
    appointments: INITIAL_APPOINTMENTS,
    monitoring: INITIAL_MONITORING,
    posters: INITIAL_POSTERS,
    chats: INITIAL_CHAT,
    currentUser: SYSTEM_USERS[0],
  };
  saveAppDatabase(defaultDb);
  return defaultDb;
}
