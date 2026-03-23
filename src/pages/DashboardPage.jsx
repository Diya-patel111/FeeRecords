import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Topnav from '../components/Topnav';
import AddStandardModal from '../components/AddStandardModal';
import RecordPaymentModal from '../components/RecordPaymentModal';
import { useStandardsDashboard } from '../hooks/useStandards';
import { useAllStudents } from '../hooks/useStudents';

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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('standards');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPaymentStudent, setSelectedPaymentStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: standards, isLoading: isLoadingStandards, error: errorStandards } = useStandardsDashboard();
  const { data: allStudents, isLoading: isLoadingStudents } = useAllStudents();

  const standardsMap = useMemo(() => {
    const map = new Map();
    (standards || []).forEach((standard) => map.set(standard.id, standard));
    return map;
  }, [standards]);

  const filteredStudents = allStudents?.filter((student) =>
    (student.full_name || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const handleClassAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['standards_dashboard'] });
  };

  if (isLoadingStandards) return <div className="p-8">Loading dashboard...</div>;
  if (errorStandards) return <div className="p-8 text-error">Error loading dashboard: {errorStandards.message}</div>;

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
      <Topnav title="Collections Dashboard" />

      <main className="flex-grow p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <section className="elevated-card rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-primary/10 blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary/80 mb-2">
                Fee Intelligence
              </p>
              <h2 className="text-3xl lg:text-4xl font-headline font-extrabold tracking-tight text-on-surface">
                Precision Fee Operations
              </h2>
              <p className="text-on-surface-variant text-sm mt-2 max-w-2xl">
                Track standards, monitor collections, and record dues in one clean workflow.
              </p>
            </div>

            {activeTab === 'standards' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="fixed bottom-6 right-6 sm:static sm:bottom-auto sm:right-auto z-50 flex items-center justify-center gap-2 px-6 py-4 sm:py-3 editorial-gradient text-white rounded-full sm:rounded-2xl font-bold text-sm tracking-[0.16em] uppercase shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-2xl sm:text-lg">add</span>
                <span className="hidden sm:inline">Add Class</span>
              </button>
            )}
          </div>
        </section>

        <div className="frost-panel p-1.5 rounded-2xl mb-8 overflow-x-auto no-scrollbar gap-1 w-full max-w-sm flex">
          <button
            onClick={() => setActiveTab('standards')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 text-sm font-extrabold tracking-[0.14em] uppercase rounded-xl transition-all ${
              activeTab === 'standards'
                ? 'editorial-gradient text-white shadow-md'
                : 'text-on-surface-variant hover:bg-white/80'
            }`}
          >
            Standards
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 text-sm font-extrabold tracking-[0.14em] uppercase rounded-xl transition-all ${
              activeTab === 'students'
                ? 'editorial-gradient text-white shadow-md'
                : 'text-on-surface-variant hover:bg-white/80'
            }`}
          >
            Students
          </button>
        </div>

        {activeTab === 'standards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standards?.map((std) => (
              <Link
                key={std.id}
                to={`/standard/${std.id}`}
                className="elevated-card rounded-3xl p-7 group block relative overflow-hidden hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-primary/10 blur-2xl"></div>
                </div>

                <div className="relative z-10 flex justify-between items-start mb-7">
                  <div>
                    <span className="std-chip">{getStdChipLabel(std)}</span>
                    <h3 className="text-2xl font-headline font-extrabold text-on-surface mt-4 tracking-tight group-hover:text-primary transition-colors">
                      {std.name}
                    </h3>
                    <p className="text-sm font-semibold text-on-surface-variant mt-1">
                      {std.count} Students Enrolled
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div>
                    <div className="flex justify-between text-xs font-extrabold uppercase tracking-[0.14em] mb-2">
                      <span className="text-on-surface-variant">Collection Progress</span>
                      <span className="text-on-surface">{std.progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full editorial-gradient transition-all duration-500"
                        style={{ width: `${std.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/25">
                    <div>
                      <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-[0.16em] mb-1">
                        Collected
                      </p>
                      <p className="text-xl font-headline font-extrabold text-fees-green">
                        {formatInr(std.collected)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-[0.16em] mb-1">
                        Pending
                      </p>
                      <p className="text-xl font-headline font-extrabold text-fees-amber">
                        {formatInr(std.pending)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {standards?.length === 0 && (
              <div className="col-span-full py-16 px-8 text-center elevated-card rounded-3xl flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl text-primary">school</span>
                </div>
                <h3 className="text-2xl font-headline font-extrabold text-on-surface mb-2 tracking-tight">No Classes Yet</h3>
                <p className="text-on-surface-variant font-medium max-w-sm mb-8">
                  Create your first class to start adding students and tracking fee collections.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-8 py-4 editorial-gradient text-white rounded-2xl font-bold text-sm tracking-[0.15em] uppercase transition-all shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95"
                >
                  Add Your First Class
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="elevated-card p-8 rounded-3xl relative z-10 w-full overflow-hidden">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
              <h2 className="text-xl font-headline font-semibold text-on-surface whitespace-nowrap">Student Records</h2>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-surface-container rounded-xl w-full sm:w-72 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface"
                />
                <svg
                  className="w-5 h-5 absolute left-3 top-3 text-on-surface-variant"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {isLoadingStudents ? (
              <div className="py-8 text-center text-on-surface-variant font-medium">Loading students...</div>
            ) : (
              <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0 pb-4">
                <table className="w-full text-left border-collapse min-w-[920px] whitespace-nowrap">
                  <thead>
                    <tr>
                      <th className="pb-4 px-4 text-xs font-extrabold uppercase tracking-[0.15em] text-on-surface-variant border-b border-outline-variant/60">Student Name</th>
                      <th className="pb-4 px-4 text-xs font-extrabold uppercase tracking-[0.15em] text-on-surface-variant border-b border-outline-variant/60">Class</th>
                      <th className="pb-4 px-4 text-xs font-extrabold uppercase tracking-[0.15em] text-on-surface-variant border-b border-outline-variant/60">Total Fee</th>
                      <th className="pb-4 px-4 text-xs font-extrabold uppercase tracking-[0.15em] text-on-surface-variant border-b border-outline-variant/60">Paid</th>
                      <th className="pb-4 px-4 text-xs font-extrabold uppercase tracking-[0.15em] text-on-surface-variant border-b border-outline-variant/60">Remaining</th>
                      <th className="pb-4 px-4 text-xs font-extrabold uppercase tracking-[0.15em] text-on-surface-variant border-b border-outline-variant/60 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents?.map((student) => {
                      const standard = standardsMap.get(student.standard_id) || { name: student.standards?.name };
                      const remainingAmount = Math.max(0, Number(student.total_fees) - Number(student.paid_amount));

                      return (
                        <tr
                          key={student.id}
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
                          <td className="py-4 px-4 bg-surface-container-lowest group-hover:bg-white text-on-surface border-b border-outline-variant/60 transition-colors">
                            <span className="std-chip !text-[10px] !tracking-[0.09em] !px-3 !py-1 shadow-none">
                              {getStdChipLabel(standard)}
                            </span>
                          </td>
                          <td className="py-4 px-4 bg-surface-container-lowest group-hover:bg-white text-on-surface font-semibold border-b border-outline-variant/60 transition-colors">
                            {formatInr(student.total_fees)}
                          </td>
                          <td className="py-4 px-4 bg-surface-container-lowest group-hover:bg-white text-on-surface border-b border-outline-variant/60 transition-colors">
                            {formatInr(student.paid_amount)}
                          </td>
                          <td className="py-4 px-4 bg-surface-container-lowest group-hover:bg-white text-on-surface border-b border-outline-variant/60 transition-colors">
                            <span className={`font-semibold ${remainingAmount > 0 ? 'text-error' : 'text-primary'}`}>
                              {formatInr(remainingAmount)}
                            </span>
                          </td>
                          <td className="py-4 px-4 last:rounded-r-2xl bg-surface-container-lowest group-hover:bg-white border-b border-outline-variant/60 text-right transition-colors">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPaymentStudent(student);
                              }}
                              className="action-pill bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-95"
                            >
                              <span className="material-symbols-outlined text-[16px]">add_card</span>
                              Record Fees
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {allStudents?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-on-surface-variant">
                          No students added yet.
                        </td>
                      </tr>
                    ) : filteredStudents?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-on-surface-variant">
                          No students found matching "{searchQuery}".
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <AddStandardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleClassAdded}
      />

      {selectedPaymentStudent && (
        <RecordPaymentModal
          student={selectedPaymentStudent}
          onClose={() => setSelectedPaymentStudent(null)}
        />
      )}
    </div>
  );
}
