import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import QuickActionButtons from './QuickActionButtons';
import { MedicalRecord } from './modals';
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
      name: 'Order Lab Test',
      icon: 'Microscope',
      action: () => setIsLabTestOpen(true),
    },
  ];
  return (
    <>
      <QuickActionButtons actions={actions} />
      <MedicalRecord isOpen={isMedicalRecordOpen} setIsMedicalRecordOpen={setIsMedicalRecordOpen} />
    </>
  );
};

export default QuickActions;
