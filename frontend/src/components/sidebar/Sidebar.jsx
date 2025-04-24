import { useAuth } from '@/contexts/Auth/useAuth';
import { getNavItems } from './sidebarData';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'manager':
        return 'Clinic Manager';
      case 'doctor':
        return 'Doctor';
      case 'secretary':
        return 'Secretary';
      default:
        return 'User';
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col w-64 bg-white border-r border-slate-200 z-20`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-primary-600">Clinic Manager</h2>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-slate-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-slate-500">{getRoleLabel(user?.role)}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {getNavItems(user).map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200">
          <button
            className="flex items-center text-sm text-slate-600 hover:text-red-500 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out md:hidden`}
      >
        {/* Same content as desktop sidebar */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-primary-600">Clinic Manager</h2>
        </div>

        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-slate-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-slate-500">{getRoleLabel(user?.role)}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {getNavItems(user).map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                    onClick={() => toggleSidebar()}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            className="flex items-center text-sm text-slate-600 hover:text-red-500 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
