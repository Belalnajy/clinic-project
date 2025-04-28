import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash, User, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/Auth/useAuth';

const PatientList = ({ patients, loading, searchTerm, handlePatientAction, openModal }) => {
  const { user } = useAuth();

  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    return new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
  };

  return (
    <tbody className="divide-y">
      {loading ? (
        <tr>
          <td colSpan="6" className="p-6 text-center text-slate-500">
            Loading...
          </td>
        </tr>
      ) : patients.length > 0 ? (
        patients.map((patient) => (
          <tr key={patient.id} className="transition-colors hover:bg-slate-50">
            <td className="p-4 pl-6 align-middle">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {patient.first_name ? patient.first_name.charAt(0) : '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-slate-900">
                    {patient.first_name} {patient.last_name}
                  </div>
                  <div className="text-xs text-slate-500">{patient.email || 'No email'}</div>
                </div>
              </div>
            </td>
            <td className="p-4 align-middle">
              <Badge variant="outline" className="font-mono">
                {patient.id}
              </Badge>
            </td>
            <td className="p-4 align-middle">{patient.gender}</td>
            <td className="p-4 align-middle">{getAge(patient.birth_date)}</td>
            <td className="p-4 align-middle font-medium">{patient.phone_number}</td>
            <td className="p-4 align-middle">
              <div className="flex justify-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-600 hover:text-primary hover:bg-primary/10"
                  onClick={() => handlePatientAction('view', patient.id)}
                >
                  <Eye size={18} />
                </Button>
                {user?.role === 'secretary' || user?.role === 'manager' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => handlePatientAction('edit', patient.id)}
                  >
                    <Edit size={18} />
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-600 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handlePatientAction('delete', patient.id)}
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
              <p className="text-slate-500 mb-1">
                {searchTerm ? 'No patients match your search' : 'No patients found'}
              </p>
              {!searchTerm && (
                <Button variant="outline" size="sm" onClick={() => openModal()} className="mt-2">
                  <Plus size={16} className="mr-2" />
                  Add your first patient
                </Button>
              )}
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default PatientList;
