import { useState, useEffect, useCallback } from 'react';
import { teacherJourneyService } from '@/services/teacherJourney.service';

export interface Interviewer {
  id: number;
  name: string;
}

export const useInterviewers = () => {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviewers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await teacherJourneyService.getInterviewers();
      if (response.status && response.data) {
        setInterviewers(response.data);
        setError(null);
      } else {
        setError(response.message || 'Failed to fetch interviewers');
      }
    } catch (err) {
      console.error('Error fetching interviewers:', err);
      setError('An error occurred while fetching interviewers');
    } finally {
      setLoading(false);
    }
  }, []);

  const addInterviewer = async (name: string) => {
    const response = await teacherJourneyService.createInterviewer(name);
    if (response.status) {
      await fetchInterviewers();
    }
    return response;
  };

  const updateInterviewer = async (id: number, name: string) => {
    const response = await teacherJourneyService.updateInterviewer(id, name);
    if (response.status) {
      await fetchInterviewers();
    }
    return response;
  };

  const deleteInterviewer = async (id: number) => {
    const response = await teacherJourneyService.deleteInterviewer(id);
    if (response.status) {
      await fetchInterviewers();
    }
    return response;
  };

  useEffect(() => {
    fetchInterviewers();
  }, [fetchInterviewers]);

  return { 
    interviewers, 
    loading, 
    error, 
    refreshInterviewers: fetchInterviewers,
    addInterviewer,
    updateInterviewer,
    deleteInterviewer
  };
};

