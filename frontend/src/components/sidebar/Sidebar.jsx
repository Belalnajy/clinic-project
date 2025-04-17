import { getNavItems, user } from './sidebarData';
import { NavLink } from 'react-router-dom';
const Sidebar = ({ isOpen, toggleSidebar }) => {
  //! For Testing
  const handleLogout = () => {
    // Handle logout logic here
    console.log('User logged out');
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
                <i className="fas fa-user"></i>
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-slate-500">
                {user?.role === 'manager'
                  ? 'Clinic Manager'
                  : user?.role === 'doctor'
                  ? 'Doctor'
                  : 'Secretary'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {getNavItems().map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}
                >
                  <i className={`${item.icon} sidebar-icon`}></i>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200">
          <button
            className="flex items-center text-sm text-slate-700 hover:text-red-500"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt w-5 h-5 mr-2"></i>
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
                <i className="fas fa-user"></i>
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-slate-500">
                {user?.role === 'manager'
                  ? 'Clinic Manager'
                  : user?.role === 'doctor'
                  ? 'Doctor'
                  : 'Secretary'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {getNavItems().map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}
                  onClick={() => toggleSidebar()}
                >
                  <i className={`${item.icon} sidebar-icon`}></i>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            className="flex items-center text-sm text-slate-700 hover:text-red-500"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt w-5 h-5 mr-2"></i>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
