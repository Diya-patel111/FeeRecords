import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentHistoryDrawer from './PaymentHistoryDrawer';
import RecordPaymentModal from './RecordPaymentModal';

export default function StudentRow({ student }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const navigate = useNavigate();
  const remainingAmount = Math.max(0, Number(student.total_fees) - Number(student.paid_amount));

  return (
    <>
      <tr
        className="group cursor-pointer"
        onClick={() => navigate(`/student/${student.id}`)}
      >
        <td className="py-4 px-4 first:rounded-l-2xl bg-surface-container-lowest group-hover:bg-white border-b border-outline-variant/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
              {student.full_name.charAt(0)}
            </div>
            <span className="font-semibold text-on-surface">{student.full_name}</span>
          </div>
        </td>
        <td className="py-4 px-4 bg-surface-container-lowest group-hover:bg-white text-on-surface font-semibold border-b border-outline-variant/60 transition-colors">
          Rs {Number(student.total_fees).toLocaleString('en-IN')}
        </td>
        <td className="py-4 px-4 bg-surface-container-lowest group-hover:bg-white text-on-surface border-b border-outline-variant/60 transition-colors">
          Rs {Number(student.paid_amount).toLocaleString('en-IN')}
        </td>
        <td className="py-4 px-4 bg-surface-container-lowest group-hover:bg-white text-on-surface border-b border-outline-variant/60 transition-colors">
          <span className={`font-semibold ${remainingAmount > 0 ? 'text-error' : 'text-primary'}`}>
            Rs {remainingAmount.toLocaleString('en-IN')}
          </span>
        </td>
        <td className="py-4 px-4 last:rounded-r-2xl bg-surface-container-lowest group-hover:bg-white text-right border-b border-outline-variant/60 transition-colors">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPaymentModalOpen(true);
            }}
            className="action-pill bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add_card</span>
            Record Fees
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
