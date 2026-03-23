import { usePaymentsByStudent } from '../hooks/usePayments';
import RecordPaymentModal from './RecordPaymentModal';
import { useState } from 'react';

export default function PaymentHistoryDrawer({ student, isOpen, onClose }) {
  const { data: payments, isLoading } = usePaymentsByStudent(student?.id);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-body flex lg:block items-end justify-center">
      <div 
        className="absolute inset-0 bg-secondary/40 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />
      
      <section className="relative lg:absolute lg:inset-y-0 lg:right-0 w-full lg:max-w-xl bg-surface shadow-2xl flex flex-col transform transition-transform duration-300 lg:outline lg:outline-1 lg:outline-outline-variant text-on-surface rounded-t-3xl lg:rounded-none max-h-[95vh] lg:max-h-full">
        <header className="px-6 lg:px-8 py-6 lg:py-8 border-b border-outline-variant flex items-center justify-between bg-surface-container/50 rounded-t-3xl lg:rounded-none">
          <div>
            <h2 className="text-xl sm:text-2xl font-headline text-on-surface mb-2">{student?.full_name || student?.name}</h2>
            <div className="flex items-center gap-3 text-sm text-on-surface-variant font-medium">
              <span>Ledger details</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-on-surface-variant hover:text-on-surface bg-surface hover:bg-surface-container rounded-full transition-colors border border-outline-variant shadow-sm"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Total Paid</p>
              <p className="text-3xl font-headline text-primary">
                ₹{Number(student?.paid_amount || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-error-container p-6 rounded-2xl border border-error/20">
              <p className="text-xs font-bold text-error uppercase tracking-widest mb-2">Remaining</p>
              <p className="text-3xl font-headline text-error">
                ₹{Number(student?.remaining_amount || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-headline text-on-surface flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Payment History
            </h3>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
            {isLoading ? (
              <div className="py-8 text-center text-on-surface-variant font-medium">Loading history...</div>
            ) : payments?.length === 0 ? (
              <div className="py-12 text-center text-on-surface-variant font-medium bg-surface-container rounded-2xl border border-dashed border-outline-variant">
                No payments recorded yet. <br/> <span className="text-sm">Click "Record Payment" to add one.</span>
              </div>
            ) : (
              payments?.map((payment, index) => (
                <div key={payment.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-surface bg-surface-container text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl shadow-sm bg-surface-container-lowest border border-outline-variant transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-headline text-xl text-on-surface">
                        ₹{Number(payment.amount).toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs font-bold text-on-surface-variant uppercase bg-surface-container px-3 py-1 rounded-full">
                        {new Date(payment.payment_date).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    {payment.note && (
                      <p className="text-sm text-on-surface-variant mt-3 p-3 bg-surface-container rounded-lg italic">"{payment.note}"</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-5 sm:p-8 bg-surface-container border-t border-outline-variant mt-auto">
          <button 
            onClick={() => setIsRecordModalOpen(true)}
            disabled={Number(student?.remaining_amount || 0) <= 0}
            className="w-full flex justify-center py-4 px-4 rounded-xl shadow-md hover:shadow-lg text-sm font-headline text-white editorial-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {Number(student?.remaining_amount || 0) <= 0 ? 'Fee Fully Paid' : 'Record New Payment'}
          </button>
        </div>
      </section>

      {isRecordModalOpen && (
        <RecordPaymentModal 
          student={student} 
          onClose={() => setIsRecordModalOpen(false)} 
        />
      )}
    </div>
  );
}
