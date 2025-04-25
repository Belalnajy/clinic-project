import { useDoctors } from '@/hooks/useDoctors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DoctorCard from '../components/doctors/DoctorCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

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
  } = useDoctors();

  console.log('Loading state:', isLoading);
  console.log('Doctors data:', doctors);
  console.log('Total doctors:', totalDoctors);

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
        <p className="text-sm text-gray-500 mt-2">
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalDoctors)} of {totalDoctors} doctors
        </p>
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

      {/* Pagination Controls */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousPage}
            disabled={!canPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!canNextPage}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <select
            className="border rounded px-2 py-1"
            value={page}
            onChange={(e) => goToPage(Number(e.target.value))}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <option key={pageNum} value={pageNum}>
                {pageNum}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;