import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Trash2, Pencil } from 'lucide-react';
import CustomPagination from '@/components/CustomPagination';
import { toast } from 'sonner';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useMedications } from '@/hooks/useMedications';
import LoadingSpinner from '@/components/LoadingSpinner';

const MedicationsTable = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [medicationToDelete, setMedicationToDelete] = useState(null);

  const {
    medications,
    pagination,
    isLoadingMedications,
    medicationsError,
    deleteMedication,
    isDeleting,
  } = useMedications();

  const filteredMedications = medications.filter((medication) =>
    medication.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!medicationToDelete) return;
    try {
      await deleteMedication(medicationToDelete.id);
      toast.success('Success', {
        description: 'Medication deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error('Error', {
        description: 'Failed to delete medication.',
      });
    } finally {
      setMedicationToDelete(null);
    }
  };

  if (isLoadingMedications) {
    return <LoadingSpinner size="lg" />;
  }

  if (medicationsError) {
    return <div>Error loading medications: {medicationsError.message}</div>;
  }

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Name</TableHead>
              <TableHead>Default Dosage</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell className="font-medium">{medication.name}</TableCell>
                <TableCell>{medication.default_dosage}</TableCell>
                <TableCell>{medication.description}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      medication.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {medication.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/medications/${medication.id}/edit`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMedicationToDelete(medication)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <CustomPagination
          totalItems={pagination.count}
          currentPage={pagination.currentPage}
          onPageChange={(page) => {
            navigate(`/medications?page=${page}`);
          }}
          hasNextPage={!!pagination.next}
          hasPreviousPage={!!pagination.previous}
        />
      </div>

      <DeleteConfirmationDialog
        isOpen={!!medicationToDelete}
        onClose={() => setMedicationToDelete(null)}
        onConfirm={handleDelete}
        itemName={medicationToDelete?.name}
      />
    </>
  );
};

export default MedicationsTable;
