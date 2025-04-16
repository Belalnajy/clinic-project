import Sidebar from '@/components/sidebar/Sidebar';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Mobile Navigation Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/50 z-40 block md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header 
          toggleSidebar={toggleSidebar} 
          title={getPageTitle()}
          user={user}
        /> */}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
