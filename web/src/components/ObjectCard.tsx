'use client';
import Link from 'next/link';
import { Trash2, Eye } from 'lucide-react';
import { HeyamaObject, objectsApi } from '@/lib/api';

interface Props {
  obj: HeyamaObject;
  onDeleted: (id: string) => void;
}

export default function ObjectCard({ obj, onDeleted }: Props) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this item? This action cannot be undone.')) return;
    try {
      await objectsApi.remove(obj._id);
      onDeleted(obj._id);
    } catch (error) {
      alert('Failed to delete object. Please try again.');
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-56 bg-slate-100 overflow-hidden">
        <img
          src={obj.imageUrl}
          alt={obj.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Preview';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
           <span className="text-white text-xs font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded-md">
             Added {new Date(obj.createdAt).toLocaleDateString()}
           </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors truncate">
            {obj.title}
          </h3>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2 h-10 mb-4">
          {obj.description}
        </p>
        <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
          <Link
            href={`/objects/${obj._id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            <Eye size={16} /> Details
          </Link>
          <button
            onClick={handleDelete}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm shadow-rose-100"
            title="Delete Object"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
