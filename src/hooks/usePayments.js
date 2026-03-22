import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const usePaymentsByStudent = (studentId) => {
  return useQuery({
    queryKey: ['payments', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', studentId)
        .order('payment_date', { ascending: false })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!studentId
  });
};

export const useAddPayment = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: async (payment) => {
      const { data, error } = await supabase
        .from('payments')
        .insert([{ ...payment, teacher_id: user.id }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate to refresh student summary and payments
      queryClient.invalidateQueries(['students']);
      queryClient.invalidateQueries(['payments', data.student_id]);
      queryClient.invalidateQueries(['standards_dashboard']);
      toast.success('Payment recorded successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};