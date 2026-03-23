import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const useStudentsByStandard = (standardId) => {
  return useQuery({
    queryKey: ['students', standardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_fee_summary')
        .select('*')
        .eq('standard_id', standardId)
        .order('full_name');
        
      if (error) throw error;
      return data;
    },
    enabled: !!standardId
  });
};

export const useAllStudents = () => {
  const user = useAuthStore(state => state.user);
  
  return useQuery({
    queryKey: ['all_students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_fee_summary')
        .select('*')
        .order('full_name');
        
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};

export const useStudent = (studentId) => {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const { data: student, error } = await supabase
        .from('student_fee_summary')
        .select('*')
        .eq('id', studentId)
        .single();
        
      if (error) throw error;

      let standardName = null;
      if (student?.standard_id) {
        const { data: standard, error: standardError } = await supabase
          .from('standards')
          .select('name')
          .eq('id', student.standard_id)
          .single();

        if (standardError) throw standardError;
        standardName = standard?.name ?? null;
      }

      return {
        ...student,
        standards: { name: standardName }
      };
    },
    enabled: !!studentId
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: async (student) => {
      const payloadToInsert = {
        standard_id: student?.standard_id ?? null,
        full_name: (student?.full_name ?? '').trim(),
        total_fees: Number(student?.total_fees ?? 0),
        teacher_id: user.id
      };

      const { data, error } = await supabase
        .from('students')
        .insert([payloadToInsert])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['students', data.standard_id]);
      queryClient.invalidateQueries(['standards_dashboard']);
      toast.success('Student added successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};
