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
  Edit,
  FileText,
} from 'lucide-react';

const MedicalRecordItem = ({ record, handleOpenPatientView }) => {
  return (
    <div className="group p-4 sm:p-5 border shadow-sm sm:shadow-xl border-slate-100 rounded-lg bg-white hover:border-slate-200 hover:shadow-md transition-all duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
        <div className="flex items-center">
          <Avatar className="h-9 w-9 sm:h-11 sm:w-11 mr-2 sm:mr-3 ring-2 ring-slate-50 shadow-sm">
            <AvatarImage src={record.patientAvatar} alt={record.patientName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-50 text-slate-700 font-medium">
              {record.patientName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm sm:text-base text-slate-800 tracking-tight">
              {record.patientName}
            </div>
            <div className="text-xs text-slate-400 flex items-center mt-0.5">
              <Fingerprint size={12} className="mr-1 text-slate-300 sm:mr-1.5 sm:size-[14px]" />
              {record.patientId}
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-normal gap-2 sm:gap-0">
          <div className="text-xs sm:text-sm text-slate-500 flex items-center">
            <Calendar size={14} className="mr-1 text-slate-300 sm:mr-1.5 sm:size-4" />
            {record.date}
          </div>
          <Badge className="bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 transition-colors text-xs sm:text-sm">
            {record.type || 'Consultation'}
          </Badge>
        </div>
      </div>

      {/* Vital Signs Section */}
      <div className="mb-4 p-2 sm:p-3 bg-gradient-to-r from-slate-50 to-white rounded-md border border-slate-100">
        <div className="flex items-center mb-2">
          <Heart size={14} className="text-red-500 mr-1 sm:mr-1.5 sm:size-4" />
          <div className="text-xs font-medium text-slate-700">Vital Signs</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          {[
            {
              label: 'Blood Pressure',
              key: 'bp',
              normal: (value) => parseInt(value?.split('/')[0]) <= 140,
            },
            { label: 'Heart Rate', key: 'hr', normal: (value) => parseInt(value) <= 100 },
            { label: 'Temperature', key: 'temp', normal: (value) => parseFloat(value) <= 38 },
            { label: 'Respiration', key: 'resp', normal: (value) => parseInt(value) <= 20 },
            { label: 'O2 Saturation', key: 'o2sat', normal: (value) => parseInt(value) >= 95 },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-1.5 sm:p-2 bg-white rounded border border-slate-100"
            >
              <div className="text-[10px] xs:text-xs text-slate-500 mb-1">{item.label}</div>
              <div
                className={`font-medium text-xs sm:text-sm ${
                  record.vitals?.[item.key] && !item.normal(record.vitals[item.key])
                    ? 'text-red-600'
                    : 'text-slate-800'
                }`}
              >
                {record.vitals?.[item.key] ||
                  (item.key === 'bp'
                    ? '120/80 mmHg'
                    : item.key === 'hr'
                    ? '72 bpm'
                    : item.key === 'temp'
                    ? '36.7 °C'
                    : item.key === 'resp'
                    ? '16 rpm'
                    : '98%')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnosis & Treatment Section */}
      <div className="border-t border-slate-50 pt-3 sm:pt-4 mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="text-xs sm:text-sm text-slate-600 bg-slate-50/50 p-2 sm:p-3 rounded-md border border-slate-100">
            <span className="font-medium text-slate-700 flex items-center mb-1">
              <Stethoscope size={14} className="mr-1 text-slate-400 sm:mr-1.5 sm:size-4" />
              Diagnosis
            </span>
            <p className="leading-relaxed line-clamp-3">{record.diagnosis}</p>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 bg-slate-50/50 p-2 sm:p-3 rounded-md border border-slate-100">
            <span className="font-medium text-slate-700 flex items-center mb-1">
              <Bed size={14} className="mr-1 text-slate-400 sm:mr-1.5 sm:size-4" />
              Treatment
            </span>
            <p className="leading-relaxed line-clamp-3">{record.treatment}</p>
          </div>
        </div>

        {/* Prescription Section */}
        {record.prescription && (
          <div className="mt-3 sm:mt-4">
            <div className="flex items-center mb-1 sm:mb-2">
              <Pill size={14} className="text-primary-400 mr-1 sm:mr-1.5 sm:size-4" />
              <div className="text-xs font-medium text-slate-600">Prescription</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 sm:p-3.5 rounded-md text-xs sm:text-sm border border-blue-100 text-slate-700 line-clamp-3">
              {record.prescription}
            </div>
          </div>
        )}

        {/* Notes Section */}
        {record.notes && (
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm italic text-slate-500 pl-2 border-l-2 border-slate-200 line-clamp-2">
            {record.notes}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mt-4 sm:mt-5 pt-2 sm:pt-3 border-t border-slate-50 gap-2">
        <div className="text-xs text-slate-400 flex items-center">
          <User size={12} className="mr-1 sm:mr-1.5 sm:size-[14px]" />
          Dr. {record.physician || 'Richardson'}
        </div>
        <div className="flex space-x-1.5 sm:space-x-2 w-full xs:w-auto">
          <Button
            variant="ghost"
            size="xs"
            className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-50 h-8 px-2 sm:px-3"
          >
            <Edit size={14} className="mr-1 sm:mr-1.5 sm:size-4" />
            <span className="hidden xs:inline">Edit</span>
          </Button>
          <Button
            size="xs"
            className="text-xs sm:text-sm bg-primary-300 hover:bg-secondary-foreground text-white group-hover:shadow-sm transition-all h-8 px-2 sm:px-3"
            onClick={() => handleOpenPatientView(record)}
          >
            <FileText size={14} className="mr-1 sm:mr-1.5 sm:size-4" />
            <span className="hidden xs:inline">Full Record</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordItem;
