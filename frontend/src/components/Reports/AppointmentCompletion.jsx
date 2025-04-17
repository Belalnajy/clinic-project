import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AppointmentCompletion = ({ completionRate, total, completed }) => {
  const getCompletionColor = (completionRate) => {
    if (completionRate <= 25) return '#EF4444'; // Red
    if (completionRate > 25 && completionRate <= 50) return '#FBBF24'; // Yellow
    if (completionRate > 50 && completionRate <= 75) return '#3B82F6'; // Blue
    return '#10B981'; // Green
  };

  const appointmentCompletionData = [
    { name: 'Completed', value: completed },
    { name: 'Remaining', value: total - completed },
  ];

  const COLORS = [
    getCompletionColor(completionRate), // Dynamic color for "Completed"
    '#E5E7EB', // Gray for "Remaining"
  ];

  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative h-32 w-32 md:h-40 md:w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={appointmentCompletionData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={5}
            >
              {appointmentCompletionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl md:text-3xl font-bold">{completionRate}%</div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCompletion;
