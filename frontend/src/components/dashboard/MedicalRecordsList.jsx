import MedicalRecordItem from "./MedicalRecordItem";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconFilter,
  IconFileExport,
  IconChevronLeft,
  IconChevronRight
} from "@tabler/icons-react";

const MedicalRecordsList = ({
  records,
  originalRecords,
  handleOpenPatientView,
  handleFilter,
  handleExport
}) => {
  return (
    <Card className="border-slate-100 shadow-sm overflow-hidden p-0">
      <CardHeader className="border-b border-slate-50 bg-primary-300 to-white py-7">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold  tracking-tight text-white">
              Medical Records
            </CardTitle>
            <CardDescription className="text-slate-100  mt-1 ">
              Recent patient diagnoses and treatment plans
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              className="border-slate-200  bg-secondary text-slate-800 hover:text-slate-800 transition-colors hover:bg-slate-200  hover:cursor-pointer"
              onClick={handleFilter}>
              <IconFilter size={16} className="mr-2 text-slate-800" /> Filter
            </Button>
            <Button
              size="sm"
              className="border-slate-200 bg-secondary text-slate-800 hover:bg-slate-200  hover:cursor-pointer" 
              onClick={handleExport}>
              <IconFileExport size={16} className="mr-2 text-slate-800" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 bg-white">
        <div className="space-y-5">
          <div className="space-y-5">
            {records.map((record, index) =>
              <MedicalRecordItem
                key={index}
                record={record}
                handleOpenPatientView={handleOpenPatientView}
              />
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t border-slate-50 py-5 px-6 bg-gradient-to ^^r from-slate-50 to-white">
        <div className="text-xs text-slate-400">
          Showing {records.length} of {originalRecords.length + 18} records
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 text-slate-500 hover:border-slate-300">
            <IconChevronLeft size={16} className="mr-1.5 text-slate-400" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 bg-white text-slate-700 hover:border-slate-300">
            Next
            <IconChevronRight size={16} className="ml-1.5 text-slate-400" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MedicalRecordsList;
