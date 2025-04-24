import { useState } from 'react';
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
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomPagination from '@/components/CustomPagination';

const ITEMS_PER_PAGE = 7;

const MedicationsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // TODO: Replace with actual data from API
  const medications = [
    {
      id: 1,
      name: 'Paracetamol',
      default_dosage: '500mg',
      description: 'Pain reliever and fever reducer',
      is_active: true,
    },
    {
      id: 2,
      name: 'Ibuprofen',
      default_dosage: '400mg',
      description: 'Nonsteroidal anti-inflammatory drug',
      is_active: true,
    },
    // Add more sample data for pagination testing
    ...Array.from({ length: 25 }, (_, i) => ({
      id: i + 3,
      name: `Medication ${i + 3}`,
      default_dosage: `${(i + 1) * 100}mg`,
      description: `Description for medication ${i + 3}`,
      is_active: i % 2 === 0,
    })),
  ];

  const filteredMedications = medications.filter((medication) =>
    medication.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedMedications = filteredMedications.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medications</h1>
        <Button onClick={() => navigate('/medications/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medications..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
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
            {paginatedMedications.map((medication) => (
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
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/medications/${medication.id}/edit`)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <CustomPagination
          totalItems={filteredMedications.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MedicationsPage;
