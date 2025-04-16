import { Outlet } from "react-router-dom";
import SettingsTabs from "@/components/settings/SettingsTabs";

function SettingsPage() {
  return (
    <div className="ms-80 pe-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500">Manage your account preferences and settings</p>
      </div>
      <SettingsTabs />
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
export default SettingsPage;
