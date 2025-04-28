import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
// Ellipsis component (replace with PaginationEllipsis if available)
const PaginationEllipsis = () => <span className="px-2">...</span>;

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

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className={currentPage === 1 ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {/* Ellipsis Pagination */}
        {(() => {
          const pages = [];
          for (let i = 1; i <= totalPages; i++) {
            if (
              i === 1 ||
              i === 2 ||
              i === totalPages ||
              i === totalPages - 1 ||
              Math.abs(i - currentPage) <= 1
            ) {
              pages.push(
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(i)}
                    isActive={currentPage === i}
                    variant="ghost"
                  >
                    {i}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              (i === 3 && currentPage > 4) ||
              (i === totalPages - 2 && currentPage < totalPages - 3)
            ) {
              pages.push(
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
          }
          return pages;
        })()}


        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            className={
              currentPage === totalPages ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''
            }
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;