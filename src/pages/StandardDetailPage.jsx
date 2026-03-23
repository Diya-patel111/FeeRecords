import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Topnav from '../components/Topnav';
import StudentRow from '../components/StudentRow';
import AddStudentModal from '../components/AddStudentModal';
import RecordPaymentModal from '../components/RecordPaymentModal';
import { useStudentsByStandard } from '../hooks/useStudents';
import { useStandard } from '../hooks/useStandards';

const getStdChipLabel = (standard) => {
  const name = String(standard?.name || '').trim();
  const match = name.match(/\d+/);
  const displayOrder = Number(standard?.display_order);

  if (match?.[0]) return `STD ${match[0]}`;
  if (!Number.isNaN(displayOrder) && displayOrder > 0) return `STD ${displayOrder}`;
  if (!name) return 'STD';

  return name.length > 12 ? name.slice(0, 12).toUpperCase() : name.toUpperCase();
};

const formatInr = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

export default function StandardDetailPage() {
  const { standardId } = useParams();
  const navigate = useNavigate();
  const { data: standard, isLoading: isStandardLoading } = useStandard(standardId);
  const { data: students, isLoading: isStudentsLoading } = useStudentsByStandard(standardId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPaymentStudent, setSelectedPaymentStudent] = useState(null);

  if (isStandardLoading || isStudentsLoading) {
    return <div className="p-8">Loading class details...</div>;
  }

  const totalTarget = students?.reduce((sum, student) => sum + Number(student.total_fees), 0) || 0;
  const totalCollected = students?.reduce((sum, student) => sum + Number(student.paid_amount), 0) || 0;
  const collectionProgress = totalTarget > 0 ? (totalCollected / totalTarget) * 100 : 0;
  const fullyPaidCount = students?.filter((student) => Number(student.remaining_amount) <= 0).length || 0;
  const pendingCount = (students?.length || 0) - fullyPaidCount;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body">
      <Topnav title="Standard Workspace" />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full text-on-surface max-w-7xl mx-auto">
        <section className="elevated-card rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant/30 text-on-surface rounded-xl hover:border-primary/40 hover:text-primary transition-all text-xs font-extrabold tracking-[0.15em] uppercase mb-5"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Dashboard
              </Link>

              <div className="mb-3">
                <span className="std-chip">{getStdChipLabel(standard)}</span>
              </div>
              <p className="text-sm text-on-surface-variant font-semibold mt-1">
                {students?.length || 0} students actively tracked in this standard.
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="fixed bottom-6 right-6 sm:static sm:bottom-auto sm:right-auto z-50 px-6 py-4 sm:py-3 editorial-gradient text-white font-bold tracking-[0.14em] text-sm uppercase rounded-full sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:opacity-90 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-2xl sm:text-lg">add</span>
              <span className="hidden sm:inline">Add Student</span>
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <div className="lg:col-span-3 elevated-card p-5 sm:p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-headline text-on-surface font-bold">Student Records</h3>
              <div className="text-xs font-extrabold tracking-[0.14em] text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-xl uppercase">
                Total {students?.length || 0}
              </div>
            </div>

            <div className="md:hidden space-y-3">
              {students?.map((student) => {
                const remainingAmount = Math.max(0, Number(student.total_fees) - Number(student.paid_amount));

                return (
                  <div key={student.id} className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4">
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => navigate(`/student/${student.id}`)}
                        className="flex items-center gap-3 min-w-0"
                      >
                        <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase shrink-0">
                          {student.full_name.charAt(0)}
                        </div>
                        <span className="font-semibold text-on-surface truncate">{student.full_name}</span>
                      </button>
                      <button
                        onClick={() => setSelectedPaymentStudent(student)}
                        className="action-pill bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-95 shrink-0"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_card</span>
                        Record Fees
                      </button>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant font-semibold">Remaining</span>
                        <span className={`font-semibold ${remainingAmount > 0 ? 'text-error' : 'text-primary'}`}>{formatInr(remainingAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant font-semibold">Paid</span>
                        <span className="font-semibold text-on-surface">{formatInr(student.paid_amount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant font-semibold">Total Fee</span>
                        <span className="font-semibold text-on-surface">{formatInr(student.total_fees)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {students?.length === 0 && (
                <div className="py-8 text-center text-on-surface-variant">
                  No students added yet.
                </div>
              )}
            </div>

            <div className="hidden md:block overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0 pb-4">
              <table className="w-full text-left border-collapse min-w-[920px] whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="pb-4 px-4 text-xs font-extrabold uppercase tracking-[0.15em] text-on-surface-variant border-b border-outline-variant/60">
                      Student Name
                    </th>
                    <th className="pb-4 px-4 text-xs font-extrabold uppercase tracking-[0.15em] text-on-surface-variant border-b border-outline-variant/60">
                      Action
                    </th>
                    <th className="pb-4 px-4 text-xs font-extrabold uppercase tracking-[0.15em] text-on-surface-variant border-b border-outline-variant/60">
                      Remaining
                    </th>
                    <th className="pb-4 px-4 text-xs font-extrabold uppercase tracking-[0.15em] text-on-surface-variant border-b border-outline-variant/60">
                      Paid
                    </th>
                    <th className="pb-4 px-4 text-xs font-extrabold uppercase tracking-[0.15em] text-on-surface-variant border-b border-outline-variant/60">
                      Total Fee
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students?.map((student) => (
                    <StudentRow key={student.id} student={student} />
                  ))}
                  {students?.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-on-surface-variant">
                        No students added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="editorial-gradient p-8 rounded-3xl text-inverse-on-surface shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/15 rounded-full blur-3xl"></div>
              <h4 className="text-xs uppercase tracking-[0.16em] font-extrabold opacity-80 mb-4">Class Collection</h4>
              <div className="text-3xl font-headline font-extrabold mb-1">{formatInr(totalCollected)}</div>
              <p className="text-xs opacity-75">Total Fees Collected</p>

              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Target</span>
                  <span>{formatInr(totalTarget)}</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-white transition-all duration-500" style={{ width: `${collectionProgress || 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="elevated-card p-5 sm:p-8 rounded-3xl">
              <h4 className="text-sm font-headline text-on-surface mb-6 flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-primary text-base">analytics</span>
                Stats
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl">
                  <span className="text-xs text-on-surface-variant font-extrabold uppercase tracking-[0.14em]">Fully Paid</span>
                  <span className="text-sm font-extrabold text-primary">{fullyPaidCount}</span>
                </div>
                <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl">
                  <span className="text-xs text-on-surface-variant font-extrabold uppercase tracking-[0.14em]">Pending</span>
                  <span className="text-sm font-extrabold text-error">{pendingCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isAddModalOpen && (
        <AddStudentModal
          standardId={standardId}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {selectedPaymentStudent && (
        <RecordPaymentModal
          student={selectedPaymentStudent}
          onClose={() => setSelectedPaymentStudent(null)}
        />
      )}
    </div>
  );
}
