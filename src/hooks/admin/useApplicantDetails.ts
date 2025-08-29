import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardApplicationDetail } from '@/types/admin';

export const useApplicantDetails = () => {
  const [selectedApplicant, setSelectedApplicant] = useState<DashboardApplicationDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (applicant: { id: string; firstName: string; lastName: string; email: string; phone: string; subjects: string[]; status: string; createdAt: string; applicationId: string }) => {
    console.log('👀 Navigating to details for applicant:', applicant);
    
    // Navigate to the application detail page
    navigate(`/admin/applications/${applicant.id}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  return {
    selectedApplicant,
    isModalOpen,
    handleViewDetails,
    closeModal
  };
};
