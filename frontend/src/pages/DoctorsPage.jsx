import { useDoctors } from '@/hooks/useDoctors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DoctorCard from '../components/doctors/DoctorCard';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const DoctorsPage = () => {
  const {
    doctors,
    totalDoctors,
    isLoading,
    query,
    setQuery,
    page,
    pageSize,
    totalPages,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    goToPage,
    setPageSize,
  } = useDoctors();

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 1; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Doctors</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search doctors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalDoctors)} of {totalDoctors} doctors
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : doctors?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No doctors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}

      {/* Responsive Pagination */}
      <div className="mt-8">
        <Pagination>
          <PaginationContent className="flex-wrap justify-center gap-2">
            <PaginationItem className="hidden sm:inline-block">
              <PaginationPrevious 
                onClick={previousPage}
                disabled={!canPreviousPage}
              />
            </PaginationItem>
            <PaginationItem className="sm:hidden">
              <PaginationLink
                onClick={previousPage}
                disabled={!canPreviousPage}
              >
                ←
              </PaginationLink>
            </PaginationItem>
            
            {getVisiblePages().map((pageNum, idx) => (
              <PaginationItem key={idx} className={pageNum === '...' ? 'hidden sm:inline-block' : ''}>
                {pageNum === '...' ? (
                  <PaginationLink disabled>...</PaginationLink>
                ) : (
                  <PaginationLink
                    className="text-black"
                    isActive={page === pageNum}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem className="hidden sm:inline-block ">
              <PaginationNext
                onClick={nextPage}
                disabled={!canNextPage}
              />
            </PaginationItem>
            <PaginationItem className="sm:hidden">
              <PaginationLink
                onClick={nextPage}
                disabled={!canNextPage}
              >
                →
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default DoctorsPage;