import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentHistoryDrawer from './PaymentHistoryDrawer';
import RecordPaymentModal from './RecordPaymentModal';


export default function StudentRow({ student }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <tr 
        className="group hover:bg-surface-container transition-colors cursor-pointer"
        onClick={() => navigate(`/student/${student.id}`)}
      >
        <td className="py-4 px-4 first:rounded-l-xl bg-surface-container-lowest group-hover:bg-transparent border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
              {student.full_name.charAt(0)}
            </div>
            <span className="font-semibold text-on-surface">{student.full_name}</span>
          </div>
        </td>
        <td className="py-4 px-4 bg-surface-container-lowest group-hover:bg-transparent text-on-surface font-medium border-b border-outline-variant">
          ₹{Number(student.total_fees).toLocaleString('en-IN')}
        </td>
        <td className="py-4 px-4 bg-surface-container-lowest group-hover:bg-transparent text-on-surface border-b border-outline-variant">
          ₹{Number(student.paid_amount).toLocaleString('en-IN')}
        </td>
        <td className="py-4 px-4 bg-surface-container-lowest group-hover:bg-transparent text-on-surface border-b border-outline-variant">
          <span className={`font-medium ${Number(student.total_fees) - Number(student.paid_amount) > 0 ? 'text-error' : 'text-primary'}`}>
            ₹{Math.max(0, Number(student.total_fees) - Number(student.paid_amount)).toLocaleString('en-IN')}
          </span>
        </td>
        <td className="py-4 px-4 last:rounded-r-xl bg-surface-container-lowest group-hover:bg-transparent text-right border-b border-outline-variant">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsPaymentModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add_card</span>
            Pay
          </button>
        </td>
      </tr>

      {isDrawerOpen && (
        <PaymentHistoryDrawer 
          student={student} 
          onClose={() => setIsDrawerOpen(false)}
          onOpenPayment={() => setIsPaymentModalOpen(true)}
        />
      )}

      {isPaymentModalOpen && (
        <RecordPaymentModal 
          student={student} 
          onClose={() => setIsPaymentModalOpen(false)} 
        />
      )}
    </>
  );
}