const StatCard = ({ title, value, change, icon, color = "primary" }) => {
  const colors = {
    primary: {
      bgGradient: "bg-gradient-to-br from-sky-50 to-indigo-50",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-700",
      borderColor: "border-sky-100"
    },
    success: {
      bgGradient: "bg-gradient-to-br from-emerald-50 to-green-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      borderColor: "border-emerald-100"
    },
    warning: {
      bgGradient: "bg-gradient-to-br from-amber-50 to-yellow-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      borderColor: "border-amber-100"
    },
    info: {
      bgGradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      borderColor: "border-blue-100"
    }
  };

  const style = colors[color];

  return (
    <div
      className={`overflow-hidden ${style.bgGradient} border border-opacity-50 ${style.borderColor} shadow-sm transition-all duration-300 hover:shadow-md rounded-lg`}>
      <div className="p-6 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-800">
            {value}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {change}
          </p>
        </div>
        <div className={`rounded-full p-3 ${style.iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
