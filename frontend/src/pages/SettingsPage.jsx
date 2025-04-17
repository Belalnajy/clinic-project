import { Outlet } from "react-router-dom";
import SettingsTabs from "@/components/settings/SettingsTabs";

function SettingsPage() {
  return (
    <div className="mx-4 pe-4 md:pe-6 py-4 md:py-10">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm md:text-base text-slate-500">
          Manage your account preferences and settings
        </p>
      </div>
      <SettingsTabs />
      <div className="mt-4 md:mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsPage;