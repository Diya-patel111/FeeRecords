import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => response, async (error) => {
  if (error.response?.status === 401) {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export const getStandards = async () => {
  const { data } = await api.get('/standards');
  return data.data;
};

export const getDashboardSummary = async () => {
  const { data } = await api.get('/dashboard/summary');
  return data.data;
};

export const getStudents = async (standardId) => {
  const url = standardId ? `/students?standard_id=${standardId}` : '/students';
  const { data } = await api.get(url);
  return data.data;
};

export const addStudent = async (studentData) => {
  const { data } = await api.post('/students', studentData);
  return data.data;
};

export const getPayments = async (studentId) => {
  const { data } = await api.get(`/payments?student_id=${studentId}`);
  return data.data;
};

export const recordPayment = async (paymentData) => {
  const { data } = await api.post('/payments', paymentData);
  return data.data;
};

export default api;
