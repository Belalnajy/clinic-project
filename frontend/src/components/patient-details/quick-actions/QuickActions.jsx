import QuickActionButtons from './QuickActionButtons';
import { LabTest, MedicalRecord, Prescription } from './modals';
import { useState } from 'react';

const QuickActions = () => {
  const [isMedicalRecordOpen, setIsMedicalRecordOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isLabTestOpen, setIsLabTestOpen] = useState(false);

  const actions = [
    {
      id: 1,
      name: 'New Medical Record',
      icon: 'FileText',
      action: () => setIsMedicalRecordOpen(true),
    },
    {
      id: 2,
      name: 'Write Prescription',
      icon: 'Pill',
      action: () => setIsPrescriptionOpen(true),
    },
    {
      id: 3,
      name: 'Add Lab Test',
      icon: 'Microscope',
      action: () => setIsLabTestOpen(true),
    },
  ];
  return (
    <>
      <QuickActionButtons actions={actions} />
      <MedicalRecord open={isMedicalRecordOpen} onOpenChange={setIsMedicalRecordOpen} />
      <Prescription isOpen={isPrescriptionOpen} setIsPrescriptionOpen={setIsPrescriptionOpen} />
      <LabTest isOpen={isLabTestOpen} setIsLabTestOpen={setIsLabTestOpen} />
    </>
  );
};

export default QuickActions;
