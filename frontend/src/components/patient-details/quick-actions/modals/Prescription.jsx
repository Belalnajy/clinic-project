// ** ShadCN Components **//
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// ** React Hook Forms **//
import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useMedications } from '@/hooks/useMedications';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import LoadingState from '@/components/LoadingState';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomPagination from '@/components/CustomPagination';

const prescriptionSchema = z.object({
  medications: z
    .array(
      z.object({
        medicationId: z.string().min(1, 'Medication is required'),
        dosage: z.string().min(1),
        frequency: z.string().min(1),
        duration: z.string().min(1),
        instructions: z.string().optional(),
      })
    )
    .min(1, 'At least one medication is required'),
});

const Prescription = ({ isOpen, setIsPrescriptionOpen }) => {
  const { id: patientId } = useParams();
  const [step, setStep] = useState(1);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const { createPrescription, addMedications, isCreatingPrescription, isAddingMedications } =
    usePrescriptions();
  const { useLatestMedicalRecord } = useMedicalRecords();
  const { data: latestMedicalRecord, isLoading: isLoadingLatestRecord } =
    useLatestMedicalRecord(patientId);
  const { medications, isLoading: isLoadingMedications, pagination } = useMedications();
  const form = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medications: [
        {
          medicationId: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'medications',
    control: form.control,
  });

  const handlePageChange = (newPage) => {
    setMedicationPage(newPage);
  };

  const handleCreatePrescription = async () => {
    if (!latestMedicalRecord) {
      toast.error('No medical record found', {
        description: 'Please create a medical record first.',
      });
      return;
    }

    try {
      const response = await createPrescription(latestMedicalRecord.id);
      if (response && response.id) {
        setPrescriptionId(response.id);
        setStep(2);
        toast.success('Prescription created successfully');
      } else {
        throw new Error('Failed to create prescription: Invalid response');
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error('Failed to create prescription', {
        description: error.message || 'Please try again',
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!prescriptionId) {
        throw new Error('No prescription ID found');
      }

      // Format the medications data correctly
      const formattedMedications = data.medications.map((med) => ({
        medication_id: parseInt(med.medicationId),
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions || '',
      }));

      const requestData = {
        prescription_id: parseInt(prescriptionId),
        medications: formattedMedications,
      };

      console.log('Component Request Data:', JSON.stringify(requestData, null, 2));

      await addMedications(requestData);

      setIsPrescriptionOpen(false);
      form.reset();
      setStep(1);
      setPrescriptionId(null);
    } catch (error) {
      console.error('Error adding medications:', error);
      toast.error('Failed to add medications', {
        description: error.message,
      });
    }
  };

  if (isLoadingLatestRecord) {
    return <LoadingState fullPage={true} message="Loading medical record..." />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsPrescriptionOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{step === 1 ? 'Create Prescription' : 'Add Medications'}</DialogTitle>
          <DialogDescription>
            {step === 1
              ? 'Create a new prescription for this patient'
              : 'Add medications to the prescription'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            {latestMedicalRecord ? (
              <>
                <p className="text-sm text-muted-foreground">
                  This prescription will be attached to the latest medical record:
                </p>
                <div className="p-4 bg-muted rounded-md">
                  <p className="font-medium">Diagnosis: {latestMedicalRecord.diagnosis}</p>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(latestMedicalRecord.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={handleCreatePrescription}
                  disabled={isCreatingPrescription}
                  className="w-full"
                >
                  {isCreatingPrescription ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    'Create Prescription'
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center p-4">
                <p className="text-sm text-muted-foreground">
                  No medical record found. Please create a medical record first.
                </p>
              </div>
            )}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Medications */}
              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Medication {index + 1}</FormLabel>
                    {fields.length > 1 && (
                      <Button variant="destructive" size="sm" onClick={() => remove(index)}>
                        Remove
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`medications.${index}.medicationId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select medication" />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingMedications ? (
                                <div className="p-2 text-center text-sm text-muted-foreground">
                                  Loading medications...
                                </div>
                              ) : medications.length === 0 ? (
                                <div className="p-2 text-center text-sm text-muted-foreground">
                                  No medications available
                                </div>
                              ) : (
                                <>
                                  {medications.map((medication) => (
                                    <SelectItem key={medication.id} value={medication.id}>
                                      {medication.name}
                                    </SelectItem>
                                  ))}
                                  <CustomPagination pagination={pagination} />
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`medications.${index}.dosage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 20mg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`medications.${index}.frequency`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Twice a day" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`medications.${index}.duration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 7 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`medications.${index}.instructions`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Optional instructions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      medicationId: '',
                      dosage: '',
                      frequency: '',
                      duration: '',
                      instructions: '',
                    })
                  }
                >
                  Add Medication
                </Button>
                <Button type="submit" disabled={isAddingMedications}>
                  {isAddingMedications ? 'Adding...' : 'Submit Prescription'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setIsPrescriptionOpen(false);
                    setStep(1);
                    setPrescriptionId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Prescription;
