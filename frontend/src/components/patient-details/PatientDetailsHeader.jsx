import { Link } from 'react-router-dom';

const PatientDetailsHeader = ({ patientName }) => {
  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 flex items-center mb-2">
        <i className="fas fa-arrow-left mr-1"></i> Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">Patient Information</h1>
      <p className="text-slate-500">Viewing medical record for {patientName}</p>
    </div>
  );
};

export default PatientDetailsHeader;
