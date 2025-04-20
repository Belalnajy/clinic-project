import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

const RecentRegistrationsTable = ({ recentRegistrations }) => {
  return (
    <Card className="shadow-md rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Registrations</CardTitle>
          <CardDescription>New patients in the last 30 days</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground text-left">
              <th className="pb-3 font-medium">Patient</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Age</th>
              <th className="pb-3 font-medium">Contact</th>
              <th className="pb-3 font-medium">Insurance</th>
              <th className="pb-3 font-medium">Registered By</th>
            </tr>
          </thead>

          <tbody>
            {recentRegistrations.map((patient, index) =>
              <tr
                key={index}
                className="border-b hover:bg-muted/40 transition-colors">
                <td className="py-3 font-medium">
                  {patient.name}
                </td>
                <td className="py-3">
                  {patient.date}
                </td>
                <td className="py-3">
                  {patient.age}
                </td>
                <td className="py-3">
                  {patient.phone}
                </td>
                <td className="py-3">
                  <Badge
                    className={
                      patient.insurance
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }>
                    {patient.insurance ? "Verified" : "Unverified"}
                  </Badge>
                </td>
                <td className="py-3">
                  {patient.registeredBy}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default RecentRegistrationsTable;
