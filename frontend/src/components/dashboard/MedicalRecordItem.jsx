// src/components/MedicalRecordItem.jsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


const MedicalRecordItem = ({ record, handleOpenPatientView }) => {
  return (
    <div
      className="group p-5 border shadow-xl border-slate-100 rounded-lg  bg-white hover:border-slate-200 hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <Avatar className="h-11 w-11 mr-3 ring-2 ring-slate-50 shadow-sm">
            <AvatarImage src={record.patientAvatar} alt={record.patientName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-50 text-slate-700 font-medium">
              {record.patientName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-slate-800 tracking-tight">
              {record.patientName}
            </div>
            <div className="text-xs text-slate-400 flex items-center mt-0.5">
              <IconFingerprint size={14} className="mr-1.5 text-slate-300" />
              {record.patientId}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-slate-500 flex items-center">
            <IconCalendarEvent size={16} className="mr-1.5 text-slate-300" />
            {record.date}
          </div>
          <Badge className="mt-1.5 bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 transition-colors">
            {record.type || 'Consultation'}
          </Badge>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gradient-to-r from-slate-50 to-white rounded-md border border-slate-100">
        <div className="flex items-center mb-2">
          <IconHeartbeat size={16} className="text-red-500 mr-1.5" />
          <div className="text-xs font-medium text-slate-700">Vital Signs</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="text-center p-2 bg-white rounded border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Blood Pressure</div>
            <div
              className={`font-medium text-sm ${
                record.vitals?.bp && parseInt(record.vitals.bp.split('/')[0]) > 140
                  ? 'text-red-600'
                  : 'text-slate-800'
              }`}
            >
              {record.vitals?.bp || '120/80 mmHg'}
            </div>
          </div>
          <div className="text-center p-2 bg-white rounded border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Heart Rate</div>
            <div
              className={`font-medium text-sm ${
                record.vitals?.hr && parseInt(record.vitals.hr) > 100
                  ? 'text-red-600'
                  : 'text-slate-800'
              }`}
            >
              {record.vitals?.hr || '72 bpm'}
            </div>
          </div>
          <div className="text-center p-2 bg-white rounded border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Temperature</div>
            <div
              className={`font-medium text-sm ${
                record.vitals?.temp && parseFloat(record.vitals.temp) > 38
                  ? 'text-red-600'
                  : 'text-slate-800'
              }`}
            >
              {record.vitals?.temp || '36.7 °C'}
            </div>
          </div>
          <div className="text-center p-2 bg-white rounded border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Respiration</div>
            <div
              className={`font-medium text-sm ${
                record.vitals?.resp && parseInt(record.vitals.resp) > 20
                  ? 'text-red-600'
                  : 'text-slate-800'
              }`}
            >
              {record.vitals?.resp || '16 rpm'}
            </div>
          </div>
          <div className="text-center p-2 bg-white rounded border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">O2 Saturation</div>
            <div
              className={`font-medium text-sm ${
                record.vitals?.o2sat && parseInt(record.vitals.o2sat) < 95
                  ? 'text-red-600'
                  : 'text-slate-800'
              }`}
            >
              {record.vitals?.o2sat || '98%'}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-50 pt-4 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-sm text-slate-600 bg-slate-50/50 p-3 rounded-md border border-slate-100">
            <span className="font-medium text-slate-700 flex items-center mb-1.5">
              <IconStethoscope size={16} className="mr-1.5 text-slate-400" />
              Diagnosis
            </span>
            <p className="leading-relaxed">{record.diagnosis}</p>
          </div>
          <div className="text-sm text-slate-600 bg-slate-50/50 p-3 rounded-md border border-slate-100">
            <span className="font-medium text-slate-700 flex items-center mb-1.5">
              <IconBed size={16} className="mr-1.5 text-slate-400" />
              Treatment
            </span>
            <p className="leading-relaxed">{record.treatment}</p>
          </div>
        </div>

        {record.prescription && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <IconPill size={16} className="text-primary-400 mr-1.5" />
              <div className="text-xs font-medium text-slate-600">Prescription</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3.5 rounded-md text-sm border border-blue-100 text-slate-700">
              {record.prescription}
            </div>
          </div>
        )}

        {record.notes && (
          <div className="mt-4 text-sm italic text-slate-500 pl-2 border-l-2 border-slate-200">
            {record.notes}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-50">
        <div className="text-xs text-slate-400 flex items-center">
          <IconUser size={14} className="mr-1.5" />
          Dr. {record.physician || 'Richardson'}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          >
            <IconEdit size={16} className="mr-1.5" /> Edit
          </Button>
          <Button
            size="sm"
            className="bg-primary-300 hover:bg-secondary-foreground text-white group-hover:shadow-sm transition-all"
            onClick={() => handleOpenPatientView(record)}
          >
            <IconFileReport size={16} className="mr-1.5" /> Full Record
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordItem;