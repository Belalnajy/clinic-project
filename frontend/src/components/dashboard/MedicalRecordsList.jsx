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
import { Filter, FileArchive, ChevronLeft, ChevronRight } from 'lucide-react';

const MedicalRecordsList = ({
  records,
  originalRecords,
  handleOpenPatientView,
  handleFilter,
  handleExport,
}) => {
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
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              className="w-full sm:w-auto border-slate-200 bg-secondary text-slate-800 hover:text-slate-800 transition-colors hover:bg-slate-200"
              onClick={handleFilter}
            >
              <Filter size={16} className="mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button
              size="sm"
              className="w-full sm:w-auto border-slate-200 bg-secondary text-slate-800 hover:bg-slate-200"
              onClick={handleExport}
            >
              <FileArchive size={16} className="mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="p-3 sm:p-4 md:p-6 bg-white">
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {records.map((record, index) => (
            <MedicalRecordItem
              key={index}
              record={record}
              handleOpenPatientView={handleOpenPatientView}
            />
          ))}
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-slate-50 py-3 sm:py-4 md:py-5 px-4 sm:px-6 bg-gradient-to-r from-slate-50 to-white">
        <div className="text-xs text-slate-400 w-full sm:w-auto text-center sm:text-left">
          Showing {records.length} of {originalRecords.length + 18} records
        </div>
        <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-normal">
          <Button
            variant="outline"
            size="sm"
            className="w-1/2 sm:w-auto border-slate-200 text-slate-500 hover:border-slate-300"
          >
            <ChevronLeft size={16} className="mr-0 sm:mr-1.5" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-1/2 sm:w-auto border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} className="ml-0 sm:ml-1.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MedicalRecordsList;
