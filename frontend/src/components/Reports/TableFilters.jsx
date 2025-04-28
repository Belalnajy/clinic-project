import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import DatePickerFilter from '../DatePickerFilter';
import useAppointmentFilters from '@/hooks/useAppointmentFilters';

const TableFilters = ({ doctors = [], specializations = [] }) => {
  const { filters, handleFilterChange } = useAppointmentFilters();

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
                {doctor.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.specialization || 'all'}
        onValueChange={(value) =>
          handleFilterChange('specialization', value === 'all' ? '' : value)
        }
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select Specialization" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Specializations</SelectItem>
          {Array.isArray(specializations) &&
            specializations.map((specialization) => (
              <SelectItem key={specialization.id} value={specialization.id}>
                {specialization.name}
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

      <DatePickerFilter />
    </div>
  );
};

export default TableFilters;
