import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';

const MedicationsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medications</h1>
        <Button onClick={() => navigate('/medications/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </div>

      <Outlet />
    </div>
  );
};

export default MedicationsPage;
