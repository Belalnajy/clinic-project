import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import PatientModal from '../components/modals/PatientModal';
import PatientList from '@/components/PatientList';
import CustomPagination from '@/components/CustomPagination'; // Import CustomPagination
import { useAuth } from '@/contexts/Auth/useAuth'; // Import useAuth

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the logged-in user
  const itemsPerPage = 10;

  const fetchPatients = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/patients/patients/', {
        params: { page, search },
      });
      setPatients(response.data.results);
      setTotalItems(response.data.count); 
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch patients');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openModal = (patient = null) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const handlePatientAction = (action, patientId) => {
    switch (action) {
      case 'view':
        handleViewPatient(patientId);
        break;
      case 'edit':
        const patientToEdit = patients.find((p) => p.id === patientId);
        openModal(patientToEdit);
        break;
      case 'delete':
        handleDeletePatient(patientId);
        break;
      case 'activate':
        handleActivatePatient(patientId);
        break;
      case 'deactivate':
        handleDeactivatePatient(patientId);
        break;
      default:
        break;
    }
  };
  const handleViewPatient =async (patientId) => {
    try {
      await axiosInstance.get(`/patients/patients/${patientId}/`);
      navigate(`/patients/patients/${patientId}`);
    } catch (error) {
      toast.error('Failed to fetch patient details');
    }
  }
  const handleDeletePatient = async (patientId) => {
    try {
      await axiosInstance.delete(`/patients/patients/${patientId}/`);
      toast.success('Patient deleted successfully');
      fetchPatients(currentPage, searchTerm);
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  const handleActivatePatient = async (patientId) => {
    try {
      await axiosInstance.post(`/patients/patients/${patientId}/activate/`);
      toast.success('Patient activated successfully');
      fetchPatients(currentPage, searchTerm);
    } catch (error) {
      toast.error('Failed to activate patient');
    }
  };

  const handleDeactivatePatient = async (patientId) => {
    try {
      await axiosInstance.post(`/patients/patients/${patientId}/deactivate/`);
      toast.success('Patient deactivated successfully');
      fetchPatients(currentPage, searchTerm);
    } catch (error) {
      toast.error('Failed to deactivate patient');
    }
  };

  const handleSavePatient = async (patientData) => {
    try {
      if (selectedPatient) {
        await axiosInstance.put(`/patients/patients/${selectedPatient.id}/`, patientData);
        toast.success('Patient updated successfully');
      } else {
        await axiosInstance.post('/patients/patients/', patientData);
        toast.success('Patient created successfully');
      }
      fetchPatients(currentPage, searchTerm);
      closeModal();
    } catch (error) {
      toast.error(`Failed to ${selectedPatient ? 'update' : 'create'} patient`);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page); 
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patients</h1>
        <p className="text-slate-500 mt-1">Manage patient records and information</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <Input
                type="search"
                placeholder="Search by name, ID, or phone number..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            {user?.role === 'secretary' || user?.role === 'manager' ? (
              <Button
                onClick={() => openModal()}
                className="bg-primary hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Add Patient
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="h-12 px-6 text-left align-middle font-medium text-slate-500">
                    Patient
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Gender
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Age
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Contact
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <PatientList
                patients={patients}
                loading={loading}
                searchTerm={searchTerm}
                handlePatientAction={handlePatientAction}
                openModal={openModal}
              />
            </table>
          </div>
        </CardContent>
      </Card>
      <CustomPagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <PatientModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSavePatient}
        patientData={selectedPatient}
      />
    </div>
  );
};

export default Patients;
