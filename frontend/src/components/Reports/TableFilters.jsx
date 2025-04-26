import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TableFilters = ({ filters, handleFilterChange, doctors = [], specializations = [] }) => {
  return (
    <div className="mb-4 mt-5 flex flex-wrap gap-4">
      <Select
        value={filters.doctor || 'all'}
        onValueChange={(value) => handleFilterChange('doctor', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select Doctor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Doctors</SelectItem>
          {Array.isArray(doctors) &&
            doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {`${doctor.first_name} ${doctor.last_name}`}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status || 'all'}
        onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="canceled">Canceled</SelectItem>
          <SelectItem value="in_queue">In Queue</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.date_filter || 'all'}
        onValueChange={(value) => handleFilterChange('date_filter', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="this_week">This Week</SelectItem>
          <SelectItem value="last_week">Last Week</SelectItem>
          <SelectItem value="this_month">This Month</SelectItem>
          <SelectItem value="last_month">Last Month</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TableFilters;
