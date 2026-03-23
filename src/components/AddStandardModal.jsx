import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function AddStandardModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore(state => state.user);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    
    const { error } = await supabase
      .from('standards')
      .insert([
        { 
          name: name.trim(), 
          display_order: parseInt(displayOrder, 10) || 1,
          teacher_id: user.id
        }
      ]);
      
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Class added successfully!');
      setName('');
      setDisplayOrder('1');
      setLoading(false);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 font-body" onClick={onClose}>
      <div className="absolute inset-0 bg-secondary/40 backdrop-blur-sm transition-opacity"></div>
      <div className="bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-2xl relative z-10 w-full max-w-md overflow-hidden animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/50">
          <h3 className="text-xl font-headline font-extrabold text-on-surface tracking-tight">Add New Class</h3>
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Class Name</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">school</span>
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 rounded-lg text-on-surface placeholder:text-outline/60 transition-all outline-none"
                placeholder="e.g. 5th Standard, Class 10A"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Display Order</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">sort</span>
              <input
                type="number"
                required
                min="1"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 rounded-lg text-on-surface placeholder:text-outline/60 transition-all outline-none"
                placeholder="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
              />
            </div>
            <p className="text-[11px] font-medium text-outline pt-1">Used to sort classes on the dashboard (e.g. 1 appears before 2).</p>
          </div>

          <div className="pt-6 flex flex-col-reverse sm:flex-row gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-lg font-bold text-sm tracking-widest uppercase transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 px-6 editorial-gradient text-white rounded-lg font-bold text-sm tracking-widest uppercase shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-75 flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Create
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
