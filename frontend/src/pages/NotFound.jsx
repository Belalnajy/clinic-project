import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Home, HeartPulse, Pill, Activity, Thermometer } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-primary/5">
      <div className="max-w-4xl mx-auto p-8 text-center relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {/* Animated icon container */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-6 shadow-lg animate-bounce">
            <Stethoscope className="w-10 h-10 text-primary animate-pulse" />
          </div>

          <h1 className="text-7xl font-bold text-primary mb-3 tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Oops! It seems the page you're looking for has been misplaced or is under medical
            observation.
          </p>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-4 text-base transition-all duration-300 hover:scale-105"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-4 text-base transition-all duration-300 hover:scale-105"
            >
              <HeartPulse className="w-4 h-4" />
              Go Back
            </Button>
          </div>

          {/* Medical icons grid */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { icon: Pill, label: 'Medication' },
              { icon: Activity, label: 'Vital Signs' },
              { icon: Thermometer, label: 'Health Check' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center transform transition-all duration-500 hover:scale-110"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mb-2 shadow-md">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Bottom decorative line */}
          <div className="mt-8 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
