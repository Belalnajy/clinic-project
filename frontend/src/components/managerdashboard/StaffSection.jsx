import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StaffPerformanceTable from './StaffPerformanceTable';
import StaffTasks from './StaffTasks';

const StaffSection = ({ staffPerformance }) => {
  return (
    <>
      <div className="mb-6 flex justify-end gap-3">
        <Button 
          onClick={() => window.location.href = '/secretaries'}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          <i className="fas fa-user-tie mr-2"></i> Secretary Management
        </Button>
        <Button 
          onClick={() => window.location.href = '/staff'}
          className="bg-primary text-white hover:bg-primary/90"
        >
          <i className="fas fa-users-cog mr-2"></i> Staff Management
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <div className="flex justify-between text-sm text-slate-500 mt-2">
              <div>Doctors: 9</div>
              <div>Staff: 15</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">96%</div>
            <div className="text-sm text-slate-500 mt-2">
              1 staff on leave today
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">87%</div>
            <div className="text-sm text-green-600 mt-2">
              <i className="fas fa-arrow-up mr-1"></i> 4% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">4.8</div>
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
      
      <StaffPerformanceTable staffPerformance={staffPerformance} />
      <StaffTasks />
    </>
  );
};

export default StaffSection;