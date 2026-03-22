import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Topnav from '../components/Topnav';
import StudentRow from '../components/StudentRow';
import AddStudentModal from '../components/AddStudentModal';
import { useStudentsByStandard } from '../hooks/useStudents';
import { useStandard } from '../hooks/useStandards';

export default function StandardDetailPage() {
  const { standardId } = useParams();
  const { data: standard, isLoading: isStandardLoading } = useStandard(standardId);
  const { data: students, isLoading: isStudentsLoading } = useStudentsByStandard(standardId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (isStandardLoading || isStudentsLoading) {
    return <div className="p-8">Loading class details...</div>;
  }

  const totalTarget = students?.reduce((sum, s) => sum + Number(s.total_fees), 0) || 0;
  const totalCollected = students?.reduce((sum, s) => sum + Number(s.paid_amount), 0) || 0;
  const collectionProgress = totalTarget > 0 ? (totalCollected / totalTarget) * 100 : 0;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body">
      <Topnav title="FeeTrack Admin" />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full text-on-surface">
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 px-5 py-2.5 editorial-gradient text-white hover:opacity-90 hover:shadow-lg text-sm font-bold tracking-widest uppercase rounded-lg transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Dashboard
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight text-on-surface">{standard?.name}</h2>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="fixed bottom-6 right-6 sm:static sm:bottom-auto sm:right-auto z-50 px-6 py-4 sm:py-3 editorial-gradient text-white font-bold tracking-widest text-sm uppercase rounded-full sm:rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:opacity-90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl sm:text-lg">add</span>
            <span className="hidden sm:inline">Add Student</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <div className="lg:col-span-3 bg-surface-container-lowest p-8 rounded-xl outline outline-1 outline-outline-variant shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-headline text-on-surface">Student Records</h3>
              <div className="text-sm font-medium text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-lg">
                Total: {students?.length || 0}
              </div>
            </div>
            
            <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0 pb-4">
              <table className="w-full text-left border-collapse min-w-[800px] whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="pb-4 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Student Name</th>
                    <th className="pb-4 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Total Fee</th>
                    <th className="pb-4 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Paid</th>
                    <th className="pb-4 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Remaining</th>
                    <th className="pb-4 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right border-b border-outline-variant">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.map(student => (
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
            <div className="editorial-gradient p-8 rounded-xl text-inverse-on-surface shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <h4 className="text-xs uppercase tracking-widest font-headline opacity-80 mb-4">Class Collection</h4>
              <div className="text-3xl font-headline mb-1">₹{totalCollected.toLocaleString('en-IN')}</div>
              <p className="text-xs opacity-70">Total Fees Collected</p>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span>Target</span>
                  <span className="font-bold">₹{totalTarget.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-white transition-all duration-500" style={{ width: `${collectionProgress || 0}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm outline outline-1 outline-outline-variant">
              <h4 className="text-sm font-headline text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">analytics</span>
                Stats
              </h4>
               <div className="space-y-4">
                 <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-lg">
                   <span className="text-xs text-on-surface-variant font-bold uppercase">Fully Paid</span>
                   <span className="text-sm font-bold text-primary">
                     {students?.filter(s => s.status === 'PAID').length || 0}
                   </span>
                 </div>
                 <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-lg">
                   <span className="text-xs text-on-surface-variant font-bold uppercase">Pending</span>
                   <span className="text-sm font-bold text-error">
                     {students?.filter(s => s.status !== 'PAID').length || 0}
                   </span>
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
    </div>
  );
}