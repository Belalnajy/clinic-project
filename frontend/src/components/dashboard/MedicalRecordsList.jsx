import { useState } from 'react';
import MedicalRecordItem from './MedicalRecordItem';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {  ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MedicalRecordsList = ({
  records = [],
  loading = false,
  error = null,
  totalRecords = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  handleOpenPatientView,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <Card className="border-slate-100 shadow-sm overflow-hidden p-0">
      {/* Header Section */}
      <CardHeader className="border-b border-slate-50 bg-primary-300 to-white py-4 sm:py-6 md:py-7 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-white">
              Medical Records
            </CardTitle>
            <CardDescription className="text-slate-100 mt-1 text-sm sm:text-base">
              Recent patient diagnoses and treatment plans
            </CardDescription>
          </div>

        </div>
      </CardHeader>

      {/* Search Bar */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <Input
            type="text"
            placeholder="Search medical records..."
            className="pl-10 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-3 sm:p-4 md:p-6 bg-white">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="text-slate-500 font-medium">Loading medical records...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-red-100 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          </div>
        ) : records.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-slate-100 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No medical records found</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {records
              .filter(record => {
                const patient = record.appointment?.patient || {};
                const patientName = `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase();
                const diagnosis = (record.diagnosis || '').toLowerCase();
                const search = searchTerm.toLowerCase();
                return patientName.includes(search) || diagnosis.includes(search);
              })
              .map((record, index) => (
                <MedicalRecordItem
                  key={record.id || index}
                  record={record}
                  handleOpenPatientView={handleOpenPatientView}
                />
              ))}
          </div>
        )}
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-slate-50 py-3 sm:py-4 md:py-5 px-4 sm:px-6 bg-gradient-to-r from-slate-50 to-white">
        <div className="text-xs text-slate-400 w-full sm:w-auto text-center sm:text-left">
          Showing {records.length} of {totalRecords} records
        </div>
        {totalPages > 1 && (
          <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-normal">
            <Button
              variant="outline"
              size="sm"
              className="w-1/2 sm:w-auto border-slate-200 text-slate-500 hover:border-slate-300"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} className="mr-0 sm:mr-1.5" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            
            <div className="flex items-center px-3 text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="w-1/2 sm:w-auto border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} className="ml-0 sm:ml-1.5" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MedicalRecordsList;
