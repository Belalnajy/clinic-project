const StatCard = ({ title, value, change, icon, iconBgColor, iconColor }) => {
  const isPositiveChange = !change.startsWith('-');
  
  return (
    <div className="rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm">
      <div className="p-6 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {change !== '-' && (
            <p className={`text-xs ${isPositiveChange ? 'text-green-600' : 'text-red-600'} mt-1`}>
              <i className={`fas fa-arrow-${isPositiveChange ? 'up' : 'down'} mr-1`}></i>
              <span>{change}</span> {title === 'Available Doctors' ? 'on leave today' : 'from last month'}
            </p>
          )}
        </div>
        <div className={`h-12 w-12 rounded-lg ${iconBgColor} flex items-center justify-center ${iconColor}`}>
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
