'use client';
import { useEffect, useState } from 'react';
import { objectsApi, HeyamaObject } from '@/lib/api';
import ObjectCard from '@/components/ObjectCard';
import CreateObjectForm from '@/components/CreateObjectForm';
import { useSocket } from '@/lib/useSocket';
import { Plus } from 'lucide-react';

export default function HomePage() {
  const [objects, setObjects] = useState<HeyamaObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    objectsApi.getAll()
      .then(setObjects)
      .finally(() => setLoading(false));
  }, []);

  useSocket(
    (obj: HeyamaObject) => {
      setConnected(true);
      setObjects((prev) => {
        if (prev.find((o) => o._id === obj._id)) return prev;
        return [obj, ...prev];
      });
    },
    ({ id }) => {
      setObjects((prev) => prev.filter((o) => o._id !== id));
    },
  );

  useEffect(() => {
    if (connected) {
      const t = setTimeout(() => setConnected(false), 3000);
      return () => clearTimeout(t);
    }
  }, [connected]);

  const handleDeleted = (id: string) => {
    setObjects((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Your Collection</h2>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider border border-indigo-100">
              Pro
            </span>
          </div>
          <p className="text-slate-500 max-w-md">
            Manage and organize your digital assets with real-time synchronization across all devices.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {connected ? 'Live Sync Active' : 'Offline Mode'}
            </span>
          </div>
          <CreateObjectForm />
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : objects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
            <Plus className="text-slate-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No assets found</h3>
          <p className="text-slate-500 mt-2 text-center max-w-xs">
            Start by creating your first object. It will appear here and sync instantly.
          </p>
          <div className="mt-6">
            <CreateObjectForm />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objects.map((obj) => (
            <ObjectCard key={obj._id} obj={obj} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
