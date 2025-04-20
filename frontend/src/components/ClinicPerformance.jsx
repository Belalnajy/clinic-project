import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/Auth/useAuth';
import { BarChart3, Clock, CalendarCheck, Star, Users, LineChart, ChevronRight } from 'lucide-react';

const ClinicPerformance = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("7days");
  
  // In a real app, these metrics would be fetched from an API
  const metrics = {
    appointmentCompletion: "92%",
    patientSatisfaction: "4.8/5",
    avgWaitTime: "12 min"
  };
  
  // Determine metrics based on user role
  const getMetrics = () => {
    if (user.role === 'doctor') {
      return {
        appointmentCompletion: "95%",
        patientSatisfaction: "4.9/5",
        avgConsultationTime: "18 min"
      };
    } else if (user.role === 'secretary') {
      return {
        appointmentCheckIns: "57",
        avgWaitTime: "12 min",
        newPatientRegistrations: "24"
      };
    }
    
    return metrics;
  };
  
  const roleMetrics = getMetrics();

  const getMetricIcons = () => {
    if (user.role === 'doctor') {
      return [CalendarCheck, Star, Clock];
    } else if (user.role === 'secretary') {
      return [CalendarCheck, Clock, Users];
    }
    return [CalendarCheck, Star, Clock];
  };

  const metricIcons = getMetricIcons();
  
  return (
    <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 p-0">
      <CardHeader className="border-b border-gray-100 bg-primary-300 rounded-t-lg p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-white mr-2" />
            <CardTitle className="text-lg font-bold text-white">Clinic Performance</CardTitle>
          </div>
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-9 w-auto text-sm  border-gray-200">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-80 flex items-center justify-center p-6">
        {/* Placeholder for chart - in a real app, this would be an actual chart component */}
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <LineChart className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500 font-medium">Performance metrics visualization would appear here</p>
          <p className="text-xs text-gray-400 mt-2 max-w-md text-center">
            {user.role === 'manager' ? 'Appointments, patient visits, and revenue data' :
             user.role === 'doctor' ? 'Patient visits, diagnoses, and treatment efficacy' :
             'Appointments, check-ins, and registration efficiency'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t border-gray-100 bg-white p-6">
        <div className="grid grid-cols-3 gap-6 w-3/4">
          {user.role === 'manager' && (
            <>
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-blue-50 rounded">
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Appointment Completion</p>
                  <p className="text-base font-semibold text-gray-800">{roleMetrics.appointmentCompletion}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-amber-50 rounded">
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Patient Satisfaction</p>
                  <p className="text-base font-semibold text-gray-800">{roleMetrics.patientSatisfaction}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-green-50 rounded">
                  {/* <metricIcons[2] className="w-4 h-4 text-green-600" /> */}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Avg. Wait Time</p>
                  <p className="text-base font-semibold text-gray-800">{roleMetrics.avgWaitTime}</p>
                </div>
              </div>
            </>
          )}
          
          {user.role === 'doctor' && (
            <>
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-blue-50 rounded">
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Appointment Completion</p>
                  <p className="text-base font-semibold text-gray-800">{roleMetrics.appointmentCompletion}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-amber-50 rounded">
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Patient Satisfaction</p>
                  <p className="text-base font-semibold text-gray-800">{roleMetrics.patientSatisfaction}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-green-50 rounded">
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Avg. Consultation Time</p>
                  <p className="text-base font-semibold text-gray-800">{roleMetrics.avgConsultationTime}</p>
                </div>
              </div>
            </>
          )}
          
          {user.role === 'secretary' && (
            <>
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-blue-50 rounded">
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Appointment Check-ins</p>
                  <p className="text-base font-semibold text-gray-800">{roleMetrics.appointmentCheckIns}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-green-50 rounded">
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Avg. Wait Time</p>
                  <p className="text-base font-semibold text-gray-800">{roleMetrics.avgWaitTime}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-purple-50 rounded">
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">New Patient Registrations</p>
                  <p className="text-base font-semibold text-gray-800">{roleMetrics.newPatientRegistrations}</p>
                </div>
              </div>
            </>
          )}
        </div>
        <button className="flex items-center text-sm font-medium text-primary hover:text-primary/90 transition-colors group">
          Detailed Reports
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </CardFooter>
    </Card>
  );
};

export default ClinicPerformance;