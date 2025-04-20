import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PatientList from '../PatientList';
import RecentRegistrationsTable from './RecentRegistrationsTable';

const PatientsSection = ({ stats, recentRegistrations, onNewPatient }) => {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.patients}</div>
            <div className="text-sm text-green-600 mt-2">
              <i className="fas fa-arrow-up mr-1"></i> {stats.patientGrowth}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">48</div>
            <div className="text-sm text-blue-600 mt-2">
              <i className="fas fa-arrow-up mr-1"></i> 12% increase
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">36</div>
            <div className="text-sm text-slate-500 mt-2">
              Due this week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">94%</div>
            <div className="flex text-amber-500 mt-2">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star-half-alt"></i>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <PatientList onNewPatient={onNewPatient} />
      </div>
      
      <RecentRegistrationsTable recentRegistrations={recentRegistrations} />
    </>
  );
};

export default PatientsSection;