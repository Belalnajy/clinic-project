import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  CalendarCheck,
  Star,
  StarHalf,
  Smile,
} from "lucide-react";
import PatientList from "../PatientList";
import RecentRegistrationsTable from "./RecentRegistrationsTable";

const PatientsSection = ({ stats, recentRegistrations, onNewPatient }) => {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        {/* Total Patients */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.patients}</div>
            <div className="text-sm text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" /> {stats.patientGrowth}
            </div>
          </CardContent>
        </Card>

        {/* New This Month */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> New This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">48</div>
            <div className="text-sm text-blue-600 mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" /> 12% increase
            </div>
          </CardContent>
        </Card>

        {/* Follow-ups */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-purple-600" /> Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">36</div>
            <div className="text-sm text-muted-foreground mt-2">
              Due this week
            </div>
          </CardContent>
        </Card>

        {/* Satisfaction */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Smile className="w-5 h-5 text-amber-500" /> Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">94%</div>
            <div className="flex text-amber-400 mt-2">
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <StarHalf className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <div className="mb-6">
        <PatientList onNewPatient={onNewPatient} />
      </div>

      {/* Recent Registrations */}
      <RecentRegistrationsTable recentRegistrations={recentRegistrations} />
    </>
  );
};

export default PatientsSection;
