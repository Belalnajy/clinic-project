import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { usePatients } from '@/hooks/usePatients';
import PatientModal from '../components/modals/PatientModal';
import PatientList from '@/components/PatientList';
import CustomPagination from '@/components/CustomPagination';
import CustomTabsList from '@/components/CustomTabsList';
import { Tabs } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/Auth/useAuth';

const Patients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('activated');
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    usePatientsList,
    useDeactivatedPatients,
    createPatient,
    updatePatient,
    deletePatient,
    activatePatient,
    deactivatePatient,
  } = usePatients();

  const { data: patientsData, isLoading: isLoadingPatients } = usePatientsList(
    currentPage,
    searchTerm
  );
  const { data: deactivatedPatientsData, isLoading: isLoadingDeactivatedPatients } =useDeactivatedPatients();

  const patients = patientsData?.results || [];
  const deactivatedPatients = deactivatedPatientsData || [];
  const filteredDeactivatedPatients = deactivatedPatients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchLower) ||
      patient.id.toString().includes(searchLower) ||
      (patient.phone_number || '').toLowerCase().includes(searchLower)
    );
  });

  const itemsPerPage = 10;
  const totalActivatedItems = patientsData?.count || 0;
  const totalDeactivatedItems = filteredDeactivatedPatients.length || 0;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeactivatedPatients = filteredDeactivatedPatients.slice(startIndex, endIndex);

  const totalItems = activeTab === 'activated' ? totalActivatedItems : totalDeactivatedItems;
  const displayedPatients = activeTab === 'activated' ? patients : paginatedDeactivatedPatients;

  const openModal = (patient = null) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const handleSavePatient = async (patientData) => {
      if (selectedPatient) {
        await updatePatient({ id: selectedPatient.id, data: patientData });
        toast.success('Patient updated successfully');
      } else {
        await createPatient(patientData);
        toast.success('Patient created successfully');
      }
      closeModal();
  };

  const handlePatientAction = async (action, patientId) => {
    try {
      switch (action) {
        case 'view':
          navigate(`/patients/patients/${patientId}`);
          break;
        case 'edit':
          const patientToEdit = (activeTab === 'activated' ? patients : deactivatedPatients).find(
            (p) => p.id === patientId
          );
          openModal(patientToEdit);
          break;
        case 'delete':
          await deletePatient(patientId);
          toast.success('Patient deleted successfully');
          break;
        case 'activate':
          await activatePatient(patientId);
          toast.success('Patient activated successfully');
          break;
        case 'deactivate':
          await deactivatePatient(patientId);
          toast.success('Patient deactivated successfully');
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error(`Failed to ${action} patient`);
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); 
  };

  const tabsData = [
    { value: 'activated', label: 'Activated Patients' },
    { value: 'deactivated', label: 'Deactivated Patients' },
  ];

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
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <CustomTabsList tabsData={tabsData} />
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
                  patients={displayedPatients}
                  loading={
                    activeTab === 'activated' ? isLoadingPatients : isLoadingDeactivatedPatients
                  }
                  searchTerm={searchTerm}
                  handlePatientAction={handlePatientAction}
                  openModal={openModal}
                />
              </table>
            </div>
          </Tabs>
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
