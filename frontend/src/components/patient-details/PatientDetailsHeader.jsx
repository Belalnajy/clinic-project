import { Link } from 'react-router-dom';

const PatientDetailsHeader = ({ patientName, patientId, city }) => {
  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 flex items-center mb-2">
        <i className="fas fa-arrow-left mr-1"></i> Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">Patient Information</h1>
      <p className="text-slate-500">Viewing medical record for {patientName}</p>

      <div className=" my-6 p-6 bg-white rounded-lg border">
        <h2 className="text-2xl mb-2 font-bold">{patientName}</h2>
        <p className="text-slate-500 text-sm">Patient ID: {patientId}</p>
        <p className="text-slate-500 text-sm">city: {city}</p>
      </div>
    </div>
  );
};

export default PatientDetailsHeader;
