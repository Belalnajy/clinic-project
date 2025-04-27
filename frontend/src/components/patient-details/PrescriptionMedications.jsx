const PrescriptionMedications = ({ medications }) => {
  if (!medications.length) {
    return (
      <p className="text-muted-foreground p-6">This Prescription doesn't have any medications</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-6">
      {medications.map((medication) => (
        <div key={medication.id} className="py-3">
          <div className="flex justify-between">
            <div className="font-medium">{medication.medication.name}</div>
          </div>
          <div className="text-sm mt-1">
            <div>
              <span className="font-medium">Dosage: </span>
              {medication.dosage}
            </div>
            <div>
              <span className="font-medium">Duration: </span>
              {medication.duration}
            </div>
            <div>
              <span className="font-medium">Frequency: </span>
              {medication.frequency}
            </div>
            <div>
              <span className="font-medium">Instructions: </span>
              {medication.instructions}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionMedications;
