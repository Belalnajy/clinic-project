const DashboardHeader = ({ userName }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">Clinic Manager Dashboard</h1>
      <p className="text-slate-500">Welcome back, {userName}. Here's your clinic performance overview.</p>
    </div>
  );
};

export default DashboardHeader;