import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StaffPerformanceTable = ({ staffPerformance }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Staff Performance</CardTitle>
        <CardDescription>Ratings and metrics for clinical staff</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-3 font-medium">Staff Member</th>
                <th className="text-left pb-3 font-medium">Role</th>
                <th className="text-left pb-3 font-medium">Patients</th>
                <th className="text-left pb-3 font-medium">Rating</th>
                <th className="text-left pb-3 font-medium">Efficiency</th>
                <th className="text-left pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance.map((staff, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={staff.avatar} alt={staff.name} />
                        <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>{staff.name}</div>
                    </div>
                  </td>
                  <td className="py-3">{staff.role}</td>
                  <td className="py-3">{staff.patients}</td>
                  <td className="py-3">
                    <div className="flex text-amber-500">
                      {[...Array(Math.floor(staff.rating))].map((_, i) => (
                        <i key={i} className="fas fa-star text-xs mr-1"></i>
                      ))}
                      {staff.rating % 1 !== 0 && (
                        <i className="fas fa-star-half-alt text-xs mr-1"></i>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <Progress value={staff.efficiency} className="h-2 w-24" />
                  </td>
                  <td className="py-3">
                    <Badge className={staff.status === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : staff.status === 'With Patient' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-red-100 text-red-800'}>
                      {staff.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffPerformanceTable;