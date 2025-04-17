const AppointmentStatus = ({ stats }) => {
  const statusColors = {
    scheduled: '#FBBF24', // Yellow
    inQueue: '#3B82F6', // Blue
    completed: '#10B981', // Green
    cancelled: '#EF4444', // Red
  };

  return (
    <div className="h-auto flex flex-col items-center justify-center space-y-4 md:space-y-6">
      {['scheduled', 'inQueue', 'completed', 'cancelled'].map((status) => (
        <div key={status} className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm capitalize">{status}</span>
            <span className="text-sm font-medium">{stats[status]}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(stats[status] / stats.total) * 100}%`,
                backgroundColor: statusColors[status],
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentStatus;
