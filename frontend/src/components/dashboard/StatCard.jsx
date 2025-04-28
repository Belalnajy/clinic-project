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
      className={`overflow-hidden ${style.bgGradient} border border-opacity-60 ${style.borderColor} shadow-sm rounded-2xl group transition-all duration-300 hover:shadow-xl hover:scale-[1.025] hover:border-opacity-100 animate-fade-in`}
      style={{ minHeight: 120 }}
    >
      <div className="px-6 pt-5 pb-4 flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-slate-600 tracking-wide">
              {title}
            </p>
            <span className={`block w-2 h-2 rounded-full ${style.iconColor} opacity-70`}></span>
          </div>
          <h3 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-sky-600 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm mb-1 animate-pop-in">
            {value}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {change}
          </p>
        </div>
        <div className={`rounded-2xl p-3 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${style.iconBg}`}>
          {icon}
        </div>
      </div>
      <div className={`h-1 w-full ${style.iconBg} mt-1 rounded-b-2xl`}></div>
    </div>
  );
};

export default StatCard;
