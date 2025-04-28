const PrescriptionHeader = ({ prescription }) => {
  const { id, medical_record, is_active, created_at } = prescription;
  const { first_name, last_name } = medical_record.appointment.doctor;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 pb-3 text-sm bg-muted p-6">
      <p>
        <span className="font-bold">Prescription ID:</span> {id}
      </p>
      <p>
        <span className="font-bold">Doctor:</span> {first_name} {last_name}
      </p>
      <p>
        <span className="font-bold">Status:</span> {is_active ? 'Active' : 'Inactive'}
      </p>
      <p>
        <span className="font-bold">Prescribed:</span> {new Date(created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export default PrescriptionHeader;
