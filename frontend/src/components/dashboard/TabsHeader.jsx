import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"; // تم استبدال الأيقونة هنا
import { cn } from "@/lib/utils";

const tabs = [
  { value: "schedule", label: "Schedule" },
  { value: "patients", label: "Patients" },
  { value: "records", label: "Medical Records" }
];

const TabsHeader = ({ searchTerm, setSearchTerm }) =>
  <div className="flex justify-between items-center mb-6 flex-wrap">
    <TabsList className="relative bg-slate-100 p-1 rounded-lg flex gap-1 overflow-hidden">
      {tabs.map(({ value, label }) =>
        <TabsTrigger
          key={value}
          value={value}
          className={cn(
            "relative px-4 py-2 text-sm rounded-md transition-all duration-300 ease-in-out",
            "data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:scale-[1.02]",
            "hover:cursor-pointer"
          )}>
          {label}
        </TabsTrigger>
      )}
    </TabsList>

    <div className="relative mt-3 sm:mt-0">
      <Input
        placeholder="Search..."
        className="w-64 pl-9 border-slate-200 rounded-full bg-slate-50 focus:bg-white transition-all  focus:ring-2 focus:ring-blue-50 "
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" // تم استبدال الأيقونة هنا
      />
    </div>
  </div>;

export default TabsHeader;
