import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Filter, UserPlus, Users, ArrowsUpFromLine } from 'lucide-react';
import { useAuth } from '@/contexts/Auth/useAuth';

const PatientsTab = ({ onNewPatient }) => {
  const { user } = useAuth();
  const isSecretary = user.role === 'secretary';

  return (
    <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 bg-primary-300 py-4 sm:py-6 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            My Patient List
          </h2>
          <p className="text-slate-100 mt-1 text-sm sm:text-base">
            All active patients under your care
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            size="sm"
            variant="secondary"
            className="w-full sm:w-auto border-slate-200 text-slate-800 hover:bg-slate-200"
          >
            <Filter size={16} className="mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Filter</span>
          </Button>

          <Button
            size="sm"
            variant="secondary"
            className="w-full sm:w-auto border-slate-200 text-slate-800 hover:bg-slate-200"
          >
            <ArrowsUpFromLine size={16} className="mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Sort</span>
          </Button>

          {isSecretary && (
            <Button
              size="sm"
              variant="secondary"
              className="w-full sm:w-auto border-slate-200 text-slate-800 hover:bg-slate-200"
              onClick={onNewPatient}
            >
              <UserPlus size={16} className="mr-0 sm:mr-2" />
              <span className="hidden sm:inline">New Patient</span>
            </Button>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] sm:w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 sm:py-12 text-slate-500">
                  <Users size={32} className="mx-auto mb-3 text-slate-300" />
                  Patient list content would appear here
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PatientsTab;
