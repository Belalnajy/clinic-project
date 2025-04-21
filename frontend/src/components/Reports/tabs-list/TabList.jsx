import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { selectItems, tablistItems } from './tabListData';

const TabList = ({ user, timeRange, setTimeRange }) => {
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

  const renderSelectItems = selectItems.map((item) => (
    <SelectItem key={item.id} value={item.value}>
      {item.title}
    </SelectItem>
  ));

  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
      <TabsList className="flex flex-wrap gap-2">{renderTabs}</TabsList>

      <Select defaultValue={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select time period" />
        </SelectTrigger>
        <SelectContent>{renderSelectItems}</SelectContent>
      </Select>
    </div>
  );
};

export default TabList;
