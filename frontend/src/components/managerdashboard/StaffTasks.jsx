import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const StaffTasks = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Staff Tasks</CardTitle>
          <CardDescription>Manage and assign tasks to staff</CardDescription>
        </div>
        <Button size="sm">
          <i className="fas fa-plus mr-2"></i> New Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div>
                <div className="font-medium">Update inventory system</div>
                <div className="text-sm text-slate-500">Assigned to: Sarah Kim</div>
              </div>
            </div>
            <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                <i className="fas fa-phone"></i>
              </div>
              <div>
                <div className="font-medium">Patient follow-up calls</div>
                <div className="text-sm text-slate-500">Assigned to: John Smith</div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Completed</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mr-3">
                <i className="fas fa-calendar"></i>
              </div>
              <div>
                <div className="font-medium">Schedule staff meeting</div>
                <div className="text-sm text-slate-500">Assigned to: You</div>
              </div>
            </div>
            <Badge className="bg-slate-200 text-slate-800">Pending</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffTasks;