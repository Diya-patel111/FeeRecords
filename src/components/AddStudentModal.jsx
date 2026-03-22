import { useState } from 'react';
import { useAddStudent } from '../hooks/useStudents';

export default function AddStudentModal({ standardId, onClose }) {
  const [fullName, setFullName] = useState('');
  const [totalFees, setTotalFees] = useState('');

  const { mutate: addStudent, isPending } = useAddStudent();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !totalFees) return;

    addStudent({
      standard_id: standardId,
      full_name: fullName,
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 font-body">
      <div className="absolute inset-0 bg-secondary/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom">
        <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-start">
          <h2 className="text-xl font-headline text-on-surface">Add New Student</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant">
             <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase block mb-1">Full Name</label>
            <input 
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2.5 px-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
              placeholder="e.g. Aditi Sharma"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase block mb-1">Total Annual Fees (₹)</label>
            <input 
              type="number"
              required
              min="0"
              step="0.01"
              value={totalFees}
              onChange={e => setTotalFees(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2.5 px-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
              placeholder="12000"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
             <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2 hover:bg-surface-container-highest text-on-surface-variant font-bold text-sm rounded-lg transition-colors border border-outline-variant"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isPending}
              className="editorial-gradient text-white px-5 py-2.5 rounded-lg font-bold text-sm tracking-widest uppercase shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}