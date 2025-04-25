import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getSpecializations,
} from '@/api/doctors';
import { toast } from 'sonner';

export const useDoctors = () => {
  const [query, setQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch doctors
  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['doctors', query],
    queryFn: () => getDoctors(query),
  });

  // Fetch specializations
  const { data: specializations = [] } = useQuery({
    queryKey: ['specializations'],
    queryFn: getSpecializations,
  });

  // Create doctor mutation
  const createDoctorMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add doctor', {
        description: error.response?.data?.detail || 'Please try again',
      });
    },
  });

  // Update doctor mutation
  const updateDoctorMutation = useMutation({
    mutationFn: ({ id, data }) => updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update doctor', {
        description: error.response?.data?.detail || 'Please try again',
      });
    },
  });

  // Delete doctor mutation
  const deleteDoctorMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete doctor', {
        description: error.response?.data?.detail || 'Please try again',
      });
    },
  });

  return {
    doctors,
    specializations,
    isLoading,
    query,
    setQuery,
    addDoctor: createDoctorMutation.mutate,
    updateDoctor: updateDoctorMutation.mutate,
    deleteDoctor: deleteDoctorMutation.mutate,
  };
};
