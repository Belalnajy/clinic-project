import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const CustomPagination = ({ pagination, pageSize = 10 }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(pagination.count / pageSize);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    navigate({ search: params.toString() });
  };

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Number of pages to show on each side of current page

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('...');
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            variant="ghost"
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className="min-w-[2.5rem]"
                variant="ghost"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            variant="ghost"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
