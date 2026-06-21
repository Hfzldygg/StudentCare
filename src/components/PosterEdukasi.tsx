import React, { useState } from 'react';
import { EducationalPoster, User } from '../types';
import { getAppDatabase, saveAppDatabase } from '../data/mockData';
import { 
  Search, 
  BookOpen, 
  Bookmark, 
  Clock, 
  User as UserIcon, 
  X,
  Share2,
  Heart,
  Plus,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  FileText,
  Pencil,
  Trash2
} from 'lucide-react';

interface PosterEdukasiProps {
  currentUser: User;
  onRefreshDatabase: () => void;
}

export default function PosterEdukasi({ currentUser, onRefreshDatabase }: PosterEdukasiProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoster, setSelectedPoster] = useState<EducationalPoster | null>(null);
  
  // High fidelity states
  const [likedPosters, setLikedPosters] = useState<string[]>([]);
  const [bookmarkedPosters, setBookmarkedPosters] = useState<string[]>([]);
  
  // Create poster form states
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EducationalPoster['category']>('Kesehatan Mental');
  const [newDescription, setNewDescription] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newReadTime, setNewReadTime] = useState('3 Menit Baca');
  const [imageUrl, setImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Edit poster states
  const [editingPoster, setEditingPoster] = useState<EducationalPoster | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<EducationalPoster['category']>('Kesehatan Mental');
  const [editDescription, setEditDescription] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editReadTime, setEditReadTime] = useState('3 Menit Baca');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [isEditDragging, setIsEditDragging] = useState(false);

  const db = getAppDatabase();
  const posters = db.posters;

  const categories = [
    'Semua',
    'Kesehatan Mental',
    'Pengembangan Diri',
    'Strategi Belajar',
    'Perencanaan Karier',
    'Etika Digital',
    'Pencegahan Bullying'
  ];

  // Filtering
  const filteredPosters = posters.filter(poster => {
    const matchesCategory = activeCategory === 'Semua' || poster.category === activeCategory;
    const matchesSearch = poster.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          poster.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosters(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosters(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    setBookmarkedPosters(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
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
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newContent) {
      alert('Mohon isi semua field wajib!');
      return;
    }

    const currentDb = getAppDatabase();
    
    // Fallback beautiful illustration based on category
    let finalImageUrl = imageUrl;
    if (!finalImageUrl) {
      if (newCategory === 'Kesehatan Mental') {
        finalImageUrl = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800';
      } else if (newCategory === 'Strategi Belajar') {
        finalImageUrl = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800';
      } else if (newCategory === 'Etika Digital') {
        finalImageUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
      } else if (newCategory === 'Pencegahan Bullying') {
        finalImageUrl = 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800';
      } else if (newCategory === 'Pengembangan Diri') {
        finalImageUrl = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800';
      } else {
        finalImageUrl = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800';
      }
    }

    const brandNewPoster: EducationalPoster = {
      id: `poster_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      description: newDescription,
      contentMarkdown: newContent,
      author: currentUser.nama || 'Konselor BK',
      readTime: newReadTime,
      imageUrl: finalImageUrl
    };

    currentDb.posters.unshift(brandNewPoster);
    saveAppDatabase(currentDb);

    // Reset states
    setNewTitle('');
    setNewDescription('');
    setNewContent('');
    setImageUrl('');
    setShowUploadForm(false);
    
    onRefreshDatabase();
    alert('Poster edukasi bimbingan konseling berhasil dipublikasikan!');
  };

  const handleDeletePoster = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus poster edukasi ini? Tindakan ini tidak dapat dibatalkan.')) {
      const currentDb = getAppDatabase();
      currentDb.posters = currentDb.posters.filter((p: any) => p.id !== id);
      saveAppDatabase(currentDb);
      
      if (selectedPoster?.id === id) {
        setSelectedPoster(null);
      }
      onRefreshDatabase();
      alert('Poster edukasi bimbingan konseling berhasil dihapus!');
    }
  };

  const handleOpenEdit = (poster: EducationalPoster, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPoster(poster);
    setEditTitle(poster.title);
    setEditCategory(poster.category);
    setEditDescription(poster.description);
    setEditContent(poster.contentMarkdown);
    setEditReadTime(poster.readTime);
    setEditImageUrl(poster.imageUrl || '');
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsEditDragging(true);
  };

  const handleEditDragLeave = () => {
    setIsEditDragging(false);
  };

  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsEditDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPoster) return;
    if (!editTitle || !editDescription || !editContent) {
      alert('Mohon isi semua field wajib!');
      return;
    }

    const currentDb = getAppDatabase();
    
    // Fallback beautiful illustration based on category
    let finalImageUrl = editImageUrl;
    if (!finalImageUrl) {
      if (editCategory === 'Kesehatan Mental') {
        finalImageUrl = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800';
      } else if (editCategory === 'Strategi Belajar') {
        finalImageUrl = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800';
      } else if (editCategory === 'Etika Digital') {
        finalImageUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
      } else if (editCategory === 'Pencegahan Bullying') {
        finalImageUrl = 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800';
      } else if (editCategory === 'Pengembangan Diri') {
        finalImageUrl = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800';
      } else {
        finalImageUrl = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800';
      }
    }

    currentDb.posters = currentDb.posters.map((p: any) => {
      if (p.id === editingPoster.id) {
        return {
          ...p,
          title: editTitle,
          category: editCategory,
          description: editDescription,
          contentMarkdown: editContent,
          readTime: editReadTime,
          imageUrl: finalImageUrl
        };
      }
      return p;
    });

    saveAppDatabase(currentDb);

    if (selectedPoster?.id === editingPoster.id) {
      setSelectedPoster({
        ...selectedPoster,
        title: editTitle,
        category: editCategory,
        description: editDescription,
        contentMarkdown: editContent,
        readTime: editReadTime,
        imageUrl: finalImageUrl
      });
    }

    // Reset states
    setEditingPoster(null);
    onRefreshDatabase();
    alert('Poster bimbingan konseling berhasil diperbarui!');
  };

  const isGuruBK = currentUser.role === 'gurubk';

  return (
    <div className="space-y-6" id="poster-container">
      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-left space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pusat Diskusi & Poster Edukasi</h2>
          <p className="text-xs text-slate-500">Materi resmi bimbingan konseling, kesehatan mental remaja, etika digital, dan pencegahan bullying</p>
        </div>

        {/* Action button & Search bar inside */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {isGuruBK && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-sm shadow-blue-100"
              id="btn-upload-poster"
            >
              <Plus className="w-4 h-4" />
              Upload Poster Baru
            </button>
          )}

          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari materi edukasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-805 outline-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs list */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
              activeCategory === cat
                ? 'bg-blue-605 bg-blue-600 text-white shadow-md shadow-blue-100'
                : 'bg-white border border-slate-200/60 text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Master Posters Grid - Redesigned to Majestic Vertical Portrait Format */}
      {filteredPosters.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <BookOpen className="w-10 h-10 mx-auto stroke-1" />
          <p className="text-xs">Tidak menemukan poster edukasi berkaitan dengan kata kunci tersebut.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="posters-grid-list">
          {filteredPosters.map((poster) => (
            <div
              key={poster.id}
              onClick={() => setSelectedPoster(poster)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition duration-300 flex flex-col group cursor-pointer text-left h-full"
              id={`poster-${poster.id}`}
            >
              {/* Cover view - 100% tall portrait poster ratio like a physical poster standee */}
              <div className="relative aspect-[1/1.5] w-full overflow-hidden bg-slate-150">
                <img
                  src={poster.imageUrl}
                  alt={poster.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual category overlay badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-xs text-[10px] font-extrabold text-blue-700 uppercase tracking-wide rounded-full shadow-sm">
                  {poster.category}
                </span>

                {/* Micro interaction buttons */}
                <div className="absolute top-4 right-4 flex gap-1.5 z-10">
                  {isGuruBK && (
                    <>
                      <button
                        onClick={(e) => handleOpenEdit(poster, e)}
                        className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-full shadow-sm transition border border-amber-200 cursor-pointer"
                        title="Edit Poster"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeletePoster(poster.id, e)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-full shadow-sm transition border border-red-200 cursor-pointer"
                        title="Hapus Poster"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => toggleLike(poster.id, e)}
                    className="p-2 bg-white/95 backdrop-blur-xs hover:bg-white rounded-full text-slate-500 hover:text-red-500 shadow-sm transition cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedPosters.includes(poster.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => toggleBookmark(poster.id, e)}
                    className="p-2 bg-white/95 backdrop-blur-xs hover:bg-white rounded-full text-slate-500 hover:text-blue-505 hover:text-blue-650 shadow-sm transition cursor-pointer"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarkedPosters.includes(poster.id) ? 'fill-blue-600 text-blue-600' : ''}`} />
                  </button>
                </div>

                {/* Dark vignette gradient at bottom of poster to display quick details */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-semibold mb-1">
                    <UserIcon className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{poster.author}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{poster.readTime}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white leading-tight line-clamp-2">
                    {poster.title}
                  </h3>
                </div>
              </div>

              {/* Back card details and call to action bar */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {poster.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-blue-600">
                  <span className="uppercase tracking-wider">Baca & Telaah Poster</span>
                  <div className="flex items-center gap-1">
                    {likedPosters.includes(poster.id) && <span className="bg-red-50 text-red-500 px-1.5 py-0.5 rounded text-[8px]">Disukai</span>}
                    {bookmarkedPosters.includes(poster.id) && <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[8px]">Disimpan</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Publish New Poster Modal (For Counselor BK) */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="upload-poster-modal">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-left space-y-5">
            <button
              onClick={() => setShowUploadForm(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Publikasikan Poster Bimbingan Konseling Baru</h3>
              <p className="text-[11px] text-slate-400">Postingan yang dikirimkan di sini akan langsung disalurkan ke dashboard edukasi semua siswa.</p>
            </div>

            <form onSubmit={handleCreatePoster} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Judul Poster *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ayo Belajar Efektif di Rumah!"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Kategori Poster *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EducationalPoster['category'])}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-800 font-medium"
                  >
                    <option value="Kesehatan Mental">Kesehatan Mental</option>
                    <option value="Pengembangan Diri">Pengembangan Diri</option>
                    <option value="Strategi Belajar">Strategi Belajar</option>
                    <option value="Perencanaan Karier">Perencanaan Karier</option>
                    <option value="Etika Digital">Etika Digital</option>
                    <option value="Pencegahan Bullying">Pencegahan Bullying</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Estimasi Waktu Baca *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 3 Menit Baca"
                    value={newReadTime}
                    onChange={(e) => setNewReadTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Deskripsi Ringkas *</label>
                <input
                  type="text"
                  required
                  placeholder="Tulis ringkasan isi poster atau subjek pembahasannya"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-805"
                />
              </div>

              {/* High precision Drag and Drop upload block with Click backup */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">File Gambar Poster / Infografis</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                    isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => document.getElementById('poster-file-picker')?.click()}
                >
                  <input
                    id="poster-file-picker"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {imageUrl ? (
                    <div className="space-y-2 w-full">
                      <div className="h-28 overflow-hidden rounded-lg border relative bg-slate-50 max-w-[200px] mx-auto">
                        <img src={imageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageUrl('');
                          }}
                          className="absolute top-1 right-1 p-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-green-600 font-bold">Gambar berhasil diunggah!</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">Tarik gambar poster ke sini</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">atau Klik untuk pilih file dari komputermu</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Materi/Artikel Pendukung Lengkap *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Gunakan format Markdown atau teks biasa paragraf demi paragraf..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-805 leading-relaxed font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Publikasikan Poster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reader Modal Overlay layout - Dual Panel Desktop Design for Max Visual Pleasure */}
      {selectedPoster && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="reader-modal">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative text-left">
            
            {/* Direct close button */}
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-sm z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Split layout: Poster on Left, Contents on Right */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12">
              
              {/* Left Panel: The Tall Vertical Portrait Poster */}
              <div className="md:col-span-5 bg-slate-100 min-h-[300px] md:min-h-0 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 relative">
                <img
                  src={selectedPoster.imageUrl}
                  alt={selectedPoster.title}
                  className="w-full h-full object-contain max-h-[60vh] md:max-h-full"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Panel: Scrollable detailed text content area */}
              <div className="md:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[80vh]">
                <div className="space-y-5">
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase rounded-full">
                      {selectedPoster.category}
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-905 tracking-tight leading-snug">
                      {selectedPoster.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-450 font-bold text-slate-500">
                      <span className="flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5" /> {selectedPoster.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {selectedPoster.readTime}</span>
                    </div>
                  </div>

                  {/* Actual reader article format text content */}
                  <div className="prose prose-blue max-w-none text-xs sm:text-sm text-slate-705 leading-relaxed font-sans space-y-4 border-t border-slate-100 pt-4">
                    {selectedPoster.contentMarkdown.split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        return <h3 key={index} className="text-base font-extrabold text-slate-900 pt-3 border-b pb-1 border-slate-100">{paragraph.replace('## ', '')}</h3>;
                      }
                      if (paragraph.startsWith('### ')) {
                        return <h4 key={index} className="text-sm font-bold text-slate-800 pt-2">{paragraph.replace('### ', '')}</h4>;
                      }
                      if (paragraph.startsWith('* **') || paragraph.startsWith('* ')) {
                        return (
                          <ul key={index} className="list-disc list-inside pl-2 space-y-1">
                            {paragraph.split('\n').map((li, lidx) => (
                              <li key={lidx}>{li.replace('* ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      if (/^\d+\.\s+/.test(paragraph)) {
                        return (
                          <ol key={index} className="list-decimal list-inside pl-2 space-y-1">
                            {paragraph.split('\n').map((li, lidx) => (
                              <li key={lidx}>{li.replace(/^\d+\.\s+/, '')}</li>
                            ))}
                          </ol>
                        );
                      }
                      return <p key={index} className="text-slate-650 leading-relaxed font-medium">{paragraph}</p>;
                    })}
                  </div>
                </div>

                {/* Footer buttons inside reader */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { toggleLike(selectedPoster.id, e); }}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold transition border cursor-pointer ${
                        likedPosters.includes(selectedPoster.id) 
                          ? 'bg-red-50 border-red-200 text-red-600' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedPosters.includes(selectedPoster.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      {likedPosters.includes(selectedPoster.id) ? 'Batal Suka' : 'Suka'}
                    </button>
                    <button
                      onClick={(e) => { toggleBookmark(selectedPoster.id, e); }}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold transition border cursor-pointer ${
                        bookmarkedPosters.includes(selectedPoster.id) 
                          ? 'bg-blue-50 border-blue-250 text-blue-600' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarkedPosters.includes(selectedPoster.id) ? 'fill-blue-600 text-blue-600' : ''}`} />
                      Simpan
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isGuruBK && (
                      <>
                        <button
                          onClick={(e) => handleOpenEdit(selectedPoster, e)}
                          className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                          title="Edit Poster Ini"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={(e) => handleDeletePoster(selectedPoster.id, e)}
                          className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-bold border border-red-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                          title="Hapus Poster Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => { alert('Tautan poster berhasil disalin ke papan klip! Bagikan materi ke wali kelas atau forum chat WhatsApp.'); }}
                      className="px-3 py-2 hover:bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Bagikan
                    </button>
                    <button
                      onClick={() => setSelectedPoster(null)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-xl transition cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* Edit Poster Modal (For Counselor BK) */}
      {editingPoster && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in" id="edit-poster-modal">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-left space-y-5">
            <button
              onClick={() => setEditingPoster(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Pencil className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Ubah & Sunting Poster Bimbingan Konseling</h3>
              <p className="text-[11px] text-slate-400">Sunting detail informasi materi bimbingan konseling dan konten publikasinya di bawah.</p>
            </div>

            <form onSubmit={handleEditPoster} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Judul Poster *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ayo Belajar Efektif di Rumah!"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Kategori Poster *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as EducationalPoster['category'])}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-800 font-medium"
                  >
                    <option value="Kesehatan Mental">Kesehatan Mental</option>
                    <option value="Pengembangan Diri">Pengembangan Diri</option>
                    <option value="Strategi Belajar">Strategi Belajar</option>
                    <option value="Perencanaan Karier">Perencanaan Karier</option>
                    <option value="Etika Digital">Etika Digital</option>
                    <option value="Pencegahan Bullying">Pencegahan Bullying</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Estimasi Waktu Baca *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 3 Menit Baca"
                    value={editReadTime}
                    onChange={(e) => setEditReadTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Deskripsi Ringkas *</label>
                <input
                  type="text"
                  required
                  placeholder="Tulis ringkasan isi poster atau subjek pembahasannya"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-805"
                />
              </div>

              {/* Drag and Drop upload block with Click backup */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">File Gambar Poster / Infografis</label>
                <div
                  onDragOver={handleEditDragOver}
                  onDragLeave={handleEditDragLeave}
                  onDrop={handleEditDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                    isEditDragging ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => document.getElementById('edit-poster-file-picker')?.click()}
                >
                  <input
                    id="edit-poster-file-picker"
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="hidden"
                  />
                  
                  {editImageUrl ? (
                    <div className="space-y-2 w-full">
                      <div className="h-28 overflow-hidden rounded-lg border relative bg-slate-50 max-w-[200px] mx-auto">
                        <img src={editImageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditImageUrl('');
                          }}
                          className="absolute top-1 right-1 p-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-green-600 font-bold">Gambar poster terpilih!</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">Tarik gambar poster ke sini atau biarkan kosong</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">atau Klik untuk pilih file baru dari sistem</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">Materi/Artikel Pendukung Lengkap *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Gunakan format Markdown atau teks biasa paragraf demi paragraf..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-805 leading-relaxed font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPoster(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
