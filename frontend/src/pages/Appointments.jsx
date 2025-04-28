import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Plus, Eye, Edit, Trash, User } from 'lucide-react';
import AppointmentModal from '@/components/modals/AppointmentModal';
import useAppointments from '@/hooks/useAppointments';
import LoadingState from '@/components/LoadingState';
import CustomPagination from '@/components/CustomPagination';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import CustomAlert from '@/components/CustomAlert';
import { useAuth } from '@/contexts/Auth/useAuth';
import DatePickerFilter from '@/components/DatePickerFilter';

const Appointments = () => {
  const { appointments, pagination, isLoadingAppointments, appointmentsError, deleteAppointment } =
    useAppointments();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false); // Tracks if the modal is in edit mode
  const [editingAppointment, setEditingAppointment] = useState(null); // Stores the appointment being edited

  let today = new Date().toLocaleDateString();
  const [date, setDate] = useState(today);
  const { user } = useAuth();

  const handleDateChange = (e) => {};

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ page: '1', search: searchQuery });
    setSearchQuery('');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false); // Reset edit mode
    setEditingAppointment(null); // Clear editing data
  };

  const handleEditClick = (appointment) => {
    setIsEditing(true);
    setEditingAppointment(appointment); // Pass the appointment data to the modal
    openModal();
  };

  console.log(appointments);

  if (isLoadingAppointments) {
    return <LoadingState fullPage={true} message="Loading appointments..." />;
  }
  if (appointmentsError) {
    return <CustomAlert message="Error Loading Appointments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Appointments</h1>
        <p>Manage appointments information</p>
      </div>

      {/* Appointments */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-wrap flex-col sm:flex-row sm:items-center  gap-4">
            {/* Search Form */}

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
              <Input
                type="text"
                placeholder="Search appointments using status, patient or doctor's name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=""
              />
              <Button type="submit">Search</Button>
            </form>

            {/* Date Picker */}
            <DatePickerFilter />

            {/* Add Appointment */}
            {user.role !== 'doctor' && (
              <Button
                onClick={openModal}
                className="bg-primary hover:bg-primary/90 transition-colors ml-auto"
              >
                <Plus size={18} className="mr-2" />
                Add Appointment
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              {/* Table Head */}
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="h-12 px-6 text-left align-middle font-medium text-slate-500">
                    Patient
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Time
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Doctor
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Status
                  </th>

                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Payment Amount
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment.id} className="transition-colors hover:bg-slate-50">
                      <td className="p-4 pl-6 align-middle">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium text-slate-900">
                              {appointment.patient_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{appointment.appointment_date}</td>
                      <td className="p-4 align-middle">{appointment.appointment_time}</td>
                      <td className="p-4 align-middle">{appointment.doctor_name}</td>
                      <td className="p-4 align-middle">{appointment.status}</td>
                      <td className="p-4 align-middle font-medium">
                        {appointment.payment?.amount || 'Free'}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex justify-center space-x-1">
                          <Link to={`/appointment/${appointment.appointment_id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-600 hover:text-primary hover:bg-primary/10"
                              aria-label="View Patient"
                            >
                              <Eye size={18} />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                            aria-label="Edit Patient"
                            onClick={() => handleEditClick(appointment)}
                          >
                            <Edit size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-600 hover:text-red-600 hover:bg-red-50"
                            aria-label="Delete Patient"
                            onClick={deleteAppointment.bind(this, appointment.appointment_id)}
                          >
                            <Trash size={18} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center py-6">
                        <User size={36} className="text-slate-300 mb-2" />
                        <p className="text-slate-500 mb-1">No Appointments found</p>
                        {user.role !== 'doctor' && (
                          <Button variant="outline" size="sm" onClick={openModal} className="mt-2">
                            <Plus size={16} className="mr-2" />
                            Add your first appointment
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        isEditing={isEditing}
        appointmentId={editingAppointment?.appointment_id}
      />

      {/* Pagination */}
      <div className="mt-6">
        <CustomPagination pagination={pagination} />
      </div>
    </div>
  );
};

export default Appointments;
