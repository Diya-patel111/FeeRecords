import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export const useStandardsDashboard = () => {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['standards_dashboard', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const [standardsRes, feesRes] = await Promise.all([
        supabase.from('standards').select('*').eq('teacher_id', user.id).order('display_order'),
        supabase.from('student_fee_summary').select('*').eq('teacher_id', user.id)
      ]);

      if (standardsRes.error) throw standardsRes.error;
      if (feesRes.error) throw feesRes.error;

      return standardsRes.data.map(std => {
        const students = feesRes.data.filter(s => s.standard_id === std.id);
        const count = students.length;
        const total = students.reduce((sum, s) => sum + Number(s.total_fees), 0);
        const collected = students.reduce((sum, s) => sum + Number(s.paid_amount), 0);
        const pending = students.reduce((sum, s) => sum + Number(s.remaining_amount), 0);
        const progress = total > 0 ? (collected / total) * 100 : 0;

        return { ...std, count, total, collected, pending, progress };
      });
    },
    enabled: !!user
  });
};

export const useStandard = (standardId) => {
  return useQuery({
    queryKey: ['standard', standardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('standards')
        .select('*')
        .eq('id', standardId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!standardId
  });
};