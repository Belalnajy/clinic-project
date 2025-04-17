const PatientGrowth = ({ newPatients, totalPatients, growthRate }) => {
  return (
    <div className="h-[240px] flex flex-col items-center justify-center">
      <div className="text-5xl font-bold text-primary-600">{newPatients}</div>
      <div className="text-sm text-slate-500 mt-2">New patients in last 30 days</div>
      <div className="mt-6 w-full bg-slate-100 rounded-full h-4 overflow-hidden">
        <div
          className="bg-primary-600 h-full rounded-full transition-all duration-700"
          style={{ width: `${growthRate}%` }}
        ></div>
      </div>
      <div className="mt-2 text-xs text-slate-500 self-end">
        {Math.round(growthRate)}% growth rate
      </div>
    </div>
  );
};

export default PatientGrowth;
