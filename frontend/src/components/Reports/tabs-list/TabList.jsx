import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tablistItems } from './tabListData';

const TabList = ({ user }) => {
  const renderTabs = tablistItems.map((item) => {
    if (item.permissions && !item.permissions.includes(user.role)) return;
    return (
      <TabsTrigger
        key={item.id}
        value={item.value}
        className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
      >
        {item.title}
      </TabsTrigger>
    );
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
      <TabsList className="flex flex-wrap gap-2">{renderTabs}</TabsList>
    </div>
  );
};

export default TabList;
