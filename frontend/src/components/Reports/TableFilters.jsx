import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TableFilters = ({ filters, handleFilterChange, uniqueSpecializations, uniqueProviders }) => {
  return (
    <div className="mb-4 flex gap-4">
      <Select
        defaultValue="all"
        onValueChange={(value) => handleFilterChange('location', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Specialization" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Specializations</SelectItem>
          {uniqueSpecializations.map((specialization, index) => (
            <SelectItem key={index} value={specialization}>
              {specialization}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue="all"
        onValueChange={(value) => handleFilterChange('provider', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Providers</SelectItem>
          {uniqueProviders.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              {provider.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue="all"
        onValueChange={(value) =>
          handleFilterChange('appointmentType', value === 'all' ? '' : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Consultation">Consultation</SelectItem>
          <SelectItem value="Follow-up">Follow-up</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue="all"
        onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Scheduled">Scheduled</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TableFilters;
