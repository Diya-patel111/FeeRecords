import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Topnav from '../components/Topnav';
import AddStandardModal from '../components/AddStandardModal';
import RecordPaymentModal from '../components/RecordPaymentModal';
import { useStandardsDashboard } from '../hooks/useStandards';
import { useAllStudents } from '../hooks/useStudents';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('standards'); // 'standards' or 'students'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPaymentStudent, setSelectedPaymentStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data: standards, isLoading: isLoadingStandards, error: errorStandards } = useStandardsDashboard();
  const { data: allStudents, isLoading: isLoadingStudents } = useAllStudents();

  const filteredStudents = allStudents?.filter(student => 
    (student.full_name || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const handleClassAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['standards_dashboard'] });
  };

  if (isLoadingStandards) return <div className="p-8">Loading dashboard...</div>;
  if (errorStandards) return <div className="p-8 text-error">Error loading dashboard: {errorStandards.message}</div>;

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
      <Topnav title="FeeTrack Dashboard" />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-headline font-extrabold tracking-tight text-on-surface">Dashboard</h2>
          </div>
          
          {activeTab === 'standards' && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="fixed bottom-6 right-6 sm:static sm:bottom-auto sm:right-auto z-50 flex items-center justify-center gap-2 px-6 py-4 sm:py-3 editorial-gradient text-white rounded-full sm:rounded-xl font-bold text-sm tracking-widest uppercase shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-2xl sm:text-lg">add</span>
              <span className="hidden sm:inline">Add Class</span>
            </button>
          )}
        </div>

        <div className="flex bg-surface-container-low p-1.5 rounded-xl mb-6 sm:mb-8 overflow-x-auto no-scrollbar gap-1 w-full max-w-sm">
          <button 
            onClick={() => setActiveTab('standards')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 text-sm font-bold tracking-widest uppercase rounded-lg transition-all ${activeTab === 'standards' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Standards
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 text-sm font-bold tracking-widest uppercase rounded-lg transition-all ${activeTab === 'students' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Students
          </button>
        </div>

        {activeTab === 'standards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standards?.map(std => (
              <Link 
                key={std.id} 
                to={`/standard/${std.id}`}
                className="bg-surface-container-lowest p-8 rounded-xl shadow-2xl shadow-on-surface/5 border border-outline-variant/20 hover:border-primary/40 transition-all group block relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h3 className="text-2xl font-headline font-extrabold text-on-surface group-hover:text-primary transition-colors tracking-tight">
                      {std.name}
                    </h3>
                    <p className="text-sm font-medium text-on-surface-variant mt-1">{std.count} Students Enrolled</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                      <span className="text-on-surface-variant">Collection Progress</span>
                      <span className="text-on-surface">{std.progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${std.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/20">
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Collected</p>
                      <p className="text-xl font-headline font-extrabold text-fees-green">
                        ₹{std.collected.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Pending</p>
                      <p className="text-xl font-headline font-extrabold text-fees-amber">
                        ₹{std.pending.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {standards?.length === 0 && (
              <div className="col-span-full py-16 px-8 text-center bg-surface-container-lowest border border-dashed border-outline-variant/40 rounded-xl flex flex-col items-center justify-center shadow-sm">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl text-primary/60">school</span>
                </div>
                <h3 className="text-2xl font-headline font-extrabold text-on-surface mb-2 tracking-tight">No Classes Yet</h3>
                <p className="text-on-surface-variant font-medium max-w-sm mb-8">Create your first class to start adding students and tracking fee collections.</p>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-8 py-4 editorial-gradient text-white hover:opacity-90 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg hover:shadow-xl shadow-primary/20 active:scale-95"
                >
                  Add Your First Class
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-surface-container-lowest p-8 rounded-xl outline outline-1 outline-outline-variant shadow-sm relative z-10 w-full overflow-hidden">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
              <h2 className="text-xl font-headline font-semibold text-on-surface whitespace-nowrap">Student Records</h2>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-surface-container rounded-xl w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                />
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {isLoadingStudents ? (
              <div className="py-8 text-center text-on-surface-variant font-medium">Loading students...</div>
            ) : (
              <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0 pb-4">
                <table className="w-full text-left border-collapse min-w-[800px] whitespace-nowrap">
                  <thead>
                    <tr>
                      <th className="pb-4 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Student Name</th>
                      <th className="pb-4 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Class</th>
                      <th className="pb-4 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Total Fee</th>
                      <th className="pb-4 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Paid</th>
                      <th className="pb-4 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Remaining</th>
                      <th className="pb-4 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents?.map(student => (
                      <tr 
                        key={student.id}
                        className="group hover:bg-surface-container transition-colors cursor-pointer"
                        onClick={() => navigate(`/student/${student.id}`)}
                      >
                        <td className="py-4 px-4 first:rounded-l-xl border-b border-outline-variant">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                              {student.full_name.charAt(0)}
                            </div>
                            <span className="font-semibold text-on-surface">{student.full_name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-on-surface-variant font-medium border-b border-outline-variant">
                          {standards?.find(s => s.id === student.standard_id)?.name || student.standards?.name || '-'}
                        </td>
                        <td className="py-4 px-4 text-on-surface font-medium border-b border-outline-variant">
                          ₹{Number(student.total_fees).toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-4 text-on-surface border-b border-outline-variant">
                          ₹{Number(student.paid_amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-4 text-on-surface border-b border-outline-variant">
                          <span className={`font-medium ${Number(student.total_fees) - Number(student.paid_amount) > 0 ? 'text-error' : 'text-primary'}`}>
                            ₹{Math.max(0, Number(student.total_fees) - Number(student.paid_amount)).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-4 px-4 last:rounded-r-xl border-b border-outline-variant text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPaymentStudent(student);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[16px]">add_card</span>
                            Pay
                          </button>
                        </td>
                      </tr>
                    ))}
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