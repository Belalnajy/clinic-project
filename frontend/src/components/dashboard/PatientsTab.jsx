import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/Auth/useAuth';
import { FileText, Edit, CheckCircle, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useReactivatePatientMutation, useDeletePatientMutation } from '@/hooks/usePatients';

const PatientsTab = ({
  patients = [],
  loading,
  onNewPatient,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  statusStyles = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-red-100 text-red-700',
  },
}) => {
  const { user } = useAuth();
  const isSecretary = user.role === 'secretary';
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const { deletePatient, isDeleting } = useDeletePatientMutation();
  const { reactivatePatient, isReactivating } = useReactivatePatientMutation();

  // Handler functions
  const handleEditPatient = (patientId) => {
    navigate(`/patients/${patientId}/edit`);
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await deletePatient(patientId);
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };
  const handleReactivatePatient = async (patientId) => {
    try {
      await reactivatePatient(patientId);
    } catch (error) {
      console.error('Error reactivating patient:', error);
    }
  };
  const handleViewPatient = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <Card className="border-slate-200 p-0 shadow-sm overflow-hidden">
      {/* Header */}
      <CardHeader className="border-b border-slate-100 py-4 sm:py-6 bg-primary-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Patient List
            </CardTitle>
            <CardDescription className="text-slate-100 mt-1 text-sm sm:text-base">
              Manage your patients here.
            </CardDescription>
          </div>
          {isSecretary && (
            <Link
              to="/patients"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-white rounded-md shadow-sm hover:bg-sky-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <UserPlus size={16} className="mr-2 text-slate-800" />
              New Patient
            </Link>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-full table-auto text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  ID
                </TableHead>
                <TableHead className="py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  Patient
                </TableHead>
                <TableHead className="hidden sm:table-cell py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  Phone
                </TableHead>
                <TableHead className="hidden lg:table-cell py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  City
                </TableHead>

                <TableHead className="py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  Status
                </TableHead>
                <TableHead className="text-right py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!patients || patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="rounded-full bg-slate-100 p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium">No patients found</p>
                      <p className="text-slate-400 text-sm">Add a new patient to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                      <p className="text-slate-500 font-medium">Loading patient records...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((p) => (
                  <TableRow
                    key={p.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="py-3 px-4 sm:py-4 sm:px-6 whitespace-nowrap">
                      {p.id}
                    </TableCell>

                    <TableCell className="py-3 px-4 sm:py-4 sm:px-6">
                      <div className="flex items-center min-w-[150px]">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mr-2 sm:mr-3 border border-slate-200">
                          <AvatarFallback className="bg-slate-100 text-slate-700">
                            {p.first_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="truncate">
                          <div className="font-medium text-slate-800 truncate">
                            {p.first_name} {p.last_name}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{p.patient_id}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell py-3 px-4 sm:py-4 sm:px-6">
                      {p.phone_number}
                    </TableCell>

                    <TableCell className="hidden lg:table-cell py-3 px-4 sm:py-4 sm:px-6">
                      {p.city}
                    </TableCell>

                    <TableCell className="py-3 px-4 sm:py-4 sm:px-6">
                      <Badge
                        className={`font-normal px-2 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm ${
                          p.is_active ? statusStyles.active : statusStyles.inactive
                        }`}
                      >
                        {p.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3 px-4 sm:py-4 sm:px-6">
                      <div className="flex justify-end space-x-1 sm:space-x-2">
                        {isSecretary ? (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-secondary text-slate-700 hover:bg-slate-200 px-2 sm:px-3"
                              onClick={() => handleEditPatient(p.id)}
                            >
                              <Edit size={14} />
                              <span className="hidden sm:inline ml-1 sm:ml-2">Edit</span>
                            </Button>
                            <Button
                              size="xs"
                              variant="default"
                              className="bg-primary-300 hover:bg-sky-700 px-2 sm:px-3"
                              onClick={() => handleDeletePatient(p.id)}
                              disabled={isDeleting}
                            >
                              <CheckCircle size={14} className="text-white" />
                              <span className="hidden sm:inline ml-1 sm:ml-2 text-white">
                                {p.is_active ? 'Deactivate' : 'Activate'}
                              </span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-600 hover:text-slate-900 hover:bg-blue-50 px-2 sm:px-3"
                              onClick={() => handleViewPatient(p.id)}
                            >
                              <FileText size={14} />
                              <span className="hidden sm:inline ml-1 sm:ml-2">View</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Footer with summary + export */}
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-slate-100 py-3 px-4 sm:py-4 sm:px-6 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
          <div className="text-sm text-slate-600">Total Patients: {totalItems}</div>

          {/* Simple Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center py-4 border-slate-200">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                >
                  <ChevronLeft size={16} />
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Calculate which page numbers to show
                    let pageNum;
                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // If near the start
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // If near the end
                      pageNum = totalPages - 4 + i;
                    } else {
                      // If in the middle
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        className={`h-8 w-8 p-0 ${currentPage === pageNum ? 'bg-primary-500 text-red-slate-400' : 'text-slate-600'}`}
                        onClick={() => onPageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  disabled={currentPage === totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}

          <Link className="text-sm text-slate-600 " to="/patients">
            {' '}
            View All Patients
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatientsTab;
