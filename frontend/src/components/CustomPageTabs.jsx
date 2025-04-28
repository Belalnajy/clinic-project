import { NavLink } from 'react-router-dom';

const CustomPageTabs = ({ tabs }) => {
  return (
    <div className="flex flex-wrap gap-4 p-2 my-4 bg-muted rounded-md w-fit">
      {tabs.map((tab) => (
        <NavLink
          key={tab}
          to={tab}
          className={({ isActive }) =>
            `px-4 py-2 rounded-md text-sm capitalize ${
              isActive ? 'bg-white shadow font-medium' : 'text-muted-foreground'
            }`
          }
        >
          {tab}
        </NavLink>
      ))}
    </div>
  );
};

export default CustomPageTabs;
