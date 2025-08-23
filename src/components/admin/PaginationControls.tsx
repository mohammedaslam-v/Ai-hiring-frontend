
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import { PaginationControlsProps } from '@/types/admin';

const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onItemsPerPageChange
}: PaginationControlsProps) => {
  // Generate page numbers for pagination with better handling for large datasets
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7; // Increased for better navigation
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Determine the range around current page
      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);
      
      // Adjust range if we're near the beginning
      if (currentPage <= 4) {
        startPage = 2;
        endPage = Math.min(6, totalPages - 1);
      }
      
      // Adjust range if we're near the end
      if (currentPage >= totalPages - 3) {
        startPage = Math.max(2, totalPages - 5);
        endPage = totalPages - 1;
      }
      
      // Add ellipsis before start if needed
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after end if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      
      // Always show last page if not already included
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Handle direct page navigation for large datasets
  const handleDirectPageNavigation = () => {
    const pageInput = prompt(`Enter page number (1-${totalPages}):`);
    if (pageInput) {
      const pageNumber = parseInt(pageInput);
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        onPageChange(pageNumber);
      } else {
        alert(`Please enter a valid page number between 1 and ${totalPages}`);
      }
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Show:</span>
        <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="200">200</SelectItem>
            <SelectItem value="500">500</SelectItem>
          </SelectContent>
        </Select>
        <span>per page</span>
      </div>

      <div className="text-sm text-gray-600">
        Showing {Math.min(startIndex + 1, totalItems)}-{Math.min(endIndex, totalItems)} of {totalItems} applicants
      </div>

      <div className="flex items-center gap-2">
        {/* Direct page navigation for large datasets */}
        {totalPages > 20 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDirectPageNavigation}
            className="text-xs px-2 py-1"
          >
            Go to Page
          </Button>
        )}

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, index) => (
              <PaginationItem key={`${page}-${index}`}>
                {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page as number);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationControls;
