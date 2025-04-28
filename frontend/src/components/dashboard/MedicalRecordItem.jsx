import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Fingerprint,
  Heart,
  Stethoscope,
  Bed,
  Pill,
  User,
  Clock,
  File,
} from 'lucide-react';

// Helper function to calculate age from birth date
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return `${age} years`;
};

// Format date for better readability
const formatDate = (dateString) => {
  if (!dateString) return 'Not available';
  
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const MedicalRecordItem = ({ record, handleOpenPatientView }) => {
  // Extract patient data from the record
  const patient = record.appointment?.patient || {};
  const doctor = record.appointment?.doctor || {};
  const appointment = record.appointment || {};
  
  // Format patient name
  const patientName = patient.first_name
    ? `${patient.first_name} ${patient.last_name || ''}`
    : 'Unknown Patient';
    
  // Format doctor name
  const doctorName = doctor.first_name
    ? `Dr. ${doctor.first_name} ${doctor.last_name || ''}`
    : 'Unassigned';
    
  // Format date
  const recordDate = formatDate(appointment.appointment_date || record.created_at);
  
  // Get patient age if birth date is available
  const patientAge = patient.birth_date ? calculateAge(patient.birth_date) : 'Unknown';

  // Create patient initials for avatar fallback
  const patientInitials = `${patient.first_name ? patient.first_name[0] : ''}${patient.last_name ? patient.last_name[0] : ''}`;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Patient Info Section */}
        <div className="p-6 flex-1 border-b sm:border-b-0 sm:border-r border-slate-200 bg-slate-50/50">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 border border-slate-200 shadow-sm">
              <AvatarImage src={patient.avatar || ''} alt={patientName} />
              <AvatarFallback className="bg-primary-50 text-primary-700 font-medium">
                {patientInitials || 'P'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 truncate text-lg">
                {patientName}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-slate-600">
                <div className="flex items-center">
                  <Fingerprint size={14} className="mr-1.5 text-slate-500" />
                  <span className="font-medium">ID:</span> {patient.id || 'N/A'}
                </div>
                <div className="flex items-center">
                  <User size={14} className="mr-1.5 text-slate-500" />
                  <span className="font-medium">Age:</span> {patientAge}
                </div>
                {patient.gender && (
                  <div className="flex items-center">
                    <span className="font-medium ml-1">Gender:</span> {patient.gender}
                  </div>
                )}
              </div>
              {patient.contact && (
                <div className="mt-4 text-xs text-slate-500">
                  <div className="font-medium mb-1">Contact Information</div>
                  <p>{patient.contact}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical Record Info Section */}
        <div className="p-6 flex-1">
          <h4 className="font-semibold text-slate-800 flex items-center mb-4">
            <Heart size={16} className="mr-2 text-primary-600" />
            Medical Record
            <span className="ml-auto text-xs flex items-center text-slate-500">
              <Calendar size={14} className="mr-1.5" />
              {recordDate}
            </span>
          </h4>

          <div className="space-y-4">
            {record.diagnosis && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Diagnosis</div>
                <p className="text-sm text-slate-800 font-medium">{record.diagnosis}</p>
              </div>
            )}

            {record.notes && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Clinical Notes</div>
                <p className="text-sm text-slate-700 leading-relaxed">{record.notes}</p>
              </div>
            )}

            {record.description && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Description</div>
                <p className="text-sm text-slate-700 leading-relaxed">{record.description}</p>
              </div>
            )}

            {/* Medications */}
            {record.medications && record.medications.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Medications</div>
                <div className="flex flex-wrap gap-2">
                  {record.medications.map((med, idx) => {
                    const medName = typeof med === 'object' ? med.name : med;
                    return (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 py-1"
                      >
                        <Pill size={12} className="mr-1.5" />
                        {medName}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Treatments */}
            {record.treatments && record.treatments.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Treatments</div>
                <div className="flex flex-wrap gap-2">
                  {record.treatments.map((treatment, idx) => {
                    const treatmentName = typeof treatment === 'object' ? treatment.name : treatment;
                    return (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-100 hover:bg-green-100 py-1"
                      >
                        <Bed size={12} className="mr-1.5" />
                        {treatmentName}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row justify-between bg-slate-50 border-t border-slate-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 sm:items-center">
          <div className="flex items-center text-sm text-slate-700">
            <Stethoscope size={16} className="mr-2 text-primary-600" />
            <span className="font-medium">{doctorName}</span>
            {doctor.specialization && <span className="ml-1 text-slate-500">({doctor.specialization})</span>}
          </div>
          <div className="flex items-center text-xs text-slate-500">
            <Clock size={14} className="mr-1.5" />
            Last updated: {formatDate(record.updated_at || record.created_at)}
          </div>
        </div>
        <div className="flex space-x-2 mt-3 sm:mt-0">

          <Button
            size="sm"
            className="bg-primary-300 hover:bg-sky-700 text-white"
            onClick={() => handleOpenPatientView(record)}
          >
            <File size={14} className="mr-1.5" />
            Full Record
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordItem;