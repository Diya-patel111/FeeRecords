import { useState } from 'react';
import { useAddPayment } from '../hooks/usePayments';

export default function RecordPaymentModal({ student, onClose }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  
  const { mutate: addPayment, isPending } = useAddPayment();

  const currentRemaining = Number(student.remaining_amount || student.total_fees);
  const inputAmount = Number(amount) || 0;
  const newRemaining = Math.max(0, currentRemaining - inputAmount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputAmount <= 0) return;

    addPayment({
      student_id: student.id,
      amount: inputAmount,
      payment_date: date,
      note: note.trim() || null
    }, {
      onSuccess: () => {
        onClose();
        setAmount('');
        setNote('');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-secondary/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full sm:max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom max-h-[90vh] flex flex-col font-body">
        <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-start">
          <div>
            <h2 className="text-xl font-headline text-on-surface">Record Payment</h2>
            <p className="text-on-surface-variant text-sm mt-1">
              Applying to <span className="font-semibold text-primary">{student.full_name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="bg-surface-container-low p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center border border-outline-variant">
            <div>
              <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider mb-1">Current Due</p>
              <p className="text-lg font-bold text-on-surface">₹{currentRemaining.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider mb-1">Total Fees</p>
              <p className="text-lg font-bold text-on-surface-variant">₹{Number(student.total_fees).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase block mb-1">Payment Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
                <input 
                  type="number"
                  required
                  step="0.01"
                  min="1"
                  max={currentRemaining}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-8 pr-4 text-xl font-bold text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="0.00"
                />
              </div>
              <p className={`text-xs mt-2 font-medium ${newRemaining === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                New remaining balance: ₹{newRemaining.toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase block mb-1">Payment Date</label>
              <input 
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 px-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase block mb-1">Notes (Optional)</label>
              <textarea 
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                placeholder="e.g. Cash payment, check #123..."
                rows="2"
              ></textarea>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 bg-surface-container border-t border-outline-variant flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 rounded-b-xl">
          <button 
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-on-surface-variant font-bold text-sm hover:bg-surface-container-highest rounded-lg transition-colors border border-outline-variant"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isPending || inputAmount <= 0}
            className="w-full sm:w-auto editorial-gradient text-white px-6 py-2.5 rounded-lg font-bold text-sm tracking-widest uppercase shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {isPending ? 'Saving...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
