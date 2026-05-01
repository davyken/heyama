'use client';
import { useState, useRef } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { objectsApi } from '@/lib/api';

export default function CreateObjectForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max = 1200;

          if (width > height) {
            if (width > max) {
              height *= max / width;
              width = max;
            }
          } else {
            if (height > max) {
              width *= max / height;
              height = max;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', 0.85);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

const handleSubmit = async () => {
    if (!title || !description || !file) {
      setError('Missing information. All fields are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const resizedBlob = await resizeImage(file);
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('image', resizedBlob, 'upload.jpg');

      await objectsApi.create(fd);

      // Reset and close
      setTitle('');
      setDescription('');
      setFile(null);
      setPreview(null);
      setOpen(false);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Upload failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
      >
        <Plus size={20} /> <span className="hidden sm:inline">Add New Asset</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-xl text-slate-800">Add New Asset</h2>
                <p className="text-xs text-slate-400 font-medium">Capture and store your digital treasures</p>
              </div>
              <button 
                onClick={() => !loading && setOpen(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {error && (
                <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                   {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Asset Title</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="E.g. Summer Memories"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none h-28"
                    placeholder="Tell the story behind this asset..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div
                  onClick={() => !loading && inputRef.current?.click()}
                  className={`relative group border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    preview ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {preview ? (
                    <div className="relative inline-block">
                      <img src={preview} alt="preview" className="h-40 w-auto object-cover rounded-xl shadow-lg" />
                      {!loading && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-rose-500 hover:scale-110 transition-transform cursor-pointer border border-rose-100" onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}>
                           <X size={16} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload size={28} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-slate-700">Drop your image here</span>
                        <span className="text-xs text-slate-400">JPG, PNG, WEBP up to 10MB</span>
                      </div>
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 flex gap-3">
              <button
                onClick={() => !loading && setOpen(false)}
                className="flex-1 py-3 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-wait shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Create Asset</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
