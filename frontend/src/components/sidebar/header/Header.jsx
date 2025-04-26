import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import React from 'react';
import { StatusSelector } from '@/components/ui/StatusSelector';

const Header = ({ toggleSidebar, title, user }) => {
  //! For Testing
  const handleLogout = () => {
    // Implement logout functionality here
    console.log('Logout clicked');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="h-16 flex items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex justify-between items-center md:hidden">
        <button
          className="text-slate-700 hover:text-primary-600 mr-4 cursor-pointer"
          aria-label="Toggle Menu"
          onClick={toggleSidebar}
        >
          <Menu size={32} />
        </button>
        <h2 className="text-xl font-bold text-primary-600 ml-3 md:hidden">Clinic Manager</h2>
      </div>

      <div className="hidden md:block">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <i className="fas fa-bell"></i>
        </Button>

        <div className="relative md:hidden">
          <Button variant="ghost" size="icon" aria-label="User Menu">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <StatusSelector />
      </div>
    </header>
  );
};

export default Header;
