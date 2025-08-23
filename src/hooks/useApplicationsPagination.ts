import { useState, useEffect } from 'react';

// Mock data for applications pagination
const mockApplications = Array.from({ length: 100 }, (_, i) => ({
  id: `app-${i + 1}`,
  firstName: `Candidate ${i + 1}`,
  lastName: `Last ${i + 1}`,
  email: `candidate${i + 1}@example.com`,
  phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  position: ['English Teacher', 'Math Teacher', 'Science Teacher'][Math.floor(Math.random() * 3)],
  status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  applicationId: `APP-${String(i + 1).padStart(4, '0')}`
}));

export function useApplicationsPagination(pageSize: number = 10) {
  const [applications, setApplications] = useState(mockApplications.slice(0, pageSize));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(mockApplications.length / pageSize));
  const [isLoading, setIsLoading] = useState(false);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    setIsLoading(true);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Simulate API delay
    setTimeout(() => {
      setApplications(mockApplications.slice(startIndex, endIndex));
      setCurrentPage(page);
      setIsLoading(false);
    }, 300);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  useEffect(() => {
    goToPage(1);
  }, [pageSize]);

  return {
    applications,
    currentPage,
    totalPages,
    isLoading,
    goToPage,
    nextPage,
    prevPage
  };
}