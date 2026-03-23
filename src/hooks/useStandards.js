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
        supabase
          .from('standards')
          .select('id,name,display_order,teacher_id,created_at')
          .eq('teacher_id', user.id)
          .order('display_order'),
        supabase
          .from('student_fee_summary')
          .select('id,standard_id,total_fees,paid_amount,remaining_amount')
          .eq('teacher_id', user.id)
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
    enabled: !!user,
    staleTime: 60 * 1000
  });
};

export const useStandard = (standardId) => {
  return useQuery({
    queryKey: ['standard', standardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('standards')
        .select('id,name,display_order,teacher_id,created_at')
        .eq('id', standardId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!standardId,
    staleTime: 60 * 1000
  });
};
