import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../hooks/useStudents';
import { usePaymentsByStudent } from '../hooks/usePayments';
import Topnav from '../components/Topnav';
import { useState } from 'react';
import RecordPaymentModal from '../components/RecordPaymentModal';
import { useQueryClient } from '@tanstack/react-query';

export default function StudentProfilePage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data: student, isLoading: isStudentLoading, error: studentError } = useStudent(studentId);
  const { data: payments, isLoading: isPaymentsLoading } = usePaymentsByStudent(studentId);

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['student', studentId] });
    queryClient.invalidateQueries({ queryKey: ['payments', studentId] });
  };

  if (isStudentLoading) return <div className="p-8">Loading profile...</div>;
  if (studentError || !student) return <div className="p-8 text-error">Error loading profile or student not found.</div>;

  const totalFees = Number(student.total_fees) || 0;
  const paidFees = Number(student.paid_amount) || 0;
  const remainingFees = Math.max(0, totalFees - paidFees);

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
      <Topnav title="Student Profile" />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl editorial-gradient flex items-center justify-center text-white hover:opacity-90 transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
            <div>
              <h2 className="text-2xl sm:text-3xl font-headline font-extrabold tracking-tight text-on-surface flex items-center gap-3">
                {student.full_name}
              </h2>
              <p className="text-on-surface-variant font-bold mt-1.5 uppercase tracking-widest text-xs">
                Class {student.standards?.name || '-'}
              </p>
            </div>
          </div>
          <div className="sm:ml-auto mt-4 sm:mt-0">
             <button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 editorial-gradient text-white rounded-xl font-bold text-sm tracking-widest uppercase hover:opacity-90 shadow-md hover:shadow-lg transition-all active:scale-95"
             >
                <span className="material-symbols-outlined text-lg">add_card</span>
                Record Fees
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Total Fees</p>
            <p className="text-3xl font-headline font-extrabold text-on-surface">
              ₹{totalFees.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Paid Up</p>
            <p className="text-3xl font-headline font-extrabold text-fees-green">
              ₹{paidFees.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border-2 border-primary/20 shadow-sm flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Remaining</p>
            <p className="text-3xl font-headline font-extrabold text-error">
              ₹{remainingFees.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Payment History Timeline */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-8">
           <h3 className="text-xl font-headline font-bold mb-6 text-on-surface border-b border-outline-variant/40 pb-4">Payment Timeline</h3>
           
           {isPaymentsLoading ? (
             <div className="py-4 text-on-surface-variant">Loading timeline...</div>
           ) : payments && payments.length > 0 ? (
             <div className="relative border-l-2 border-outline-variant/50 ml-3 space-y-8 pb-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="relative pl-8">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface-container-lowest border-2 border-primary z-10"></div>
                    <div className="bg-surface-container p-5 rounded-lg border border-outline-variant/30">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-lg text-fees-green">
                              +₹{Number(payment.amount).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs font-medium text-on-surface-variant mt-1">
                              {new Date(payment.payment_date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                       </div>
                       {payment.note && (
                         <div className="mt-3 p-3 bg-surface-container-low rounded text-sm text-on-surface">
                           "{payment.note}"
                         </div>
                       )}
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-10 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3">receipt_long</span>
                <p className="text-on-surface-variant font-medium">No payments recorded yet.</p>
             </div>
           )}
        </div>
      </main>

      {isPaymentModalOpen && (
        <RecordPaymentModal 
          student={student}
          onClose={() => {
            setIsPaymentModalOpen(false);
            handlePaymentSuccess();
          }}
        />
      )}
    </div>
  );
}
