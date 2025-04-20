import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const RecentRegistrationsTable = ({ recentRegistrations }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Registrations</CardTitle>
          <CardDescription>New patients in the last 30 days</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <i className="fas fa-download mr-2"></i> Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-3 font-medium">Patient</th>
                <th className="text-left pb-3 font-medium">Date</th>
                <th className="text-left pb-3 font-medium">Age</th>
                <th className="text-left pb-3 font-medium">Contact</th>
                <th className="text-left pb-3 font-medium">Insurance</th>
                <th className="text-left pb-3 font-medium">Registered By</th>
              </tr>
            </thead>
            <tbody>
              {recentRegistrations.map((patient, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">
                    <div className="font-medium">{patient.name}</div>
                  </td>
                  <td className="py-3">{patient.date}</td>
                  <td className="py-3">{patient.age}</td>
                  <td className="py-3">{patient.phone}</td>
                  <td className="py-3">
                    <Badge className={patient.insurance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {patient.insurance ? 'Verified' : 'Unverified'}
                    </Badge>
                  </td>
                  <td className="py-3">{patient.registeredBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRegistrationsTable;